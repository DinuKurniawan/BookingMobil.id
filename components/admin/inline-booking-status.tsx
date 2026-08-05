"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { BookingStatus } from "@prisma/client";

interface InlineBookingStatusProps {
  bookingId: string;
  currentStatus: BookingStatus;
}

const ALLOWED_TRANSITIONS: Record<string, BookingStatus[]> = {
  PENDING: ["CANCELLED"],
  PAYMENT_REVIEW: ["CONFIRMED", "REJECTED"],
  CONFIRMED: ["ONGOING", "CANCELLED"],
  ONGOING: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
  REJECTED: [],
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Menunggu",
  PAYMENT_REVIEW: "Review",
  CONFIRMED: "Terkonfirmasi",
  ONGOING: "Berlangsung",
  COMPLETED: "Selesai",
  CANCELLED: "Batal",
  REJECTED: "Tolak",
};

type ActionState = { success?: boolean; message?: string };

export function InlineBookingStatus({ bookingId, currentStatus }: InlineBookingStatusProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableStatuses = ALLOWED_TRANSITIONS[currentStatus] ?? [];

  const handleChange = async (newStatus: string) => {
    if (newStatus === currentStatus || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/booking-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Gagal mengubah status");
        setTimeout(() => setError(null), 3000);
        return;
      }

      router.refresh();
    } catch (err) {
      setError("Gagal mengubah status");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (availableStatuses.length === 0) {
    return (
      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getBadgeClass(currentStatus)}`}>
        {STATUS_LABELS[currentStatus] ?? currentStatus}
      </span>
    );
  }

  return (
    <div className="relative">
      <select
        value={currentStatus}
        disabled={loading}
        onChange={(e) => handleChange(e.target.value)}
        className={`text-[11px] font-bold rounded-lg border px-2 py-1 cursor-pointer transition-colors appearance-none pr-6 ${
          loading ? "opacity-50 cursor-wait" : ""
        } ${getSelectClass(currentStatus)}`}
      >
        <option value={currentStatus} disabled>
          {STATUS_LABELS[currentStatus] ?? currentStatus}
        </option>
        {availableStatuses.map((s) => (
          <option key={s} value={s}>
            {STATUS_LABELS[s] ?? s}
          </option>
        ))}
      </select>
      {error && (
        <p className="absolute -bottom-5 left-0 text-[10px] text-red-500 whitespace-nowrap">{error}</p>
      )}
    </div>
  );
}

function getBadgeClass(status: string): string {
  const map: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800 border border-amber-200",
    PAYMENT_REVIEW: "bg-blue-100 text-blue-800 border border-blue-200",
    CONFIRMED: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    ONGOING: "bg-purple-100 text-purple-800 border border-purple-200",
    COMPLETED: "bg-slate-200 text-slate-700 border border-slate-300",
    CANCELLED: "bg-red-100 text-red-700 border border-red-200",
    REJECTED: "bg-red-100 text-red-700 border border-red-200",
  };
  return map[status] ?? "bg-gray-100 text-gray-700 border border-gray-200";
}

function getSelectClass(status: string): string {
  const map: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-800 border-amber-300",
    PAYMENT_REVIEW: "bg-blue-50 text-blue-800 border-blue-300",
    CONFIRMED: "bg-emerald-50 text-emerald-800 border-emerald-300",
    ONGOING: "bg-purple-50 text-purple-800 border-purple-300",
    COMPLETED: "bg-slate-200 text-slate-700 border-slate-300",
    CANCELLED: "bg-red-50 text-red-700 border-red-300",
    REJECTED: "bg-red-50 text-red-700 border-red-300",
  };
  return map[status] ?? "bg-gray-50 text-gray-700 border-gray-300";
}
