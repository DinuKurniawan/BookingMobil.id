"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition, useRef } from "react";
import {
  CAR_CATEGORIES,
  CAR_CATEGORY_LABELS,
  TRANSMISSIONS,
  TRANSMISSION_LABELS,
  formatCurrency,
} from "@/lib/car-constants";

const PRICE_PRESETS = [
  { label: "Semua", min: "", max: "" },
  { label: "< Rp300rb", min: "", max: "300000" },
  { label: "Rp300rb – 500rb", min: "300000", max: "500000" },
  { label: "Rp500rb – 1jt", min: "500000", max: "1000000" },
  { label: "> Rp1jt", min: "1000000", max: "" },
] as const;

export function CatalogFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const currentCategory = searchParams.get("category") ?? "";
  const currentTransmission = searchParams.get("transmission") ?? "";
  const currentMinPrice = searchParams.get("minPrice") ?? "";
  const currentMaxPrice = searchParams.get("maxPrice") ?? "";
  const currentQuery = searchParams.get("q") ?? "";

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      }
      startTransition(() => {
        router.push(`/cars?${params.toString()}`, { scroll: false });
      });
    },
    [router, searchParams],
  );

  const updateFilter = useCallback(
    (key: string, value: string) => updateFilters({ [key]: value }),
    [updateFilters],
  );

  const clearAll = useCallback(() => {
    startTransition(() => {
      router.push("/cars", { scroll: false });
    });
  }, [router]);

  /** Check which price preset is active */
  const activePriceIdx = PRICE_PRESETS.findIndex(
    (p) => p.min === currentMinPrice && p.max === currentMaxPrice,
  );

  const hasActiveFilters =
    currentCategory || currentTransmission || currentMinPrice || currentMaxPrice || currentQuery;

  return (
    <div
      className={`transition-opacity duration-200 ${isPending ? "opacity-60 pointer-events-none" : "opacity-100"}`}
    >
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            aria-label="Cari nama mobil"
            placeholder="Cari mobil... contoh: Avanza"
            defaultValue={currentQuery}
            onChange={(e) => {
              const val = e.target.value;
              if (debounceRef.current) clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(
                () => updateFilter("q", val),
                400,
              );
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white transition-all"
          />
          {currentQuery && (
            <button
              type="button"
              onClick={() => updateFilter("q", "")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full bg-gray-300 text-white hover:bg-gray-400 transition-colors"
              aria-label="Hapus pencarian"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Row of filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
          {/* ── Kategori ───────────────────── */}
          <div>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              Kategori
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => updateFilter("category", "")}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 border ${
                  !currentCategory
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                Semua
              </button>
              {CAR_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => updateFilter("category", cat)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 border ${
                    currentCategory === cat
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {CAR_CATEGORY_LABELS[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* ── Transmisi ──────────────────── */}
          <div>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">
              Transmisi
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => updateFilter("transmission", "")}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 border ${
                  !currentTransmission
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                Semua
              </button>
              {TRANSMISSIONS.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => updateFilter("transmission", t)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 border ${
                    currentTransmission === t
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {TRANSMISSION_LABELS[t]}
                </button>
              ))}
            </div>
          </div>

          {/* ── Harga / Hari ────────────────── */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 whitespace-nowrap">
              Harga / Hari
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {PRICE_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() =>
                    updateFilters({ minPrice: preset.min, maxPrice: preset.max })
                  }
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 border ${
                    activePriceIdx === idx
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-600/20"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Custom range inputs */}
            <div className="flex items-center gap-2 mt-3">
              <input
                type="number"
                aria-label="Harga minimum"
                placeholder="Min"
                defaultValue={currentMinPrice}
                onChange={(e) => {
                  const val = e.target.value;
                  if (debounceRef.current) clearTimeout(debounceRef.current);
                  debounceRef.current = setTimeout(
                    () => updateFilter("minPrice", val),
                    600,
                  );
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
              <span className="text-gray-400 text-xs flex-shrink-0">—</span>
              <input
                type="number"
                aria-label="Harga maksimum"
                placeholder="Max"
                defaultValue={currentMaxPrice}
                onChange={(e) => {
                  const val = e.target.value;
                  if (debounceRef.current) clearTimeout(debounceRef.current);
                  debounceRef.current = setTimeout(
                    () => updateFilter("maxPrice", val),
                    600,
                  );
                }}
                className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Active filters summary + clear */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-gray-400 mr-1">Filter aktif:</span>
              {currentQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-cyan-50 text-cyan-700 border border-cyan-200">
                  🔍 {currentQuery}
                </span>
              )}
              {currentCategory && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-purple-50 text-purple-700 border border-purple-200">
                  {CAR_CATEGORY_LABELS[currentCategory as keyof typeof CAR_CATEGORY_LABELS] ?? currentCategory}
                </span>
              )}
              {currentTransmission && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {TRANSMISSION_LABELS[currentTransmission as keyof typeof TRANSMISSION_LABELS] ?? currentTransmission}
                </span>
              )}
              {(currentMinPrice || currentMaxPrice) && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  {currentMinPrice && currentMaxPrice
                    ? `${formatCurrency(Number(currentMinPrice))} – ${formatCurrency(Number(currentMaxPrice))}`
                    : currentMinPrice
                      ? `≥ ${formatCurrency(Number(currentMinPrice))}`
                      : `≤ ${formatCurrency(Number(currentMaxPrice))}`}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 transition-colors flex-shrink-0"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
