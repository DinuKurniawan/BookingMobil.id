"use client";

interface TopCar {
  id: string;
  name: string;
  brand: string;
  bookingCount: number;
  totalRevenue: number;
}

interface OccupancyData {
  totalCars: number;
  availableCars: number;
  maintenanceCars: number;
  inUseCars: number;
}

interface AnalyticsChartsProps {
  topCars: TopCar[];
  occupancy: OccupancyData;
}

export function AnalyticsCharts({ topCars, occupancy }: AnalyticsChartsProps) {
  const maxBookings = Math.max(...topCars.map((c) => c.bookingCount), 1);
  const occRate = occupancy.totalCars > 0
    ? Math.round((occupancy.inUseCars / occupancy.totalCars) * 100)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Top Cars */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Mobil Paling Sering Disewa
        </h3>

        {topCars.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">Belum ada data booking</p>
        ) : (
          <div className="space-y-2.5">
            {topCars.map((car, idx) => {
              const pct = Math.max((car.bookingCount / maxBookings) * 100, 2);
              return (
                <div key={car.id} className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-gray-400 w-5 text-right">#{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-gray-700 truncate">{car.name}</span>
                      <span className="text-[11px] text-gray-500 ml-2 flex-shrink-0">{car.bookingCount}x</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Occupancy Rate */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
          </svg>
          Tingkat Okupansi Armada
        </h3>

        <div className="flex items-center gap-5">
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8f0" strokeWidth="6" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="url(#occGradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${occRate * 0.88} 88`}
              />
              <defs>
                <linearGradient id="occGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-black text-gray-800">{occRate}%</span>
            </div>
          </div>

          <div className="flex-1 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                Tersedia
              </span>
              <span className="font-semibold text-gray-800">{occupancy.availableCars} mobil</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                Sedang Disewa
              </span>
              <span className="font-semibold text-gray-800">{occupancy.inUseCars} mobil</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-gray-600">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />
                Perawatan
              </span>
              <span className="font-semibold text-gray-800">{occupancy.maintenanceCars} mobil</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
