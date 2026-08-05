import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TestimonialForm } from "./testimonial-form";

type Props = {
  params: Promise<{ bookingCode: string }>;
  searchParams: Promise<{ email?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookingCode } = await params;
  return {
    title: `Beri Testimoni #${bookingCode} - BookingMobil.id`,
    description: "Bagikan pengalaman Anda menyewa mobil di BookingMobil.id.",
  };
}

export default async function BeriTestimoniPage({ params, searchParams }: Props) {
  const { bookingCode } = await params;
  const sParams = await searchParams;
  const emailParam = sParams.email?.trim().toLowerCase();

  const booking = await prisma.booking.findUnique({
    where: { bookingCode },
    select: {
      id: true,
      bookingCode: true,
      customerName: true,
      customerEmail: true,
      status: true,
      car: { select: { name: true, brand: true } },
      testimonial: { select: { id: true } },
    },
  });

  if (!booking) {
    notFound();
  }

  // Verify email if provided
  if (emailParam && booking.customerEmail.toLowerCase() !== emailParam) {
    return (
      <div className="py-12 px-4 max-w-lg mx-auto text-center space-y-4">
        <div className="text-4xl">🔒</div>
        <h1 className="text-xl font-bold text-gray-900">Akses Ditolak</h1>
        <p className="text-gray-500 text-sm">
          Email tidak cocok dengan data pemesanan #{bookingCode}.
        </p>
        <Link
          href="/"
          className="inline-flex px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // Check if already submitted
  if (booking.testimonial) {
    return (
      <div className="py-12 px-4 max-w-lg mx-auto text-center space-y-4">
        <div className="text-4xl">✅</div>
        <h1 className="text-xl font-bold text-gray-900">Testimoni Sudah Dikirim</h1>
        <p className="text-gray-500 text-sm">
          Anda sudah memberikan testimoni untuk pemesanan #{bookingCode}. Terima kasih!
        </p>
        <Link
          href="/"
          className="inline-flex px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  // Check if booking is COMPLETED
  if (booking.status !== "COMPLETED") {
    return (
      <div className="py-12 px-4 max-w-lg mx-auto text-center space-y-4">
        <div className="text-4xl">⏳</div>
        <h1 className="text-xl font-bold text-gray-900">Belum Bisa Memberi Testimoni</h1>
        <p className="text-gray-500 text-sm">
          Testimoni hanya bisa diberikan setelah masa sewa selesai dan booking berstatus COMPLETED. Saat ini status: <strong>{booking.status}</strong>.
        </p>
        <Link
          href={`/booking/${bookingCode}?email=${encodeURIComponent(booking.customerEmail)}`}
          className="inline-flex px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold"
        >
          Lihat Detail Booking
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto w-full space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Beri Testimoni</span>
      </nav>

      <div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 inline-block mb-2">
          ⭐ Testimoni Pelanggan
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Bagikan Pengalaman Anda
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Beri penilaian untuk sewa mobil <strong>{booking.car.name}</strong> ({booking.car.brand}). Testimoni Anda akan ditampilkan di halaman utama kami setelah disetujui admin.
        </p>
      </div>

      <TestimonialForm
        bookingId={booking.id}
        customerName={booking.customerName}
        bookingCode={booking.bookingCode}
        email={booking.customerEmail}
      />
    </div>
  );
}
