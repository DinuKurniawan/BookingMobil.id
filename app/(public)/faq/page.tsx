import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/scroll-reveal";

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
        <Link href="/cars" className="text-[#1F4D3F] underline underline-offset-4 decoration-[#1F4D3F]/30 hover:decoration-[#1F4D3F] transition-colors">
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
    a: "Pembayaran dilakukan melalui transfer bank ke rekening resmi yang tercantum di halaman konfirmasi pemesanan. Setelah transfer, unggah bukti transfer di halaman yang sama. Admin kami akan memverifikasi pembayaran dalam waktu 1×24 jam dan mengirimkan konfirmasi via email.",
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
      <ul className="list-disc pl-5 space-y-1.5 marker:text-[#1F4D3F]">
        <li>
          <strong>Pembatalan H-3 atau lebih</strong> sebelum mulai sewa: pengembalian 80% dari total pembayaran.
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
        <Link href="/cek-booking" className="text-[#1F4D3F] underline underline-offset-4 decoration-[#1F4D3F]/30 hover:decoration-[#1F4D3F] transition-colors">
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
        <Link href="/syarat-ketentuan" className="text-[#1F4D3F] underline underline-offset-4 decoration-[#1F4D3F]/30 hover:decoration-[#1F4D3F] transition-colors">
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
        <Link href="/contact" className="text-[#1F4D3F] underline underline-offset-4 decoration-[#1F4D3F]/30 hover:decoration-[#1F4D3F] transition-colors">
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
    <div className="bg-[#FAFAF7] text-[#1A1A1A]">
      {/* ──── Header ──── */}
      <header className="border-b border-[#1A1A1A]/10">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 pt-16 pb-10 lg:pt-24 lg:pb-14">
          <ScrollReveal>
            <div className="flex items-baseline justify-between flex-wrap gap-4">
              <div>
                <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#1F4D3F] mb-4">
                  Frequently Asked
                </p>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
                  Pertanyaan
                  <span className="block italic font-light text-[#1A1A1A]/60">yang sering diajukan.</span>
                </h1>
              </div>
              <p className="text-sm text-[#1A1A1A]/60 max-w-xs">
                {faqs.length} pertanyaan. Tidak menemukan yang Anda cari?{" "}
                <Link href="/contact" className="text-[#1F4D3F] underline underline-offset-4 decoration-[#1F4D3F]/30 hover:decoration-[#1F4D3F] transition-colors">
                  Hubungi kami
                </Link>.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </header>

      {/* ──── TOC Strip ──── */}
      <div className="border-b border-[#1A1A1A]/10">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-5">
          <div className="flex items-center gap-x-6 gap-y-2 flex-wrap text-[11px] uppercase tracking-[0.2em]">
            <span className="text-[#1A1A1A]/40 font-semibold">Topik</span>
            {["Booking", "Dokumen", "Pembayaran", "Kebijakan", "Layanan"].map((topic, i) => (
              <a
                key={topic}
                href={`#topic-${i}`}
                className="text-[#1A1A1A]/70 hover:text-[#1F4D3F] transition-colors"
              >
                {topic}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ──── FAQ Body ──── */}
      <section className="py-16 lg:py-20">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="space-y-12">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={Math.min(i * 40, 400)}>
                <article
                  id={`topic-${Math.min(Math.floor(i / 4), 4)}`}
                  className="grid grid-cols-12 gap-4 lg:gap-10 border-b border-[#1A1A1A]/8 pb-10"
                >
                  {/* Number */}
                  <div className="col-span-12 lg:col-span-2">
                    <span className="font-serif text-3xl lg:text-4xl text-[#1A1A1A]/30 tabular-nums leading-none">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Question + Answer */}
                  <div className="col-span-12 lg:col-span-10 space-y-4">
                    <h3 className="font-serif text-xl lg:text-2xl leading-snug tracking-tight text-[#1A1A1A]">
                      {faq.q}
                    </h3>
                    <div className="text-[15px] text-[#1A1A1A]/70 leading-relaxed max-w-2xl">
                      {faq.a}
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──── Footer accent ──── */}
      <div className="border-t border-[#1A1A1A]/10 bg-[#1A1A1A] text-[#FAFAF7]">
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-12 grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 lg:col-span-8">
            <p className="font-serif text-2xl lg:text-3xl leading-snug max-w-lg">
              Tidak menemukan jawaban Anda?
            </p>
            <p className="text-sm text-[#FAFAF7]/60 mt-2">
              Tim kami standby Senin–Sabtu pukul 08.00–20.00 WIB. WhatsApp 24 jam untuk darurat.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
            <a
              href="https://wa.me/6281234567890?text=Halo%20BookingMobil%2C%20saya%20mau%20bertanya..."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-[#FAFAF7]/30 text-sm font-semibold hover:bg-[#FAFAF7] hover:text-[#1A1A1A] transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#FAFAF7] text-[#1A1A1A] text-sm font-semibold hover:bg-[#1F4D3F] hover:text-[#FAFAF7] transition-colors"
            >
              Halaman Kontak →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
