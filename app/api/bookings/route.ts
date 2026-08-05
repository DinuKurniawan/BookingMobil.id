import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadIdentityImage } from "@/lib/upload";
import { sendBookingEmail } from "@/lib/email";
import {
  bookingFormSchema,
  generateBookingCode,
} from "@/lib/validations/booking";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const carId = formData.get("carId") as string;
    const startDateStr = formData.get("startDate") as string;
    const endDateStr = formData.get("endDate") as string;
    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const customerEmail = formData.get("customerEmail") as string;
    const customerAddress = formData.get("customerAddress") as string;
    const identityNumber = formData.get("identityNumber") as string;
    const notes = (formData.get("notes") as string) || undefined;
    const identityFile = formData.get("identityFile") as File | null;

    // 1. Validate identity file presence and size
    if (!identityFile || identityFile.size === 0) {
      return NextResponse.json(
        {
          error: "Foto identitas KTP/SIM wajib diunggah",
          errors: { identityFile: ["Foto identitas KTP/SIM wajib diunggah"] },
        },
        { status: 400 },
      );
    }

    if (identityFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        {
          error: "Ukuran foto identitas maksimal 5MB",
          errors: { identityFile: ["Ukuran foto identitas maksimal 5MB"] },
        },
        { status: 400 },
      );
    }

    // 2. Validate form fields with Zod
    const validated = bookingFormSchema.safeParse({
      carId,
      startDate: startDateStr,
      endDate: endDateStr,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      identityNumber,
      notes,
    });

    if (!validated.success) {
      const errors = validated.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0] || "Data form tidak valid";
      return NextResponse.json(
        { error: firstError, errors },
        { status: 400 },
      );
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Calculate total days
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (totalDays <= 0) {
      return NextResponse.json(
        { error: "Durasi sewa minimal 1 hari (tanggal selesai harus setelah tanggal mulai)" },
        { status: 400 },
      );
    }

    // 3. Check car exists and is AVAILABLE in database
    const car = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return NextResponse.json(
        { error: "Mobil tidak ditemukan" },
        { status: 404 },
      );
    }

    if (car.status !== "AVAILABLE") {
      return NextResponse.json(
        { error: "Mobil sedang dalam status perawatan atau non-aktif" },
        { status: 400 },
      );
    }

    // 4. PRE-SUBMIT OVERLAP CHECK: Check database for any existing bookings
    // with status NOT IN ["CANCELLED", "REJECTED"] that overlap with requested dates
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        carId,
        status: { notIn: ["CANCELLED", "REJECTED"] },
        startDate: { lt: endDate },
        endDate: { gt: startDate },
      },
      select: {
        bookingCode: true,
        startDate: true,
        endDate: true,
      },
    });

    if (overlappingBooking) {
      const startFormatted = overlappingBooking.startDate.toISOString().split("T")[0];
      const endFormatted = overlappingBooking.endDate.toISOString().split("T")[0];

      return NextResponse.json(
        {
          error: `Tanggal bentrok! Mobil sudah dipesan pada tanggal ${startFormatted} s/d ${endFormatted}. Silakan pilih rentang tanggal lain.`,
          conflictingBooking: {
            start: startFormatted,
            end: endFormatted,
          },
        },
        { status: 409 },
      );
    }

    // 5. Handle Identity File upload
    const identityImageUrl = await uploadIdentityImage(identityFile);

    if (!identityImageUrl) {
      return NextResponse.json(
        { error: "Gagal menyimpan foto identitas, silakan coba lagi" },
        { status: 500 },
      );
    }

    // 6. Calculate total price and create booking in database
    const pricePerDayNum = car.pricePerDay.toNumber();
    const totalPrice = pricePerDayNum * totalDays;

    const bookingCode = generateBookingCode();
    const booking = await prisma.booking.create({
      data: {
        bookingCode,
        carId,
        customerName,
        customerPhone,
        customerEmail,
        customerAddress,
        identityNumber,
        identityImageUrl,
        startDate,
        endDate,
        totalDays,
        totalPrice,
        status: "PENDING",
        notes: notes || null,
      },
    });

    // Kirim email konfirmasi ke customer & notifikasi admin (fire-and-forget)
    sendBookingEmail({
      type: "booking-created-customer",
      to: customerEmail,
      customerName,
      bookingCode,
      carName: car.name,
      startDate: startDateStr,
      endDate: endDateStr,
      totalDays,
      totalPrice,
    });
    sendBookingEmail({
      type: "booking-created-admin",
      bookingId: booking.id,
      bookingCode,
      customerName,
      customerPhone,
      customerEmail,
      carName: car.name,
      startDate: startDateStr,
      endDate: endDateStr,
      totalDays,
      totalPrice,
    });

    return NextResponse.json({
      success: true,
      bookingCode: booking.bookingCode,
      bookingId: booking.id,
      message: "Pemesanan berhasil dibuat",
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses pemesanan" },
      { status: 500 },
    );
  }
}
