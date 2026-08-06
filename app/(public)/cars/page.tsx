import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { CarsContent } from "@/components/cars-content";

export const metadata: Metadata = {
  title: "Katalog Armada Mobil - BookingMobil.id",
  description:
    "Jelajahi seluruh armada mobil rental kami yang terawat dan siap antar. Tersedia berbagai tipe dari MPV, SUV, Sedan, hingga Van dengan harga terjangkau.",
};

type SearchParams = Promise<{
  category?: string;
  transmission?: string;
  minPrice?: string;
  maxPrice?: string;
  q?: string;
  startDate?: string;
  endDate?: string;
}>;

export default async function CarsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const where: Prisma.CarWhereInput = { status: "AVAILABLE" };

  if (params.category && ["MPV", "SUV", "SEDAN", "HATCHBACK", "VAN"].includes(params.category)) {
    where.category = params.category as Prisma.CarWhereInput["category"];
  }

  if (params.transmission && ["MANUAL", "AUTOMATIC"].includes(params.transmission)) {
    where.transmission = params.transmission as Prisma.CarWhereInput["transmission"];
  }

  const minPrice = params.minPrice ? Number(params.minPrice) : null;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : null;

  if (minPrice !== null && !isNaN(minPrice) && minPrice > 0) {
    where.pricePerDay = { ...(where.pricePerDay as Prisma.DecimalFilter | undefined), gte: minPrice };
  }
  if (maxPrice !== null && !isNaN(maxPrice) && maxPrice > 0) {
    where.pricePerDay = { ...(where.pricePerDay as Prisma.DecimalFilter | undefined), lte: maxPrice };
  }

  if (params.q) {
    where.AND = [
      ...(where.AND as Prisma.CarWhereInput[] || []),
      { OR: [{ name: { contains: params.q, mode: "insensitive" } }, { brand: { contains: params.q, mode: "insensitive" } }] },
    ];
  }

  const [cars, totalCars, categoryCounts] = await Promise.all([
    prisma.car.findMany({
      where,
      select: {
        id: true, name: true, brand: true, category: true,
        transmission: true, seats: true, pricePerDay: true,
        images: true, description: true, licensePlate: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.car.count({ where }),
    prisma.car.groupBy({ by: ["category"], where: { status: "AVAILABLE" }, _count: { _all: true } }),
  ]);

  const categoryCountMap = Object.fromEntries(categoryCounts.map((c) => [c.category, c._count._all]));

  const allCars = cars.map((car) => ({
    id: car.id,
    name: car.name,
    brand: car.brand,
    category: car.category,
    transmission: car.transmission,
    seats: car.seats,
    pricePerDay: car.pricePerDay.toNumber(),
    images: car.images,
    description: car.description ?? "",
    licensePlate: car.licensePlate,
    bookingCount: car._count.bookings,
  }));

  return (
    <CarsContent
      cars={allCars}
      totalCars={totalCars}
      categoryCountMap={categoryCountMap}
    />
  );
}
