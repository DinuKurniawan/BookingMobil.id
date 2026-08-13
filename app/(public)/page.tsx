import Link from "next/link";
import Image from "next/image";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { ScrollReveal } from "@/components/scroll-reveal";
import { HeroSearchForm } from "@/components/hero-search-form";
import { BrandMarquee } from "@/components/brand-marquee";
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
      <section className="relative bg-black text-white border-b border-white/10">
        <div className="flex flex-col lg:flex-row min-h-[560px]">
          {/* Left Panel — Branding */}
          <div className="relative bg-black text-white overflow-hidden lg:w-[55%]">
            {/* Car background */}
            <Image
              src="/images/Toyota Fortuner 2_4L Vrz Trds A_T 2021.jpg"
              alt="Toyota Fortuner armada kami"
              fill
              preload
              quality={60}
              sizes="(max-width: 1023px) 100vw, 55vw"
              className="absolute inset-0 object-cover object-center opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/70" />
            {/* Grid pattern */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
            {/* Glow accents */}
            <div className="absolute -top-32 -left-32 w-[34rem] h-[34rem] rounded-full bg-blue-500/20 blur-3xl" />
            <div className="absolute -bottom-40 -right-24 w-[30rem] h-[30rem] rounded-full bg-indigo-500/15 blur-3xl" />

            {/* Content */}
            <div className="relative z-10 flex flex-col w-full max-w-xl mx-auto px-6 sm:px-14 py-14 lg:py-16 flex-1">
              {/* Headline */}
              <ScrollReveal>
                <div className="mt-4 lg:mt-20">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-xs font-medium text-blue-100 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Premium · Nyaman · Terpercaya
                  </div>
                  <h1 className="text-4xl lg:text-5xl xl:text-[3.4rem] font-bold tracking-tight leading-tight">
                    Rental mobil,{" "}
                    <span className="italic font-light text-blue-200">bukan</span>{" "}
                    drama.
                  </h1>
                  <p className="mt-4 text-blue-200/90 text-base leading-relaxed max-w-md">
                    Sejak 2019, kami belajar dari setiap rental yang mengecewakan — lalu membangun yang lebih jujur.
                  </p>
                </div>
              </ScrollReveal>

              {/* Feature list */}
              <ScrollReveal delay={150}>
                <div className="mt-10 space-y-4">
                  {[
                    { icon: "M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11m-14 0a2 2 0 00-2 2v4h2m-2-6h14m0 0a2 2 0 012 2v4h-2m-12 0a2 2 0 104 0m-4 0a2 2 0 004 0m2 0a2 2 0 104 0m-4 0a2 2 0 004 0", title: "Armada Terpilih", desc: "Mobil terawat, dari kategori premium sampai keluarga" },
                    { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", title: "Booking Mudah", desc: "Pesan dalam hitungan menit, konfirmasi cepat" },
                    { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-7.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Harga Jujur", desc: "Tanpa biaya tersembunyi, semua transparan" },
                  ].map((item) => (
                    <div key={item.title} className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4.5 h-4.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{item.title}</p>
                        <p className="text-xs text-blue-200/80 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              {/* CTA */}
              <ScrollReveal delay={250}>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Link
                    href="/cars"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Lihat Armada Mobil
                    <span>→</span>
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/40 text-sm font-semibold text-white hover:bg-white hover:text-slate-900 transition-colors"
                  >
                    Hubungi Kami
                  </Link>
                </div>
              </ScrollReveal>

              {/* Footer quote */}
              <div className="mt-auto pt-12">
                <div className="border-t border-white/10 pt-6 flex items-center justify-between">
                  <p className="text-xs text-blue-200/60">© {new Date().getFullYear()} BookingMobil.id</p>
                  <p className="text-xs text-blue-200/60">Rental Premium</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel — Search Form */}
          <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
            <div className="w-full max-w-md py-6">
              {/* Mobile brand */}
              <div className="lg:hidden text-center mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/25">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11m-14 0a2 2 0 00-2 2v4h2m-2-6h14m0 0a2 2 0 012 2v4h-2m-12 0a2 2 0 104 0m-4 0a2 2 0 004 0m2 0a2 2 0 104 0m-4 0a2 2 0 004 0" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">BookingMobil<span className="text-blue-600">.id</span></h2>
                <p className="text-sm text-slate-500 mt-1">Sewa mobil premium tanpa drama</p>
              </div>

              {/* Heading */}
              <div className="mb-8">
                <p className="text-sm font-medium text-blue-600 mb-2">Cari Armada Impian Anda</p>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Siap Berangkat Hari Ini?</h2>
                <p className="text-sm text-slate-500 mt-2">Pilih kategori dan tanggal, lalu temukan mobil yang pas untuk perjalanan Anda.</p>
              </div>

              {/* Card */}
              <div className="bg-black rounded-3xl border border-white/10 p-8">
                <HeroSearchForm />
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="border-t border-white/10 bg-black">
          <div className="max-w-4xl mx-auto px-6 lg:px-10 py-8 lg:py-10 grid grid-cols-3 gap-6 lg:gap-0 text-center">
            {[
              { num: String(totalCars || 80).padStart(2, "0"), label: "Armada aktif" },
              { num: totalCustomers, label: "Pelanggan" },
              { num: "06", label: "Tahun beroperasi" },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className={`lg:px-10 ${i > 0 ? "lg:border-l border-white/15" : ""}`}>
                  <p className="font-serif text-4xl lg:text-5xl tabular-nums leading-none text-white">
                    {stat.num}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/50 mt-2">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <BrandMarquee />

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((step, i) => (
              <ScrollReveal key={step.num} delay={i * 80}>
                <article className="relative h-full border border-[#1A1A1A]/15 rounded-2xl bg-white p-8 transition-shadow hover:shadow-lg">
                  <h3 className="font-serif text-2xl leading-tight tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[15px] text-[#1A1A1A]/70 leading-relaxed">
                    {step.body}
                  </p>
                  {i < PROCESS.length - 1 && (
                    <svg
                      className="hidden lg:block absolute top-1/2 -translate-y-1/2 -right-6 w-6 h-6 text-[#1A1A1A]/40 z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
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
