"use client";

import { useState, useActionState } from "react";
import { submitTestimonialAction } from "@/app/actions/testimonial";
import { Button } from "@/components/ui/button";
import type { TestimonialActionState } from "@/lib/validations/testimonial";

interface TestimonialFormProps {
  bookingId: string;
  customerName: string;
  bookingCode: string;
  email: string;
}

export function TestimonialForm({ bookingId, customerName, bookingCode, email }: TestimonialFormProps) {
  const [state, formAction, isPending] = useActionState<TestimonialActionState, FormData>(
    submitTestimonialAction,
    {}
  );

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const roleOptions = [
    "Pengusaha",
    "Karyawan Swasta",
    "PNS",
    "Mahasiswa",
    "Ibu Rumah Tangga",
    "Driver Online",
    "Tour Guide",
    "Konten Kreator",
    "Lainnya",
  ];

  if (state.success) {
    return (
      <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-8 text-center space-y-4">
        <div className="text-5xl">🎉</div>
        <div>
          <h3 className="text-xl font-bold text-emerald-900">Terima Kasih!</h3>
          <p className="text-emerald-700 text-sm mt-1">{state.message}</p>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          <a
            href={`/booking/${bookingCode}?email=${encodeURIComponent(email)}`}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-500 transition-colors"
          >
            Kembali ke Booking
          </a>
          <a
            href="/cars"
            className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-700 text-sm font-bold hover:bg-emerald-50 transition-colors"
          >
            Sewa Lagi
          </a>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="bookingId" value={bookingId} />

      {/* Error Alert */}
      {state.message && !state.success && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {state.message}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900">Detail Testimoni</h3>
          <p className="text-xs text-slate-500 mt-1">
            Isi form berikut untuk berbagi pengalaman sewa mobil Anda.
          </p>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={customerName}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all"
          />
          {state.errors?.name && (
            <p className="text-xs text-red-500 mt-1">{state.errors.name[0]}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Pekerjaan / Peran
          </label>
          <select
            id="role"
            name="role"
            defaultValue=""
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all"
          >
            <option value="">Pilih pekerjaan (opsional)</option>
            {roleOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div>
          <span className="block text-xs font-semibold text-slate-700 mb-2">
            Rating <span className="text-red-500">*</span>
          </span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="text-3xl transition-transform hover:scale-110"
              >
                <span className={star <= (hoverRating || rating) ? "text-amber-400" : "text-slate-200"}>
                  ★
                </span>
              </button>
            ))}
            <span className="text-sm text-slate-500 ml-2">
              {rating === 5 ? "Sangat Puas" : rating === 4 ? "Puas" : rating === 3 ? "Cukup" : rating === 2 ? "Kurang" : "Tidak Puas"}
            </span>
          </div>
          <input type="hidden" name="rating" value={rating} />
          {state.errors?.rating && (
            <p className="text-xs text-red-500 mt-1">{state.errors.rating[0]}</p>
          )}
        </div>

        {/* Testimonial Text */}
        <div>
          <label htmlFor="text" className="block text-xs font-semibold text-slate-700 mb-1.5">
            Testimoni Anda <span className="text-red-500">*</span>
          </label>
          <textarea
            id="text"
            name="text"
            rows={4}
            required
            placeholder="Ceritakan pengalaman Anda menyewa mobil bersama kami... (minimal 10 karakter)"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all resize-none"
          />
          {state.errors?.text && (
            <p className="text-xs text-red-500 mt-1">{state.errors.text[0]}</p>
          )}
        </div>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        size="lg"
        disabled={isPending}
        className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 font-bold text-sm shadow-lg shadow-blue-600/30"
      >
        {isPending ? (
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Mengirim Testimoni...
          </span>
        ) : (
          "⭐ Kirim Testimoni"
        )}
      </Button>
    </form>
  );
}
