import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ACTIVE_BOOKING_STATUSES } from "@/lib/validations/car";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { searchParams } = new URL(request.url);
  const startStr = searchParams.get("startDate");
  const endStr = searchParams.get("endDate");

  if (!startStr || !endStr) {
    return NextResponse.json(
      { error: "Parameter startDate dan endDate wajib diisi" },
      { status: 400 },
    );
  }

  const startDate = new Date(startStr);
  const endDate = new Date(endStr);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return NextResponse.json(
      { error: "Format tanggal tidak valid" },
      { status: 400 },
    );
  }

  if (startDate >= endDate) {
    return NextResponse.json(
      { error: "Tanggal mulai harus sebelum tanggal selesai" },
      { status: 400 },
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (startDate < today) {
    return NextResponse.json(
      { error: "Tanggal mulai tidak boleh di masa lalu" },
      { status: 400 },
    );
  }

  // Check the car exists and is available
  const car = await prisma.car.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!car) {
    return NextResponse.json(
      { error: "Mobil tidak ditemukan" },
      { status: 404 },
    );
  }

  if (car.status !== "AVAILABLE") {
    return NextResponse.json({
      available: false,
      reason: "Mobil sedang tidak tersedia untuk disewa",
    });
  }

  // Find overlapping active bookings
  const conflicting = await prisma.booking.findMany({
    where: {
      carId: id,
      status: { notIn: ["CANCELLED", "REJECTED"] },
      startDate: { lt: endDate },
      endDate: { gt: startDate },
    },
    select: {
      startDate: true,
      endDate: true,
    },
    orderBy: { startDate: "asc" },
  });

  if (conflicting.length > 0) {
    return NextResponse.json({
      available: false,
      conflictingDates: conflicting.map((b) => ({
        start: b.startDate.toISOString().split("T")[0],
        end: b.endDate.toISOString().split("T")[0],
      })),
    });
  }

  return NextResponse.json({ available: true });
}
