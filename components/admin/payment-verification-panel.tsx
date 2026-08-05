"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type PaymentProofItem = {
  id: string;
  imageUrl: string;
  status: string;
  uploadedAt: string;
  rejectionReason: string | null;
  verifiedAt: string | null;
};

type Props = {
  proofs: PaymentProofItem[];
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isPdfUrl(url: string) {
  return url.toLowerCase().endsWith(".pdf");
}

function ImagePreview({ src, alt }: { src: string; alt: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block group cursor-zoom-in focus:outline-none"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="w-full max-w-xl object-contain bg-gray-100 rounded-lg group-hover:opacity-90 transition-opacity"
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[90vh] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}

export function PaymentVerificationPanel({ proofs }: Props) {
  if (proofs.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-gray-400">
        Belum ada bukti pembayaran yang diunggah.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {proofs.map((proof) => {
        const isPdf = isPdfUrl(proof.imageUrl);

        return (
          <div
            key={proof.id}
            className={cn(
              "rounded-xl border p-5 space-y-4",
              proof.status === "APPROVED"
                ? "border-emerald-200 bg-emerald-50/50"
                : proof.status === "REJECTED"
                ? "border-red-200 bg-red-50/50"
                : "border-gray-200 bg-white"
            )}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs text-gray-400">Diunggah: {formatDate(proof.uploadedAt)}</span>
                <span
                  className={cn(
                    "inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border",
                    proof.status === "APPROVED"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : proof.status === "REJECTED"
                      ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-amber-100 text-amber-800 border-amber-200"
                  )}
                >
                  {proof.status === "APPROVED" ? "Disetujui" : proof.status === "REJECTED" ? "Ditolak" : "Pending"}
                </span>
                {isPdf && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-red-50 text-red-600 border border-red-200">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    PDF
                  </span>
                )}
              </div>
              {proof.verifiedAt && (
                <span className="text-xs text-gray-400">Diverifikasi: {formatDate(proof.verifiedAt)}</span>
              )}
            </div>

            {/* File preview */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
              {isPdf ? (
                <div className="p-6 flex flex-col items-center gap-3 text-center">
                  <div className="w-16 h-16 rounded-xl bg-red-100 flex items-center justify-center text-3xl">
                    📄
                  </div>
                  <p className="text-sm font-medium text-gray-700">Dokumen PDF</p>
                  <a
                    href={proof.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Buka PDF di Tab Baru
                  </a>
                </div>
              ) : (
                <ImagePreview src={proof.imageUrl} alt="Bukti Pembayaran" />
              )}
            </div>

            {proof.rejectionReason && (
              <div className="p-3 rounded-lg bg-red-100 border border-red-200 text-red-800 text-xs">
                <strong>Alasan Penolakan:</strong> {proof.rejectionReason}
              </div>
            )}

          </div>
        );
      })}
    </div>
  );
}
