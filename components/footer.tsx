import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-900 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">BookingMobil.id</h3>
            <p className="text-sm text-gray-400">
              Layanan penyewaan mobil terpercaya, aman, dan fleksibel untuk semua kebutuhan
              perjalanan Anda.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Navigasi
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/cars" className="hover:text-white transition-colors">
                  Armada Mobil
                </Link>
              </li>
              <li>
                <Link href="/tentang-kami" className="hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Hubungi Kami
                </Link>
              </li>
              <li>
                <Link href="/cek-booking" className="hover:text-white transition-colors">
                  Cek Booking
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ / Bantuan
                </Link>
              </li>
              <li>
                <Link href="/syarat-ketentuan" className="hover:text-white transition-colors">
                  Syarat &amp; Ketentuan
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Layanan
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span>Sewa Mobil Harian</span>
              </li>
              <li>
                <span>Sewa Mobil Bulanan</span>
              </li>
              <li>
                <span>Sewa dengan Sopir</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Kontak
            </h4>
            <p className="text-sm text-gray-400">Jakarta, Indonesia</p>
            <p className="text-sm text-gray-400 mt-2">Email: info@bookingmobil.com</p>
            <p className="text-sm text-gray-400">Telp: +62 812-3456-7890</p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} BookingMobil.id. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
