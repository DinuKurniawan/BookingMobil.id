import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadPaymentProofImage } from "@/lib/upload";
import {
  ALLOWED_PAYMENT_PROOF_TYPES,
  MAX_PAYMENT_PROOF_SIZE,
} from "@/lib/config";
import { sendBookingEmail } from "@/lib/email";
import { checkRateLimit, getClientId } from "@/lib/rate-limit";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ bookingCode: string }> }
) {
  try {
    // Rate limit: max 5 upload per 10 menit per client
    const clientId = getClientId(request);
    const rate = checkRateLimit(`payment-proof:${clientId}`, 5, 10 * 60_000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: "Terlalu banyak upload. Silakan coba lagi nanti." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rate.resetAt - Date.now()) / 1000)) } },
      );
    }

    const { bookingCode } = await params;
    const formData = await request.formData();
    const file = formData.get("paymentProof") as File | null;

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: "File bukti transfer wajib diunggah" },
        { status: 400 }
      );
    }

    // 1. Validate File Size (Max 5MB)
    if (file.size > MAX_PAYMENT_PROOF_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file bukti transfer maksimal 5MB" },
        { status: 400 }
      );
    }

    // 2. Validate File Type (Images or PDF)
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    const isValidType =
      ALLOWED_PAYMENT_PROOF_TYPES.includes(fileType) ||
      fileName.endsWith(".pdf") ||
      fileName.endsWith(".jpg") ||
      fileName.endsWith(".jpeg") ||
      fileName.endsWith(".png") ||
      fileName.endsWith(".webp");

    if (!isValidType) {
      return NextResponse.json(
        {
          error:
            "Format file tidak didukung. Hanya file foto (JPG, PNG, WEBP) atau PDF yang diperbolehkan.",
        },
        { status: 400 }
      );
    }

    // 3. Find booking in DB
    const booking = await prisma.booking.findUnique({
      where: { bookingCode },
      include: { car: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Kode pemesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Security Check: If email/phone identity is sent, verify match
    const identityInput = (
      (formData.get("customerEmail") as string) ||
      (formData.get("customerPhone") as string) ||
      (formData.get("identity") as string) ||
      ""
    ).trim();

    if (identityInput.length > 0) {
      const isEmailMatch =
        booking.customerEmail.toLowerCase() === identityInput.toLowerCase();
      const isPhoneMatch =
        booking.customerPhone.replace(/[^0-9]/g, "") ===
        identityInput.replace(/[^0-9]/g, "");

      if (!isEmailMatch && !isPhoneMatch) {
        return NextResponse.json(
          { error: "Verifikasi gagal: Email atau No. HP tidak cocok dengan data pemesanan." },
          { status: 403 }
        );
      }
    }

    // 4. Save file to disk/storage
    const imageUrl = await uploadPaymentProofImage(file);
    if (!imageUrl) {
      return NextResponse.json(
        { error: "Gagal menyimpan file bukti transfer" },
        { status: 500 }
      );
    }

    // 5. Create PaymentProof record in DB
    const paymentProof = await prisma.paymentProof.create({
      data: {
        bookingId: booking.id,
        imageUrl,
        status: "PENDING",
      },
    });

    // 6. Update booking status to PAYMENT_REVIEW
    if (booking.status === "PENDING" || booking.status === "REJECTED") {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: "PAYMENT_REVIEW" },
      });
    }

    // 7. Send notification email to admin
    sendBookingEmail({
      type: "payment-proof-admin",
      bookingId: booking.id,
      bookingCode: booking.bookingCode,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      carName: booking.car.name,
      startDate: booking.startDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      endDate: booking.endDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      totalDays: booking.totalDays,
      totalPrice: booking.totalPrice.toNumber(),
      paymentProofUrl: imageUrl,
    });

    return NextResponse.json({
      success: true,
      paymentProofId: paymentProof.id,
      message:
        "Bukti transfer berhasil diunggah! Admin telah dinotifikasi dan akan melakukan verifikasi.",
    });
  } catch (error) {
    console.error("Payment proof upload error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat mengunggah bukti transfer" },
      { status: 500 }
    );
  }
}
