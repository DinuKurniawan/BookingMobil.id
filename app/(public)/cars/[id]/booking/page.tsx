import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCar } from "@/lib/queries";
import { BookingForm } from "@/components/booking-form";
import { CAR_CATEGORY_LABELS, formatCurrency } from "@/lib/validations/car";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ startDate?: string; endDate?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const car = await getCar(id);

  if (!car) {
    return { title: "Mobil Tidak Ditemukan - BookingMobil.id" };
  }

  return {
    title: `Form Pemesanan - ${car.name} (${car.brand}) | BookingMobil.id`,
    description: `Isi formulir pemesanan untuk menyewa ${car.name} ${car.brand}.`,
  };
}

export default async function CarBookingPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sParams = await searchParams;

  const car = await getCar(id);

  if (!car || car.status !== "AVAILABLE") {
    notFound();
  }

  const priceNum = car.pricePerDay.toNumber();
  const thumbUrl = car.images[0];

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <Link href="/cars" className="hover:text-blue-600 transition-colors">
          Armada Mobil
        </Link>
        <span>/</span>
        <Link
          href={`/cars/${car.id}`}
          className="hover:text-blue-600 transition-colors"
        >
          {car.name}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Form Pemesanan</span>
      </nav>

      {/* Header */}
      <div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 inline-block mb-2">
          Pemesanan Sewa Mobil
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Formulir Pemesanan Armada
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Lengkapi data diri dan jadwal penyewaan Anda di bawah ini.
        </p>
      </div>

      {/* Car Overview Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center gap-5">
        <div className="w-full sm:w-44 h-28 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
          {thumbUrl ? (
            <Image
              src={thumbUrl}
              alt={car.name}
              width={176}
              height={112}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              🚗
            </div>
          )}
        </div>

        <div className="flex-1 w-full space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
              {CAR_CATEGORY_LABELS[car.category]}
            </span>
            <span className="text-xs text-slate-400">{car.brand}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{car.name}</h2>
          <p className="text-xs text-slate-500">
            {car.seats} Kursi Penumpang • Transmisi {car.transmission}
          </p>
        </div>

        <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
          <span className="text-xs text-slate-400 block">Tarif Harian</span>
          <span className="text-2xl font-black text-blue-600">
            {formatCurrency(priceNum)}
          </span>
          <span className="text-xs text-slate-400 block">/ hari</span>
        </div>
      </div>

      {/* Booking Form Component */}
      <BookingForm
        car={{
          id: car.id,
          name: car.name,
          brand: car.brand,
          pricePerDay: priceNum,
          images: car.images,
        }}
        initialStartDate={sParams.startDate}
        initialEndDate={sParams.endDate}
      />
    </div>
  );
}
