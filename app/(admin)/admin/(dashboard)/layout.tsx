import React from "react";
import { AdminDashboardLayoutClient } from "@/components/admin-dashboard-layout-client";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const currentAdmin = await getCurrentAdmin();
  const pendingTestimonials = await prisma.testimonial.count({
    where: { isApproved: false },
  });

  const initial = currentAdmin?.name
    ? currentAdmin.name.charAt(0).toUpperCase()
    : "A";

  return (
    <AdminDashboardLayoutClient
      currentAdminName={currentAdmin?.name || "Administrator"}
      initial={initial}
      pendingTestimonials={pendingTestimonials}
    >
      {children}
    </AdminDashboardLayoutClient>
  );
}
