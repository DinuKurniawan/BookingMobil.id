"use client";

import { useState, useMemo, useCallback, useTransition, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  CAR_CATEGORIES,
  CAR_CATEGORY_LABELS,
  TRANSMISSIONS,
  TRANSMISSION_LABELS,
  formatCurrency,
} from "@/lib/validations/car";

type CarWithMeta = {
  id: string;
  name: string;
  brand: string;
  category: string;
  transmission: string;
  seats: number;
  pricePerDay: number;
  images: string[];
  description: string;
  licensePlate: string;
  bookingCount: number;
};

type SortKey = "newest" | "cheapest" | "expensive" | "popular";
const PER_PAGE = 9;

const PRICE_PRESETS = [
  { label: "Semua", min: "", max: "" },
  { label: "< Rp300rb", min: "", max: "300000" },
  { label: "Rp300rb–500rb", min: "300000", max: "500000" },
  { label: "Rp500rb–1jt", min: "500000", max: "1000000" },
  { label: "> Rp1jt", min: "1000000", max: "" },
] as const;

function getBadge(car: CarWithMeta, all: CarWithMeta[]) {
  if (all.length < 2) return undefined;
  const cheapest = Math.min(...all.map((c) => c.pricePerDay));
  const mostBooked = Math.max(...all.map((c) => c.bookingCount));
  if (car.pricePerDay === cheapest && car.bookingCount === mostBooked) return { label: "HOT", bg: "bg-[#C2410C]" };
  if (car.pricePerDay === cheapest) return { label: "Best Deal", bg: "bg-[#1A1A1A]" };
  if (car.bookingCount === mostBooked && car.bookingCount > 0) return { label: "Populer", bg: "bg-[#1A1A1A]" };
  return undefined;
}

export function CarsContent({
  cars,
  totalCars,
  categoryCountMap,
}: {
  cars: CarWithMeta[];
  totalCars: number;
  categoryCountMap: Record<string, number>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [page, setPage] = useState(1);

  const currentCategory = searchParams.get("category") ?? "";
  const currentTransmission = searchParams.get("transmission") ?? "";
  const currentMinPrice = searchParams.get("minPrice") ?? "";
  const currentMaxPrice = searchParams.get("maxPrice") ?? "";
  const currentQuery = searchParams.get("q") ?? "";

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }
      startTransition(() => {
        router.push(`/cars?${params.toString()}`, { scroll: false });
        setPage(1);
      });
    },
    [router, searchParams],
  );

  const hasActiveFilters =
    currentCategory || currentTransmission || currentMinPrice || currentMaxPrice || currentQuery;

  const activeFilterCount = [currentCategory, currentTransmission, currentMinPrice || currentMaxPrice, currentQuery].filter(Boolean).length;

  const sorted = useMemo(() => {
    const copy = [...cars];
    switch (sortKey) {
      case "cheapest": copy.sort((a, b) => a.pricePerDay - b.pricePerDay); break;
      case "expensive": copy.sort((a, b) => b.pricePerDay - a.pricePerDay); break;
      case "popular": copy.sort((a, b) => b.bookingCount - a.bookingCount); break;
      default: break;
    }
    return copy;
  }, [cars, sortKey]);

  const carsWithBadges = useMemo(() => sorted.map((c) => ({ ...c, badge: getBadge(c, sorted) })), [sorted]);
  const totalPages = Math.ceil(carsWithBadges.length / PER_PAGE);
  const paginated = carsWithBadges.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "newest", label: "Terbaru" },
    { key: "cheapest", label: "Termurah" },
    { key: "expensive", label: "Termahal" },
    { key: "popular", label: "Terpopuler" },
  ];

  const clearAll = useCallback(() => {
    startTransition(() => {
      router.push("/cars", { scroll: false });
      setPage(1);
    });
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F4EE] text-[#0A0A0A]">
      {/* ──── Header ──── */}
      <header className="border-b border-[#0A0A0A]/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-16 pb-10 lg:pt-24 lg:pb-14">
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 lg:col-span-8">
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#C2410C] mb-4">
                Katalog — 2025
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
                Pilih mobil,
                <span className="block italic font-light text-[#0A0A0A]/70">isi data,</span>
                <span className="block">jalan.</span>
              </h1>
            </div>
            <div className="col-span-12 lg:col-span-4 lg:text-right">
              <p className="text-sm text-[#0A0A0A]/60 leading-relaxed max-w-xs lg:ml-auto">
                Armada kami siap mengantar Anda. {totalCars} unit terawat, transparan, tanpa biaya tersembunyi.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ──── Filter Bar ──── */}
      <div className="sticky top-16 z-30 bg-[#F7F4EE]/95 backdrop-blur-sm border-b border-[#0A0A0A]/10">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-4">
          <div className={`flex flex-col lg:flex-row lg:items-center gap-4 transition-opacity duration-200 ${isPending ? "opacity-50" : "opacity-100"}`}>
            {/* Search */}
            <SearchInput
              defaultValue={currentQuery}
              onChange={(val) => updateFilters({ q: val })}
            />

            <span className="hidden lg:block w-px h-6 bg-[#0A0A0A]/10" />

            {/* Filter chips */}
            <div className="flex items-center gap-1.5 flex-wrap flex-1">
              <FilterGroup label="Kategori" current={currentCategory} onClear={() => updateFilters({ category: "" })}>
                {CAR_CATEGORIES.map((c) => (
                  <FilterChip key={c} active={currentCategory === c} onClick={() => updateFilters({ category: c })}>
                    {CAR_CATEGORY_LABELS[c]}
                  </FilterChip>
                ))}
              </FilterGroup>

              <span className="hidden xl:block w-px h-4 bg-[#0A0A0A]/10 mx-1" />

              <FilterGroup label="Transmisi" current={currentTransmission} onClear={() => updateFilters({ transmission: "" })}>
                {TRANSMISSIONS.map((t) => (
                  <FilterChip key={t} active={currentTransmission === t} onClick={() => updateFilters({ transmission: t })}>
                    {TRANSMISSION_LABELS[t]}
                  </FilterChip>
                ))}
              </FilterGroup>

              <span className="hidden xl:block w-px h-4 bg-[#0A0A0A]/10 mx-1" />

              <FilterGroup label="Harga/hari" current={currentMinPrice || currentMaxPrice ? "1" : ""} onClear={() => updateFilters({ minPrice: "", maxPrice: "" })}>
                {PRICE_PRESETS.slice(1).map((p, idx) => {
                  const isActive = currentMinPrice === p.min && currentMaxPrice === p.max;
                  return (
                    <FilterChip key={idx} active={isActive} onClick={() => updateFilters({ minPrice: p.min, maxPrice: p.max })}>
                      {p.label}
                    </FilterChip>
                  );
                })}
              </FilterGroup>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="flex-shrink-0 text-xs font-semibold text-[#0A0A0A]/60 hover:text-[#C2410C] transition-colors flex items-center gap-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ──── Results bar ──── */}
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-4xl lg:text-5xl font-serif tabular-nums tracking-tight">
              {String(totalCars).padStart(2, "0")}
            </p>
            <p className="text-xs text-[#0A0A0A]/50 mt-1">
              unit tersedia {hasActiveFilters && <span className="text-[#C2410C]">· {activeFilterCount} filter aktif</span>}
            </p>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[11px] text-[#0A0A0A]/50 mr-2 hidden sm:inline uppercase tracking-wider">Urut</span>
            <div className="flex">
              {SORT_OPTIONS.map((opt, i) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => { setSortKey(opt.key); setPage(1); }}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    sortKey === opt.key ? "bg-[#0A0A0A] text-[#F7F4EE]" : "text-[#0A0A0A]/60 hover:text-[#0A0A0A]"
                  } ${i === 0 ? "rounded-l-full" : i === SORT_OPTIONS.length - 1 ? "rounded-r-full" : ""} border border-[#0A0A0A]/15 ${i > 0 ? "-ml-px" : ""}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ──── Main Grid ──── */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 pb-24 flex-1">
        {sorted.length === 0 ? (
          <div className="py-24 text-center border-t border-[#0A0A0A]/10">
            <p className="font-serif text-3xl italic text-[#0A0A0A]/70 mb-2">Tidak ada yang cocok</p>
            <p className="text-sm text-[#0A0A0A]/50 max-w-xs mx-auto mb-6">
              Coba longgarkan filter atau cari dengan kata kunci berbeda.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="text-sm font-semibold text-[#C2410C] hover:underline"
            >
              Reset semua filter →
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 border-t border-[#0A0A0A]/10 pt-8">
              {paginated.map((car, i) => (
                <ScrollReveal key={car.id} delay={i * 50}>
                  <CatalogCard index={(page - 1) * PER_PAGE + i + 1} car={car} />
                </ScrollReveal>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-16">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="w-9 h-9 rounded-md flex items-center justify-center text-sm text-[#0A0A0A]/60 hover:text-[#0A0A0A] hover:bg-[#0A0A0A]/5 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                  aria-label="Halaman sebelumnya"
                >
                  ←
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`w-9 h-9 rounded-md text-sm font-medium transition-all ${
                      p === page ? "bg-[#0A0A0A] text-[#F7F4EE]" : "text-[#0A0A0A]/60 hover:text-[#0A0A0A] hover:bg-[#0A0A0A]/5"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="w-9 h-9 rounded-md flex items-center justify-center text-sm text-[#0A0A0A]/60 hover:text-[#0A0A0A] hover:bg-[#0A0A0A]/5 disabled:opacity-20 disabled:pointer-events-none transition-colors"
                  aria-label="Halaman berikutnya"
                >
                  →
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ──── Footer accent ──── */}
      <div className="border-t border-[#0A0A0A]/10 bg-[#0A0A0A] text-[#F7F4EE]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7">
            <p className="font-serif text-2xl lg:text-3xl leading-snug max-w-md">
              Tidak menemukan yang Anda cari?{" "}
              <Link href="/contact" className="italic underline decoration-[#C2410C] underline-offset-4 hover:decoration-2">
                Hubungi tim kami
              </Link>{" "}
              untuk permintaan khusus.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:text-right">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#F7F4EE]/50 mb-2">Butuh bantuan?</p>
            <a href="https://wa.me/628123456789" className="font-serif text-2xl hover:text-[#C2410C] transition-colors">
              +62 812-3456-7890
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──── Filter Components ──── */

function SearchInput({ defaultValue, onChange }: { defaultValue: string; onChange: (val: string) => void }) {
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  return (
    <div className="relative flex-1 max-w-md">
      <input
        type="text"
        placeholder="Cari mobil..."
        defaultValue={defaultValue}
        onChange={(e) => {
          const val = e.target.value;
          if (debounceRef.current) clearTimeout(debounceRef.current);
          debounceRef.current = setTimeout(() => onChange(val), 350);
        }}
        className="w-full pl-4 pr-4 py-2 bg-transparent border-b border-[#0A0A0A]/30 text-base text-[#0A0A0A] placeholder:text-[#0A0A0A]/40 focus:outline-none focus:border-[#C2410C] transition-colors"
      />
    </div>
  );
}

function FilterGroup({ label, current, onClear, children }: { label: string; current: string; onClear: () => void; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#0A0A0A]/50 mr-1 hidden sm:inline">{label}</span>
      {current && (
        <button
          type="button"
          onClick={onClear}
          className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#0A0A0A] text-[#F7F4EE] hover:bg-[#C2410C] transition-colors"
        >
          Semua
        </button>
      )}
      {!current && (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#0A0A0A] text-[#F7F4EE]">
          Semua
        </span>
      )}
      {children}
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
        active ? "bg-[#0A0A0A] text-[#F7F4EE]" : "text-[#0A0A0A]/70 hover:text-[#0A0A0A] border border-[#0A0A0A]/15"
      }`}
    >
      {children}
    </button>
  );
}

/* ──── Catalog Card (2-column grid, uniform height) ──── */

function CatalogCard({ index, car }: { index: number; car: CarWithMeta & { badge?: { label: string; bg: string } } }) {
  const thumbUrl = car.images[0];

  return (
    <Link href={`/cars/${car.id}`} className="group block h-full">
      <article className="bg-[#F7F4EE] border border-[#0A0A0A]/10 rounded-2xl overflow-hidden hover:border-[#0A0A0A]/30 hover:shadow-md transition-all duration-300 flex flex-col h-full relative">
        {/* Image */}
        <div className="relative aspect-[16/10] bg-[#0A0A0A]/5 overflow-hidden flex-shrink-0">
          {thumbUrl ? (
            <Image
              src={thumbUrl}
              alt={car.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-[#0A0A0A]/15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25" />
              </svg>
            </div>
          )}

          {/* Index badge */}
          <span className="absolute top-3 right-3 font-serif text-2xl tabular-nums text-white/95 drop-shadow-md leading-none">
            {String(index).padStart(2, "0")}
          </span>

          {/* Category badge */}
          {car.badge && (
            <span className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider text-white ${car.badge.bg}`}>
              {car.badge.label}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 min-h-[180px]">
          <div className="mb-3">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#C2410C] mb-1 h-4 line-clamp-1">
              {car.brand}
            </p>
            <h3 className="font-serif text-lg leading-snug tracking-tight text-[#0A0A0A] group-hover:text-[#C2410C] transition-colors line-clamp-2 min-h-[2.75rem]">
              {car.name}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#0A0A0A]/55 mb-4 h-4">
            <span className="whitespace-nowrap">{car.seats} kursi</span>
            <span className="w-0.5 h-0.5 rounded-full bg-[#0A0A0A]/25 flex-shrink-0" />
            <span className="whitespace-nowrap">{TRANSMISSION_LABELS[car.transmission as keyof typeof TRANSMISSION_LABELS]}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-[#0A0A0A]/25 flex-shrink-0" />
            <span className="whitespace-nowrap truncate">{CAR_CATEGORY_LABELS[car.category as keyof typeof CAR_CATEGORY_LABELS]}</span>
          </div>

          <div className="mt-auto pt-4 border-t border-[#0A0A0A]/10 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#0A0A0A]/50 mb-0.5">Mulai dari</p>
              <p className="font-serif text-xl tabular-nums leading-none text-[#0A0A0A] truncate">
                {formatCurrency(car.pricePerDay)}
              </p>
              <p className="text-[10px] text-[#0A0A0A]/45 uppercase tracking-wider mt-1">/ hari</p>
            </div>
            <span className="text-[11px] font-semibold text-[#0A0A0A]/60 group-hover:text-[#C2410C] group-hover:translate-x-1 transition-all inline-flex items-center gap-1 flex-shrink-0">
              Detail <span>→</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
