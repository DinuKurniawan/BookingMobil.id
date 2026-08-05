"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/bookings", label: "Kelola Booking", exact: false },
  { href: "/admin/cars", label: "Kelola Mobil", exact: false },
  { href: "/admin/users", label: "Pengguna", exact: false },
  { href: "/admin/settings", label: "Pengaturan", exact: true },
] as const;

interface AdminSidebarProps {
  pendingTestimonials: number;
}

export function AdminSidebar({ pendingTestimonials }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <aside className="w-64 border-r border-gray-200 bg-gray-900 text-gray-300 min-h-screen flex flex-col justify-between">
      <div>
        <div className="p-6 border-b border-gray-800">
          <Link href="/admin" className="text-xl font-bold text-white tracking-wide">
            Admin<span className="text-blue-500">Panel</span>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white bg-blue-600 hover:bg-blue-700"
                    : "hover:bg-gray-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="pt-3 mt-3 border-t border-gray-800 px-4">
          <Link
            href="/admin/testimonials"
            className="flex items-center justify-between py-2 px-2 rounded-lg text-xs hover:bg-gray-800 hover:text-white transition-colors text-gray-400"
          >
            <span>⭐ Testimoni</span>
            {pendingTestimonials > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white">
                {pendingTestimonials}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <Link
          href="/"
          className="flex items-center justify-center w-full px-4 py-2 text-xs font-semibold rounded-lg text-gray-400 bg-gray-800 hover:bg-gray-700 hover:text-white transition-colors"
        >
          &larr; Kembali ke Website
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-full px-4 py-2 text-xs font-semibold rounded-lg text-red-400 bg-red-950/40 hover:bg-red-900/60 hover:text-white border border-red-900/50 transition-colors cursor-pointer"
        >
          Keluar (Logout)
        </button>
      </div>
    </aside>
  );
}
