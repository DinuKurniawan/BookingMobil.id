import { Resend } from "resend";
import { ADMIN_NOTIFICATION_EMAIL, getBankAccounts, EMAIL_FROM } from "@/lib/config";

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------
export type BookingEmailType =
  | "booking-created-admin"
  | "booking-created-customer"
  | "payment-proof-admin"
  | "payment-approved"
  | "payment-rejected"
  | "booking-cancelled"
  | "rental-started"
  | "rental-completed";

export interface BookingEmailBase {
  type: BookingEmailType;
}

export type BookingEmailData =
  | (BookingEmailBase & { type: "booking-created-admin"; bookingId: string; bookingCode: string; customerName: string; customerPhone: string; customerEmail: string; carName: string; startDate: string; endDate: string; totalDays: number; totalPrice: number })
  | (BookingEmailBase & { type: "booking-created-customer"; to: string; customerName: string; bookingCode: string; carName: string; startDate: string; endDate: string; totalDays: number; totalPrice: number })
  | (BookingEmailBase & { type: "payment-proof-admin"; bookingId: string; bookingCode: string; customerName: string; customerPhone: string; carName: string; startDate: string; endDate: string; totalDays: number; totalPrice: number; paymentProofUrl: string })
  | (BookingEmailBase & { type: "payment-approved"; to: string; customerName: string; bookingCode: string; carName: string; startDate: string; endDate: string; totalDays: number; totalPrice: number })
  | (BookingEmailBase & { type: "payment-rejected"; to: string; customerName: string; bookingCode: string; reason: string; totalPrice: number })
  | (BookingEmailBase & { type: "booking-cancelled"; to: string; customerName: string; bookingCode: string; carName: string })
  | (BookingEmailBase & { type: "rental-started"; to: string; customerName: string; bookingCode: string; carName: string })
  | (BookingEmailBase & { type: "rental-completed"; to: string; customerName: string; bookingCode: string; carName: string });

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

function dispatch(html: string, opts: { to: string; subject: string; label: string }) {
  const { to, subject, label } = opts;
  console.log(`📧 [${label}] "${subject}" → ${to}`);

  const resend = getResend();
  if (!resend) return;

  resend.emails
    .send({ from: EMAIL_FROM, to, subject, html })
    .then(({ error }) => {
      if (error) console.error(`[RESEND ERROR] ${label}:`, error);
      else console.log(`[RESEND OK] ${label} → ${to}`);
    })
    .catch((err) => console.error(`[RESEND ERROR] ${label}:`, err));
}

// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------
const HEADER_BLUE = 'background:#1e40af;padding:24px 24px 20px;border-radius:8px 8px 0 0';
const HEADER_GREEN = 'background:#059669;padding:24px 24px 20px;border-radius:8px 8px 0 0';
const BODY = 'background:#f8fafc;padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px';
const FOOTER = 'padding:16px 24px;text-align:center;font-size:11px;color:#94a3b8';

function customerLayout(headerHtml: string, bodyHtml: string): string {
  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px 16px;background:#f1f5f9">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#ffffff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.08)">
    <tr><td style="${HEADER_BLUE}">${headerHtml}</td></tr>
    <tr><td style="${BODY}">${bodyHtml}</td></tr>
    <tr><td style="${FOOTER}">Email otomatis — mohon tidak membalas.</td></tr>
  </table>
</div>`;
}

function adminLayout(headerBg: string, headerHtml: string, bodyHtml: string): string {
  return `
<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px 16px;background:#f1f5f9">
  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#ffffff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.08)">
    <tr><td style="${headerBg}">${headerHtml}</td></tr>
    <tr><td style="${BODY}">${bodyHtml}</td></tr>
    <tr><td style="${FOOTER}">Email otomatis — mohon tidak membalas.</td></tr>
  </table>
</div>`;
}

function infoRow(label: string, value: string, valueColor = "#1e293b"): string {
  return `<tr>
    <td style="padding:5px 0;color:#64748b;font-size:13px;vertical-align:top;width:130px">${label}</td>
    <td style="padding:5px 0;font-size:13px;font-weight:600;color:${valueColor}">${value}</td>
  </tr>`;
}

function pill(text: string, bg = "#fef3c7", color = "#92400e"): string {
  return `<span style="display:inline-block;padding:3px 10px;border-radius:12px;font-size:12px;font-weight:700;background:${bg};color:${color}">${text}</span>`;
}

function button(text: string, href: string, bg = "#1e40af", color = "#ffffff"): string {
  return `<a href="${href}" style="display:inline-block;margin-top:16px;padding:12px 28px;background:${bg};color:${color};text-decoration:none;border-radius:6px;font-size:14px;font-weight:600">${text}</a>`;
}

function divider(): string {
  return '<hr style="border:none;border-top:1px solid #e2e8f0;margin:16px 0">';
}

function rp(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function nowStr(): string {
  return new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

// ===========================================================================
// PUBLIC API — satu entry point terpusat, tidak pernah throw
// ===========================================================================
export async function sendBookingEmail(data: BookingEmailData): Promise<void> {
  try {
    switch (data.type) {
      case "booking-created-admin":
        return await send_bookingCreatedAdmin(data);
      case "booking-created-customer":
        return await send_bookingCreatedCustomer(data);
      case "payment-proof-admin":
        return send_paymentProofAdmin(data);
      case "payment-approved":
        return send_paymentApproved(data);
      case "payment-rejected":
        return send_paymentRejected(data);
      case "booking-cancelled":
        return send_bookingCancelled(data);
      case "rental-started":
        return send_rentalStarted(data);
      case "rental-completed":
        return send_rentalCompleted(data);
    }
  } catch (err) {
    console.error("[EMAIL FATAL] sendBookingEmail unhandled error:", err);
  }
}

// ===========================================================================
// Internal template functions
// ===========================================================================

// 1. Booking Baru → ADMIN
async function send_bookingCreatedAdmin(p: Extract<BookingEmailData, { type: "booking-created-admin" }>): Promise<void> {
  const url = `${siteUrl()}/admin/bookings/${p.bookingId}`;
  const subject = `[Booking Baru] ${esc(p.customerName)} — #${esc(p.bookingCode)}`;

  const accounts = await getBankAccounts();
  const bankInfo = accounts.map(
    (b) => `<span style="font-size:11px;color:#475569"><strong>${esc(b.bankName)}</strong> ${esc(b.accountNumber)} a.n. ${esc(b.accountName)}</span>`
  ).join(" &nbsp;·&nbsp; ");

  const html = adminLayout(HEADER_GREEN,
    `<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td><h1 style="color:#fff;margin:0;font-size:18px;font-weight:700">🆕 Booking Baru</h1></td>
      <td align="right"><span style="font-size:12px;color:#d1fae5">${esc(nowStr())}</span></td>
    </tr></table>`,
    `
      <p style="margin:0 0 16px;font-size:14px;color:#334155">Booking baru masuk dan <strong>menunggu pembayaran</strong> dari customer.</p>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px">
        ${infoRow("Kode Booking", `<span style="font-family:monospace;font-size:14px">${esc(p.bookingCode)}</span>`, "#1e40af")}
        ${infoRow("Nama", esc(p.customerName))}
        ${infoRow("No. HP", esc(p.customerPhone))}
        ${infoRow("Email", esc(p.customerEmail))}
        ${divider()}
        ${infoRow("Mobil", esc(p.carName))}
        ${infoRow("Tanggal", `${esc(p.startDate)} — ${esc(p.endDate)}`)}
        ${infoRow("Durasi", `${p.totalDays} hari`)}
        ${infoRow("Total", rp(p.totalPrice), "#059669")}
      </table>
      <p style="font-size:13px;color:#475569;margin:14px 0 4px">💰 Info rekening tujuan transfer:</p>
      <div style="font-size:11px;color:#64748b;line-height:1.8">${bankInfo}</div>
      ${button("🔍 Lihat Detail Booking", url, "#059669")}
    `
  );

  dispatch(html, { to: ADMIN_NOTIFICATION_EMAIL, subject, label: "NEW-BOOKING→ADMIN" });
}

// 2. Booking Baru → CUSTOMER
async function send_bookingCreatedCustomer(p: Extract<BookingEmailData, { type: "booking-created-customer" }>): Promise<void> {
  const url = `${siteUrl()}/booking/${p.bookingCode}`;
  const subject = `[BookingMobil] 📋 Booking Diterima — #${esc(p.bookingCode)}`;

  const accounts = await getBankAccounts();
  const bankInfo = accounts.map(
    (b) => `<tr><td style="padding:3px 0;font-size:12px;color:#334155"><strong>${esc(b.bankName)}</strong> — ${esc(b.accountNumber)} a.n. ${esc(b.accountName)}</td></tr>`
  ).join("");

  const html = customerLayout(
    `<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td><h1 style="color:#fff;margin:0;font-size:18px;font-weight:700">📋 Booking Diterima</h1></td>
      <td align="right"><span style="font-size:12px;color:#bfdbfe">#${esc(p.bookingCode)}</span></td>
    </tr></table>`,
    `
      <p style="margin:0 0 4px;font-size:15px;color:#1e293b">Halo <strong>${esc(p.customerName)}</strong>,</p>
      <p style="margin:0 0 16px;font-size:14px;color:#475569">Booking Anda sudah tercatat. Langkah selanjutnya: <strong>lakukan pembayaran</strong> dan upload bukti transfer.</p>
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px;margin-bottom:16px">
        <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td><span style="font-weight:700;color:#92400e;font-size:14px">Status: ${pill("MENUNGGU PEMBAYARAN")}</span></td>
        </tr></table>
      </div>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:16px">
        <tr><td colspan="2" style="padding-bottom:8px;font-weight:700;font-size:13px;color:#1e293b">📋 Detail Booking</td></tr>
        ${infoRow("Mobil", esc(p.carName))}
        ${infoRow("Tanggal", `${esc(p.startDate)} — ${esc(p.endDate)}`)}
        ${infoRow("Durasi", `${p.totalDays} hari`)}
        ${infoRow("Total", rp(p.totalPrice), "#059669")}
      </table>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:16px">
        <tr><td colspan="2" style="padding-bottom:8px;font-weight:700;font-size:13px;color:#1e293b">🏦 Rekening Tujuan Transfer</td></tr>
        ${bankInfo}
      </table>
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px;margin-bottom:16px">
        <p style="margin:0;font-size:13px;color:#1e40af"><strong>⚠️ Penting:</strong> Setelah transfer, segera upload bukti melalui halaman booking. Admin akan verifikasi dalam 1×24 jam.</p>
      </div>
      ${button("💳 Upload Bukti Bayar", url, "#2563eb")}
    `
  );

  dispatch(html, { to: p.to, subject, label: "BOOKING-CONFIRMATION→CUSTOMER" });
}

// 3. Bukti Transfer Diupload → ADMIN
function send_paymentProofAdmin(p: Extract<BookingEmailData, { type: "payment-proof-admin" }>): void {
  const verificationUrl = `${siteUrl()}/admin/bookings/${p.bookingId}`;
  const subject = `[Bukti Bayar] ${esc(p.customerName)} — #${esc(p.bookingCode)}`;

  const html = adminLayout(HEADER_BLUE,
    `<table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
      <td><h1 style="color:#fff;margin:0;font-size:18px;font-weight:700">🔔 Bukti Pembayaran Masuk</h1></td>
      <td align="right"><span style="font-size:12px;color:#bfdbfe">${esc(nowStr())}</span></td>
    </tr></table>`,
    `
      <p style="margin:0 0 16px;font-size:14px;color:#334155">Customer telah mengunggah bukti transfer. Segera lakukan <strong>verifikasi pembayaran</strong>.</p>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px">
        ${infoRow("Kode", `<span style="font-family:monospace;font-size:14px">${esc(p.bookingCode)}</span>`, "#1e40af")}
        ${infoRow("Customer", esc(p.customerName))}
        ${infoRow("HP", esc(p.customerPhone))}
        ${infoRow("Mobil", esc(p.carName))}
        ${infoRow("Tanggal", `${esc(p.startDate)} — ${esc(p.endDate)}`)}
        ${infoRow("Durasi", `${p.totalDays} hari`)}
        ${infoRow("Total", rp(p.totalPrice), "#059669")}
      </table>
      <div style="margin-top:16px;padding:12px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px">
        <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td><span style="font-size:13px;font-weight:600;color:#1e40af">📎 Bukti Transfer</span></td>
          <td align="right"><a href="${esc(p.paymentProofUrl)}" target="_blank" style="font-size:12px;color:#2563eb;text-decoration:underline">Lihat File</a></td>
        </tr></table>
      </div>
      ${button("⚡ Verifikasi Pembayaran", verificationUrl, "#1e40af")}
    `
  );

  dispatch(html, { to: ADMIN_NOTIFICATION_EMAIL, subject, label: "PAYMENT-PROOF→ADMIN" });
}

// 4. Pembayaran Di-approve → CUSTOMER
function send_paymentApproved(p: Extract<BookingEmailData, { type: "payment-approved" }>): void {
  const url = `${siteUrl()}/booking/${p.bookingCode}`;
  const subject = `[BookingMobil] ✅ Pembayaran Dikonfirmasi — #${esc(p.bookingCode)}`;

  const html = customerLayout(
    `<h1 style="color:#fff;margin:0;font-size:18px;font-weight:700">✅ Pembayaran Dikonfirmasi</h1>`,
    `
      <p style="margin:0 0 4px;font-size:15px;color:#1e293b">Halo <strong>${esc(p.customerName)}</strong>,</p>
      <p style="margin:0 0 16px;font-size:14px;color:#475569">Pembayaran Anda sudah diverifikasi. Booking <strong>#${esc(p.bookingCode)}</strong> telah dikonfirmasi.</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;margin-bottom:16px">
        <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td><span style="font-weight:700;color:#166534;font-size:14px">🎉 Status: ${pill("TERKONFIRMASI", "#bbf7d0", "#166534")}</span></td>
        </tr></table>
      </div>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:16px">
        <tr><td colspan="2" style="padding-bottom:8px;font-weight:700;font-size:13px;color:#1e293b">📋 Detail Penjemputan</td></tr>
        ${infoRow("Mobil", esc(p.carName))}
        ${infoRow("Tanggal Sewa", `${esc(p.startDate)} — ${esc(p.endDate)}`)}
        ${infoRow("Durasi", `${p.totalDays} hari`)}
        ${infoRow("Total Dibayar", rp(p.totalPrice), "#059669")}
        ${infoRow("Kode Booking", `<span style="font-family:monospace">${esc(p.bookingCode)}</span>`, "#1e40af")}
      </table>
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px;margin-bottom:16px">
        <p style="margin:0;font-size:13px;color:#92400e"><strong>ℹ️ Info Penting:</strong> Tim kami akan menghubungi Anda melalui WhatsApp menjelang jadwal penjemputan. Pastikan nomor HP Anda aktif.</p>
      </div>
      ${button("📱 Lihat Status Booking", url)}
    `
  );

  dispatch(html, { to: p.to, subject, label: "PAYMENT-APPROVED→CUSTOMER" });
}

// 5. Pembayaran Di-reject → CUSTOMER
function send_paymentRejected(p: Extract<BookingEmailData, { type: "payment-rejected" }>): void {
  const url = `${siteUrl()}/booking/${p.bookingCode}`;
  const subject = `[BookingMobil] ❌ Pembayaran Ditolak — #${esc(p.bookingCode)}`;

  const html = customerLayout(
    `<h1 style="color:#fff;margin:0;font-size:18px;font-weight:700">❌ Pembayaran Ditolak</h1>`,
    `
      <p style="margin:0 0 4px;font-size:15px;color:#1e293b">Halo <strong>${esc(p.customerName)}</strong>,</p>
      <p style="margin:0 0 16px;font-size:14px;color:#475569">Pembayaran untuk booking <strong>#${esc(p.bookingCode)}</strong> belum bisa dikonfirmasi. Silakan upload ulang bukti transfer yang valid.</p>
      <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:14px;margin-bottom:16px">
        <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#991b1b">Alasan Penolakan:</p>
        <p style="margin:0;font-size:14px;color:#b91c1c;line-height:1.6">${esc(p.reason)}</p>
      </div>
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:16px">
        ${infoRow("Kode Booking", `<span style="font-family:monospace">${esc(p.bookingCode)}</span>`, "#1e40af")}
        ${infoRow("Total Tagihan", rp(p.totalPrice), "#dc2626")}
        ${infoRow("Status", pill("DITOLAK", "#fee2e2", "#991b1b"))}
      </table>
      <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px;margin-bottom:16px">
        <p style="margin:0;font-size:13px;color:#1e40af"><strong>💡 Langkah selanjutnya:</strong> Silakan upload ulang bukti transfer melalui halaman detail booking. Pastikan gambar bukti jelas dan sesuai nominal.</p>
      </div>
      ${button("📤 Upload Ulang Bukti Bayar", url, "#dc2626")}
    `
  );

  dispatch(html, { to: p.to, subject, label: "PAYMENT-REJECTED→CUSTOMER" });
}

// 6. Booking Dibatalkan → CUSTOMER
function send_bookingCancelled(p: Extract<BookingEmailData, { type: "booking-cancelled" }>): void {
  const url = `${siteUrl()}/booking/${p.bookingCode}`;
  const subject = `[BookingMobil] ❌ Booking Dibatalkan — #${esc(p.bookingCode)}`;

  const html = customerLayout(
    `<h1 style="color:#fff;margin:0;font-size:18px;font-weight:700">❌ Booking Dibatalkan</h1>`,
    `
      <p style="margin:0 0 4px;font-size:15px;color:#1e293b">Halo <strong>${esc(p.customerName)}</strong>,</p>
      <p style="margin:0 0 16px;font-size:14px;color:#475569">Booking <strong>#${esc(p.bookingCode)}</strong> untuk mobil <strong>${esc(p.carName)}</strong> telah dibatalkan.</p>
      <div style="background:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;padding:14px;margin-bottom:16px">
        <table cellpadding="0" cellspacing="0" border="0" width="100%"><tr>
          <td><span style="font-weight:700;color:#475569;font-size:13px">Status: ${pill("CANCELLED", "#f1f5f9", "#475569")}</span></td>
        </tr></table>
      </div>
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:14px;margin-bottom:16px">
        <p style="margin:0;font-size:13px;color:#92400e">Jika Anda memiliki pertanyaan, silakan hubungi tim kami melalui WhatsApp atau email.</p>
      </div>
      ${button("🏠 Kembali ke Beranda", `${siteUrl()}`, "#475569", "#fff")}
    `
  );

  dispatch(html, { to: p.to, subject, label: "BOOKING-CANCELLED→CUSTOMER" });
}

// 7. Sewa Dimulai → CUSTOMER
function send_rentalStarted(p: Extract<BookingEmailData, { type: "rental-started" }>): void {
  const url = `${siteUrl()}/booking/${p.bookingCode}`;
  const subject = `[BookingMobil] 🚗 Sewa Dimulai — #${esc(p.bookingCode)}`;

  const html = customerLayout(
    `<h1 style="color:#fff;margin:0;font-size:18px;font-weight:700">🚗 Sewa Dimulai</h1>`,
    `
      <p style="margin:0 0 4px;font-size:15px;color:#1e293b">Halo <strong>${esc(p.customerName)}</strong>,</p>
      <p style="margin:0 0 16px;font-size:14px;color:#475569">Sewa untuk <strong>${esc(p.carName)}</strong> (Booking #${esc(p.bookingCode)}) telah dimulai. Selamat menikmati perjalanan!</p>
      ${button("📱 Lihat Status Booking", url)}
    `
  );

  dispatch(html, { to: p.to, subject, label: "RENTAL-STARTED→CUSTOMER" });
}

// 8. Sewa Selesai → CUSTOMER
function send_rentalCompleted(p: Extract<BookingEmailData, { type: "rental-completed" }>): void {
  const url = `${siteUrl()}/cars`;
  const subject = `[BookingMobil] 🏁 Sewa Selesai — #${esc(p.bookingCode)}`;

  const html = customerLayout(
    `<h1 style="color:#fff;margin:0;font-size:18px;font-weight:700">🏁 Sewa Selesai</h1>`,
    `
      <p style="margin:0 0 4px;font-size:15px;color:#1e293b">Halo <strong>${esc(p.customerName)}</strong>,</p>
      <p style="margin:0 0 16px;font-size:14px;color:#475569">Sewa untuk <strong>${esc(p.carName)}</strong> (Booking #${esc(p.bookingCode)}) telah selesai. Terima kasih telah menggunakan layanan kami!</p>
      ${button("🌟 Booking Lagi", url, "#059669")}
    `
  );

  dispatch(html, { to: p.to, subject, label: "RENTAL-COMPLETED→CUSTOMER" });
}
