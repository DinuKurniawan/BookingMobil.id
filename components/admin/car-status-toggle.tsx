"use client";

import { useState, useTransition } from "react";
import { updateCarStatus } from "@/app/(admin)/admin/(dashboard)/cars/actions";
import { CAR_STATUS_LABELS, CAR_STATUSES } from "@/lib/validations/car";
import { cn } from "@/lib/utils";

const statusStyles: Record<(typeof CAR_STATUSES)[number], string> = {
  AVAILABLE: "bg-green-100 text-green-700 border-green-300",
  MAINTENANCE: "bg-amber-100 text-amber-700 border-amber-300",
  INACTIVE: "bg-gray-200 text-gray-600 border-gray-300",
};

type Props = {
  carId: string;
  currentStatus: (typeof CAR_STATUSES)[number];
};

export function CarStatusToggle({ carId, currentStatus }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleChange = (next: string) => {
    setError(null);
    startTransition(async () => {
      const res = await updateCarStatus(carId, next);
      if (!res.success) setError(res.message);
    });
  };

  return (
    <div className="min-w-[130px]">
      <div className="relative inline-block">
        <select
          aria-label="Ubah status mobil"
          value={currentStatus}
          disabled={pending}
          onChange={(e) => handleChange(e.target.value)}
          className={cn(
            "appearance-none rounded-full border px-3 py-1 pr-8 text-xs font-semibold cursor-pointer transition-opacity outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60",
            statusStyles[currentStatus]
          )}
        >
          {CAR_STATUSES.map((status) => (
            <option key={status} value={status}>
              {CAR_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
        <svg
          className={cn(
            "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-current opacity-70",
            pending && "animate-pulse"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {error && (
        <p className="mt-1 text-[11px] leading-tight text-red-600 max-w-[180px]">{error}</p>
      )}
    </div>
  );
}
