import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { cekBookingSchema } from "@/lib/validations/cek-booking";
import { Button } from "@/components/ui/button";
import { BookingStatusTimeline } from "@/components/booking-status-timeline";
import { CopyButton } from "@/components/copy-button";
import {
  CAR_CATEGORY_LABELS,
  formatCurrency,
} from "@/lib/validations/car";

export const metadata: Metadata = {
  title: "Cek Status Booking - BookingMobil.id",
  description:
    "Lacak status pemesanan sewa mobil Anda secara aman dengan verifikasi Kode Booking dan Email/No HP.",
};

type Props = {
  searchParams: Promise<{ bookingCode?: string; identity?: string; email?: string; phone?: string }>;
};

const STATUS_BADGES: Record<
  string,
  { label: string; bgClass: string }
> = {
  PENDING: { label: "Menunggu Pembayaran", bgClass: "bg-amber-100 text-amber-800 border-amber-200" },
  PAYMENT_REVIEW: { label: "Verifikasi Admin", bgClass: "bg-blue-100 text-blue-800 border-blue-200" },
  CONFIRMED: { label: "Pemesanan Terkonfirmasi", bgClass: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  ONGOING: { label: "Sewa Berlangsung", bgClass: "bg-purple-100 text-purple-800 border-purple-200" },
  COMPLETED: { label: "Sewa Selesai", bgClass: "bg-slate-200 text-slate-700 border-slate-300" },
  CANCELLED: { label: "Dibatalkan", bgClass: "bg-red-100 text-red-800 border-red-200" },
  REJECTED: { label: "Pembayaran Ditolak", bgClass: "bg-red-100 text-red-800 border-red-200" },
};

function formatDateID(date: Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function CekBookingPage({ searchParams }: Props) {
  const sParams = await searchParams;
  const bookingCodeInput = sParams.bookingCode?.trim() || "";
  const identityInput = (sParams.identity || sParams.email || sParams.phone)?.trim() || "";

  let bookings: any[] = [];
  let searched = false;
  let validationError: string | null = null;

  if (bookingCodeInput || identityInput) {
    searched = true;

    const parsed = cekBookingSchema.safeParse({
      bookingCode: bookingCodeInput,
      identity: identityInput,
    });

    if (!parsed.success) {
      validationError = parsed.error.issues[0]?.message || "Format input tidak valid";
    } else if (!bookingCodeInput || !identityInput) {
      validationError =
        "Demi keamanan data pribadi, Anda wajib memasukkan KEDUA data: Kode Booking DAN Email / No. HP terdaftar.";
    } else {
      bookings = await prisma.booking.findMany({
        where: {
          AND: [
            { bookingCode: { equals: bookingCodeInput, mode: "insensitive" } },
            {
              OR: [
                { customerEmail: { equals: identityInput, mode: "insensitive" } },
                { customerPhone: { equals: identityInput, mode: "insensitive" } },
              ],
            },
          ],
        },
        select: {
          id: true,
          bookingCode: true,
          customerName: true,
          customerPhone: true,
          customerEmail: true,
          startDate: true,
          endDate: true,
          totalDays: true,
          totalPrice: true,
          status: true,
          createdAt: true,
          car: { select: { name: true, brand: true, category: true, images: true } },
          paymentProofs: {
            orderBy: { createdAt: "desc" },
            select: { id: true, status: true, imageUrl: true, uploadedAt: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }
  }

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-medium">Cek Status Booking</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-10 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 inline-block mb-1">
            🔒 Lacak Pesanan Terverifikasi
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Cek Status Pemesanan
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Demi keamanan data pribadi, lacak pesanan membutuhkan kombinasi yang cocok antara <strong>Kode Booking</strong> serta <strong>Email atau Nomor HP</strong> yang terdaftar saat pemesanan.
          </p>
        </div>

        {/* Dual Search Input Form */}
        <form action="/cek-booking" method="GET" className="relative z-10 space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20">
            {/* Input 1: Kode Booking */}
            <div>
              <label htmlFor="bookingCode" className="block text-xs font-semibold text-blue-200 mb-1">
                Kode Booking <span className="text-red-400">*</span>
              </label>
              <input
                id="bookingCode"
                type="text"
                name="bookingCode"
                defaultValue={bookingCodeInput}
                placeholder="Contoh: BK-20260804-A9F"
                required
                className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none font-medium focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Input 2: Email atau No HP */}
            <div>
              <label htmlFor="identity" className="block text-xs font-semibold text-blue-200 mb-1">
                Email atau No. HP Terdaftar <span className="text-red-400">*</span>
              </label>
              <input
                id="identity"
                type="text"
                name="identity"
                defaultValue={identityInput}
                placeholder="nama@email.com / 081234567890"
                required
                className="w-full px-4 py-3 rounded-xl bg-white text-slate-900 text-sm placeholder:text-slate-400 outline-none font-medium focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 font-bold text-sm shadow-lg shadow-blue-600/40"
            >
              🔒 Verifikasi &amp; Lacak Pesanan
            </Button>
          </div>
        </form>
      </div>

      {/* Validation Error Alert */}
      {validationError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{validationError}</span>
        </div>
      )}

      {/* SEARCH RESULTS SECTION */}
      {searched && !validationError && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <h2 className="text-xl font-bold text-slate-900">
              Hasil Verifikasi ({bookings.length})
            </h2>
            <span className="text-xs text-slate-500">
              Kode: <strong className="text-slate-800 font-mono">{bookingCodeInput}</strong> • Identitas: <strong className="text-slate-800">{identityInput}</strong>
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-3xl mx-auto">
                🔒
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Data Pemesanan Tidak Cocok
                </h3>
                <p className="text-slate-500 text-xs max-w-md mx-auto">
                  Kombinasi Kode Booking <strong>{bookingCodeInput}</strong> dan Email/No HP <strong>{identityInput}</strong> tidak cocok dengan data pemesanan mana pun di sistem kami.
                </p>
              </div>
              <div className="pt-2">
                <Link href="/cars">
                  <Button variant="outline" size="sm" className="text-xs font-semibold">
                    Lihat Armada Mobil
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {bookings.map((booking) => {
                const car = booking.car;
                const totalPriceNum = booking.totalPrice.toNumber();
                const badgeInfo =
                  STATUS_BADGES[booking.status] || STATUS_BADGES.PENDING;

                return (
                  <div
                    key={booking.id}
                    className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6 hover:shadow-md transition-all"
                  >
                    {/* Header: Code & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <span className="text-xs text-slate-400 block font-medium">
                          Kode Pemesanan
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xl sm:text-2xl font-black text-blue-700 font-mono">
                            {booking.bookingCode}
                          </span>
                          <CopyButton textToCopy={booking.bookingCode} />
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${badgeInfo.bgClass}`}
                        >
                          {badgeInfo.label}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(booking.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Visual Status Timeline Progress */}
                    <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                      <span className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wider">
                        Progress Status Pemesanan
                      </span>
                      <BookingStatusTimeline status={booking.status} />
                    </div>

                    {/* Car & Booking Summary Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                      {/* Car Details */}
                      <div className="sm:col-span-2 flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-full sm:w-36 h-24 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                          {car?.images[0] ? (
                            <Image
                              src={car.images[0]}
                              alt={car.name}
                              width={144}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              🚗
                            </div>
                          )}
                        </div>

                        <div className="space-y-1 w-full text-left">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              {car ? CAR_CATEGORY_LABELS[car.category as keyof typeof CAR_CATEGORY_LABELS] : "-"}
                            </span>
                            <span className="text-xs text-slate-400">{car?.brand}</span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900">{car?.name}</h3>
                          <p className="text-xs text-slate-500">
                            {formatDateID(booking.startDate)} s/d {formatDateID(booking.endDate)} ({booking.totalDays} Hari)
                          </p>
                          <p className="text-xs text-slate-500">
                            Pemesan: <strong className="text-slate-800">{booking.customerName}</strong> ({booking.customerPhone})
                          </p>
                        </div>
                      </div>

                      {/* Total Price & Action Button */}
                      <div className="flex flex-col justify-between items-start sm:items-end border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <span className="text-xs text-slate-400 block">Total Tagihan</span>
                          <span className="text-2xl font-black text-blue-600 font-mono">
                            {formatCurrency(totalPriceNum)}
                          </span>
                        </div>

                        <Link
                          href={`/booking/${booking.bookingCode}?email=${encodeURIComponent(booking.customerEmail)}`}
                          className="mt-3 w-full sm:w-auto"
                        >
                          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-xs font-bold px-4 py-2.5 shadow-xs">
                            Detail &amp; Upload Bukti Pembayaran →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
