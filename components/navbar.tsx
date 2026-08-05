"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        setIsAuthenticated(data.authenticated === true);
        setAuthChecked(true);
      })
      .catch(() => setAuthChecked(true));
  }, []);

  const loginButton = (
    <Link href={isAuthenticated ? "/admin" : "/admin/login"}>
      <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50">
        {isAuthenticated ? "Dashboard" : "Login"}
      </Button>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-black tracking-tight text-blue-600 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-600/30">
              🚗
            </div>
            <span>
              BookingMobil<span className="text-slate-900">.id</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link href="/" className="hover:text-blue-600 transition-colors">
              Beranda
            </Link>
            <Link href="/cars" className="hover:text-blue-600 transition-colors">
              Armada Mobil
            </Link>
            <Link href="/tentang-kami" className="hover:text-blue-600 transition-colors">
              Tentang Kami
            </Link>
            <Link href="/faq" className="hover:text-blue-600 transition-colors">
              FAQ
            </Link>
            <Link href="/cek-booking" className="hover:text-blue-600 transition-colors">
              Cek Status Booking
            </Link>
          </nav>
        </div>

        {/* Action Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/cek-booking">
            <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 bg-blue-50/50 hover:bg-blue-100 font-semibold">
              🔍 Cek Booking
            </Button>
          </Link>
          {authChecked ? (
            loginButton
          ) : (
            <div className="h-8 w-20 rounded-lg bg-slate-100 animate-pulse" />
          )}
          <Link href="/cars">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20">
              Sewa Sekarang
            </Button>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-4 shadow-lg animate-[fadeIn_0.2s_ease-out]">
          <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-700">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/cars"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              Armada Mobil
            </Link>
            <Link
              href="/tentang-kami"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              Tentang Kami
            </Link>
            <Link
              href="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              FAQ / Bantuan
            </Link>
            <Link
              href="/cek-booking"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              🔍 Cek Status Booking
            </Link>
          </nav>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href={isAuthenticated ? "/admin" : "/admin/login"}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button variant="outline" size="sm" className="w-full justify-center">
                {isAuthenticated ? "Dashboard" : "Login"}
              </Button>
            </Link>
            <Link href="/cars" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full justify-center bg-blue-600 hover:bg-blue-500">
                Sewa Sekarang
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
