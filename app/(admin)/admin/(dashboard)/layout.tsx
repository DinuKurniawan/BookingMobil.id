import React from "react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const currentAdmin = await getCurrentAdmin();
  const pendingTestimonials = await prisma.testimonial.count({
    where: { isApproved: false },
  });

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar pendingTestimonials={pendingTestimonials} />
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h2 className="text-lg font-bold text-gray-800">Dashboard Panel Admin</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              {currentAdmin?.name || "Administrator"}
            </span>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              {currentAdmin?.name ? currentAdmin.name.charAt(0).toUpperCase() : "A"}
            </div>
          </div>
        </header>
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}
