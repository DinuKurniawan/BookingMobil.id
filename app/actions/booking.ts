"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { uploadIdentityImage } from "@/lib/upload";
import { sendBookingEmail } from "@/lib/email";
import {
  bookingFormSchema,
  generateBookingCode,
  type BookingActionState,
} from "@/lib/validations/booking";

export async function createBookingAction(
  prevState: BookingActionState,
  formData: FormData
): Promise<BookingActionState> {
  let createdBookingCode: string | null = null;

  try {
    const carId = formData.get("carId") as string;
    const startDateStr = formData.get("startDate") as string;
    const endDateStr = formData.get("endDate") as string;
    const customerName = formData.get("customerName") as string;
    const customerPhone = formData.get("customerPhone") as string;
    const customerEmail = formData.get("customerEmail") as string;
    const customerAddress = formData.get("customerAddress") as string;
    const identityNumber = formData.get("identityNumber") as string;
    const deliveryOption = formData.get("deliveryOption") as string;
    const notes = (formData.get("notes") as string) || undefined;
    const identityFile = formData.get("identityFile") as File | null;

    // 1. Validate identity file
    if (!identityFile || identityFile.size === 0) {
      return {
        message: "Foto identitas KTP/SIM wajib diunggah",
        errors: { identityFile: ["Foto identitas KTP/SIM wajib diunggah"] },
      };
    }

    if (identityFile.size > 5 * 1024 * 1024) {
      return {
        message: "Ukuran foto identitas maksimal 5MB",
        errors: { identityFile: ["Ukuran foto identitas maksimal 5MB"] },
      };
    }

    // 2. Validate form input fields with Zod
    const validated = bookingFormSchema.safeParse({
      carId,
      startDate: startDateStr,
      endDate: endDateStr,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      identityNumber,
      deliveryOption,
      notes,
    });

    if (!validated.success) {
      const errors = validated.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0] || "Data form tidak valid";
      return { message: firstError, errors };
    }

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (totalDays <= 0) {
      return {
        message: "Durasi sewa minimal 1 hari (tanggal selesai harus setelah tanggal mulai)",
        errors: { endDate: ["Tanggal selesai harus setelah tanggal mulai sewa"] },
      };
    }

    // 3. Check car existence and status
    const car = await prisma.car.findUnique({
      where: { id: carId },
    });

    if (!car) {
      return { message: "Mobil tidak ditemukan" };
    }

    if (car.status !== "AVAILABLE") {
      return { message: "Mobil sedang dalam status perawatan atau non-aktif" };
    }

    // 4. Overlap check in database
    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        carId,
        status: { notIn: ["CANCELLED", "REJECTED"] },
        startDate: { lt: endDate },
        endDate: { gt: startDate },
      },
    });

    if (overlappingBooking) {
      const startFormatted = overlappingBooking.startDate.toISOString().split("T")[0];
      const endFormatted = overlappingBooking.endDate.toISOString().split("T")[0];

      return {
        message: `Tanggal bentrok! Mobil sudah dipesan pada tanggal ${startFormatted} s/d ${endFormatted}. Silakan pilih rentang tanggal lain.`,
      };
    }

    // 5. Upload identity file
    const identityImageUrl = await uploadIdentityImage(identityFile);

    if (!identityImageUrl) {
      return { message: "Gagal menyimpan foto identitas, silakan coba lagi" };
    }

    // 6. Calculate total price and create booking with PENDING status
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
        deliveryOption: validated.data.deliveryOption,
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

    createdBookingCode = booking.bookingCode;
  } catch (error) {
    console.error("Booking creation action error:", error);
    return { message: "Terjadi kesalahan saat memproses pemesanan" };
  }

  // Redirect outside try-catch block to prevent catching Next.js redirect exception
  if (createdBookingCode) {
    const emailParam = encodeURIComponent(formData.get("customerEmail") as string || "");
    redirect(`/booking/${createdBookingCode}?email=${emailParam}`);
  }

  return { message: "Gagal membuat pemesanan" };
}
