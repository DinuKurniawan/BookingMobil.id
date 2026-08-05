import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-8xl font-black text-blue-600 select-none">404</div>
        <h1 className="text-2xl font-bold text-slate-900">Halaman Tidak Ditemukan</h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.
          Silakan periksa kembali URL atau kembali ke beranda.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Kembali ke Beranda
          </Link>
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-white transition-colors"
          >
            Lihat Katalog Mobil
          </Link>
        </div>
      </div>
    </div>
  );
}
