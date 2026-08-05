"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  approvePayment,
  rejectPayment,
  startRental,
  completeRental,
  cancelBooking,
} from "@/app/(admin)/admin/(dashboard)/bookings/actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  bookingId: string;
  currentStatus: string;
  startDate: string;
  endDate: string;
};

export function BookingStatusActions({
  bookingId,
  currentStatus,
  startDate,
  endDate,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (currentStatus !== "CONFIRMED") {
      return;
    }

    const syncStatus = async () => {
      if (new Date() < new Date(startDate)) {
        return;
      }

      const response = await fetch("/api/admin/booking-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: "ONGOING" }),
      });

      if (response.ok) {
        router.refresh();
      }
    };

    void syncStatus();
    const intervalId = window.setInterval(syncStatus, 60_000);
    return () => window.clearInterval(intervalId);
  }, [bookingId, currentStatus, router, startDate]);

  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  const isPastStart = now >= start;
  const isPastEnd = now >= end;
  const isCancelable = currentStatus !== "COMPLETED" && currentStatus !== "CANCELLED";

  // --- PAYMENT_REVIEW: Approve / Reject ---
  const showPaymentActions = currentStatus === "PAYMENT_REVIEW";

  // --- CONFIRMED & sudah lewat start date: Mulai Sewa ---
  const showStartRental = currentStatus === "CONFIRMED" && isPastStart;

  // --- ONGOING & sudah lewat end date: Selesai ---
  const showCompleteRental = currentStatus === "ONGOING" && isPastEnd;

  const handleApprove = () => {
    startTransition(async () => {
      const res = await approvePayment("", bookingId);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Alasan penolakan wajib diisi");
      return;
    }
    startTransition(async () => {
      const res = await rejectPayment("", bookingId, rejectReason.trim());
      if (res.success) {
        toast.success(res.message);
        setShowRejectForm(false);
        setRejectReason("");
      } else {
        toast.error(res.message);
      }
    });
  };

  const handleStartRental = () => {
    startTransition(async () => {
      const res = await startRental(bookingId);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    });
  };

  const handleCompleteRental = () => {
    startTransition(async () => {
      const res = await completeRental(bookingId);
      if (res.success) toast.success(res.message);
      else toast.error(res.message);
    });
  };

  const handleCancel = () => {
    startTransition(async () => {
      const res = await cancelBooking(bookingId);
      if (res.success) {
        toast.success(res.message);
        setShowCancelConfirm(false);
      } else {
        toast.error(res.message);
      }
    });
  };

  if (!showPaymentActions && !showStartRental && !showCompleteRental && !isCancelable) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Approve / Reject buttons for PAYMENT_REVIEW */}
      {showPaymentActions && (
        <div className="space-y-3">
          {!showRejectForm ? (
            <div className="flex flex-wrap gap-2">
              <Button variant="primary" size="sm" disabled={pending} onClick={handleApprove}>
                ✅ Approve — Konfirmasi Booking
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pending}
                onClick={() => setShowRejectForm(true)}
              >
                ❌ Reject — Tolak Pembayaran
              </Button>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-red-200 bg-red-50 space-y-3">
              <p className="text-sm font-semibold text-red-800">Tolak Pembayaran</p>
              <p className="text-xs text-red-600">
                Customer akan kembali ke status PENDING dan harus upload ulang bukti pembayaran.
              </p>
              <textarea
                placeholder="Tulis alasan penolakan (wajib)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-red-300 text-sm resize-none focus:ring-2 focus:ring-red-500/30 outline-none bg-white"
              />
              <div className="flex gap-2">
                <Button variant="danger" size="sm" disabled={pending} onClick={handleReject}>
                  Kirim Penolakan
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() => {
                    setShowRejectForm(false);
                    setRejectReason("");
                  }}
                >
                  Batal
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mulai Sewa */}
      {showStartRental && (
        <div className="space-y-2">
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Tanggal mulai terlewati — sewa sudah bisa dimulai
          </p>
          <Button variant="primary" size="sm" disabled={pending} onClick={handleStartRental}>
            🚗 Mulai Sewa (ONGOING)
          </Button>
        </div>
      )}

      {/* CONFIRMED tapi belum lewat start */}
      {currentStatus === "CONFIRMED" && !isPastStart && (
        <p className="text-xs text-amber-600 flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg p-2">
          ⏳ Menunggu tanggal mulai sewa ({start.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })})
        </p>
      )}

      {/* Selesai */}
      {showCompleteRental && (
        <div className="space-y-2">
          <p className="text-xs text-emerald-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            Tanggal selesai terlewati — sewa bisa diselesaikan
          </p>
          <Button variant="secondary" size="sm" disabled={pending} onClick={handleCompleteRental}>
            🏁 Selesai (COMPLETED)
          </Button>
        </div>
      )}

      {/* ONGOING tapi belum lewat end */}
      {currentStatus === "ONGOING" && !isPastEnd && (
        <p className="text-xs text-amber-600 flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-lg p-2">
          ⏳ Menunggu tanggal selesai ({end.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })})
        </p>
      )}

      {/* Cancel button — always before COMPLETED */}
      {isCancelable && (
        <div className="pt-3 border-t border-gray-100">
          {!showCancelConfirm ? (
            <Button
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={() => setShowCancelConfirm(true)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              ❌ Batalkan Booking
            </Button>
          ) : (
            <div className="p-4 rounded-xl border border-red-200 bg-red-50 space-y-3">
              <p className="text-sm font-semibold text-red-800">Konfirmasi Pembatalan</p>
              <p className="text-xs text-red-600">
                Booking akan berstatus CANCELLED. Email pemberitahuan akan dikirim ke customer.
                Tindakan ini tidak dapat diurungkan untuk status COMPLETED.
              </p>
              <div className="flex gap-2">
                <Button variant="danger" size="sm" disabled={pending} onClick={handleCancel}>
                  Ya, Batalkan Booking
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() => setShowCancelConfirm(false)}
                >
                  Tidak Jadi
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
