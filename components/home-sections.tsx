"use client";

import dynamic from "next/dynamic";
import { ScrollReveal } from "@/components/scroll-reveal";
import type { CarCardData } from "@/components/car-card";

const FleetGrid = dynamic(() => import("@/components/fleet-grid").then((m) => m.FleetGrid));
const TestimonialCarousel = dynamic(
  () => import("@/components/testimonial-carousel").then((m) => m.TestimonialCarousel),
);

export function HomeFleetSection({ cars }: { cars: (CarCardData & { bookingCount: number })[] }) {
  return (
    <section className="border-b border-[#1A1A1A]/10">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#1F4D3F] mb-3">
                Sorotan
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl leading-tight">
                Pilihan minggu ini.
              </h2>
            </div>
            <a
              href="/cars"
              className="text-sm font-semibold text-[#1A1A1A] hover:text-[#1F4D3F] transition-colors inline-flex items-center gap-2"
            >
              Lihat seluruh armada
              <span>→</span>
            </a>
          </div>

          <FleetGrid cars={cars} />
        </div>
      </ScrollReveal>
    </section>
  );
}

interface TestimonialItem {
  name: string;
  role?: string | null;
  text: string;
  rating: number;
}

export function HomeTestimonialSection({ testimonials }: { testimonials: TestimonialItem[] }) {
  return (
    <section className="border-b border-[#1A1A1A]/10 bg-[#FAFAF7]">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="flex items-baseline justify-between flex-wrap gap-4 mb-12">
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#1F4D3F]">
              Suara Pelanggan
            </p>
            <p className="font-serif text-3xl lg:text-4xl italic text-[#1A1A1A]/70 max-w-md text-right">
              Apa kata mereka yang sudah mencoba.
            </p>
          </div>

          <TestimonialCarousel testimonials={testimonials} />
        </div>
      </ScrollReveal>
    </section>
  );
}
