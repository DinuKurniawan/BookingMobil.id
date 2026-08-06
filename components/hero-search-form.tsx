"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CAR_CATEGORIES, CAR_CATEGORY_LABELS } from "@/lib/validations/car";

export function HeroSearchForm() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    const qs = params.toString();
    router.push(`/cars${qs ? `?${qs}` : ""}`);
  }

  const today = new Date().toISOString().split("T")[0];

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-[#1A1A1A]/15 bg-[#FAFAF7] text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/35 focus:outline-none focus:border-[#1F4D3F] focus:ring-1 focus:ring-[#1F4D3F]/30 transition-all";

  const selectClass =
    `${inputClass} appearance-none cursor-pointer pr-10`;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3"
    >
      <div className="flex-1 min-w-0">
        <label
          htmlFor="hero-category"
          className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-2"
        >
          Kategori Mobil
        </label>
        <div className="relative">
          <select
            id="hero-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={selectClass}
          >
            <option value="">Semua Kategori</option>
            {CAR_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CAR_CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <label
          htmlFor="hero-start"
          className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-2"
        >
          Tanggal Mulai
        </label>
        <input
          id="hero-start"
          type="date"
          value={startDate}
          min={today}
          onChange={(e) => setStartDate(e.target.value)}
          className={inputClass}
        />
      </div>

      <div className="flex-1 min-w-0">
        <label
          htmlFor="hero-end"
          className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-2"
        >
          Tanggal Selesai
        </label>
        <input
          id="hero-end"
          type="date"
          value={endDate}
          min={startDate || today}
          onChange={(e) => setEndDate(e.target.value)}
          className={inputClass}
        />
      </div>

      <button
        type="submit"
        className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1A1A1A] text-[#FAFAF7] text-sm font-semibold hover:bg-[#1F4D3F] transition-colors"
      >
        <svg
          className="w-4 h-4"
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
        Cari Mobil
      </button>
    </form>
  );
}
