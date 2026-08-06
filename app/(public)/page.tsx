import Link from "next/link";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { ScrollReveal } from "@/components/scroll-reveal";
import { HeroSearchForm } from "@/components/hero-search-form";
import { FleetGrid } from "@/components/fleet-grid";
import { prisma } from "@/lib/prisma";

import type { CarCategory, Transmission } from "@prisma/client";

type CarWithMeta = {
  id: string;
  name: string;
  brand: string;
  category: CarCategory;
  transmission: Transmission;
  seats: number;
  pricePerDay: number;
  images: string[];
  bookingCount: number;
};

const PROCESS = [
  { num: "01", title: "Pilih Mobil", body: "Telusuri katalog. Filter sesuai kebutuhan." },
  { num: "02", title: "Isi Data", body: "Tanggal, identitas, alamat. Tanpa registrasi akun." },
  { num: "03", title: "Bayar", body: "Transfer ke rekening resmi. Upload bukti." },
  { num: "04", title: "Jalan", body: "Mobil diantar atau siap diambil. Sampai jumpa di jalan." },
];

export default async function HomePage() {
  const cars = await prisma.car.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { _count: { select: { bookings: true } } },
  });

  const carCards: CarWithMeta[] = cars.map((car) => ({
    id: car.id,
    name: car.name,
    brand: car.brand,
    category: car.category,
    transmission: car.transmission,
    seats: car.seats,
    pricePerDay: car.pricePerDay.toNumber(),
    images: car.images,
    bookingCount: car._count.bookings,
  }));

  const [testimonials, totalCars, totalBookings, categoryCounts] = await Promise.all([
    prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { name: true, role: true, text: true, rating: true },
    }),
    prisma.car.count({ where: { status: "AVAILABLE" } }),
    prisma.booking.count(),
    prisma.car.groupBy({ by: ["category"], where: { status: "AVAILABLE" }, _count: { _all: true } }),
  ]);

  const categoryCountMap = Object.fromEntries(categoryCounts.map((c) => [c.category, c._count._all]));
  const totalCustomers = totalBookings > 999 ? `${Math.floor(totalBookings / 1000)}K+` : `${totalBookings}+`;

  return (
    <div className="bg-[#FAFAF7] text-[#1A1A1A]">
      <section className="border-b border-[#1A1A1A]/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-12 pb-16 lg:pt-20 lg:pb-24">
          <ScrollReveal>
            <div className="flex items-center justify-between flex-wrap gap-4 mb-10 pb-4 border-b border-[#1A1A1A]/15">
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#1F4D3F]">
                Edisi Terbaru — 2025
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/40">
                {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-12 gap-6 lg:gap-10 items-end">
            <div className="col-span-12 lg:col-span-9">
              <ScrollReveal>
                <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] tracking-tight">
                  Rental mobil,
                  <span className="block italic font-light text-[#1A1A1A]/60">bukan</span>
                  <span className="block">drama.</span>
                </h1>
              </ScrollReveal>
            </div>

            <div className="col-span-12 lg:col-span-3 lg:pb-3">
              <ScrollReveal delay={150}>
                <p className="text-base lg:text-lg leading-relaxed text-[#1A1A1A]/75 max-w-xs">
                  Sejak 2019, kami belajar dari setiap rental yang mengecewakan — lalu membangun yang lebih jujur.
                </p>
              </ScrollReveal>
            </div>
          </div>

          <ScrollReveal delay={300}>
            <div className="mt-12 lg:mt-16 max-w-4xl">
              <HeroSearchForm />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-b border-[#1A1A1A]/10 bg-[#1A1A1A] text-[#FAFAF7]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 grid grid-cols-3 gap-6 lg:gap-0">
          {[
            { num: String(totalCars || 80).padStart(2, "0"), label: "Armada aktif" },
            { num: totalCustomers, label: "Pelanggan" },
            { num: "06", label: "Tahun beroperasi" },
          ].map((stat, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className={`lg:px-10 ${i > 0 ? "lg:border-l border-[#FAFAF7]/15" : ""}`}>
                <p className="font-serif text-4xl lg:text-5xl tabular-nums leading-none">
                  {stat.num}
                </p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#FAFAF7]/50 mt-2">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="border-b border-[#1A1A1A]/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <ScrollReveal>
            <div className="flex items-baseline justify-between flex-wrap gap-4 mb-12">
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#1F4D3F]">
                Cara Sewa
              </p>
              <p className="text-xs text-[#1A1A1A]/40 italic max-w-xs text-right">
                Empat langkah. Tidak perlu aplikasi, tidak perlu akun.
              </p>
            </div>
          </ScrollReveal>

          <div className="border-t border-[#1A1A1A]/15">
            {PROCESS.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 80}>
                <article className="grid grid-cols-12 gap-4 lg:gap-10 py-8 lg:py-10 border-b border-[#1A1A1A]/15 items-baseline">
                  <div className="col-span-2 lg:col-span-1">
                    <span className="font-serif text-3xl lg:text-4xl tabular-nums text-[#1A1A1A]/30">
                      {step.num}
                    </span>
                  </div>
                  <div className="col-span-10 lg:col-span-4">
                    <h3 className="font-serif text-2xl lg:text-3xl leading-tight tracking-tight">
                      {step.title}
                    </h3>
                  </div>
                  <div className="col-span-12 lg:col-span-7">
                    <p className="text-[15px] text-[#1A1A1A]/70 leading-relaxed max-w-xl">
                      {step.body}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#1A1A1A]/10 bg-[#FAFAF7]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <ScrollReveal>
            <div className="flex items-baseline justify-between flex-wrap gap-4 mb-12">
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#1F4D3F]">
                Indeks Kategori
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl leading-tight max-w-xl">
                Pilih dari lima tipe.
              </h2>
            </div>
          </ScrollReveal>

          <div className="border-t border-[#1A1A1A]/15">
            {[
              { key: "MPV", label: "MPV", body: "Untuk keluarga. Kabin luas, bagasi lega." },
              { key: "SUV", label: "SUV", body: "Medan beragam. Ground clearance tinggi." },
              { key: "SEDAN", label: "Sedan", body: "Perjalanan bisnis. Nyaman di jalan tol." },
              { key: "HATCHBACK", label: "Hatchback", body: "Kompak dan lincah. Cocok untuk kota." },
              { key: "VAN", label: "Van", body: "Kapasitas besar. Untuk rombongan." },
            ].map((cat, i) => (
              <ScrollReveal key={cat.key} delay={i * 60}>
                <Link
                  href={`/cars?category=${cat.key}`}
                  className="grid grid-cols-12 gap-4 lg:gap-10 py-7 border-b border-[#1A1A1A]/15 items-baseline group hover:bg-[#1A1A1A]/3 transition-colors"
                >
                  <div className="col-span-2 lg:col-span-1">
                    <span className="font-serif text-2xl tabular-nums text-[#1A1A1A]/30 group-hover:text-[#1F4D3F] transition-colors">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="col-span-7 lg:col-span-3">
                    <h3 className="font-serif text-2xl lg:text-3xl leading-tight group-hover:text-[#1F4D3F] transition-colors">
                      {cat.label}
                    </h3>
                  </div>
                  <div className="col-span-12 lg:col-span-6">
                    <p className="text-sm text-[#1A1A1A]/65 leading-relaxed">
                      {cat.body}
                    </p>
                  </div>
                  <div className="col-span-3 lg:col-span-2 lg:text-right">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/40 group-hover:text-[#1F4D3F] transition-colors inline-flex items-center gap-1">
                      {categoryCountMap[cat.key] ?? 0} unit
                      <span className="hidden lg:inline group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#1A1A1A]/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <ScrollReveal>
            <div className="flex items-end justify-between flex-wrap gap-4 mb-12">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#1F4D3F] mb-3">
                  Sorotan
                </p>
                <h2 className="font-serif text-4xl lg:text-5xl leading-tight">
                  Pilihan minggu ini.
                </h2>
              </div>
              <Link
                href="/cars"
                className="text-sm font-semibold text-[#1A1A1A] hover:text-[#1F4D3F] transition-colors inline-flex items-center gap-2"
              >
                Lihat seluruh armada
                <span>→</span>
              </Link>
            </div>
          </ScrollReveal>

          <FleetGrid cars={carCards} />
        </div>
      </section>

      <section className="border-b border-[#1A1A1A]/10 bg-[#FAFAF7]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <ScrollReveal>
            <div className="flex items-baseline justify-between flex-wrap gap-4 mb-12">
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#1F4D3F]">
                Suara Pelanggan
              </p>
              <p className="font-serif text-3xl lg:text-4xl italic text-[#1A1A1A]/70 max-w-md text-right">
                Apa kata mereka yang sudah mencoba.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <TestimonialCarousel testimonials={testimonials} />
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-[#1A1A1A] text-[#FAFAF7]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-28 grid grid-cols-12 gap-6 lg:gap-10 items-end">
          <div className="col-span-12 lg:col-span-8">
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#FAFAF7]/50 mb-4">
              Mulai dari sini
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
              Sudah siap untuk{" "}
              <span className="italic font-light text-[#FAFAF7]/60">perjalanan</span> berikutnya?
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link
              href="/cars"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#FAFAF7] text-[#1A1A1A] text-sm font-semibold hover:bg-[#1F4D3F] hover:text-[#FAFAF7] transition-colors"
            >
              Lihat Armada Mobil →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full border border-[#FAFAF7]/30 text-sm font-semibold hover:bg-[#FAFAF7] hover:text-[#1A1A1A] transition-colors"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
