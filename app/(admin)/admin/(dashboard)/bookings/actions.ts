"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { sendBookingEmail } from "@/lib/email";

const bookingStatusSchema = z.enum([
  "PENDING",
  "PAYMENT_REVIEW",
  "CONFIRMED",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
]);

// ---------------------------------------------------------------------------
// approvePayment — PAYMENT_REVIEW → CONFIRMED
// If proofId is provided, approve that specific proof. Otherwise approve all pending proofs.
// ---------------------------------------------------------------------------
export async function approvePayment(
  proofId: string,
  bookingId: string
): Promise<{ success: boolean; message: string }> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { car: true, paymentProofs: { orderBy: { createdAt: "desc" } } },
  });

  if (!booking) {
    return { success: false, message: "Booking tidak ditemukan" };
  }

  if (booking.status !== "PAYMENT_REVIEW") {
    return { success: false, message: "Booking tidak dalam status review pembayaran" };
  }

  const pendingProofs = proofId
    ? booking.paymentProofs.filter((p) => p.id === proofId && p.status === "PENDING")
    : booking.paymentProofs.filter((p) => p.status === "PENDING");

  if (pendingProofs.length === 0) {
    return { success: false, message: "Tidak ada bukti pembayaran pending yang bisa disetujui" };
  }

  const now = new Date();

  await prisma.$transaction([
    ...pendingProofs.map((p) =>
      prisma.paymentProof.update({
        where: { id: p.id },
        data: {
          status: "APPROVED",
          verifiedAt: now,
          verifiedByAdminId: admin.id,
        },
      })
    ),
    prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CONFIRMED" },
    }),
  ]);

  sendBookingEmail({
    type: "payment-approved",
    to: booking.customerEmail,
    customerName: booking.customerName,
    bookingCode: booking.bookingCode,
    carName: booking.car?.name ?? "",
    startDate: booking.startDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    endDate: booking.endDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    totalDays: booking.totalDays,
    totalPrice: booking.totalPrice.toNumber(),
  });

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath(`/booking/${booking.bookingCode}`);

  return { success: true, message: "Pembayaran disetujui, booking terkonfirmasi." };
}

// ---------------------------------------------------------------------------
// rejectPayment — PAYMENT_REVIEW → PENDING (supaya customer bisa reupload)
// ---------------------------------------------------------------------------
export async function rejectPayment(
  proofId: string,
  bookingId: string,
  reason: string
): Promise<{ success: boolean; message: string }> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  if (!reason || reason.trim().length === 0) {
    return { success: false, message: "Alasan penolakan wajib diisi" };
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { car: true, paymentProofs: { orderBy: { createdAt: "desc" } } },
  });

  if (!booking) {
    return { success: false, message: "Booking tidak ditemukan" };
  }

  if (booking.status !== "PAYMENT_REVIEW") {
    return { success: false, message: "Booking tidak dalam status review pembayaran" };
  }

  const pendingProofs = proofId
    ? booking.paymentProofs.filter((p) => p.id === proofId && p.status === "PENDING")
    : booking.paymentProofs.filter((p) => p.status === "PENDING");

  if (pendingProofs.length === 0) {
    return { success: false, message: "Tidak ada bukti pembayaran pending yang bisa ditolak" };
  }

  const now = new Date();

  await prisma.$transaction([
    ...pendingProofs.map((p) =>
      prisma.paymentProof.update({
        where: { id: p.id },
        data: {
          status: "REJECTED",
          verifiedAt: now,
          verifiedByAdminId: admin.id,
          rejectionReason: reason.trim(),
        },
      })
    ),
    prisma.booking.update({
      where: { id: bookingId },
      data: { status: "PENDING" },
    }),
  ]);

  // Email pemberitahuan penolakan ke customer
  sendBookingEmail({
    type: "payment-rejected",
    to: booking.customerEmail,
    customerName: booking.customerName,
    bookingCode: booking.bookingCode,
    reason: reason.trim(),
    totalPrice: booking.totalPrice.toNumber(),
  });

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath(`/booking/${booking.bookingCode}`);

  return { success: true, message: "Pembayaran ditolak, customer dapat mengupload ulang." };
}

// ---------------------------------------------------------------------------
// startRental — CONFIRMED → ONGOING (hanya jika sudah lewat tanggal mulai)
// ---------------------------------------------------------------------------
export async function startRental(
  bookingId: string
): Promise<{ success: boolean; message: string }> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { car: true } });
  if (!booking) {
    return { success: false, message: "Booking tidak ditemukan" };
  }

  if (booking.status !== "CONFIRMED") {
    return { success: false, message: "Booking belum terkonfirmasi" };
  }

  if (new Date(booking.startDate) > new Date()) {
    return { success: false, message: "Belum bisa memulai sewa: tanggal mulai belum tiba" };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "ONGOING" },
  });

  sendBookingEmail({
    type: "rental-started",
    to: booking.customerEmail,
    customerName: booking.customerName,
    bookingCode: booking.bookingCode,
    carName: booking.car?.name ?? "",
  });

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath(`/booking/${booking.bookingCode}`);

  return { success: true, message: "Sewa dimulai, status ONGOING." };
}

// ---------------------------------------------------------------------------
// completeRental — ONGOING → COMPLETED (hanya jika sudah lewat tanggal selesai)
// ---------------------------------------------------------------------------
export async function completeRental(
  bookingId: string
): Promise<{ success: boolean; message: string }> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { car: true } });
  if (!booking) {
    return { success: false, message: "Booking tidak ditemukan" };
  }

  if (booking.status !== "ONGOING") {
    return { success: false, message: "Booking tidak dalam status sewa berlangsung" };
  }

  if (new Date(booking.endDate) > new Date()) {
    return { success: false, message: "Belum bisa menyelesaikan sewa: tanggal selesai belum tiba" };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "COMPLETED" },
  });

  sendBookingEmail({
    type: "rental-completed",
    to: booking.customerEmail,
    customerName: booking.customerName,
    bookingCode: booking.bookingCode,
    carName: booking.car?.name ?? "",
  });

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath(`/booking/${booking.bookingCode}`);

  return { success: true, message: "Sewa diselesaikan, status COMPLETED." };
}

// ---------------------------------------------------------------------------
// cancelBooking — bisa kapan saja sebelum COMPLETED
// ---------------------------------------------------------------------------
export async function cancelBooking(
  bookingId: string
): Promise<{ success: boolean; message: string }> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const booking = await prisma.booking.findUnique({ where: { id: bookingId }, include: { car: true } });
  if (!booking) {
    return { success: false, message: "Booking tidak ditemukan" };
  }

  if (booking.status === "COMPLETED" || booking.status === "CANCELLED") {
    return { success: false, message: "Booking sudah selesai atau sudah dibatalkan" };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });

  sendBookingEmail({
    type: "booking-cancelled",
    to: booking.customerEmail,
    customerName: booking.customerName,
    bookingCode: booking.bookingCode,
    carName: booking.car?.name ?? "",
  });

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath(`/booking/${booking.bookingCode}`);

  return { success: true, message: "Booking berhasil dibatalkan." };
}

// ---------------------------------------------------------------------------
// updateBookingStatus — fallback untuk transisi umum (jika diperlukan)
// ---------------------------------------------------------------------------
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["PAYMENT_REVIEW", "CANCELLED", "REJECTED"],
  PAYMENT_REVIEW: ["PENDING", "CONFIRMED"],
  CONFIRMED: ["ONGOING", "CANCELLED"],
  ONGOING: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
  REJECTED: [],
};

export async function updateBookingStatus(
  bookingId: string,
  rawStatus: string
): Promise<{ success: boolean; message: string }> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = bookingStatusSchema.safeParse(rawStatus);
  if (!parsed.success) {
    return { success: false, message: "Status booking tidak valid" };
  }

  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) {
    return { success: false, message: "Booking tidak ditemukan" };
  }

  const allowed = ALLOWED_TRANSITIONS[booking.status] ?? [];
  if (!allowed.includes(parsed.data)) {
    return {
      success: false,
      message: `Tidak dapat mengubah status dari ${booking.status} ke ${parsed.data}`,
    };
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: parsed.data },
  });

  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath(`/booking/${booking.bookingCode}`);

  return { success: true, message: "Status booking berhasil diperbarui" };
}
