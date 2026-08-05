import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/validations/car";
import { BookingTabs } from "@/components/admin/booking-tabs";
import { BookingSearchBar } from "@/components/admin/booking-search-bar";
import { BookingStatusBadge } from "@/components/admin/booking-status-badge";
import Link from "next/link";

type SearchParams = Promise<{ status?: string; q?: string }>;

function formatDateID(date: Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function BookingsTable({
  statusFilter,
  query,
}: {
  statusFilter: string;
  query: string;
}) {

  const statuses = statusFilter
    ? statusFilter.split(",").filter(Boolean)
    : undefined;

  const where: Record<string, unknown> = {};

  if (statuses && statuses.length > 0) {
    where.status = { in: statuses };
  }

  if (query) {
    where.OR = [
      { bookingCode: { contains: query, mode: "insensitive" } },
      { customerName: { contains: query, mode: "insensitive" } },
    ];
  }

  const bookings = await prisma.booking.findMany({
    where,
    select: {
      id: true,
      bookingCode: true,
      customerName: true,
      customerPhone: true,
      startDate: true,
      endDate: true,
      totalDays: true,
      totalPrice: true,
      status: true,
      createdAt: true,
      car: { select: { name: true, licensePlate: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const highlightText = (text: string, search: string) => {
    if (!search) return text;
    const idx = text.toLowerCase().indexOf(search.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">
          {text.slice(idx, idx + search.length)}
        </mark>
        {text.slice(idx + search.length)}
      </>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {bookings.length === 0 ? (
        <div className="p-12 text-center text-sm text-gray-400">
          {query
            ? `Tidak ada booking yang cocok dengan pencarian "${query}".`
            : statusFilter
            ? `Tidak ada booking dengan status ${statusFilter.replace(",", "/")}.`
            : "Belum ada booking."}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-gray-500 text-[11px] font-semibold uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-5">Kode</th>
                <th className="py-3 px-5">Pelanggan</th>
                <th className="py-3 px-5">Mobil</th>
                <th className="py-3 px-5">Tanggal Sewa</th>
                <th className="py-3 px-5">Total</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 w-0">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-5">
                    <span className="font-mono font-semibold text-gray-900 text-sm">
                      {highlightText(booking.bookingCode, query)}
                    </span>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {formatDateID(booking.createdAt)}
                    </p>
                  </td>
                  <td className="py-3 px-5">
                    <p className="font-semibold text-gray-900 text-sm">
                      {highlightText(booking.customerName, query)}
                    </p>
                    <p className="text-xs text-gray-400">{booking.customerPhone}</p>
                  </td>
                  <td className="py-3 px-5">
                    <p className="text-gray-800 font-medium text-sm">{booking.car.name}</p>
                    <p className="text-xs text-gray-400">{booking.car.licensePlate}</p>
                  </td>
                  <td className="py-3 px-5 whitespace-nowrap">
                    <p className="text-xs text-gray-700">{formatDateID(booking.startDate)}</p>
                    <p className="text-xs text-gray-400">→ {formatDateID(booking.endDate)}</p>
                    <p className="text-[11px] text-gray-400">{booking.totalDays} hari</p>
                  </td>
                  <td className="py-3 px-5 font-semibold text-gray-900 whitespace-nowrap text-sm">
                    {formatCurrency(booking.totalPrice.toNumber())}
                  </td>
                  <td className="py-3 px-5">
                    <BookingStatusBadge status={booking.status} />
                  </td>
                  <td className="py-3 px-5">
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 hover:border-blue-200 transition-colors whitespace-nowrap"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const statusFilter = params.status || "";
  const query = params.q || "";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Booking</h1>
          <p className="text-gray-500 text-sm mt-1">
            Pantau dan kelola semua pemesanan mobil
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <BookingSearchBar defaultValue={query} currentStatus={statusFilter} />
      </div>

      <Suspense fallback={<div className="flex gap-2">{Array.from({ length: 7 }).map((_, i) => <div key={i} className="h-9 w-28 bg-gray-100 rounded-lg animate-pulse" />)}</div>}>
        <BookingTabs />
      </Suspense>

      <BookingsTable statusFilter={statusFilter} query={query} />
    </div>
  );
}
