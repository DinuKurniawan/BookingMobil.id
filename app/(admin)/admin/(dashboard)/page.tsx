import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/validations/car";
import { InlineBookingStatus } from "@/components/admin/inline-booking-status";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import { TimeSeriesChart } from "@/components/admin/time-series-chart";
import { unstable_cache } from "next/cache";
import Link from "next/link";

function formatDateShort(date: Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateRange(start: Date, end: Date) {
  const s = start.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  const e = end.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  return `${s} – ${e}`;
}

async function getTopCars() {
  const bookings = await prisma.booking.groupBy({
    by: ["carId"],
    where: { status: { notIn: ["CANCELLED", "REJECTED"] } },
    _count: { carId: true },
    orderBy: { _count: { carId: "desc" } },
    take: 5,
  });

  const cars = await prisma.car.findMany({
    where: { id: { in: bookings.map((b) => b.carId) } },
    select: { id: true, name: true, brand: true },
  });

  const carMap = new Map(cars.map((c) => [c.id, c]));

  return bookings.map((b) => {
    const car = carMap.get(b.carId);
    return {
      id: b.carId,
      name: car?.name ?? "?",
      brand: car?.brand ?? "",
      bookingCount: b._count.carId,
      totalRevenue: 0,
    };
  });
}

async function getOccupancy() {
  const [totalCars, availableCars, maintenanceCars, inUseCars] = await Promise.all([
    prisma.car.count(),
    prisma.car.count({ where: { status: "AVAILABLE" } }),
    prisma.car.count({ where: { status: "MAINTENANCE" } }),
    prisma.booking.count({ where: { status: { in: ["CONFIRMED", "ONGOING"] } } }),
  ]);

  return { totalCars, availableCars, maintenanceCars, inUseCars };
}

interface TimeSeriesPoint {
  date: string;
  label: string;
  bookings: number;
  revenue: number;
}

const getTimeSeriesData = unstable_cache(
  async (): Promise<{ weekly: TimeSeriesPoint[]; monthly: TimeSeriesPoint[]; yearly: TimeSeriesPoint[] }> => {
    const now = new Date();

    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const weekMap = new Map<string, TimeSeriesPoint>();
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart.getTime() + i * 86_400_000);
      const key = d.toISOString().split("T")[0];
      weekMap.set(key, { date: key, label: d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" }), bookings: 0, revenue: 0 });
    }

    const monthStart = new Date(now);
    monthStart.setDate(monthStart.getDate() - 29);
    monthStart.setHours(0, 0, 0, 0);

    const monthMap = new Map<string, TimeSeriesPoint>();
    for (let i = 0; i < 30; i++) {
      const d = new Date(monthStart.getTime() + i * 86_400_000);
      const key = d.toISOString().split("T")[0];
      monthMap.set(key, { date: key, label: d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }), bookings: 0, revenue: 0 });
    }

    const yStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const yEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const yMap = new Map<string, TimeSeriesPoint>();
    for (let i = 0; i < 12; i++) {
      const d = new Date(yStart.getFullYear(), yStart.getMonth() + i, 1);
      const key = d.toISOString().split("T")[0];
      yMap.set(key, { date: key, label: d.toLocaleDateString("id-ID", { month: "short", year: "numeric" }), bookings: 0, revenue: 0 });
    }

    const [dailyCounts, dailyRevenues, yCounts, yRevenues] = await Promise.all([
      prisma.$queryRawUnsafe<{ day: string; cnt: bigint }[]>(
        `SELECT "createdAt"::date::text AS day, COUNT(*)::bigint AS cnt FROM bookings WHERE "createdAt" >= $1::timestamp GROUP BY day ORDER BY day`,
        weekStart,
      ),
      prisma.$queryRawUnsafe<{ day: string; total: number }[]>(
        `SELECT "endDate"::date::text AS day, COALESCE(SUM("totalPrice"), 0) AS total FROM bookings WHERE status IN ('CONFIRMED','ONGOING','COMPLETED') AND "endDate" >= $1::timestamp GROUP BY day ORDER BY day`,
        weekStart,
      ),
      prisma.$queryRawUnsafe<{ month: string; cnt: bigint }[]>(
        `SELECT to_char("createdAt"::date, 'YYYY-MM') AS month, COUNT(*)::bigint AS cnt FROM bookings WHERE "createdAt" >= $1::timestamp AND "createdAt" < $2::timestamp GROUP BY month ORDER BY month`,
        yStart, yEnd,
      ),
      prisma.$queryRawUnsafe<{ month: string; total: number }[]>(
        `SELECT to_char("endDate"::date, 'YYYY-MM') AS month, COALESCE(SUM("totalPrice"), 0) AS total FROM bookings WHERE status IN ('CONFIRMED','ONGOING','COMPLETED') AND "endDate" >= $1::timestamp AND "endDate" < $2::timestamp GROUP BY month ORDER BY month`,
        yStart, yEnd,
      ),
    ]);

    for (const row of dailyCounts) {
      const w = weekMap.get(row.day); if (w) w.bookings = Number(row.cnt);
      const m = monthMap.get(row.day); if (m) m.bookings = Number(row.cnt);
    }
    for (const row of dailyRevenues) {
      const w = weekMap.get(row.day); if (w) w.revenue = row.total;
      const m = monthMap.get(row.day); if (m) m.revenue = row.total;
    }
    for (const row of yCounts) {
      const key = row.month + "-01"; const p = yMap.get(key); if (p) p.bookings = Number(row.cnt);
    }
    for (const row of yRevenues) {
      const key = row.month + "-01"; const p = yMap.get(key); if (p) p.revenue = row.total;
    }

    return { weekly: [...weekMap.values()], monthly: [...monthMap.values()], yearly: [...yMap.values()] };
  },
  ["admin-time-series"],
  { revalidate: 300, tags: ["time-series"] }
);

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(Number(params.page) || 1, 1);
  const pageSize = 10;
  const skip = (currentPage - 1) * pageSize;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const [
    totalBookings,
    todayBookings,
    pendingReviewCount,
    ongoingCount,
    confirmedCount,
    availableCars,
    totalCars,
    completedMonthRevenue,
    recentBookings,
    topCars,
    occupancy,
    timeSeriesData,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({
      where: {
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          lte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999),
        },
      },
    }),
    prisma.booking.count({ where: { status: "PAYMENT_REVIEW" } }),
    prisma.booking.count({ where: { status: "ONGOING" } }),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
    prisma.car.count({ where: { status: "AVAILABLE" } }),
    prisma.car.count(),
    prisma.booking.aggregate({
      _sum: { totalPrice: true },
      where: {
        status: { in: ["CONFIRMED", "ONGOING", "COMPLETED"] },
        endDate: { gte: startOfMonth, lte: endOfMonth },
      },
    }),
    prisma.booking.findMany({
      select: {
        id: true, bookingCode: true, customerName: true, customerPhone: true,
        startDate: true, endDate: true, totalPrice: true, status: true,
        car: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    }),
    getTopCars(),
    getOccupancy(),
    getTimeSeriesData(),
  ]);

  const revenueThisMonth = completedMonthRevenue._sum.totalPrice?.toNumber() ?? 0;
  const occupancyRate = totalCars > 0 ? Math.round((availableCars / totalCars) * 100) : 0;

  const statCards = [
    {
      label: "Review Pembayaran",
      value: pendingReviewCount,
      suffix: "booking",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "amber",
      href: "/admin/bookings?status=PAYMENT_REVIEW",
      badge: pendingReviewCount > 0 ? "Butuh tindakan" : "Aman",
      badgeDanger: pendingReviewCount > 0,
    },
    {
      label: "Booking Aktif",
      value: ongoingCount + confirmedCount,
      suffix: "sedang berjalan",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: "violet",
      href: "/admin/bookings",
      sub: `${ongoingCount} ongoing, ${confirmedCount} terkonfirmasi`,
    },
    {
      label: "Pendapatan Bulan Ini",
      value: formatCurrency(revenueThisMonth),
      suffix: "",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "emerald",
      href: null,
      sub: formatDateRange(startOfMonth, endOfMonth),
    },
    {
      label: "Armada Tersedia",
      value: `${availableCars} / ${totalCars}`,
      suffix: "mobil",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 3.75a2.25 2.25 0 00-2.25 2.25V6.75" />
        </svg>
      ),
      color: "sky",
      href: "/admin/cars",
      sub: `${occupancyRate}% okupansi`,
    },
  ];

  const totalPages = Math.ceil(totalBookings / pageSize);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Ringkasan Sistem</h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
            <span>{formatDateShort(now)}</span>
            <span className="text-slate-300">·</span>
            <span>{totalBookings} total booking</span>
            {todayBookings > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                +{todayBookings} hari ini
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-stretch">
        {statCards.map((stat) => {
          const colorMap: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
            amber:  { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", iconBg: "bg-amber-100 text-amber-600" },
            violet: { bg: "bg-violet-50", border: "border-violet-200", text: "text-violet-800", iconBg: "bg-violet-100 text-violet-600" },
            emerald:{ bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", iconBg: "bg-emerald-100 text-emerald-600" },
            sky:    { bg: "bg-sky-50", border: "border-sky-200", text: "text-sky-800", iconBg: "bg-sky-100 text-sky-600" },
          };
          const c = colorMap[stat.color] ?? colorMap.amber;

          const cardContent = (
            <div className={`h-full rounded-2xl border ${c.border} ${c.bg} p-5 transition-all duration-200 flex flex-col hover:shadow-md hover:scale-[1.02]`}>
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">{stat.label}</span>
                <span className={`w-9 h-9 rounded-xl ${c.iconBg} flex items-center justify-center flex-shrink-0`}>
                  {stat.icon}
                </span>
              </div>
              <div className={`text-2xl font-extrabold ${c.text} tracking-tight`}>
                {stat.value}
                {stat.suffix ? <span className="text-sm font-medium text-slate-500 ml-1">{stat.suffix}</span> : null}
              </div>
              {stat.sub && <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>}
              {stat.badge && (
                <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold border ${stat.badgeDanger ? "bg-red-100 text-red-700 border-red-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${stat.badgeDanger ? "bg-red-500" : "bg-emerald-500"}`} />
                  {stat.badge}
                </span>
              )}
            </div>
          );

          return stat.href ? (
            <Link key={stat.label} href={stat.href}>
              {cardContent}
            </Link>
          ) : (
            <div key={stat.label}>{cardContent}</div>
          );
        })}
      </div>

      {/* Analytics Charts (2 sections: Top Cars + Occupancy) */}
      <AnalyticsCharts topCars={topCars} occupancy={occupancy} />

      {/* Time Series Chart */}
      <TimeSeriesChart data={timeSeriesData} />

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Pemesanan Terbaru</h3>
            <p className="text-xs text-slate-400 mt-0.5">{totalBookings} total booking</p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Lihat Semua →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm font-medium">Belum ada booking masuk</p>
            <p className="text-slate-400 text-xs mt-1">Booking baru akan muncul di sini</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Kode</th>
                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Pelanggan</th>
                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mobil</th>
                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</th>
                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-6">
                        <Link
                          href={`/admin/bookings/${booking.id}`}
                          className="font-mono font-semibold text-blue-600 hover:text-blue-700 text-xs transition-colors"
                        >
                          {booking.bookingCode}
                        </Link>
                      </td>
                      <td className="py-3.5 px-6">
                        <p className="font-semibold text-slate-900 text-xs">{booking.customerName}</p>
                        <p className="text-xs text-slate-400">{booking.customerPhone}</p>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className="text-slate-700 font-medium text-xs">{booking.car.name}</span>
                      </td>
                      <td className="py-3.5 px-6 whitespace-nowrap text-xs text-slate-600">
                        {formatDateShort(booking.startDate)} → {formatDateShort(booking.endDate)}
                      </td>
                      <td className="py-3.5 px-6 font-semibold text-slate-900 text-xs whitespace-nowrap">
                        {formatCurrency(booking.totalPrice.toNumber())}
                      </td>
                      <td className="py-3.5 px-6">
                        <InlineBookingStatus bookingId={booking.id} currentStatus={booking.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 bg-slate-50/50">
              <span className="text-xs text-slate-500">
                {skip + 1}–{Math.min(skip + pageSize, totalBookings)} dari {totalBookings}
              </span>
              <div className="flex items-center gap-1">
                {currentPage > 1 ? (
                  <Link
                    href={`/admin?page=${currentPage - 1}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
                  >
                    ← Sebelumnya
                  </Link>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg text-xs text-slate-300 bg-slate-100 border border-slate-200 cursor-not-allowed select-none">
                    ← Sebelumnya
                  </span>
                )}

                {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Link
                      key={pageNum}
                      href={`/admin?page=${pageNum}`}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors ${
                        pageNum === currentPage
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 bg-white hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}

                {skip + pageSize < totalBookings ? (
                  <Link
                    href={`/admin?page=${currentPage + 1}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 transition-colors"
                  >
                    Selanjutnya →
                  </Link>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg text-xs text-slate-300 bg-slate-100 border border-slate-200 cursor-not-allowed select-none">
                    Selanjutnya →
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
