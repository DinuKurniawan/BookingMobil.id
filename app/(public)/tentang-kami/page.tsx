import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";
import { TentangKamiMap } from "./map";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tentang Kami - BookingMobil.id",
  description:
    "Pelajari lebih lanjut tentang BookingMobil.id, layanan rental mobil terpercaya di Indonesia.",
};

const values = [
  {
    word: "Jujur",
    body: "Tidak ada biaya tersembunyi, tidak ada syarat yang menjebak. Harga yang Anda lihat adalah harga yang Anda bayar.",
  },
  {
    word: "Tepat",
    body: "Mobil datang sesuai jadwal, dalam kondisi prima, dengan bensin sesuai perjanjian. Waktu Anda berharga bagi kami.",
  },
  {
    word: "Ramah",
    body: "Tim yang menjawab bukan bot. Manusia yang paham solusi, bukan sekadar membaca skrip.",
  },
];

const timeline = [
  { year: "2019", title: "Mulai dari Satu Mobil", body: "Berangkat dari satu Avanza yang dipinjamkan kakak. Hari itu cuma tiga pelanggan pertama." },
  { year: "2021", title: "Pindah ke Kantor Kecil", body: "Pesanan membludak di tengah pandemi. Sewa kantor pertama di Menteng, 18 armada." },
  { year: "2023", title: "Buka Cabang Kedua", body: "Ekspansi ke Bandung dan Surabaya. Tim jadi 7 orang, armada jadi 80 unit." },
  { year: "2025", title: "BookingMobil.id", body: "Rebrand dari rental konvensional menjadi platform digital. Website, verifikasi online, pembayaran transparan." },
];

export default async function TentangKamiPage() {
  const [totalCars, totalBookings] = await Promise.all([
    prisma.car.count({ where: { status: "AVAILABLE" } }),
    prisma.booking.count(),
  ]);

  return (
    <div className="bg-[#FAFAF7] text-[#1A1A1A]">
      {/* ──── Header ──── */}
      <header className="border-b border-[#1A1A1A]/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-16 pb-12 lg:pt-24 lg:pb-16">
          <ScrollReveal>
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#1F4D3F] mb-5">
              Tentang Kami — Est. 2019
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight max-w-5xl">
              Rental mobil,
              <span className="block italic font-light text-[#1A1A1A]/60">tanpa drama.</span>
            </h1>
            <div className="grid grid-cols-12 gap-6 mt-12">
              <div className="col-span-12 lg:col-span-6 lg:col-start-7">
                <p className="text-base lg:text-lg leading-relaxed text-[#1A1A1A]/75 max-w-md">
                  Kami bukan perusahaan rental konvensional. Sejak 2019 kami
                  belajar dari setiap pelanggan yang kecewa di tempat lain —
                  dan memutuskan untuk membangun layanan yang lebih jujur.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </header>

      {/* ──── Stats Bar ──── */}
      <section className="border-y border-[#1A1A1A]/10 bg-[#1A1A1A] text-[#FAFAF7]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
          {[
            { num: totalCars || 80, label: "Armada aktif" },
            { num: totalBookings > 999 ? `${Math.floor(totalBookings / 1000)}K+` : `${totalBookings}+`, label: "Pelanggan dilayani" },
            { num: "6", label: "Tahun beroperasi" },
            { num: "24/7", label: "WhatsApp standby" },
          ].map((stat, i) => (
            <ScrollReveal key={i} delay={i * 80}>
              <div className={`lg:px-8 ${i > 0 ? "lg:border-l border-[#FAFAF7]/15" : ""}`}>
                <p className="font-serif text-4xl lg:text-5xl tabular-nums leading-none">
                  {typeof stat.num === "number" ? String(stat.num).padStart(2, "0") : stat.num}
                </p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#FAFAF7]/50 mt-2">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ──── Story Timeline ──── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <ScrollReveal>
            <div className="flex items-baseline justify-between flex-wrap gap-4 mb-12">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight max-w-xl">
                Enam tahun, satu kantor, satu prinsip.
              </h2>
              <p className="text-xs uppercase tracking-[0.2em] text-[#1A1A1A]/40">Sejarah Singkat</p>
            </div>
          </ScrollReveal>

          <div className="space-y-0 border-t border-[#1A1A1A]/15">
            {timeline.map((item, i) => (
              <ScrollReveal key={item.year} delay={i * 100}>
                <article className="grid grid-cols-12 gap-4 lg:gap-10 py-10 lg:py-12 border-b border-[#1A1A1A]/15">
                  <div className="col-span-12 lg:col-span-3">
                    <span className="font-serif text-5xl lg:text-6xl tabular-nums text-[#1F4D3F] leading-none">
                      {item.year}
                    </span>
                  </div>
                  <div className="col-span-12 lg:col-span-9 space-y-3">
                    <h3 className="font-serif text-2xl lg:text-3xl leading-snug tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-[15px] text-[#1A1A1A]/70 leading-relaxed max-w-2xl">
                      {item.body}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Values (large words) ──── */}
      <section className="py-20 lg:py-28 bg-[#1F4D3F] text-[#FAFAF7]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <ScrollReveal>
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#FAFAF7]/60 mb-4">
              Nilai Kami
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight max-w-3xl mb-16">
              Tiga kata yang jadi <span className="italic font-light">pegangan</span> setiap hari.
            </h2>
          </ScrollReveal>

          <div className="space-y-0 border-t border-[#FAFAF7]/15">
            {values.map((v, i) => (
              <ScrollReveal key={v.word} delay={i * 100}>
                <div className="grid grid-cols-12 gap-4 lg:gap-10 py-10 lg:py-14 border-b border-[#FAFAF7]/15 items-baseline">
                  <div className="col-span-12 lg:col-span-5">
                    <span className="font-serif text-6xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-tight">
                      {v.word}
                    </span>
                  </div>
                  <div className="col-span-12 lg:col-span-7">
                    <p className="text-lg lg:text-xl leading-relaxed text-[#FAFAF7]/85 max-w-xl">
                      {v.body}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Office ──── */}
      <section className="py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">
          <ScrollReveal>
            <div className="grid grid-cols-12 gap-6 mb-10">
              <div className="col-span-12 lg:col-span-6">
                <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#1F4D3F] mb-4">
                  Kantor Pusat
                </p>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-tight">
                  Datang, ngopi,{" "}
                  <span className="italic font-light text-[#1A1A1A]/60">lihat langsung armadanya.</span>
                </h2>
              </div>
              <div className="col-span-12 lg:col-span-5 lg:col-start-8 lg:pt-12">
                <div className="space-y-4 text-[15px] text-[#1A1A1A]/70">
                  <p className="flex items-start gap-3">
                    <span className="text-[#1F4D3F] font-semibold w-20 flex-shrink-0">Alamat</span>
                    <span>Jl. Sudirman No. 123, Menteng, Jakarta Pusat 10310</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-[#1F4D3F] font-semibold w-20 flex-shrink-0">WhatsApp</span>
                    <a href="https://wa.me/628123456789" className="hover:text-[#1F4D3F] transition-colors underline decoration-[#1F4D3F]/30 underline-offset-4">0812-3456-7890</a>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-[#1F4D3F] font-semibold w-20 flex-shrink-0">Email</span>
                    <a href="mailto:info@bookingmobil.com" className="hover:text-[#1F4D3F] transition-colors underline decoration-[#1F4D3F]/30 underline-offset-4">info@bookingmobil.com</a>
                  </p>
                  <p className="flex items-start gap-3">
                    <span className="text-[#1F4D3F] font-semibold w-20 flex-shrink-0">Jam buka</span>
                    <span>Senin–Sabtu, 08.00–20.00 WIB</span>
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="rounded-2xl overflow-hidden border border-[#1A1A1A]/10">
              <TentangKamiMap />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ──── CTA ──── */}
      <section className="border-t border-[#1A1A1A]/10 bg-[#1A1A1A] text-[#FAFAF7]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-20 lg:py-28 grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-8">
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#FAFAF7]/50 mb-4">
              Mulai dari sini
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
              Sudah siap <span className="italic font-light text-[#FAFAF7]/60">perjalanan</span> berikutnya?
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
