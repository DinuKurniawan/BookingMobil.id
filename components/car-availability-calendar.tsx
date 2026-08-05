"use client";

import { useState, useEffect, useCallback } from "react";

interface BookedRange {
  bookingCode: string;
  start: string;
  end: string;
  status: string;
}

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function isDateBooked(dateStr: string, ranges: BookedRange[]): BookedRange | null {
  return ranges.find((r) => dateStr >= r.start && dateStr <= r.end) ?? null;
}

export function CarAvailabilityCalendar({ carId }: { carId: string }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [bookedRanges, setBookedRanges] = useState<BookedRange[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const monthKey = `${year}-${String(month).padStart(2, "0")}`;

  const fetchCalendar = useCallback(async (y: number, m: number) => {
    const key = `${y}-${String(m).padStart(2, "0")}`;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/cars/${carId}/calendar?month=${key}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Gagal memuat kalender");
        setBookedRanges([]);
      } else {
        const data = await res.json();
        setBookedRanges(data.bookedRanges || []);
      }
    } catch {
      setError("Gagal menghubungi server");
      setBookedRanges([]);
    } finally {
      setLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    fetchCalendar(year, month);
  }, [year, month, fetchCalendar]);

  const goPrev = () => {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };

  const goNext = () => {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  // Build calendar grid
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const todayStr = now.toISOString().slice(0, 10);

  const cells: { date: string | null; day: number; isPast: boolean; booking: BookedRange | null }[] = [];

  // Empty padding before first day
  for (let i = 0; i < firstDay; i++) {
    cells.push({ date: null, day: 0, isPast: false, booking: null });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const isPast = dateStr < todayStr;
    const booking = isDateBooked(dateStr, bookedRanges);
    cells.push({ date: dateStr, day: d, isPast, booking });
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Kalender Ketersediaan
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={goPrev}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-30 transition-colors"
            aria-label="Bulan sebelumnya"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-gray-700 min-w-[130px] text-center">
            {MONTHS[month - 1]} {year}
          </span>
          <button
            onClick={goNext}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-30 transition-colors"
            aria-label="Bulan berikutnya"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && (
        <div className="text-center py-6 text-xs text-gray-400">
          Memuat data kalender...
        </div>
      )}
      {error && !loading && (
        <div className="text-center py-6 text-xs text-red-500">{error}</div>
      )}

      {/* Calendar Grid */}
      {!loading && !error && (
        <div className="space-y-1">
          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {DAY_NAMES.map((name) => (
              <span key={name} className="text-[11px] font-semibold text-gray-400 uppercase py-1">
                {name}
              </span>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((cell, idx) => {
              if (!cell.date) {
                return <div key={`empty-${idx}`} className="aspect-square" />;
              }

              const isToday = cell.date === todayStr;

              let cellClass = "aspect-square rounded-lg flex flex-col items-center justify-center text-xs transition-colors";
              let dayClass = "font-semibold";

              if (cell.booking) {
                cellClass += " bg-red-100 border border-red-200 cursor-default";
                dayClass += " text-red-700";
              } else if (cell.isPast) {
                cellClass += " bg-gray-100 text-gray-300 cursor-default";
                dayClass = "text-gray-300";
              } else {
                cellClass += " bg-emerald-50 border border-emerald-100 hover:bg-emerald-100";
                dayClass += " text-emerald-700";
              }

              if (isToday) {
                cellClass += " ring-2 ring-blue-400 ring-offset-1";
              }

              const title = cell.booking
                ? `Disewa: ${cell.booking.bookingCode} (${cell.booking.start} → ${cell.booking.end})`
                : cell.isPast
                ? "Tanggal sudah lewat"
                : "Tersedia";

              return (
                <div
                  key={cell.date}
                  className={cellClass}
                  title={title}
                  role="gridcell"
                  aria-label={title}
                >
                  <span className={dayClass}>{cell.day}</span>
                  {cell.booking && (
                    <span className="text-[9px] leading-none text-red-500 mt-0.5">●</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 pt-3 text-[11px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200 inline-block" />
              Tersedia
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-red-100 border border-red-200 inline-block" />
              Dibooking
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-gray-100 inline-block" />
              Terlewat
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
