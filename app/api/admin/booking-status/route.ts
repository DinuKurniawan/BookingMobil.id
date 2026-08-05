import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingEmail } from "@/lib/email";
import { getCurrentAdmin } from "@/lib/auth";

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CANCELLED"],
  PAYMENT_REVIEW: ["CONFIRMED", "REJECTED"],
  CONFIRMED: ["ONGOING", "CANCELLED"],
  ONGOING: ["COMPLETED"],
};

export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { bookingId, status } = await request.json();

    if (!bookingId || !status) {
      return NextResponse.json({ message: "Data tidak lengkap" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { car: true },
    });

    if (!booking) {
      return NextResponse.json({ message: "Booking tidak ditemukan" }, { status: 404 });
    }

    if (status === "ONGOING" && booking.status === "CONFIRMED" && new Date() < booking.startDate) {
      return NextResponse.json(
        { message: "Tanggal mulai sewa belum tiba" },
        { status: 400 },
      );
    }

    const allowed = ALLOWED_TRANSITIONS[booking.status];
    if (!allowed?.includes(status)) {
      return NextResponse.json(
        { message: `Transisi dari ${booking.status} ke ${status} tidak diizinkan` },
        { status: 400 }
      );
    }

    await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    // Send email notifications for relevant transitions
    const startStr = booking.startDate.toISOString().split("T")[0];
    const endStr = booking.endDate.toISOString().split("T")[0];
    const totalPriceNum = booking.totalPrice.toNumber();

    if (status === "CONFIRMED") {
      sendBookingEmail({
        type: "payment-approved",
        to: booking.customerEmail,
        customerName: booking.customerName,
        bookingCode: booking.bookingCode,
        carName: booking.car.name,
        startDate: startStr,
        endDate: endStr,
        totalDays: booking.totalDays,
        totalPrice: totalPriceNum,
      });
    } else if (status === "ONGOING") {
      sendBookingEmail({
        type: "rental-started",
        to: booking.customerEmail,
        customerName: booking.customerName,
        bookingCode: booking.bookingCode,
        carName: booking.car.name,
      });
    } else if (status === "COMPLETED") {
      sendBookingEmail({
        type: "rental-completed",
        to: booking.customerEmail,
        customerName: booking.customerName,
        bookingCode: booking.bookingCode,
        carName: booking.car.name,
      });
    } else if (status === "CANCELLED") {
      sendBookingEmail({
        type: "booking-cancelled",
        to: booking.customerEmail,
        customerName: booking.customerName,
        bookingCode: booking.bookingCode,
        carName: booking.car.name,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking status update error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
