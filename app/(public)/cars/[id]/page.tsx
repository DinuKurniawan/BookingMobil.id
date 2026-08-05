import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCar } from "@/lib/queries";
import { CarImageGallery } from "@/components/car-image-gallery";
import { AvailabilityChecker } from "@/components/availability-checker";
import { CarAvailabilityCalendar } from "@/components/car-availability-calendar";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  CAR_CATEGORY_LABELS,
  TRANSMISSION_LABELS,
  CAR_STATUS_LABELS,
  formatCurrency,
} from "@/lib/validations/car";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const car = await getCar(id);

  if (!car) {
    return {
      title: "Mobil Tidak Ditemukan - BookingMobil.id",
    };
  }

  return {
    title: `${car.name} (${car.brand}) - BookingMobil.id`,
    description: car.description || `Sewa mobil ${car.name} ${car.brand} murah dan terawat.`,
  };
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params;

  const car = await getCar(id);

  if (!car) {
    notFound();
  }

  const priceNum = car.pricePerDay.toNumber();

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Breadcrumb */}
      <ScrollReveal>
        <nav className="flex items-center gap-2 text-xs text-gray-500">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/cars" className="hover:text-blue-600 transition-colors">
            Armada Mobil
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">{car.name}</span>
        </nav>
      </ScrollReveal>

      {/* Title & Brand Header */}
      <ScrollReveal delay={100}>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
              {CAR_CATEGORY_LABELS[car.category]}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                car.status === "AVAILABLE"
                  ? "bg-emerald-100 text-emerald-700"
                  : car.status === "MAINTENANCE"
                  ? "bg-amber-100 text-amber-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {CAR_STATUS_LABELS[car.status]}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {car.name}
          </h1>
          <p className="text-base text-gray-500 mt-1">{car.brand}</p>
        </div>

        <div className="text-left md:text-right">
          <span className="text-xs text-gray-500 block">Harga Sewa</span>
          <div className="flex items-baseline md:justify-end gap-1">
            <span className="text-3xl font-black text-blue-600">
              {formatCurrency(priceNum)}
            </span>
            <span className="text-sm text-gray-500">/ hari</span>
          </div>
        </div>
      </div>
      </ScrollReveal>

      {/* Main Grid: Gallery & Specs vs Booking Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Photo Gallery & Specifications & Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Photo Gallery */}
          <ScrollReveal delay={200}>
            <CarImageGallery images={car.images} carName={car.name} />
          </ScrollReveal>

          {/* Specifications Card */}
          <ScrollReveal delay={300}>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Spesifikasi Lengkap
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-400 block mb-1">Merek / Brand</span>
                <span className="font-semibold text-gray-900 text-sm">{car.brand}</span>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-400 block mb-1">Kategori</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {CAR_CATEGORY_LABELS[car.category]}
                </span>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-400 block mb-1">Transmisi</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {TRANSMISSION_LABELS[car.transmission]}
                </span>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-400 block mb-1">Kapasitas Kursi</span>
                <span className="font-semibold text-gray-900 text-sm">{car.seats} Penumpang</span>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-400 block mb-1">Plat Nomor</span>
                <span className="font-semibold text-gray-900 text-sm">{car.licensePlate}</span>
              </div>

              <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                <span className="text-xs text-gray-400 block mb-1">Status Mobil</span>
                <span className="font-semibold text-gray-900 text-sm">
                  {CAR_STATUS_LABELS[car.status]}
                </span>
              </div>
            </div>
          </div>
          </ScrollReveal>

          {/* Availability Calendar */}
          <ScrollReveal delay={400}>
            <CarAvailabilityCalendar carId={car.id} />
          </ScrollReveal>

          {/* Description */}
          <ScrollReveal delay={500}>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-3">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Deskripsi Kendaraan
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
              {car.description || "Tidak ada deskripsi tambahan untuk armada kendaraan ini."}
            </p>
          </div>
          </ScrollReveal>
        </div>

        {/* Right 1 Col: Availability Checker & Booking Sidebar */}
        <ScrollReveal delay={300} variant="right">
        <div className="lg:sticky lg:top-24">
          <AvailabilityChecker carId={car.id} pricePerDay={priceNum} />
        </div>
        </ScrollReveal>
      </div>
    </div>
  );
}
