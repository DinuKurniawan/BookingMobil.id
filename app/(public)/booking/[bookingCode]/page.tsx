import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PaymentProofUploadForm } from "@/components/payment-proof-upload-form";
import { CopyButton } from "@/components/copy-button";
import { getBankAccounts } from "@/lib/config";
import { Button } from "@/components/ui/button";
import {
  CAR_CATEGORY_LABELS,
  TRANSMISSION_LABELS,
  formatCurrency,
} from "@/lib/validations/car";

type Props = {
  params: Promise<{ bookingCode: string }>;
  searchParams: Promise<{ email?: string; phone?: string; identity?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookingCode } = await params;
  const booking = await prisma.booking.findUnique({
    where: { bookingCode },
  });

  if (!booking) {
    return { title: "Pemesanan Tidak Ditemukan - BookingMobil.id" };
  }

  return {
    title: `Konfirmasi Pemesanan #${booking.bookingCode} - BookingMobil.id`,
    description: `Detail pemesanan dan instruksi pembayaran untuk kode ${booking.bookingCode}.`,
  };
}

const BOOKING_STATUS_CONFIG: Record<
  string,
  { label: string; bgClass: string; textClass: string; icon: string; description: string }
> = {
  PENDING: {
    label: "Menunggu Pembayaran",
    bgClass: "bg-amber-50 border-amber-200 text-amber-900",
    textClass: "bg-amber-100 text-amber-800 border-amber-200",
    icon: "⏳",
    description:
      "Pemesanan Anda telah berhasil dibuat. Silakan selesaikan pembayaran ke rekening di bawah dan upload bukti transfer.",
  },
  PAYMENT_REVIEW: {
    label: "Menunggu Verifikasi Admin",
    bgClass: "bg-blue-50 border-blue-200 text-blue-900",
    textClass: "bg-blue-100 text-blue-800 border-blue-200",
    icon: "🔍",
    description:
      "Bukti pembayaran Anda telah diterima dan sedang dalam proses verifikasi oleh tim admin kami.",
  },
  CONFIRMED: {
    label: "Pemesanan Terkonfirmasi",
    bgClass: "bg-emerald-50 border-emerald-200 text-emerald-900",
    textClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    icon: "✅",
    description:
      "Pembayaran telah diverifikasi! Pemesanan Anda telah terkonfirmasi. Tim kami akan menghubungi Anda menjelang jadwal penjemputan.",
  },
  ONGOING: {
    label: "Sewa Berlangsung",
    bgClass: "bg-purple-50 border-purple-200 text-purple-900",
    textClass: "bg-purple-100 text-purple-800 border-purple-200",
    icon: "🚗",
    description: "Armada mobil saat ini sedang dalam masa penyewaan aktif Anda.",
  },
  COMPLETED: {
    label: "Sewa Selesai",
    bgClass: "bg-slate-100 border-slate-200 text-slate-900",
    textClass: "bg-slate-200 text-slate-800 border-slate-300",
    icon: "🏁",
    description:
      "Masa penyewaan telah selesai. Terima kasih telah menggunakan layanan BookingMobil.id!",
  },
  CANCELLED: {
    label: "Pemesanan Dibatalkan",
    bgClass: "bg-red-50 border-red-200 text-red-900",
    textClass: "bg-red-100 text-red-800 border-red-200",
    icon: "❌",
    description: "Pemesanan ini telah dibatalkan.",
  },
  REJECTED: {
    label: "Pembayaran Ditolak",
    bgClass: "bg-red-50 border-red-200 text-red-900",
    textClass: "bg-red-100 text-red-800 border-red-200",
    icon: "⚠️",
    description:
      "Bukti pembayaran ditolak. Silakan periksa catatan alasan penolakan dan unggah ulang bukti transfer yang valid.",
  },
};

function formatDateID(date: Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BookingConfirmationPage({ params, searchParams }: Props) {
  const { bookingCode } = await params;
  const sParams = await searchParams;
  const userInput = (sParams.email || sParams.phone || sParams.identity)?.trim() || "";

  const bankAccounts = await getBankAccounts();

  const booking = await prisma.booking.findUnique({
    where: { bookingCode },
    select: {
      bookingCode: true,
      customerName: true,
      customerPhone: true,
      customerEmail: true,
      customerAddress: true,
      identityNumber: true,
      startDate: true,
      endDate: true,
      totalDays: true,
      totalPrice: true,
      status: true,
      notes: true,
      deliveryOption: true,
      createdAt: true,
      car: {
        select: { id: true, name: true, brand: true, category: true, transmission: true, seats: true, pricePerDay: true, images: true, licensePlate: true },
      },
      testimonial: { select: { id: true, text: true, rating: true } },
      paymentProofs: {
        orderBy: { createdAt: "desc" },
        select: { id: true, status: true, imageUrl: true, uploadedAt: true, rejectionReason: true, createdAt: true },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  // SECURITY CHECK: Verify user identity (email or phone) matches booking records
  const isEmailMatch =
    userInput.length > 0 &&
    booking.customerEmail.toLowerCase() === userInput.toLowerCase();
  const isPhoneMatch =
    userInput.length > 0 &&
    booking.customerPhone.replace(/[^0-9]/g, "") === userInput.replace(/[^0-9]/g, "");

  const isAccessVerified = isEmailMatch || isPhoneMatch;

  // IF NOT VERIFIED: Show Security Verification Gate
  if (!isAccessVerified) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-xl mx-auto w-full space-y-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
            🔒
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Verifikasi Akses Pemesanan
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Demi melindungi kerahasiaan data pribadi Anda, silakan masukkan <strong>Alamat Email</strong> atau <strong>Nomor HP</strong> yang Anda gunakan saat memesan kode <strong className="text-blue-600 font-mono">#{bookingCode}</strong>.
            </p>
          </div>

          {userInput.length > 0 && !isAccessVerified && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              Alamat Email atau Nomor HP tidak cocok dengan data pemesanan #{bookingCode}.
            </div>
          )}

          <form action={`/booking/${bookingCode}`} method="GET" className="space-y-4">
            <div>
              <label htmlFor="identity" className="block text-xs font-semibold text-slate-700 text-left mb-1.5">
                Alamat Email atau No. HP Penyewa <span className="text-red-500">*</span>
              </label>
              <input
                id="identity"
                type="text"
                name="email"
                placeholder="Contoh: nama@email.com / 081234567890"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-sm font-bold shadow-lg shadow-blue-600/30 justify-center"
            >
              Buka Detail Pemesanan →
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
            <Link href="/cek-booking" className="hover:text-blue-600 transition-colors">
              ← Cek Pemesanan Lain
            </Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">
              Bantuan Kontak
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // IF VERIFIED: Render Full Booking Confirmation & Details
  const car = booking.car;
  const totalPriceNum = booking.totalPrice.toNumber();
  const carPriceNum = car.pricePerDay.toNumber();

  const showInvoiceButton = ["CONFIRMED", "ONGOING", "COMPLETED"].includes(booking.status);
  const statusInfo =
    BOOKING_STATUS_CONFIG[booking.status] || BOOKING_STATUS_CONFIG.PENDING;

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
        <span className="text-slate-900 font-medium">Konfirmasi Pemesanan</span>
      </nav>

      {/* Header Banner */}
      <div className={`p-6 sm:p-8 rounded-3xl border shadow-sm ${statusInfo.bgClass} space-y-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{statusInfo.icon}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusInfo.textClass}`}>
                {statusInfo.label}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight pt-1">
              Detail &amp; Konfirmasi Pemesanan
            </h1>
            <p className="text-sm opacity-90">{statusInfo.description}</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-white/60 text-slate-900 flex flex-col items-start sm:items-end">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Kode Pemesanan
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl sm:text-2xl font-black text-blue-700 font-mono">
                {booking.bookingCode}
              </span>
              <CopyButton textToCopy={booking.bookingCode} label="Salin Kode" />
              {showInvoiceButton && (
                <a
                  href={`/api/invoice/${booking.bookingCode}?email=${encodeURIComponent(booking.customerEmail)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Invoice
                </a>
              )}
              {booking.status === "COMPLETED" && !booking.testimonial && (
                <a
                  href={`/beri-testimoni/${booking.bookingCode}?email=${encodeURIComponent(booking.customerEmail)}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-400 transition-colors"
                >
                  ⭐ Beri Testimoni
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Detail Booking & Payment Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Detail Booking & Form Upload Bukti */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Detail Mobil & Rental Schedule */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-6-1a1 1 0 011-1h1" />
              </svg>
              Detail Armada &amp; Jadwal Sewa
            </h2>

            <div className="flex flex-col sm:flex-row gap-5 items-center">
              <div className="w-full sm:w-44 h-28 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                {car.images[0] ? (
                  <Image
                    src={car.images[0]}
                    alt={car.name}
                    width={176}
                    height={112}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
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
                <h3 className="text-xl font-bold text-slate-900">{car.name}</h3>
                <p className="text-xs text-slate-500">
                  {car.seats} Kursi Penumpang • Transmisi {TRANSMISSION_LABELS[car.transmission]}
                </p>
                <p className="text-sm font-semibold text-blue-600 pt-1">
                  {formatCurrency(carPriceNum)} / hari
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">Mulai Sewa</span>
                <span className="font-semibold text-slate-900 text-sm">
                  {formatDateID(booking.startDate)}
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">Selesai Sewa</span>
                <span className="font-semibold text-slate-900 text-sm">
                  {formatDateID(booking.endDate)}
                </span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block mb-1">Total Durasi</span>
                <span className="font-bold text-blue-600 text-sm">
                  {booking.totalDays} Hari
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Data Pemesan */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Data Penyewa / Customer
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-xs text-slate-400 block">Nama Lengkap</span>
                <span className="font-semibold text-slate-800">{booking.customerName}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">No. HP / WhatsApp</span>
                <span className="font-semibold text-slate-800">{booking.customerPhone}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Alamat Email</span>
                <span className="font-semibold text-slate-800">{booking.customerEmail}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">No. KTP / SIM</span>
                <span className="font-semibold text-slate-800">{booking.identityNumber}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-xs text-slate-400 block">Alamat Lengkap</span>
                <span className="font-semibold text-slate-800">{booking.customerAddress}</span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block">Metode Pengambilan</span>
                <span className="font-semibold text-slate-800">
                  {booking.deliveryOption === "PICKUP" ? "🏢 Ambil di Tempat" : "🚚 Diantar ke Alamat"}
                </span>
              </div>

              {booking.notes && (
                <div className="sm:col-span-2">
                  <span className="text-xs text-slate-400 block">Catatan Tambahan</span>
                  <span className="text-slate-700 italic">{booking.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Upload Bukti Pembayaran Component */}
          <PaymentProofUploadForm
            bookingCode={booking.bookingCode}
            bookingStatus={booking.status}
            customerEmail={booking.customerEmail}
            existingProofs={booking.paymentProofs.map((p) => ({
              id: p.id,
              imageUrl: p.imageUrl,
              status: p.status,
              createdAt: p.createdAt.toISOString(),
              rejectionReason: p.rejectionReason,
            }))}
          />
        </div>

        {/* Right 1 Col: Instruksi Transfer Bank & Total Tagihan */}
        <div className="space-y-6 lg:sticky lg:top-24">
          {/* Box Total Tagihan */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-4 border border-slate-800">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
              Total Pembayaran
            </span>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                {formatCurrency(totalPriceNum)}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                ({formatCurrency(carPriceNum)} × {booking.totalDays} Hari)
              </p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-300">Salin Nominal Transfer</span>
              <CopyButton
                textToCopy={totalPriceNum.toString()}
                label="Salin Nominal"
                className="bg-slate-800 text-white hover:bg-slate-700"
              />
            </div>
          </div>

          {/* Instructions Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Info Rekening Tujuan Transfer
            </h3>

            {/* List Rekening Bank from database */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Pilih Rekening Tujuan
              </span>

              {bankAccounts.map((account) => (
                <div
                  key={account.bankName}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 px-2.5 py-0.5 rounded-md bg-white border border-slate-200 shadow-2xs">
                      {account.bankName}
                    </span>
                    <CopyButton
                      textToCopy={account.accountNumber}
                      label="Salin No. Rek"
                    />
                  </div>
                  <div>
                    <span className="text-lg font-mono font-bold text-slate-900 block tracking-wide">
                      {account.accountNumber}
                    </span>
                    <span className="text-xs text-slate-500 block">
                      a.n. {account.accountName}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Step-by-Step Guide */}
            <div className="pt-2 border-t border-slate-100 space-y-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Petunjuk Transfer
              </span>
              <ol className="space-y-2 text-xs text-slate-600 list-decimal list-inside leading-relaxed">
                <li>Transfer sejumlah nominal di atas ke salah satu rekening bank resmi kami.</li>
                <li>Simpan struk atau file PDF / screenshot bukti transaksi Anda.</li>
                <li>Upload bukti transfer pada formulir yang tersedia di halaman ini.</li>
                <li>Status pemesanan akan otomatis berubah ke <strong>PAYMENT_REVIEW</strong> dan admin akan menerima email notifikasi.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
