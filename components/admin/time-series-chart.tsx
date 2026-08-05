"use client";

import { useState } from "react";

interface TimeSeriesPoint {
  date: string;
  label: string;
  bookings: number;
  revenue: number;
}

interface TimeSeriesChartProps {
  data: {
    weekly: TimeSeriesPoint[];
    monthly: TimeSeriesPoint[];
    yearly: TimeSeriesPoint[];
  };
}

type RangeKey = "weekly" | "monthly" | "yearly";

const RANGE_OPTIONS: { key: RangeKey; label: string; icon: string }[] = [
  { key: "weekly", label: "Minggu", icon: "📅" },
  { key: "monthly", label: "Bulan", icon: "📆" },
  { key: "yearly", label: "Tahun", icon: "📊" },
];

function formatRupiahShort(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toLocaleString("id-ID");
}

export function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  const [range, setRange] = useState<RangeKey>("monthly");
  const [showRevenue, setShowRevenue] = useState(true);

  const points = data[range];

  const maxBookings = Math.max(...points.map((p) => p.bookings), 1);
  const maxRevenue = Math.max(...points.map((p) => p.revenue), 1);

  const totalBookings = points.reduce((sum, p) => sum + p.bookings, 0);
  const totalRevenue = points.reduce((sum, p) => sum + p.revenue, 0);

  // SVG chart dimensions
  const svgWidth = 100;
  const svgHeight = 40;
  const padding = 1;
  const chartW = svgWidth - padding * 2;
  const chartH = svgHeight - padding * 2;

  // Generate SVG polyline points
  const bookingsPoints = points
    .map(
      (p, i) =>
        `${padding + (i / Math.max(points.length - 1, 1)) * chartW},${
          padding + chartH - (p.bookings / maxBookings) * chartH
        }`
    )
    .join(" ");

  const revenuePoints = points
    .map(
      (p, i) =>
        `${padding + (i / Math.max(points.length - 1, 1)) * chartW},${
          padding + chartH - (p.revenue / maxRevenue) * chartH
        }`
    )
    .join(" ");

  // Bar widths
  const barGap = 2;
  const totalBars = points.length * 2;
  const barW = Math.max((svgWidth - padding * 2 - (totalBars - 1) * barGap) / totalBars, 0.5);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
      {/* Header with toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
          <svg
            className="w-4 h-4 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Grafik Booking &amp; Pendapatan
        </h3>

        <div className="flex items-center gap-2">
          {/* Range toggle */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {RANGE_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setRange(opt.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  range === opt.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="hidden sm:inline mr-1">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>

          {/* Revenue toggle */}
          <button
            type="button"
            onClick={() => setShowRevenue(!showRevenue)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              showRevenue
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-gray-50 text-gray-500 border-gray-200"
            }`}
          >
            💰 Rp
          </button>
        </div>
      </div>

      {/* Summary numbers */}
      <div className="flex gap-6 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
          <span className="text-gray-500">
            Total Booking: <strong className="text-gray-800">{totalBookings}</strong>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          <span className="text-gray-500">
            Total Pendapatan:{" "}
            <strong className="text-gray-800">Rp {totalRevenue.toLocaleString("id-ID")}</strong>
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-64"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
            <line
              key={pct}
              x1={padding}
              x2={svgWidth - padding}
              y1={padding + chartH - pct * chartH}
              y2={padding + chartH - pct * chartH}
              stroke="#f1f5f9"
              strokeWidth="0.3"
            />
          ))}

          {/* Bar chart: bookings */}
          {points.map((p, i) => {
            const x = padding + i * ((svgWidth - padding * 2) / Math.max(points.length - 1, 1));
            const h = (p.bookings / maxBookings) * chartH * 0.9;
            const w = barW;
            return (
              <rect
                key={`b-${i}`}
                x={x - w / 2}
                y={padding + chartH - h}
                width={w}
                height={h}
                rx="0.3"
                fill="url(#bookingGrad)"
                opacity="0.85"
              />
            );
          })}

          {/* Bar chart: revenue */}
          {showRevenue &&
            points.map((p, i) => {
              const x = padding + i * ((svgWidth - padding * 2) / Math.max(points.length - 1, 1));
              const h = (p.revenue / maxRevenue) * chartH * 0.9;
              const w = barW;
              return (
                <rect
                  key={`r-${i}`}
                  x={x + w * 0.6}
                  y={padding + chartH - h}
                  width={w}
                  height={h}
                  rx="0.3"
                  fill="url(#revenueGrad)"
                  opacity="0.7"
                />
              );
            })}

          {/* Gradient defs */}
          <defs>
            <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#93c5fd" />
            </linearGradient>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#6ee7b7" />
            </linearGradient>
          </defs>
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-1 px-1">
          {points.map((p, i) => {
            // Show limited labels to avoid crowding
            const showLabel =
              range === "weekly" ||
              (range === "monthly" && i % 5 === 0) ||
              (range === "yearly" && i % 2 === 0);

            return (
              <span
                key={p.date}
                className="text-[10px] text-gray-400 text-center leading-tight"
                style={{ width: `${100 / points.length}%` }}
              >
                {showLabel ? p.label : ""}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
