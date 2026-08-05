import { Metadata } from "next";
import { TentangKamiMap } from "./map";

export const metadata: Metadata = {
  title: "Tentang Kami - BookingMobil.id",
  description: "Pelajari lebih lanjut tentang BookingMobil.id, layanan rental mobil terpercaya di Indonesia.",
};

export default function TentangKamiPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block">
            Tentang Kami
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Solusi Rental Mobil
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mt-1">
              Terpercaya Sejak 2025
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            BookingMobil.id hadir untuk memberikan pengalaman sewa mobil yang mudah, transparan, dan terpercaya bagi seluruh pelanggan di Indonesia.
          </p>
        </div>
      </section>

      {/* Visi & Misi */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Visi Kami</h2>
            <p className="text-gray-600 leading-relaxed">
              Menjadi platform rental mobil terdepan di Indonesia yang memberikan kemudahan, kenyamanan, dan kepercayaan dalam setiap perjalanan pelanggan.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-100">
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-5">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Misi Kami</h2>
            <ul className="text-gray-600 leading-relaxed space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5 flex-shrink-0">✓</span>
                Menyediakan armada mobil berkualitas dengan harga kompetitif
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5 flex-shrink-0">✓</span>
                Memberikan proses booking yang cepat, mudah, dan transparan
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5 flex-shrink-0">✓</span>
                Mengutamakan kepuasan dan keamanan pelanggan
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm">
            <p className="text-3xl font-extrabold text-blue-600">50+</p>
            <p className="text-sm text-gray-500 mt-1">Armada Mobil</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm">
            <p className="text-3xl font-extrabold text-blue-600">3</p>
            <p className="text-sm text-gray-500 mt-1">Kota Besar</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm">
            <p className="text-3xl font-extrabold text-blue-600">1.200+</p>
            <p className="text-sm text-gray-500 mt-1">Booking Sukses</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-sm">
            <p className="text-3xl font-extrabold text-blue-600">24/7</p>
            <p className="text-sm text-gray-500 mt-1">Dukungan Pelanggan</p>
          </div>
        </div>
      </section>

      {/* Kenapa Memilih Kami */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Keunggulan</span>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">Mengapa BookingMobil.id?</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all">
            <span className="text-2xl mb-3 block">🚗</span>
            <h3 className="font-bold text-gray-900 mb-2">Armada Terawat</h3>
            <p className="text-sm text-gray-500">Seluruh kendaraan menjalani perawatan rutin dan inspeksi sebelum disewakan.</p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all">
            <span className="text-2xl mb-3 block">💰</span>
            <h3 className="font-bold text-gray-900 mb-2">Harga Transparan</h3>
            <p className="text-sm text-gray-500">Tidak ada biaya tersembunyi. Semua tarif ditampilkan jelas sebelum Anda booking.</p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all">
            <span className="text-2xl mb-3 block">🔒</span>
            <h3 className="font-bold text-gray-900 mb-2">Aman & Terpercaya</h3>
            <p className="text-sm text-gray-500">Proses verifikasi identitas ketat dan pembayaran terlindungi untuk keamanan Anda.</p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all">
            <span className="text-2xl mb-3 block">⚡</span>
            <h3 className="font-bold text-gray-900 mb-2">Booking Instan</h3>
            <p className="text-sm text-gray-500">Pesan dalam hitungan menit tanpa perlu registrasi akun yang rumit.</p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all">
            <span className="text-2xl mb-3 block">🎯</span>
            <h3 className="font-bold text-gray-900 mb-2">Fleksibel</h3>
            <p className="text-sm text-gray-500">Pilih dari berbagai kategori: MPV, SUV, Sedan, Hatchback, hingga Van.</p>
          </div>
          <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all">
            <span className="text-2xl mb-3 block">📞</span>
            <h3 className="font-bold text-gray-900 mb-2">Support 24/7</h3>
            <p className="text-sm text-gray-500">Tim kami siap membantu kapan pun Anda butuhkan, baik via telepon maupun WhatsApp.</p>
          </div>
        </div>
      </section>

      {/* Lokasi */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Kunjungi Kami</span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2">Lokasi Kantor</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Silakan kunjungi kantor kami untuk konsultasi langsung atau pengambilan armada.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <TentangKamiMap />
            <div className="p-6 space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <span className="p-2 rounded-lg bg-blue-50 text-blue-600 flex-shrink-0">📍</span>
                <div>
                  <p className="font-semibold text-gray-900">Alamat Kantor Pusat</p>
                  <p>Jl. Sudirman No. 123, Kelurahan Menteng, Kecamatan Menteng</p>
                  <p>Jakarta Pusat, DKI Jakarta 10310</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="p-2 rounded-lg bg-green-50 text-green-600 flex-shrink-0">📞</span>
                <div>
                  <p className="font-semibold text-gray-900">Hubungi Kami</p>
                  <p>WhatsApp: 0812-3456-7890</p>
                  <p>Email: info@bookingmobil.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold">Siap Memulai Perjalanan Anda?</h2>
          <p className="text-blue-100">Booking mobil impian Anda sekarang dan nikmati pengalaman berkendara terbaik.</p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href="/cars"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg"
            >
              🚗 Lihat Armada Mobil
            </a>
            <a
              href="/contact"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-400 border border-blue-400 transition-colors"
            >
              📞 Hubungi Kami
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
