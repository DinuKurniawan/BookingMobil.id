"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin-sidebar";

interface AdminDashboardLayoutClientProps {
  children: React.ReactNode;
  currentAdminName: string;
  initial: string;
  pendingTestimonials: number;
}

export function AdminDashboardLayoutClient({
  children,
  currentAdminName,
  initial,
  pendingTestimonials,
}: AdminDashboardLayoutClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar
        pendingTestimonials={pendingTestimonials}
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
      />

      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Header */}
        <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">

            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <h2 className="text-sm font-semibold text-slate-700">Dashboard Admin</h2>
            </div>
            <span className="hidden sm:inline text-slate-300">|</span>
            <p className="text-xs text-slate-500 truncate">
              Selamat datang, <span className="font-semibold text-slate-700">{currentAdminName || "Administrator"}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick action buttons */}
            <a
              href="/admin/bookings?status=PAYMENT_REVIEW"
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Review Pembayaran
            </a>

            {/* Admin avatar */}
            <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-slate-200">
              <div className="text-right leading-tight hidden sm:block">
                <p className="text-xs font-semibold text-slate-800">{currentAdminName || "Admin"}</p>
                <p className="text-[10px] text-slate-400">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-blue-500/20 flex-shrink-0">
                {initial}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
