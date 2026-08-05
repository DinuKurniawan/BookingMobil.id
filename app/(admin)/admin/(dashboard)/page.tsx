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

    // Build date index maps (no DB queries yet)
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const weekMap = new Map<string, TimeSeriesPoint>();
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart.getTime() + i * 86_400_000);
      const key = d.toISOString().split("T")[0];
      weekMap.set(key, {
        date: key,
        label: d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric" }),
        bookings: 0,
        revenue: 0,
      });
    }

    const monthStart = new Date(now);
    monthStart.setDate(monthStart.getDate() - 29);
    monthStart.setHours(0, 0, 0, 0);

    const monthMap = new Map<string, TimeSeriesPoint>();
    for (let i = 0; i < 30; i++) {
      const d = new Date(monthStart.getTime() + i * 86_400_000);
      const key = d.toISOString().split("T")[0];
      monthMap.set(key, {
        date: key,
        label: d.toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
        bookings: 0,
        revenue: 0,
      });
    }

    const yStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    const yEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const yMap = new Map<string, TimeSeriesPoint>();
    for (let i = 0; i < 12; i++) {
      const d = new Date(yStart.getFullYear(), yStart.getMonth() + i, 1);
      const key = d.toISOString().split("T")[0];
      yMap.set(key, {
        date: key,
        label: d.toLocaleDateString("id-ID", { month: "short", year: "numeric" }),
        bookings: 0,
        revenue: 0,
      });
    }

    // Only 3 raw queries total (replaces 98 individual queries)

    const [dailyCounts, dailyRevenues, yCounts, yRevenues] = await Promise.all([
      prisma.$queryRawUnsafe<{ day: string; cnt: bigint }[]>(
        `SELECT "createdAt"::date::text AS day, COUNT(*)::bigint AS cnt
         FROM bookings
         WHERE "createdAt" >= $1::timestamp
         GROUP BY day ORDER BY day`,
        weekStart,
      ),
      prisma.$queryRawUnsafe<{ day: string; total: number }[]>(
        `SELECT "endDate"::date::text AS day, COALESCE(SUM("totalPrice"), 0) AS total
         FROM bookings
         WHERE status IN ('CONFIRMED','ONGOING','COMPLETED')
           AND "endDate" >= $1::timestamp
         GROUP BY day ORDER BY day`,
        weekStart,
      ),
      prisma.$queryRawUnsafe<{ month: string; cnt: bigint }[]>(
        `SELECT to_char("createdAt"::date, 'YYYY-MM') AS month, COUNT(*)::bigint AS cnt
         FROM bookings
         WHERE "createdAt" >= $1::timestamp AND "createdAt" < $2::timestamp
         GROUP BY month ORDER BY month`,
        yStart,
        yEnd,
      ),
      prisma.$queryRawUnsafe<{ month: string; total: number }[]>(
        `SELECT to_char("endDate"::date, 'YYYY-MM') AS month, COALESCE(SUM("totalPrice"), 0) AS total
         FROM bookings
         WHERE status IN ('CONFIRMED','ONGOING','COMPLETED')
           AND "endDate" >= $1::timestamp AND "endDate" < $2::timestamp
         GROUP BY month ORDER BY month`,
        yStart,
        yEnd,
      ),
    ]);

    for (const row of dailyCounts) {
      const w = weekMap.get(row.day);
      if (w) w.bookings = Number(row.cnt);
      const m = monthMap.get(row.day);
      if (m) m.bookings = Number(row.cnt);
    }
    for (const row of dailyRevenues) {
      const w = weekMap.get(row.day);
      if (w) w.revenue = row.total;
      const m = monthMap.get(row.day);
      if (m) m.revenue = row.total;
    }
    for (const row of yCounts) {
      const key = row.month + "-01";
      const p = yMap.get(key);
      if (p) p.bookings = Number(row.cnt);
    }
    for (const row of yRevenues) {
      const key = row.month + "-01";
      const p = yMap.get(key);
      if (p) p.revenue = row.total;
    }

    return {
      weekly: [...weekMap.values()],
      monthly: [...monthMap.values()],
      yearly: [...yMap.values()],
    };
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
        id: true,
        bookingCode: true,
        customerName: true,
        customerPhone: true,
        startDate: true,
        endDate: true,
        totalPrice: true,
        status: true,
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

  const stats = [
    {
      title: "Review Pembayaran",
      value: pendingReviewCount.toString(),
      sub: "Menunggu verifikasi",
      color: "bg-blue-50 border-blue-100 text-blue-900",
      iconColor: "text-blue-500",
      href: "/admin/bookings?status=PAYMENT_REVIEW",
    },
    {
      title: "Booking Aktif (Ongoing)",
      value: ongoingCount.toString(),
      sub: `${confirmedCount} terkonfirmasi menunggu`,
      color: "bg-violet-50 border-violet-100 text-violet-900",
      iconColor: "text-violet-500",
      href: "/admin/bookings?status=ONGOING",
    },
    {
      title: "Pendapatan Bulan Ini",
      value: formatCurrency(revenueThisMonth),
      sub: `Dari booking aktif ${formatDateShort(startOfMonth)} – ${formatDateShort(endOfMonth)}`,
      color: "bg-emerald-50 border-emerald-100 text-emerald-900",
      iconColor: "text-emerald-500",
      href: null,
    },
    {
      title: "Armada Tersedia",
      value: `${availableCars}/${totalCars}`,
      sub: "Mobil siap sewa",
      color: "bg-amber-50 border-amber-100 text-amber-900",
      iconColor: "text-amber-500",
      href: "/admin/cars",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ringkasan Sistem</h1>
        <p className="text-gray-500 text-sm mt-1">
          {formatDateShort(now)} · Total {totalBookings} booking terdaftar
          {todayBookings > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full text-[11px] font-bold bg-green-100 text-green-700 border border-green-200">
              +{todayBookings} booking hari ini
            </span>
          )}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) =>
          stat.href ? (
            <Link
              key={stat.title}
              href={stat.href}
              className={`rounded-xl border p-5 shadow-sm ${stat.color} space-y-2 block hover:shadow-md transition-shadow`}
            >
              <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">
                {stat.title}
              </p>
              <p className="text-2xl font-extrabold">{stat.value}</p>
              <p className="text-xs opacity-70">{stat.sub}</p>
            </Link>
          ) : (
            <div
              key={stat.title}
              className={`rounded-xl border p-5 shadow-sm ${stat.color} space-y-2`}
            >
              <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">
                {stat.title}
              </p>
              <p className="text-2xl font-extrabold">{stat.value}</p>
              <p className="text-xs opacity-70">{stat.sub}</p>
            </div>
          )
        )}
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts
        topCars={topCars}
        occupancy={occupancy}
      />

      {/* Time Series Chart with Weekly/Monthly/Yearly Toggle */}
      <TimeSeriesChart data={timeSeriesData} />

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">Pemesanan Terbaru</h3>
          <Link
            href="/admin/bookings"
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Lihat Semua →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">
            Belum ada booking masuk.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-700 text-xs font-semibold uppercase">
                  <tr>
                    <th className="py-3 px-4">Kode</th>
                    <th className="py-3 px-4">Pelanggan</th>
                    <th className="py-3 px-4">Mobil</th>
                    <th className="py-3 px-4">Tanggal Sewa</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/bookings/${booking.id}`}
                          className="font-mono font-semibold text-blue-600 hover:underline text-xs"
                        >
                          {booking.bookingCode}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-gray-900 text-xs">{booking.customerName}</p>
                        <p className="text-xs text-gray-400">{booking.customerPhone}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-800 font-medium text-xs">{booking.car.name}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-xs">
                        {formatDateShort(booking.startDate)} → {formatDateShort(booking.endDate)}
                      </td>
                      <td className="py-3 px-4 font-semibold text-gray-900 text-xs whitespace-nowrap">
                        {formatCurrency(booking.totalPrice.toNumber())}
                      </td>
                      <td className="py-3 px-4">
                        <InlineBookingStatus bookingId={booking.id} currentStatus={booking.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Menampilkan {skip + 1}–{Math.min(skip + pageSize, totalBookings)} dari {totalBookings} booking
              </span>
              <div className="flex items-center gap-1">
                {currentPage > 1 ? (
                  <Link
                    href={`/admin?page=${currentPage - 1}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors"
                  >
                    ← Sebelumnya
                  </Link>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg text-xs text-gray-300 bg-gray-50 border border-gray-100 cursor-not-allowed">
                    ← Sebelumnya
                  </span>
                )}

                {Array.from({ length: Math.min(Math.ceil(totalBookings / pageSize), 5) }).map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <Link
                      key={pageNum}
                      href={`/admin?page=${pageNum}`}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}

                {skip + pageSize < totalBookings ? (
                  <Link
                    href={`/admin?page=${currentPage + 1}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200 transition-colors"
                  >
                    Selanjutnya →
                  </Link>
                ) : (
                  <span className="px-3 py-1.5 rounded-lg text-xs text-gray-300 bg-gray-50 border border-gray-100 cursor-not-allowed">
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
