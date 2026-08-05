import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ACTIVE_BOOKING_STATUSES } from "@/lib/validations/car";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const monthStr = searchParams.get("month"); // format: YYYY-MM

  if (!monthStr || !/^\d{4}-\d{2}$/.test(monthStr)) {
    return NextResponse.json(
      { error: "Parameter month wajib dalam format YYYY-MM" },
      { status: 400 },
    );
  }

  const [year, month] = monthStr.split("-").map(Number);
  const startOfMonth = new Date(year, month - 1, 1);
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);

  const bookings = await prisma.booking.findMany({
    where: {
      carId: id,
      status: { in: [...ACTIVE_BOOKING_STATUSES] },
      AND: [
        { startDate: { lte: endOfMonth } },
        { endDate: { gte: startOfMonth } },
      ],
    },
    select: {
      bookingCode: true,
      startDate: true,
      endDate: true,
      status: true,
    },
    orderBy: { startDate: "asc" },
  });

  // Convert to date strings (YYYY-MM-DD) for easier client-side use
  const ranges = bookings.map((b) => ({
    bookingCode: b.bookingCode,
    start: b.startDate.toISOString().slice(0, 10),
    end: b.endDate.toISOString().slice(0, 10),
    status: b.status,
  }));

  return NextResponse.json({ month: monthStr, bookedRanges: ranges });
}
