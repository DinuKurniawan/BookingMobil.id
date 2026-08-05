"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const TAB_DOTS: Record<string, string> = {
  "": "bg-gray-400",
  PENDING: "bg-amber-500",
  PAYMENT_REVIEW: "bg-blue-500",
  CONFIRMED: "bg-emerald-500",
  ONGOING: "bg-violet-500",
  COMPLETED: "bg-slate-500",
  "CANCELLED,REJECTED": "bg-rose-500",
};

const TABS = [
  { key: "", label: "Semua" },
  { key: "PENDING", label: "Pending" },
  { key: "PAYMENT_REVIEW", label: "Review Pembayaran" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "ONGOING", label: "Ongoing" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED,REJECTED", label: "Dibatalkan/Ditolak" },
] as const;

export function BookingTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("status") || "";

  const handleClick = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (key) {
      params.set("status", key);
    } else {
      params.delete("status");
    }
    params.delete("q");
    router.replace(`/admin/bookings?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const dotColor = TAB_DOTS[tab.key] || "bg-gray-400";
        const isActive = active === tab.key;

        return (
          <button
            key={tab.key}
            onClick={() => handleClick(tab.key)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer",
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            )}
          >
            <span
              className={cn(
                "w-2 h-2 rounded-full flex-shrink-0",
                isActive ? "bg-white" : dotColor
              )}
            />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
