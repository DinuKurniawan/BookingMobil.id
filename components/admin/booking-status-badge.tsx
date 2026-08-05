import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; dot: string; className: string }> = {
  PENDING: {
    label: "Pending",
    dot: "bg-amber-500",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
  PAYMENT_REVIEW: {
    label: "Review Pembayaran",
    dot: "bg-blue-500",
    className: "bg-blue-50 text-blue-800 border-blue-200",
  },
  CONFIRMED: {
    label: "Confirmed",
    dot: "bg-emerald-500",
    className: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  ONGOING: {
    label: "Ongoing",
    dot: "bg-violet-500",
    className: "bg-violet-50 text-violet-800 border-violet-200",
  },
  COMPLETED: {
    label: "Completed",
    dot: "bg-slate-500",
    className: "bg-slate-100 text-slate-700 border-slate-300",
  },
  CANCELLED: {
    label: "Cancelled",
    dot: "bg-rose-500",
    className: "bg-rose-50 text-rose-800 border-rose-200",
  },
  REJECTED: {
    label: "Rejected",
    dot: "bg-orange-500",
    className: "bg-orange-50 text-orange-800 border-orange-200",
  },
};

export function BookingStatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    dot: "bg-gray-400",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border",
        config.className
      )}
    >
      <span className={cn("w-2 h-2 rounded-full flex-shrink-0", config.dot)} />
      {config.label}
    </span>
  );
}

