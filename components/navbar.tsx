"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/cars", label: "Armada" },
  { href: "/tentang-kami", label: "Tentang" },
  { href: "/faq", label: "FAQ" },
  { href: "/cek-booking", label: "Cek Booking" },
] as const;

export function Navbar() {
  const pathname = usePathname();
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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* ──── Topbar (info strip) ──── */}
      <div className="hidden lg:block bg-[#1A1A1A] text-[#FAFAF7]/60 text-[10px] uppercase tracking-[0.2em]">
        <div className="max-w-6xl mx-auto px-6 lg:px-10 h-9 flex items-center justify-between">
          <span>Jakarta · Bandung · Surabaya</span>
          <span className="flex items-center gap-4">
            <a href="tel:+628123456789" className="hover:text-[#FAFAF7] transition-colors">+62 812-3456-7890</a>
            <span className="text-[#FAFAF7]/25">·</span>
            <a href="mailto:info@bookingmobil.com" className="hover:text-[#FAFAF7] transition-colors">info@bookingmobil.com</a>
          </span>
        </div>
      </div>

      {/* ──── Main Navbar ──── */}
      <header className="sticky top-0 z-50 w-full bg-[#FAFAF7]/95 backdrop-blur-md border-b border-[#1A1A1A]/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-10 h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <span className="w-8 h-8 rounded-lg bg-[#1A1A1A] text-[#FAFAF7] flex items-center justify-center text-base group-hover:bg-[#1F4D3F] transition-colors">
              🚗
            </span>
            <span className="text-base tracking-tight" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              <span className="font-bold text-[#1A1A1A]">BookingMobil</span>
              <span className="font-bold text-[#1F4D3F]">.id</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7 text-[12px] font-semibold tracking-wide uppercase text-[#1A1A1A]/60">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 transition-colors hover:text-[#1A1A1A] ${
                  isActive(link.href) ? "text-[#1A1A1A]" : ""
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute left-0 right-0 -bottom-[17px] h-px bg-[#1F4D3F]" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {authChecked && (
              <Link
                href={isAuthenticated ? "/admin" : "/admin/login"}
                className="text-[12px] font-semibold uppercase tracking-wide text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
              >
                {isAuthenticated ? "Dashboard" : "Login"}
              </Link>
            )}
            <Link
              href="/cars"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1A1A1A] text-[#FAFAF7] text-[12px] font-semibold uppercase tracking-wide hover:bg-[#1F4D3F] transition-colors"
            >
              Sewa Sekarang
              <span className="text-base leading-none">→</span>
            </Link>
          </div>

          {/* Mobile: Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -mr-2 text-[#1A1A1A] hover:bg-[#1A1A1A]/5 rounded-lg transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1A1A1A]/10 bg-[#FAFAF7]">
            <nav className="flex flex-col px-6 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-3 text-sm font-semibold uppercase tracking-wide border-b border-[#1A1A1A]/8 transition-colors ${
                    isActive(link.href)
                      ? "text-[#1F4D3F]"
                      : "text-[#1A1A1A]/70 hover:text-[#1A1A1A]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="px-6 pb-6 pt-2 flex flex-col gap-2 border-t border-[#1A1A1A]/10">
              {authChecked && (
                <Link
                  href={isAuthenticated ? "/admin" : "/admin/login"}
                  className="text-center py-2.5 text-sm font-semibold uppercase tracking-wide text-[#1A1A1A] border border-[#1A1A1A]/15 rounded-full hover:bg-[#1A1A1A] hover:text-[#FAFAF7] transition-colors"
                >
                  {isAuthenticated ? "Dashboard" : "Login"}
                </Link>
              )}
              <Link
                href="/cars"
                className="text-center py-2.5 text-sm font-semibold uppercase tracking-wide bg-[#1A1A1A] text-[#FAFAF7] rounded-full hover:bg-[#1F4D3F] transition-colors"
              >
                Sewa Sekarang →
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
