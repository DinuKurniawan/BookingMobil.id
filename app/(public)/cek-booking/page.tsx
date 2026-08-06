import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { cekBookingSchema } from "@/lib/validations/cek-booking";
import { BookingStatusTimeline } from "@/components/booking-status-timeline";
import { CopyButton } from "@/components/copy-button";
import { ScrollReveal } from "@/components/scroll-reveal";
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

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Menunggu Pembayaran",
  PAYMENT_REVIEW: "Verifikasi Admin",
  CONFIRMED: "Terkonfirmasi",
  ONGOING: "Sewa Berlangsung",
  COMPLETED: "Sewa Selesai",
  CANCELLED: "Dibatalkan",
  REJECTED: "Pembayaran Ditolak",
};

function formatDateShort(date: Date) {
  return new Date(date).toLocaleDateString("id-ID", {
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
    <div className="bg-[#FAFAF7] text-[#1A1A1A] min-h-screen">
      {/* ──── Header ──── */}
      <header className="border-b border-[#1A1A1A]/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 pt-14 pb-10 lg:pt-20 lg:pb-12">
          <ScrollReveal>
            <nav className="text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/40 mb-8">
              <Link href="/" className="hover:text-[#1A1A1A] transition-colors">Beranda</Link>
              <span className="mx-2">/</span>
              <span className="text-[#1A1A1A]">Cek Status Booking</span>
            </nav>
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#1F4D3F] mb-4">
              Verifikasi Pesanan
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1] tracking-tight">
              Lacak status
              <span className="block italic font-light text-[#1A1A1A]/60">pesanan Anda.</span>
            </h1>
          </ScrollReveal>
        </div>
      </header>

      {/* ──── Verification Form ──── */}
      <section className="border-b border-[#1A1A1A]/10">
        <div className="max-w-4xl mx-auto px-6 lg:px-10 py-12 lg:py-16">
          <ScrollReveal>
            <p className="text-[15px] text-[#1A1A1A]/70 leading-relaxed max-w-xl mb-8">
              Masukkan Kode Booking dan Email atau Nomor HP yang Anda gunakan saat pemesanan. Kedua data harus cocok untuk menampilkan detail pesanan.
            </p>

            <form action="/cek-booking" method="GET" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#1A1A1A]/10 border border-[#1A1A1A]/10 rounded-2xl overflow-hidden">
                <div className="bg-[#FAFAF7] p-5">
                  <label htmlFor="bookingCode" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-2">
                    01 / Kode Booking
                  </label>
                  <input
                    id="bookingCode"
                    type="text"
                    name="bookingCode"
                    defaultValue={bookingCodeInput}
                    placeholder="BK-20260804-A9F"
                    required
                    className="w-full bg-transparent text-lg font-medium text-[#1A1A1A] placeholder:text-[#1A1A1A]/25 outline-none font-mono"
                  />
                </div>

                <div className="bg-[#FAFAF7] p-5">
                  <label htmlFor="identity" className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-2">
                    02 / Email atau No. HP
                  </label>
                  <input
                    id="identity"
                    type="text"
                    name="identity"
                    defaultValue={identityInput}
                    placeholder="nama@email.com / 081234567890"
                    required
                    className="w-full bg-transparent text-lg font-medium text-[#1A1A1A] placeholder:text-[#1A1A1A]/25 outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-[#1A1A1A]/50">
                  Kode pemesanan dikirim via email setelah booking.
                </p>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1A1A1A] text-[#FAFAF7] text-sm font-semibold hover:bg-[#1F4D3F] transition-colors"
                >
                  Verifikasi & Lacak
                  <span>→</span>
                </button>
              </div>
            </form>
          </ScrollReveal>
        </div>
      </section>

      {validationError && (
        <section className="border-b border-[#1A1A1A]/10">
          <div className="max-w-4xl mx-auto px-6 lg:px-10 py-8">
            <div className="flex items-start gap-4 border-l-2 border-amber-600 pl-5 py-3">
              <span className="text-2xl font-serif text-amber-600 leading-none">!</span>
              <p className="text-sm text-[#1A1A1A]/80 leading-relaxed">{validationError}</p>
            </div>
          </div>
        </section>
      )}

      {searched && !validationError && (
        <section className="border-b border-[#1A1A1A]/10">
          <div className="max-w-4xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
            <div className="flex items-baseline justify-between flex-wrap gap-2 mb-10 pb-4 border-b border-[#1A1A1A]/10">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/50">
                Hasil verifikasi — {bookings.length} pesanan ditemukan
              </p>
              <p className="text-[11px] font-mono text-[#1A1A1A]/50">
                {bookingCodeInput} • {identityInput}
              </p>
            </div>

            {bookings.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-serif text-3xl italic text-[#1A1A1A]/70 mb-3">
                  Tidak ada yang cocok.
                </p>
                <p className="text-sm text-[#1A1A1A]/60 max-w-md mx-auto mb-8">
                  Kombinasi Kode Booking <strong>{bookingCodeInput}</strong> dan Email/No HP tidak cocok dengan data pesanan manapun.
                </p>
                <Link
                  href="/contact"
                  className="text-sm font-semibold text-[#1F4D3F] hover:underline underline-offset-4 decoration-[#1F4D3F]/30"
                >
                  Hubungi kami jika butuh bantuan →
                </Link>
              </div>
            ) : (
              <div className="space-y-16">
                {bookings.map((booking, idx) => {
                  const car = booking.car;
                  const totalPriceNum = booking.totalPrice.toNumber();
                  const statusLabel = STATUS_LABELS[booking.status] || booking.status;

                  return (
                    <article key={booking.id} className="space-y-8">
                      <div className="grid grid-cols-12 gap-4 items-baseline">
                        <div className="col-span-2">
                          <span className="font-serif text-3xl lg:text-4xl text-[#1A1A1A]/30 tabular-nums">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <div className="col-span-10">
                          <p className="text-[11px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-1">
                            Kode Pemesanan
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-mono text-2xl lg:text-3xl font-bold text-[#1A1A1A]">
                              {booking.bookingCode}
                            </span>
                            <CopyButton textToCopy={booking.bookingCode} />
                          </div>
                        </div>
                      </div>

                      <div className="border-y border-[#1A1A1A]/10 py-8">
                        <div className="grid grid-cols-12 gap-4 items-end">
                          <div className="col-span-12 lg:col-span-7">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-2">
                              Status saat ini
                            </p>
                            <p className="font-serif text-4xl lg:text-5xl leading-none tracking-tight">
                              {statusLabel}
                            </p>
                          </div>
                          <div className="col-span-12 lg:col-span-5 lg:text-right">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-1">
                              Total Tagihan
                            </p>
                            <p className="font-serif text-3xl lg:text-4xl tabular-nums leading-none">
                              {formatCurrency(totalPriceNum)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-8">
                          <BookingStatusTimeline status={booking.status} />
                        </div>
                      </div>

                      <div className="grid grid-cols-12 gap-6 lg:gap-10">
                        <div className="col-span-12 sm:col-span-5">
                          <div className="relative aspect-[16/10] bg-[#1A1A1A]/5 overflow-hidden rounded-lg">
                            {car?.images[0] ? (
                              <Image
                                src={car.images[0]}
                                alt={car.name}
                                fill
                                sizes="(max-width: 640px) 100vw, 40vw"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[#1A1A1A]/15">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="col-span-12 sm:col-span-7 space-y-6">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-1">
                              Mobil
                            </p>
                            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#1F4D3F] mb-1">
                              {car?.brand}
                            </p>
                            <h3 className="font-serif text-2xl lg:text-3xl leading-tight tracking-tight">
                              {car?.name}
                            </h3>
                            <p className="text-xs text-[#1A1A1A]/60 mt-1">
                              {car ? CAR_CATEGORY_LABELS[car.category as keyof typeof CAR_CATEGORY_LABELS] : "-"}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-1">Mulai</p>
                              <p className="text-[#1A1A1A]">{formatDateShort(booking.startDate)}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-1">Selesai</p>
                              <p className="text-[#1A1A1A]">{formatDateShort(booking.endDate)}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-1">Durasi</p>
                              <p className="text-[#1A1A1A] tabular-nums">{booking.totalDays} hari</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-1">Dipesan</p>
                              <p className="text-[#1A1A1A]">{formatDateShort(booking.createdAt)}</p>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-[#1A1A1A]/10">
                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 mb-1">
                              Pemesan
                            </p>
                            <p className="text-[#1A1A1A]">
                              <strong>{booking.customerName}</strong> · {booking.customerPhone}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-[#1A1A1A]/10">
                        <Link
                          href={`/booking/${booking.bookingCode}?email=${encodeURIComponent(booking.customerEmail)}`}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A1A1A] text-[#FAFAF7] text-sm font-semibold hover:bg-[#1F4D3F] transition-colors"
                        >
                          Detail & Upload Bukti Pembayaran
                          <span>→</span>
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
