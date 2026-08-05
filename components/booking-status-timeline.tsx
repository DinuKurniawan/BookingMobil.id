import React from "react";

interface BookingStatusTimelineProps {
  status:
    | "PENDING"
    | "PAYMENT_REVIEW"
    | "CONFIRMED"
    | "ONGOING"
    | "COMPLETED"
    | "CANCELLED"
    | "REJECTED"
    | string;
}

const TIMELINE_STEPS = [
  { id: "PENDING", title: "Pesanan Dibuat", subtitle: "Menunggu Pembayaran", stepNum: 1 },
  { id: "PAYMENT_REVIEW", title: "Verifikasi Admin", subtitle: "Review Bukti Transfer", stepNum: 2 },
  { id: "CONFIRMED", title: "Terkonfirmasi", subtitle: "Pembayaran Lunas", stepNum: 3 },
  { id: "ONGOING", title: "Sewa Berlangsung", subtitle: "Armada Digunakan", stepNum: 4 },
  { id: "COMPLETED", title: "Sewa Selesai", subtitle: "Pengembalian Selesai", stepNum: 5 },
];

const STATUS_ORDER: Record<string, number> = {
  PENDING: 1,
  PAYMENT_REVIEW: 2,
  CONFIRMED: 3,
  ONGOING: 4,
  COMPLETED: 5,
};

export function BookingStatusTimeline({ status }: BookingStatusTimelineProps) {
  const currentStepNum = STATUS_ORDER[status] || 1;
  const isCancelled = status === "CANCELLED";
  const isRejected = status === "REJECTED";

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-900 space-y-1">
        <div className="flex items-center gap-2 font-bold text-sm text-red-700">
          <span className="text-base">❌</span>
          Status Pemesanan: Dibatalkan (CANCELLED)
        </div>
        <p className="text-xs text-red-600">
          Pemesanan ini telah dibatalkan. Jika Anda membutuhkan armada mobil, silakan buat pemesanan baru.
        </p>
      </div>
    );
  }

  if (isRejected) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 space-y-1">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
          <span className="text-base">⚠️</span>
          Status Pemesanan: Pembayaran Ditolak (REJECTED)
        </div>
        <p className="text-xs text-amber-700">
          Bukti transfer yang Anda unggah sebelumnya ditolak. Silakan buka halaman detail untuk mengunggah ulang bukti pembayaran yang valid.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full py-2">
      <div className="relative">
        {/* Background Line Connector */}
        <div className="absolute top-4 left-6 right-6 h-1 bg-slate-200 -translate-y-1/2 z-0 hidden sm:block">
          <div
            className="h-full bg-blue-600 transition-all duration-500"
            style={{
              width: `${((currentStepNum - 1) / (TIMELINE_STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* 5 Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative z-10">
          {TIMELINE_STEPS.map((step) => {
            const isPassed = currentStepNum > step.stepNum;
            const isCurrent = currentStepNum === step.stepNum;

            return (
              <div
                key={step.id}
                className={`flex flex-row sm:flex-col items-center sm:text-center gap-3 p-3 sm:p-0 rounded-xl sm:rounded-none transition-all ${
                  isCurrent ? "bg-blue-50/90 sm:bg-transparent border sm:border-0 border-blue-200" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all flex-shrink-0 ${
                    isPassed
                      ? "bg-emerald-500 text-white shadow-xs"
                      : isCurrent
                      ? "bg-blue-600 text-white ring-4 ring-blue-100 shadow-md scale-110"
                      : "bg-slate-100 text-slate-400 border border-slate-300"
                  }`}
                >
                  {isPassed ? "✓" : step.stepNum}
                </div>

                <div className="min-w-0">
                  <span
                    className={`text-xs font-bold block truncate ${
                      isCurrent
                        ? "text-blue-700"
                        : isPassed
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-[11px] text-slate-400 block truncate">
                    {step.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
