"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface PaymentProofUploadFormProps {
  bookingCode: string;
  bookingStatus: string;
  customerEmail?: string;
  existingProofs?: {
    id: string;
    imageUrl: string;
    status: string;
    createdAt: string;
    rejectionReason?: string | null;
  }[];
}

export function PaymentProofUploadForm({
  bookingCode,
  bookingStatus,
  customerEmail,
  existingProofs = [],
}: PaymentProofUploadFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const latestProof = existingProofs[0]; // Proofs sorted by createdAt desc
  const isPendingReview =
    bookingStatus === "PAYMENT_REVIEW" ||
    (latestProof && latestProof.status === "PENDING");
  const isRejected =
    bookingStatus === "REJECTED" ||
    (latestProof && latestProof.status === "REJECTED");
  const isConfirmed = bookingStatus === "CONFIRMED";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];

    if (selected) {
      if (selected.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file bukti transfer maksimal 5MB");
        return;
      }

      const fileType = selected.type.toLowerCase();
      const fileName = selected.name.toLowerCase();
      const valid =
        fileType === "image/jpeg" ||
        fileType === "image/png" ||
        fileType === "image/webp" ||
        fileType === "application/pdf" ||
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".png") ||
        fileName.endsWith(".webp") ||
        fileName.endsWith(".pdf");

      if (!valid) {
        toast.error("Format file tidak didukung. Harap pilih foto (JPG, PNG, WEBP) atau file PDF.");
        return;
      }

      setFile(selected);
      if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
        setIsPdf(true);
        setPreviewUrl(null);
      } else {
        setIsPdf(false);
        setPreviewUrl(URL.createObjectURL(selected));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("paymentProof", file);
      if (customerEmail) {
        formData.append("customerEmail", customerEmail);
      }

      const res = await fetch(`/api/bookings/${bookingCode}/payment-proof`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Gagal mengunggah bukti transfer.");
      } else {
        toast.success("Bukti transfer berhasil diunggah! Admin akan melakukan verifikasi segera.");
        setFile(null);
        setPreviewUrl(null);
        setIsPdf(false);
        router.refresh();
      }
    } catch {
      toast.error("Terjadi kesalahan jaringan saat mengunggah bukti transfer.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Upload Bukti Pembayaran / Transfer
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Unggah resi/bukti transfer bank (foto JPG/PNG atau file PDF) agar pesanan Anda dapat diverifikasi oleh admin.
          </p>
        </div>
      </div>

      {/* STATUS BANNER 1: PAYMENT REVIEW (Menunggu Verifikasi Admin) */}
      {isPendingReview && !isConfirmed && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-blue-800">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            Menunggu Verifikasi Admin
          </div>
          <p className="text-xs text-blue-700 leading-relaxed">
            Bukti transfer Anda telah berhasil diunggah dan saat ini sedang berada dalam antrean verifikasi oleh tim admin kami. Progres pemesanan akan diperbarui setelah verifikasi selesai (maksimal 1x24 jam).
          </p>
        </div>
      )}

      {/* STATUS BANNER 2: REJECTED (Bukti Ditolak -> Boleh Re-upload) */}
      {isRejected && !isConfirmed && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-red-800">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Bukti Transfer Sebelumnya Ditolak
          </div>
          {latestProof?.rejectionReason && (
            <p className="text-xs text-red-700 font-semibold bg-white/70 p-2.5 rounded-lg border border-red-200">
              Alasan Penolakan: {latestProof.rejectionReason}
            </p>
          )}
          <p className="text-xs text-red-700">
            Silakan periksa kembali kelengkapan resi dan unggah ulang bukti transfer yang valid di bawah ini.
          </p>
        </div>
      )}

      {/* STATUS BANNER 3: CONFIRMED */}
      {isConfirmed && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Pembayaran Lunas &amp; Terkonfirmasi
          </div>
          <p className="text-xs text-emerald-700">
            Pembayaran Anda telah diverifikasi dan disetujui. Pemesanan Anda telah aktif!
          </p>
        </div>
      )}

      {/* Upload History List */}
      {existingProofs.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
            Riwayat Upload Bukti Transfer ({existingProofs.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {existingProofs.map((proof) => {
              const proofIsPdf = proof.imageUrl.toLowerCase().endsWith(".pdf");
              return (
                <div
                  key={proof.id}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0 flex items-center justify-center">
                    {proofIsPdf ? (
                      <a
                        href={proof.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-red-600 hover:underline flex flex-col items-center"
                      >
                        <span className="text-lg">📄</span>
                        PDF
                      </a>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={proof.imageUrl}
                        alt="Bukti Transfer"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-xs">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        proof.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-700"
                          : proof.status === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {proof.status === "APPROVED"
                        ? "Disetujui"
                        : proof.status === "REJECTED"
                        ? "Ditolak"
                        : "Menunggu Verifikasi"}
                    </span>
                    <p className="text-slate-400 mt-1">
                      {new Date(proof.createdAt).toLocaleString("id-ID")}
                    </p>
                    {proof.rejectionReason && (
                      <p className="text-red-500 font-medium mt-0.5 truncate">
                        Alasan: {proof.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Show Form if Status is PENDING or REJECTED (allowing re-upload) or if user wants to add proof */}
      {(!isPendingReview || isRejected) && !isConfirmed && (
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilih Struk / Bukti Transfer (Foto atau PDF) <span className="text-red-500">*</span>
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <label
                htmlFor="payment-proof-file"
                className="cursor-pointer px-4 py-2.5 rounded-xl border border-slate-300 hover:border-blue-500 bg-slate-50 hover:bg-blue-50/50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                {file ? file.name : "Pilih File Bukti (JPG, PNG, WEBP, PDF)"}
              </label>
              <input
                id="payment-proof-file"
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={handleFileChange}
                required
                className="hidden"
              />
              <span className="text-[11px] text-slate-400">
                Format: JPG, PNG, WEBP, PDF (Maksimal 5MB)
              </span>
            </div>
          </div>

          {/* File Preview */}
          {previewUrl && !isPdf && (
            <div className="w-36 h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview Struk Transfer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {isPdf && file && (
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3 w-fit">
              <span className="text-2xl">📄</span>
              <div className="text-xs">
                <span className="font-bold text-slate-800 block truncate max-w-xs">{file.name}</span>
                <span className="text-slate-400">{(file.size / 1024).toFixed(1)} KB (Dokumen PDF)</span>
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting || !file}
            className="bg-blue-600 hover:bg-blue-500 text-xs font-bold px-5 py-2.5 shadow-md shadow-blue-600/20"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Mengunggah &amp; Mengirim Notifikasi...
              </span>
            ) : isRejected ? (
              "Upload Ulang Bukti Pembayaran"
            ) : (
              "Kirim Bukti Pembayaran"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
