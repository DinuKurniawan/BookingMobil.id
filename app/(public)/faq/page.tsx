import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ - BookingMobil.id",
  description:
    "Pertanyaan yang sering diajukan seputar sewa mobil di BookingMobil.id: cara booking, pembayaran, pembatalan, syarat KTP/SIM, dan lainnya.",
};

const faqs = [
  {
    q: "Bagaimana cara melakukan pemesanan mobil?",
    a: (
      <>
        Sangat mudah! Pilih mobil yang Anda inginkan dari{" "}
        <Link href="/cars" className="text-blue-600 hover:underline">
          halaman Armada Mobil
        </Link>
        , tentukan tanggal mulai dan selesai sewa, isi data diri lengkap
        (nama, No. HP, email, alamat), upload foto KTP/SIM, lalu klik
        Konfirmasi. Setelah itu Anda akan menerima kode booking dan instruksi
        pembayaran via email.
      </>
    ),
  },
  {
    q: "Dokumen apa saja yang diperlukan untuk menyewa mobil?",
    a: "Anda wajib mengunggah foto KTP atau SIM yang masih berlaku. Dokumen ini digunakan untuk verifikasi identitas penyewa dan disimpan dengan aman sesuai kebijakan privasi kami.",
  },
  {
    q: "Apakah saya perlu punya SIM untuk menyewa?",
    a: "Ya, pengemudi wajib memiliki SIM yang masih berlaku dan sesuai dengan golongan kendaraan yang disewa (SIM A untuk mobil penumpang).",
  },
  {
    q: "Bagaimana cara melakukan pembayaran?",
    a: (
      <>
        Pembayaran dilakukan melalui transfer bank ke rekening resmi yang
        tercantum di halaman konfirmasi pemesanan. Setelah transfer, unggah
        bukti transfer di halaman yang sama. Admin kami akan memverifikasi
        pembayaran dalam waktu 1×24 jam dan mengirimkan konfirmasi via email.
      </>
    ),
  },
  {
    q: "Bank apa saja yang tersedia untuk transfer?",
    a: "Rekening bank tujuan akan ditampilkan di halaman konfirmasi pemesanan dan juga dikirimkan melalui email. Kami menyediakan beberapa pilihan bank untuk memudahkan Anda.",
  },
  {
    q: "Berapa lama verifikasi pembayaran?",
    a: "Tim admin kami akan memverifikasi bukti pembayaran dalam waktu maksimal 1×24 jam setelah Anda mengunggah bukti transfer. Setelah diverifikasi, status pemesanan akan berubah menjadi TERKONFIRMASI dan Anda menerima notifikasi email.",
  },
  {
    q: "Bagaimana jika pembayaran saya ditolak?",
    a: "Jika bukti pembayaran ditolak (misalnya: gambar buram, nominal tidak sesuai, atau tidak terdeteksi), Anda akan menerima email berisi alasan penolakan. Anda bisa mengunggah ulang bukti transfer yang valid melalui halaman detail booking.",
  },
  {
    q: "Bagaimana kebijakan pembatalan dan pengembalian dana?",
    a: (
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <strong>Pembatalan H-3 atau lebih</strong> sebelum mulai sewa:
          pengembalian 80% dari total pembayaran.
        </li>
        <li>
          <strong>Pembatalan H-2</strong>: pengembalian 50%.
        </li>
        <li>
          <strong>Pembatalan H-1 atau hari H</strong>: tidak ada pengembalian.
        </li>
      </ul>
    ),
  },
  {
    q: "Bagaimana cara mengambil mobil?",
    a: "Anda bisa memilih dua metode saat booking: Ambil di Tempat (datang langsung ke lokasi rental kami) atau Diantar ke Alamat (mobil diantar ke alamat domisili Anda). Biaya pengantaran akan diinformasikan oleh tim kami.",
  },
  {
    q: "Bisakah saya memperpanjang masa sewa?",
    a: "Ya, Anda bisa memperpanjang masa sewa selama mobil belum dipesan oleh pelanggan lain. Hubungi tim kami via WhatsApp secepatnya untuk mengonfirmasi perpanjangan. Biaya tambahan dikenakan per hari sesuai tarif yang berlaku.",
  },
  {
    q: "Apa yang terjadi jika saya terlambat mengembalikan mobil?",
    a: "Keterlambatan pengembalian dikenakan biaya tambahan sebesar 20% dari tarif harian per jam keterlambatan, maksimal hingga setara 1 hari penuh. Harap segera hubungi kami jika Anda memperkirakan akan terlambat.",
  },
  {
    q: "Bagaimana dengan asuransi kendaraan?",
    a: "Seluruh armada kami dilindungi asuransi kendaraan (all-risk). Namun pelanggan tetap bertanggung jawab atas kerusakan akibat kelalaian. Biaya klaim asuransi (deductible) dapat dibebankan kepada pelanggan sesuai ketentuan polis.",
  },
  {
    q: "Bagaimana cara cek status pemesanan saya?",
    a: (
      <>
        Gunakan{" "}
        <Link href="/cek-booking" className="text-blue-600 hover:underline">
          halaman Cek Status Booking
        </Link>
        . Masukkan kode booking (contoh: BK-20260804-A9F) dan email atau No. HP
        yang Anda gunakan saat pemesanan. Informasi lengkap termasuk status
        pembayaran akan ditampilkan.
      </>
    ),
  },
  {
    q: "Apakah saya bisa menyewa mobil dengan sopir?",
    a: "Ya, kami menyediakan layanan sewa mobil dengan sopir untuk kenyamanan Anda. Silakan informasikan kebutuhan ini saat pemesanan melalui catatan tambahan atau hubungi kami via WhatsApp.",
  },
  {
    q: "Apakah data pribadi saya aman?",
    a: (
      <>
        Ya. Kami sangat serius menjaga privasi Anda. Foto KTP/SIM Anda dienkripsi saat disimpan dan hanya dapat diakses oleh admin yang bertugas. Kami tidak menjual atau membagikan data Anda ke pihak ketiga. Baca selengkapnya di{" "}
        <Link href="/syarat-ketentuan" className="text-blue-600 hover:underline">
          halaman Kebijakan Privasi
        </Link>
        .
      </>
    ),
  },
  {
    q: "Bagaimana cara menghubungi customer service?",
    a: (
      <>
        Anda bisa menghubungi kami melalui: WhatsApp di 0812-3456-7890, email
        ke info@bookingmobil.com, atau kunjungi{" "}
        <Link href="/contact" className="text-blue-600 hover:underline">
          halaman Kontak
        </Link>
        . Tim kami tersedia Senin–Sabtu pukul 08.00–20.00 WIB. Untuk darurat,
        WhatsApp kami tetap standby 24 jam.
      </>
    ),
  },
];

export default function FAQPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block">
            Pusat Bantuan
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Pertanyaan yang Sering Diajukan
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Temukan jawaban cepat untuk pertanyaan umum seputar sewa mobil di
            BookingMobil.id. Tidak menemukan yang Anda cari? Hubungi kami
            langsung.
          </p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden transition-all hover:border-blue-200"
            >
              <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-gray-900 text-sm list-none select-none">
                <span className="pr-4">{faq.q}</span>
                <svg
                  className="w-5 h-5 text-gray-400 flex-shrink-0 group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        {/* Still need help */}
        <div className="mt-12 text-center bg-blue-50 rounded-2xl border border-blue-100 p-8">
          <div className="text-3xl mb-3">🤔</div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Tidak Menemukan Jawaban?
          </h3>
          <p className="text-gray-600 text-sm mb-5 max-w-sm mx-auto">
            Tim kami siap membantu pertanyaan spesifik Anda. Chat kami via
            WhatsApp untuk respon cepat.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/6281234567890?text=Halo%20BookingMobil%2C%20saya%20mau%20bertanya..."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-green-500 text-white font-bold text-sm hover:bg-green-400 transition-colors shadow-md shadow-green-500/30"
            >
              💬 Chat via WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/30"
            >
              📞 Halaman Kontak
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
