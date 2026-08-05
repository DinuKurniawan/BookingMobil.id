"use client";

import { useState } from "react";

type Props = {
  defaultValue: string;
  currentStatus: string;
};

export function BookingSearchBar({ defaultValue, currentStatus }: Props) {
  const [value, setValue] = useState(defaultValue);

  const buildUrl = (q: string) => {
    if (!q) return "/admin/bookings" + (currentStatus ? `?status=${encodeURIComponent(currentStatus)}` : "");
    const params = new URLSearchParams();
    params.set("q", q);
    if (currentStatus) params.set("status", currentStatus);
    return `/admin/bookings?${params.toString()}`;
  };

  return (
    <form
      className="relative flex-1 max-w-md"
      method="GET"
      action="/admin/bookings"
      onSubmit={(e) => {
        if (!value.trim()) {
          e.preventDefault();
          window.location.href = buildUrl("");
        }
      }}
    >
      {currentStatus && <input type="hidden" name="status" value={currentStatus} />}
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
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
        name="q"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Cari kode booking atau nama pelanggan..."
        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none bg-white"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            window.location.href = buildUrl("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs hover:bg-gray-300 cursor-pointer"
        >
          ✕
        </button>
      )}
    </form>
  );
}
