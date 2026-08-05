import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency, CAR_CATEGORY_LABELS, TRANSMISSION_LABELS } from "@/lib/validations/car";
import { BookingStatusBadge } from "@/components/admin/booking-status-badge";
import { BookingStatusActions } from "@/components/admin/booking-status-actions";
import { PaymentVerificationPanel } from "@/components/admin/payment-verification-panel";

type Props = {
  params: Promise<{ id: string }>;
};

function formatDateID(date: Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateShort(date: Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminBookingDetailPage({ params }: Props) {
  const { id } = await params;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      car: true,
      paymentProofs: {
        orderBy: { createdAt: "desc" },
        include: { verifiedByAdmin: { select: { name: true } } },
      },
    },
  });

  if (!booking) {
    notFound();
  }

  const car = booking.car;
  const carPriceNum = car.pricePerDay.toNumber();
  const totalPriceNum = booking.totalPrice.toNumber();

  return (
    <div className="space-y-6 pb-10">
      {/* Breadcrumb + Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/bookings"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Daftar Booking
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <span className="font-mono text-blue-600">#{booking.bookingCode}</span>
            <span className="text-sm font-normal text-gray-400 hidden sm:inline">·</span>
            <span className="text-sm font-normal text-gray-400 hidden sm:inline">Dibuat {formatDateShort(booking.createdAt)}</span>
          </h1>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
          <span className="text-xs text-blue-500 font-medium uppercase tracking-wide">Total Tagihan</span>
          <p className="text-lg font-bold text-blue-900 mt-1">{formatCurrency(totalPriceNum)}</p>
          <p className="text-xs text-blue-600">{booking.totalDays} hari sewa</p>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-100 p-4">
          <span className="text-xs text-purple-500 font-medium uppercase tracking-wide">Mobil</span>
          <p className="text-sm font-bold text-purple-900 mt-1 truncate">{car.name}</p>
          <p className="text-xs text-purple-600">{car.licensePlate}</p>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-100 p-4">
          <span className="text-xs text-emerald-500 font-medium uppercase tracking-wide">Pelanggan</span>
          <p className="text-sm font-bold text-emerald-900 mt-1 truncate">{booking.customerName}</p>
          <p className="text-xs text-emerald-600">{booking.customerPhone}</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
          <span className="text-xs text-amber-500 font-medium uppercase tracking-wide">Bukti Bayar</span>
          <p className="text-lg font-bold text-amber-900 mt-1">{booking.paymentProofs.length}</p>
          <p className="text-xs text-amber-600">
            {booking.paymentProofs.filter((p) => p.status === "PENDING").length} pending
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT: Data booking + customer + identitas */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Detail Armada */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
              </svg>
              Detail Armada
            </h2>

            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                {car.images[0] ? (
                  <Image src={car.images[0]} alt={car.name} width={192} height={128} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">🚗</div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Link href={`/admin/cars/${car.id}/edit`} className="text-lg font-bold text-blue-600 hover:underline">
                  {car.name}
                </Link>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600">
                    {CAR_CATEGORY_LABELS[car.category]}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600">
                    {TRANSMISSION_LABELS[car.transmission]}
                  </span>
                  <span className="text-xs text-gray-400">{car.seats} Kursi</span>
                  <span className="text-xs text-gray-400">·</span>
                  <span className="text-xs text-gray-400">{car.licensePlate}</span>
                </div>
                <p className="text-xs text-gray-500">{car.brand}</p>
                <p className="text-sm font-bold text-blue-600">{formatCurrency(carPriceNum)} / hari</p>
                {car.description && (
                  <p className="text-xs text-gray-500 italic mt-1 line-clamp-2">{car.description}</p>
                )}
              </div>
            </div>

            {/* Jadwal */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-400">Mulai</span>
                <p className="font-semibold text-gray-900 text-sm">{formatDateID(booking.startDate)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-400">Selesai</span>
                <p className="font-semibold text-gray-900 text-sm">{formatDateID(booking.endDate)}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-xs text-gray-400">Durasi</span>
                <p className="font-bold text-blue-600 text-sm">{booking.totalDays} Hari</p>
              </div>
            </div>
          </div>

          {/* 2. Data Pelanggan */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Data Pelanggan
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <span className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Nama Lengkap</span>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{booking.customerName}</p>
              </div>
              <div>
                <span className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">No. HP / WhatsApp</span>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{booking.customerPhone}</p>
              </div>
              <div>
                <span className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Email</span>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{booking.customerEmail}</p>
              </div>
              <div>
                <span className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">No. KTP / SIM</span>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{booking.identityNumber}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Alamat Lengkap</span>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">{booking.customerAddress}</p>
              </div>
              <div>
                <span className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Metode Pengambilan</span>
                <p className="font-semibold text-gray-800 text-sm mt-0.5">
                  {booking.deliveryOption === "PICKUP" ? "🏢 Ambil di Tempat" : "🚚 Diantar ke Alamat"}
                </p>
              </div>
              {booking.notes && (
                <div className="sm:col-span-2">
                  <span className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Catatan</span>
                  <p className="text-gray-600 text-sm mt-0.5 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {booking.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 3. Foto Identitas */}
          {booking.identityImageUrl && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Foto Identitas (KTP/SIM)
              </h2>

              <a href={booking.identityImageUrl} target="_blank" rel="noopener noreferrer" className="block group">
                <Image
                  src={booking.identityImageUrl}
                  alt={`Foto Identitas - ${booking.customerName}`}
                  width={512}
                  height={320}
                  unoptimized
                  className="w-full max-w-lg rounded-xl border border-gray-200 object-contain bg-gray-50 group-hover:shadow-md transition-shadow"
                />
                <p className="text-xs text-gray-400 mt-2 text-center group-hover:text-blue-600 transition-colors">
                  Klik untuk melihat ukuran penuh
                </p>
              </a>
            </div>
          )}
        </div>

        {/* RIGHT: Sidebar */}
        <div className="space-y-6">
          {/* Total Tagihan */}
          <div className="bg-gray-900 rounded-xl p-6 text-white shadow-lg space-y-3">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
              Total Pembayaran
            </span>
            <div className="text-2xl font-black font-mono">{formatCurrency(totalPriceNum)}</div>
            <div className="pt-2 border-t border-gray-800 space-y-1 text-xs text-gray-400">
              <div className="flex justify-between">
                <span>Harga per hari</span>
                <span>{formatCurrency(carPriceNum)}</span>
              </div>
              <div className="flex justify-between">
                <span>Durasi</span>
                <span>{booking.totalDays} Hari</span>
              </div>
              <div className="flex justify-between font-semibold text-white pt-1 border-t border-gray-800">
                <span>Total</span>
                <span>{formatCurrency(totalPriceNum)}</span>
              </div>
            </div>
          </div>

          {/* Status Actions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-3">
            <h3 className="text-sm font-bold text-gray-900">Aksi Status</h3>
            <BookingStatusActions
              bookingId={booking.id}
              currentStatus={booking.status}
              startDate={booking.startDate.toISOString()}
              endDate={booking.endDate.toISOString()}
            />
          </div>

          {/* Info Booking */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-gray-900">Info Booking</h3>
            <div className="space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>Kode</span>
                <span className="font-mono font-semibold text-gray-800">{booking.bookingCode}</span>
              </div>
              <div className="flex justify-between">
                <span>Dibuat</span>
                <span>{formatDateShort(booking.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Terakhir Update</span>
                <span>{formatDateShort(booking.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Proofs Section — full width */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Bukti Pembayaran ({booking.paymentProofs.length})
          </h2>
        </div>

        <PaymentVerificationPanel
          proofs={booking.paymentProofs.map((p) => ({
            id: p.id,
            imageUrl: p.imageUrl,
            status: p.status,
            uploadedAt: p.uploadedAt.toISOString(),
            rejectionReason: p.rejectionReason,
            verifiedAt: p.verifiedAt?.toISOString() ?? null,
          }))}
        />

        {/* Payment Proof History */}
        {booking.paymentProofs.length > 0 && booking.paymentProofs.some((p) => p.status !== "PENDING") && (
          <div className="pt-4 mt-4 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">
              Riwayat Verifikasi
            </span>
            <div className="space-y-2">
              {booking.paymentProofs
                .filter((p) => p.verifiedAt)
                .map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <span className={p.status === "APPROVED" ? "text-emerald-600" : "text-red-600"}>
                        {p.status === "APPROVED" ? "✅ Disetujui" : "❌ Ditolak"}
                      </span>
                      <span className="text-gray-400">oleh</span>
                      <span className="font-semibold text-gray-700">{p.verifiedByAdmin?.name || "Admin"}</span>
                    </div>
                    <span className="text-gray-400">
                      {p.verifiedAt
                        ? new Date(p.verifiedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
