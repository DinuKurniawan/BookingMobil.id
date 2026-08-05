import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { CarCard } from "@/components/car-card";
import { CatalogFilters } from "@/components/catalog-filters";
import type { Prisma } from "@prisma/client";

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
}>;

export default async function CarsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  // Build Prisma where clause from search params
  const where: Prisma.CarWhereInput = { status: "AVAILABLE" };

  if (
    params.category &&
    ["MPV", "SUV", "SEDAN", "HATCHBACK", "VAN"].includes(params.category)
  ) {
    where.category = params.category as Prisma.CarWhereInput["category"];
  }

  if (
    params.transmission &&
    ["MANUAL", "AUTOMATIC"].includes(params.transmission)
  ) {
    where.transmission =
      params.transmission as Prisma.CarWhereInput["transmission"];
  }

  // Price range filter
  const minPrice = params.minPrice ? Number(params.minPrice) : null;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : null;

  if (minPrice !== null && !isNaN(minPrice) && minPrice > 0) {
    where.pricePerDay = {
      ...(where.pricePerDay as Prisma.DecimalFilter | undefined),
      gte: minPrice,
    };
  }
  if (maxPrice !== null && !isNaN(maxPrice) && maxPrice > 0) {
    where.pricePerDay = {
      ...(where.pricePerDay as Prisma.DecimalFilter | undefined),
      lte: maxPrice,
    };
  }

  // Text search on car name and brand
  if (params.q) {
    where.AND = [
      ...(where.AND as Prisma.CarWhereInput[] || []),
      {
        OR: [
          { name: { contains: params.q, mode: "insensitive" } },
          { brand: { contains: params.q, mode: "insensitive" } },
        ],
      },
    ];
  }

  const cars = await prisma.car.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  // Get total available count (no filter) for stats
  const totalAvailable = await prisma.car.count({
    where: { status: "AVAILABLE" },
  });

  const hasActiveFilters =
    params.category || params.transmission || params.minPrice || params.maxPrice || params.q;

  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/25">
                  Katalog Lengkap
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                  {totalAvailable} Unit Tersedia
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                Pilihan{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Armada Mobil
                </span>
              </h1>
              <p className="text-gray-400 max-w-xl text-sm sm:text-base leading-relaxed">
                Temukan mobil impian Anda dari koleksi armada kami yang selalu
                terawat dan siap menemani perjalanan Anda.
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-6 lg:gap-8">
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-white">
                  {totalAvailable}
                </p>
                <p className="text-xs text-gray-400 mt-1">Unit Tersedia</p>
              </div>
              <div className="w-px bg-gray-700/50" />
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-white">5</p>
                <p className="text-xs text-gray-400 mt-1">Kategori</p>
              </div>
              <div className="w-px bg-gray-700/50" />
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-white">
                  24/7
                </p>
                <p className="text-xs text-gray-400 mt-1">Layanan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Filter Bar — above grid */}
        <Suspense
          fallback={
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8 animate-pulse">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-16 bg-gray-100 rounded-lg" />
                <div className="h-16 bg-gray-100 rounded-lg" />
                <div className="h-16 bg-gray-100 rounded-lg" />
              </div>
            </div>
          }
        >
          <div className="mb-8">
            <CatalogFilters />
          </div>
        </Suspense>

        {/* Results info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500">
            {hasActiveFilters ? (
              <>
                Ditemukan{" "}
                <span className="font-semibold text-gray-800">
                  {cars.length}
                </span>{" "}
                mobil
                {cars.length !== totalAvailable && (
                  <span className="text-gray-400">
                    {" "}
                    dari {totalAvailable} total
                  </span>
                )}
              </>
            ) : (
              <>
                Menampilkan{" "}
                <span className="font-semibold text-gray-800">
                  semua {cars.length}
                </span>{" "}
                mobil tersedia
              </>
            )}
          </p>
        </div>

        {/* Cars Grid or Empty State */}
        {cars.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-5">
              <svg
                className="w-10 h-10 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0h-2.735a2.25 2.25 0 00-1.834.952L4.843 10.5H3.375"
                />
              </svg>
            </div>
            {hasActiveFilters ? (
              <>
                <p className="text-gray-700 text-lg font-semibold">
                  Tidak ada mobil ditemukan
                </p>
                <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
                  Coba ubah filter kategori, transmisi, atau range harga untuk
                  menemukan mobil yang sesuai.
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-700 text-lg font-semibold">
                  Belum ada mobil tersedia saat ini
                </p>
                <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
                  Mohon maaf, seluruh armada kami sedang dalam perjalanan atau
                  perawatan. Silakan cek kembali nanti.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map((car) => (
              <CarCard
                key={car.id}
                car={{
                  id: car.id,
                  name: car.name,
                  brand: car.brand,
                  category: car.category,
                  transmission: car.transmission,
                  seats: car.seats,
                  pricePerDay: car.pricePerDay.toNumber(),
                  images: car.images,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
