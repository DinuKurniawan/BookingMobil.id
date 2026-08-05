"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="text-6xl font-black text-red-500 select-none">⚠️</div>
            <h1 className="text-2xl font-bold text-slate-900">Kesalahan Sistem</h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Maaf, terjadi kesalahan kritis pada sistem. Tim teknis kami sudah
              diberitahu dan sedang menanganinya. Silakan coba lagi dalam beberapa saat.
            </p>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Coba Lagi
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-white transition-colors"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
