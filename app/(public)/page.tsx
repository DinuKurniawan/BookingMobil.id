import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CarCard } from "@/components/car-card";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { ScrollReveal } from "@/components/scroll-reveal";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const cars = await prisma.car.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  const testimonials = await prisma.testimonial.findMany({
    where: { isApproved: true },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { name: true, role: true, text: true, rating: true },
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white py-24 lg:py-36 px-4 sm:px-6 lg:px-8">
        {/* Decorative blurred circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <ScrollReveal variant="scale" delay={100}>
            <span className="px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block">
              Sewa Mobil Mudah &amp; Cepat
            </span>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Perjalanan Nyaman
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Memulai Dari Sini
              </span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Temukan ragam pilihan armada mobil impian untuk keperluan liburan,
              perjalanan bisnis, atau rental harian dengan harga bersaing dan
              kondisi prima.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Link href="/cars">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Lihat Armada Mobil
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  Hubungi Kami
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Mengapa Memilih Kami?
            </h2>
            <p className="text-gray-600 mt-2">
              Keunggulan layanan rental mobil terbaik untuk kepuasan Anda
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ScrollReveal delay={0}>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl mb-4">
                🚗
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Mobil Terawat
              </h3>
              <p className="text-gray-600 text-sm">
                Seluruh armada kendaraan dipelihara secara berkala dan selalu
                bersih sebelum diserahkan.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl mb-4">
                💰
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Harga Transparan
              </h3>
              <p className="text-gray-600 text-sm">
                Tidak ada biaya tersembunyi. Harga sewa yang tertera jelas dan
                terjangkau.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={300}>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xl mb-4">
                🕒
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Layanan 24/7
              </h3>
              <p className="text-gray-600 text-sm">
                Tim dukungan siap memandu dan membantu Anda dalam pemesanan kapan
                saja.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              Testimoni
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">
              Dipercaya Pelanggan
            </h2>
            <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">
              Pengalaman nyata dari pelanggan yang telah menggunakan layanan kami
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <TestimonialCarousel testimonials={testimonials} />
        </ScrollReveal>
      </section>

      {/* Car Grid Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-gray-50">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
                Armada Kami
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-1">
                Mobil Tersedia
              </h2>
              <p className="text-gray-500 mt-1">
                Pilih mobil yang sesuai dengan kebutuhan perjalanan Anda
              </p>
            </div>
            <Link
              href="/cars"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap"
            >
              Lihat Semua Armada
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </ScrollReveal>

        {cars.length === 0 ? (
          <ScrollReveal>
            <div className="py-16 text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25m-2.25 0h-2.735a2.25 2.25 0 00-1.834.952L4.843 10.5H3.375"
                />
              </svg>
              <p className="text-gray-500 text-lg font-medium">
                Belum ada mobil tersedia saat ini
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Silakan cek kembali nanti atau hubungi kami untuk informasi lebih
                lanjut
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cars.map((car, i) => (
              <ScrollReveal key={car.id} delay={i * 100}>
                <CarCard
                  car={{
                    id: car.id,
                    name: car.name,
                    brand: car.brand,
                    category: car.category,
                    transmission: car.transmission,
                    seats: car.seats,
                    pricePerDay: car.pricePerDay.toNumber(),
                    images: car.images,
                  }}
                />
              </ScrollReveal>
            ))}
          </div>
        )}

        {cars.length > 0 && (
          <ScrollReveal delay={200}>
            <div className="text-center mt-10">
              <Link href="/cars">
                <Button variant="outline" size="lg">
                  Lihat Semua Armada Mobil
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        )}
      </section>
    </div>
  );
}
