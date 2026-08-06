"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CarCard } from "@/components/car-card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";
import type { CarCardData } from "@/components/car-card";

type CarWithBooking = CarCardData & { bookingCount: number };

function getBadge(
  car: CarWithBooking,
  all: CarWithBooking[],
): { text: string; className: string } | undefined {
  if (all.length < 2) return undefined;

  const cheapest = Math.min(...all.map((c) => c.pricePerDay));
  const mostBooked = Math.max(...all.map((c) => c.bookingCount));
  const newest = all.reduce((a, b) =>
    a.id > b.id ? a : b, // simplistic: higher cuid ≈ newer
  );

  if (car.pricePerDay === cheapest && car.bookingCount === mostBooked) {
    return { text: "HOT", className: "bg-red-500 text-white shadow-md" };
  }
  if (car.pricePerDay === cheapest) {
    return { text: "Best Deal", className: "bg-emerald-500 text-white shadow-md" };
  }
  if (car.bookingCount === mostBooked && car.bookingCount > 0) {
    return { text: "Populer", className: "bg-amber-500 text-white shadow-md" };
  }
  if (car === newest) {
    return { text: "Baru", className: "bg-blue-500 text-white shadow-md" };
  }
  return undefined;
}

export function FleetGrid({ cars }: { cars: CarWithBooking[] }) {
  const [filter, setFilter] = useState<"all" | "cheapest" | "popular">("all");

  const carsWithBadges = useMemo(
    () => cars.map((car) => ({ ...car, badge: getBadge(car, cars) })),
    [cars],
  );

  const filtered = useMemo(() => {
    if (filter === "cheapest") {
      return [...carsWithBadges].sort((a, b) => a.pricePerDay - b.pricePerDay);
    }
    if (filter === "popular") {
      return [...carsWithBadges].sort((a, b) => b.bookingCount - a.bookingCount);
    }
    return carsWithBadges;
  }, [carsWithBadges, filter]);

  if (cars.length === 0) {
    return (
      <ScrollReveal>
        <div className="py-16 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
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
          <p className="text-gray-500 text-lg font-medium">
            Belum ada mobil tersedia saat ini
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Silakan cek kembali nanti atau hubungi kami untuk informasi lebih lanjut
          </p>
        </div>
      </ScrollReveal>
    );
  }

  return (
    <>
      {/* Quick filters */}
      <ScrollReveal delay={50}>
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-medium text-gray-400 mr-1">
            Urutkan:
          </span>
          {([
            { key: "all", label: "Semua" },
            { key: "cheapest", label: "Termurah" },
            { key: "popular", label: "Terpopuler" },
          ] as const).map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setFilter(opt.key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 border ${
                filter === opt.key
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                  : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((car, i) => (
          <ScrollReveal key={car.id} delay={i * 100}>
            <CarCard car={car} />
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={200}>
        <div className="text-center mt-10">
          <Link href="/cars">
            <Button variant="outline" size="lg">
              Lihat Semua Armada Mobil
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Button>
          </Link>
        </div>
      </ScrollReveal>
    </>
  );
}
