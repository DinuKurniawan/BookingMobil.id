import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan - BookingMobil.id",
  description:
    "Syarat dan ketentuan layanan sewa mobil BookingMobil.id, termasuk kebijakan privasi, pembatalan, dan perlindungan data pribadi.",
};

export default function SyaratKetentuanPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block">
            Legal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Syarat &amp; Ketentuan
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Berlaku efektif sejak 1 Agustus 2025. Dengan menggunakan layanan BookingMobil.id, Anda menyetujui seluruh ketentuan di bawah ini.
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto prose prose-slate prose-sm sm:prose-base">
        {/* 1. Umum */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</span>
            Ketentuan Umum
          </h2>
          <div className="ml-10 space-y-3 text-gray-600 leading-relaxed">
            <p>
              BookingMobil.id (&quot;Kami&quot;, &quot;Platform&quot;) adalah layanan penyewaan mobil online yang dikelola oleh PT Booking Mobil Indonesia. Dengan mengakses, mendaftar, atau menggunakan layanan kami, Anda (&quot;Pelanggan&quot;, &quot;Anda&quot;) menyatakan telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan ini.
            </p>
            <p>
              Kami berhak mengubah syarat dan ketentuan ini sewaktu-waktu. Perubahan akan diumumkan melalui Platform dan berlaku efektif pada tanggal yang ditentukan. Penggunaan berkelanjutan setelah perubahan merupakan persetujuan Anda atas ketentuan yang diperbarui.
            </p>
          </div>
        </section>

        {/* 2. Pendaftaran & Akun */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">2</span>
            Pemesanan &amp; Pembayaran
          </h2>
          <div className="ml-10 space-y-3 text-gray-600 leading-relaxed">
            <p>
              Pemesanan dilakukan melalui formulir booking di Platform dengan mengisi data diri yang valid dan benar. Anda bertanggung jawab penuh atas keakuratan data yang diberikan.
            </p>
            <p>
              Tarif sewa yang tercantum adalah harga per hari dan dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu. Harga yang berlaku adalah harga pada saat pemesanan dikonfirmasi.
            </p>
            <p>
              Pembayaran dilakukan melalui transfer bank ke rekening resmi yang tercantum di halaman konfirmasi pemesanan. Bukti transfer wajib diunggah melalui Platform untuk verifikasi.
            </p>
            <p>
              Pemesanan akan dikonfirmasi setelah pembayaran diverifikasi oleh tim admin kami dalam waktu maksimal 1×24 jam sejak bukti transfer diunggah.
            </p>
          </div>
        </section>

        {/* 3. Pembatalan */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">3</span>
            Kebijakan Pembatalan
          </h2>
          <div className="ml-10 space-y-3 text-gray-600 leading-relaxed">
            <p>Pembatalan pemesanan dikenakan ketentuan sebagai berikut:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Pembatalan H-3 atau lebih</strong> sebelum tanggal mulai sewa: pengembalian dana 80% dari total pembayaran.</li>
              <li><strong>Pembatalan H-2</strong> sebelum tanggal mulai sewa: pengembalian dana 50% dari total pembayaran.</li>
              <li><strong>Pembatalan H-1 atau hari H</strong>: tidak ada pengembalian dana.</li>
            </ul>
            <p>
              Pembatalan karena force majeure (bencana alam, kerusuhan, kebijakan pemerintah) akan dipertimbangkan secara kasus per kasus.
            </p>
          </div>
        </section>

        {/* 4. Penggunaan Kendaraan */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">4</span>
            Penggunaan Kendaraan
          </h2>
          <div className="ml-10 space-y-3 text-gray-600 leading-relaxed">
            <p>Pelanggan wajib mematuhi ketentuan penggunaan kendaraan sebagai berikut:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Menyetir dengan Surat Izin Mengemudi (SIM) yang masih berlaku dan sesuai golongan kendaraan.</li>
              <li>Tidak mengoperasikan kendaraan di bawah pengaruh alkohol atau obat-obatan terlarang.</li>
              <li>Tidak menggunakan kendaraan untuk kegiatan ilegal, balapan, atau off-road tanpa izin.</li>
              <li>Tidak memodifikasi, menyewakan kembali, atau menjaminkan kendaraan kepada pihak lain.</li>
              <li>Mengembalikan kendaraan dalam kondisi bersih dan tangki bahan bakar penuh seperti saat diserahkan.</li>
            </ul>
          </div>
        </section>

        {/* 5. Identitas & Dokumen */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">5</span>
            Verifikasi Identitas (KTP/SIM)
          </h2>
          <div className="ml-10 space-y-3 text-gray-600 leading-relaxed">
            <p>
              Pelanggan wajib mengunggah foto KTP atau SIM yang masih berlaku sebagai bagian dari proses pemesanan. Dokumen ini digunakan semata-mata untuk:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Verifikasi identitas penyewa.</li>
              <li>Pemenuhan kewajiban hukum dan peraturan yang berlaku.</li>
              <li>Penanganan sengketa atau klaim yang mungkin timbul.</li>
            </ul>
            <p>
              Kami tidak akan menggunakan dokumen identitas Anda untuk tujuan lain di luar yang disebutkan di atas.
            </p>
          </div>
        </section>

        {/* 6. Tanggung Jawab & Kerusakan */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">6</span>
            Tanggung Jawab &amp; Kerusakan
          </h2>
          <div className="ml-10 space-y-3 text-gray-600 leading-relaxed">
            <p>
              Pelanggan bertanggung jawab penuh atas kerusakan kendaraan selama masa sewa yang disebabkan oleh kelalaian, penggunaan yang tidak wajar, atau pelanggaran ketentuan penggunaan.
            </p>
            <p>
              Kerusakan akibat keausan normal (wear and tear) menjadi tanggung jawab kami. Biaya perbaikan akibat kecelakaan akan dibebankan kepada pelanggan sesuai tingkat kerusakan, kecuali pelanggan mengambil asuransi tambahan (jika tersedia).
            </p>
            <p>
              Keterlambatan pengembalian kendaraan dikenakan biaya tambahan sebesar 20% dari tarif harian per jam keterlambatan, maksimal hingga setara 1 hari penuh.
            </p>
          </div>
        </section>

        {/* 7. Kebijakan Privasi */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">7</span>
            Kebijakan Privasi
          </h2>
          <div className="ml-10 space-y-3 text-gray-600 leading-relaxed">
            <p>
              Kami mengumpulkan data pribadi yang Anda berikan secara sukarela saat melakukan pemesanan, termasuk namun tidak terbatas pada: nama lengkap, nomor telepon, alamat email, alamat domisili, nomor identitas (KTP/SIM), dan foto identitas.
            </p>

            <h3 className="text-base font-semibold text-gray-800 mt-6">Penggunaan Data</h3>
            <p>Data pribadi Anda kami gunakan untuk:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Memproses dan mengonfirmasi pemesanan Anda.</li>
              <li>Verifikasi identitas penyewa.</li>
              <li>Komunikasi terkait status pemesanan melalui email atau WhatsApp.</li>
              <li>Penyelesaian sengketa dan penanganan klaim.</li>
              <li>Kepatuhan terhadap peraturan perundang-undangan yang berlaku.</li>
            </ul>

            <h3 className="text-base font-semibold text-gray-800 mt-6">Penyimpanan &amp; Keamanan</h3>
            <p>
              Data Anda disimpan di server yang aman dan hanya dapat diakses oleh personel yang berwenang. Kami menerapkan langkah-langkah keamanan teknis dan organisasional untuk melindungi data Anda dari akses, perubahan, pengungkapan, atau penghancuran yang tidak sah.
            </p>
            <p>
              Foto identitas (KTP/SIM) Anda dienkripsi saat disimpan dan hanya dapat diakses oleh admin yang bertugas melakukan verifikasi.
            </p>

            <h3 className="text-base font-semibold text-gray-800 mt-6">Berbagi Data dengan Pihak Ketiga</h3>
            <p>
              Kami <strong>tidak</strong> menjual, memperdagangkan, atau mentransfer data pribadi Anda kepada pihak ketiga, kecuali:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Diwajibkan oleh hukum atau perintah pengadilan yang sah.</li>
              <li>Diperlukan untuk melindungi hak, properti, atau keselamatan kami dan pelanggan lain.</li>
            </ul>

            <h3 className="text-base font-semibold text-gray-800 mt-6">Hak Anda</h3>
            <p>Anda berhak untuk:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Meminta salinan data pribadi yang kami simpan.</li>
              <li>Meminta koreksi data yang tidak akurat.</li>
              <li>Meminta penghapusan data pribadi Anda, dengan ketentuan tidak melanggar kewajiban hukum kami.</li>
            </ul>
            <p>
              Untuk permintaan terkait privasi, silakan hubungi kami melalui email di <a href="mailto:privacy@bookingmobil.com" className="text-blue-600 hover:underline">privacy@bookingmobil.com</a>.
            </p>
          </div>
        </section>

        {/* 8. Lain-lain */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">8</span>
            Ketentuan Lain-lain
          </h2>
          <div className="ml-10 space-y-3 text-gray-600 leading-relaxed">
            <p>
              Apabila salah satu ketentuan dalam dokumen ini dinyatakan tidak sah atau tidak dapat diberlakukan oleh pengadilan yang berwenang, ketentuan lainnya tetap berlaku penuh.
            </p>
            <p>
              Segala sengketa yang timbul akan diselesaikan secara musyawarah. Apabila tidak tercapai kesepakatan, sengketa akan diselesaikan melalui Pengadilan Negeri Jakarta Pusat.
            </p>
          </div>
        </section>
      </article>

      {/* Contact CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-200">
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Masih ada pertanyaan?</h2>
          <p className="text-gray-500 text-sm">
            Tim kami siap membantu menjawab pertanyaan Anda seputar syarat dan ketentuan ini.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/30"
          >
            📞 Hubungi Kami
          </a>
        </div>
      </section>
    </div>
  );
}
