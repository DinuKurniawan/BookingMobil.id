"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/validations/car";

interface AvailabilityCheckerProps {
  carId: string;
  pricePerDay: number;
}

export function AvailabilityChecker({ carId, pricePerDay }: AvailabilityCheckerProps) {
  const todayStr = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    checked: boolean;
    available?: boolean;
    reason?: string;
    error?: string;
    conflictingDates?: { start: string; end: string }[];
  } | null>(null);

  // Calculate rental duration in days
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  let totalDays = 0;
  if (start && end && end > start) {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const totalPrice = totalDays * pricePerDay;

  const handleCheckAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `/api/cars/${carId}/availability?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await res.json();

      if (!res.ok) {
        setResult({ checked: true, error: data.error || "Gagal mengecek ketersediaan" });
      } else {
        setResult({
          checked: true,
          available: data.available,
          reason: data.reason,
          conflictingDates: data.conflictingDates,
        });
      }
    } catch {
      setResult({ checked: true, error: "Terjadi kesalahan koneksi" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900">Cek Ketersediaan &amp; Booking</h3>
        <p className="text-xs text-gray-500 mt-1">
          Pilih tanggal mulai dan selesai untuk mengecek ketersediaan armada
        </p>
      </div>

      <form onSubmit={handleCheckAvailability} className="space-y-4">
        <div>
          <label htmlFor="startDate" className="block text-xs font-semibold text-gray-700 mb-1">
            Tanggal Mulai Sewa
          </label>
          <input
            id="startDate"
            type="date"
            min={todayStr}
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              setResult(null);
            }}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-xs font-semibold text-gray-700 mb-1">
            Tanggal Selesai Sewa
          </label>
          <input
            id="endDate"
            type="date"
            min={startDate || todayStr}
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              setResult(null);
            }}
            required
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <Button
          type="submit"
          variant="outline"
          className="w-full justify-center"
          disabled={loading || !startDate || !endDate || totalDays <= 0}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Mengecek...
            </span>
          ) : (
            "Cek Ketersediaan"
          )}
        </Button>
      </form>

      {/* Breakdown calculation preview */}
      {totalDays > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Harga Per Hari</span>
            <span className="font-semibold text-gray-900">{formatCurrency(pricePerDay)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Durasi Sewa</span>
            <span className="font-semibold text-gray-900">{totalDays} Hari</span>
          </div>
          <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-base">
            <span>Estimasi Total</span>
            <span className="text-blue-600">{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      )}

      {/* Result feedback */}
      {result && result.checked && (
        <div className="space-y-4 animate-[fadeIn_0.2s_ease-out]">
          {result.error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {result.error}
            </div>
          )}

          {result.available === false && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-2">
              <p className="font-bold flex items-center gap-1.5 text-sm">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Mobil Tidak Tersedia
              </p>
              <p>{result.reason || "Mobil telah dipesan pada rentang tanggal yang dipilih."}</p>
              {result.conflictingDates && result.conflictingDates.length > 0 && (
                <div className="mt-2 pt-2 border-t border-amber-200/60">
                  <p className="font-semibold mb-1">Tanggal Terisi:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {result.conflictingDates.map((d, idx) => (
                      <li key={idx}>
                        {d.start} s/d {d.end}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {result.available === true && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-bold text-sm text-emerald-900">Mobil Tersedia!</p>
                  <p className="text-xs text-emerald-700">Silakan lanjutkan ke proses pemesanan.</p>
                </div>
              </div>

              <Link
                href={`/cars/${carId}/booking?startDate=${startDate}&endDate=${endDate}`}
                className="block"
              >
                <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20">
                  Booking Sekarang
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Fallback button when not checked yet */}
      {(!result || !result.checked || result.available === undefined) && (
        <Link
          href={
            startDate && endDate && totalDays > 0
              ? `/cars/${carId}/booking?startDate=${startDate}&endDate=${endDate}`
              : `/cars/${carId}/booking`
          }
          className="block"
        >
          <Button size="lg" className="w-full">
            Booking Sekarang
          </Button>
        </Link>
      )}
    </div>
  );
}
