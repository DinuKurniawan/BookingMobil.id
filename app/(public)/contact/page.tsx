import type { Metadata } from "next";
import Link from "next/link";
import { ContactMap } from "./map";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Hubungi Kami - BookingMobil.id",
  description:
    "Hubungi BookingMobil.id untuk informasi sewa mobil, pertanyaan, atau bantuan. Tim kami siap membantu 24/7 via WhatsApp, telepon, atau email.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block">
            Kontak Kami
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Kami Siap
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mt-1">
              Membantu Anda
            </span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Punya pertanyaan seputar armada, pemesanan, atau butuh bantuan? Jangan ragu untuk menghubungi tim kami kapan saja.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* WhatsApp */}
          <a
            href="https://wa.me/6281234567890?text=Halo%20BookingMobil%2C%20saya%20mau%20tanya..."
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-green-300 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              💬
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">WhatsApp</h3>
            <p className="text-sm text-gray-500 mb-3">
              Chat langsung via WhatsApp. Tim kami merespon dalam hitungan menit.
            </p>
            <span className="text-green-600 font-bold text-sm group-hover:underline">
              0812-3456-7890 →
            </span>
          </a>

          {/* Email */}
          <a
            href="mailto:info@bookingmobil.com"
            className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              ✉️
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Email</h3>
            <p className="text-sm text-gray-500 mb-3">
              Kirim pertanyaan detail via email. Kami balas maksimal 1×24 jam.
            </p>
            <span className="text-blue-600 font-bold text-sm group-hover:underline">
              info@bookingmobil.com →
            </span>
          </a>

          {/* Telepon */}
          <a
            href="tel:+6281234567890"
            className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:border-amber-300 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              📞
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Telepon</h3>
            <p className="text-sm text-gray-500 mb-3">
              Tersedia Senin–Sabtu pukul 08.00–20.00 WIB. Darurat bisa 24 jam.
            </p>
            <span className="text-amber-600 font-bold text-sm group-hover:underline">
              +62 812-3456-7890 →
            </span>
          </a>
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Kirim Pesan
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">
                Formulir Kontak
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Isi form di bawah dan tim kami akan segera menghubungi Anda.
              </p>
            </div>

            <form
              action="https://wa.me/6281234567890"
              method="get"
              target="_blank"
              rel="noopener noreferrer"
              className="space-y-5"
            >
              <input type="hidden" name="text" value="" id="wa-text" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold text-gray-700 mb-1.5"
                  >
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Nama Anda"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-semibold text-gray-700 mb-1.5"
                  >
                    No. HP / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="081234567890"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                >
                  Alamat Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                >
                  Subjek <span className="text-red-500">*</span>
                </label>
                <select
                  id="subject"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all"
                >
                  <option value="">Pilih topik pertanyaan</option>
                  <option value="Info Harga Sewa">Info Harga Sewa</option>
                  <option value="Ketersediaan Mobil">Ketersediaan Mobil</option>
                  <option value="Bantuan Pemesanan">Bantuan Pemesanan</option>
                  <option value="Pembayaran">Pembayaran &amp; Verifikasi</option>
                  <option value="Pembatalan">Pembatalan / Pengembalian Dana</option>
                  <option value="Kerjasama">Kerjasama / Kemitraan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs font-semibold text-gray-700 mb-1.5"
                >
                  Pesan <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  rows={5}
                  required
                  placeholder="Tulis pertanyaan atau kebutuhan Anda di sini..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all resize-none"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-green-600 hover:bg-green-500 font-bold shadow-lg shadow-green-600/30 justify-center"
                onClick={(e) => {
                  const form = e.currentTarget.closest("form");
                  if (!form) return;
                  const name = (form.querySelector("#name") as HTMLInputElement)?.value || "";
                  const phone = (form.querySelector("#phone") as HTMLInputElement)?.value || "";
                  const email = (form.querySelector("#email") as HTMLInputElement)?.value || "";
                  const subject = (form.querySelector("#subject") as HTMLSelectElement)?.value || "";
                  const message = (form.querySelector("#message") as HTMLTextAreaElement)?.value || "";

                  const waText = `Halo BookingMobil,%0A%0A` +
                    `Nama: ${encodeURIComponent(name)}%0A` +
                    `No. HP: ${encodeURIComponent(phone)}%0A` +
                    (email ? `Email: ${encodeURIComponent(email)}%0A` : "") +
                    `Subjek: ${encodeURIComponent(subject)}%0A%0A` +
                    `Pesan:%0A${encodeURIComponent(message)}`;

                  const waInput = form.querySelector("#wa-text") as HTMLInputElement;
                  if (waInput) waInput.value = waText;
                }}
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Kirim via WhatsApp
              </Button>
            </form>
          </div>

          {/* Map & Address */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <ContactMap />
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Jam Operasional</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Senin – Jumat</span>
                  <span className="font-semibold text-gray-800">08.00 – 20.00 WIB</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Sabtu</span>
                  <span className="font-semibold text-gray-800">08.00 – 17.00 WIB</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Minggu / Libur</span>
                  <span className="font-semibold text-gray-800">Tutup</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Darurat 24 Jam</span>
                  <span className="font-semibold text-green-600">Via WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold">Butuh Bantuan Segera?</h2>
          <p className="text-blue-100">
            Tim support kami standby untuk menjawab pertanyaan Anda secepat mungkin.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href="https://wa.me/6281234567890?text=Halo%20BookingMobil%2C%20saya%20butuh%20bantuan."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-green-500 text-white font-bold text-sm hover:bg-green-400 transition-colors shadow-lg"
            >
              💬 Chat WhatsApp Sekarang
            </a>
            <Link
              href="/cars"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg"
            >
              🚗 Lihat Armada Mobil
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
