import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function rupiah(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

function fmtDate(date: Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fmtDateShort(date: Date): string {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookingCode: string }> },
) {
  const { bookingCode } = await params;
  const { searchParams } = new URL(request.url);
  const emailParam = searchParams.get("email")?.trim().toLowerCase();

  const booking = await prisma.booking.findUnique({
    where: { bookingCode },
    include: { car: true },
  });

  if (!booking) {
    return new NextResponse("Booking tidak ditemukan", { status: 404 });
  }

  // Verify email matches if provided
  if (emailParam && booking.customerEmail.toLowerCase() !== emailParam) {
    return new NextResponse("Akses ditolak", { status: 403 });
  }

  if (!["CONFIRMED", "ONGOING", "COMPLETED"].includes(booking.status)) {
    return new NextResponse("Invoice hanya tersedia untuk booking yang sudah dikonfirmasi", { status: 400 });
  }

  const now = new Date();
  const car = booking.car;
  const totalPrice = booking.totalPrice.toNumber();
  const pricePerDay = car.pricePerDay.toNumber();

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Invoice #${bookingCode} - BookingMobil</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; font-size: 14px; line-height: 1.5; }
  .container { max-width: 800px; margin: 40px auto; padding: 0 20px; }
  .header { background: #1e40af; color: white; padding: 30px; border-radius: 12px 12px 0 0; display: flex; justify-content: space-between; align-items: flex-start; }
  .header h1 { font-size: 24px; font-weight: 800; }
  .header .subtitle { font-size: 12px; opacity: 0.8; margin-top: 4px; }
  .header .invoice-number { text-align: right; }
  .header .invoice-number .label { font-size: 10px; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px; }
  .header .invoice-number .code { font-size: 20px; font-weight: 800; font-family: 'Courier New', monospace; margin-top: 2px; }
  .body { background: #fff; border: 1px solid #e2e8f0; border-top: none; padding: 30px; border-radius: 0 0 12px 12px; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .info-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; border-bottom: 1px dotted #f1f5f9; }
  .info-row .label { color: #64748b; }
  .info-row .value { font-weight: 600; text-align: right; }
  .info-row.total { font-size: 16px; font-weight: 800; color: #059669; border-bottom: none; margin-top: 8px; padding-top: 8px; border-top: 2px solid #e2e8f0; }
  .info-row.total .label { color: #1e293b; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  table th { text-align: left; padding: 8px 0; color: #64748b; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; }
  table td { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
  table td.right { text-align: right; font-weight: 600; }
  .footer { text-align: center; color: #94a3b8; font-size: 11px; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; }
  .badge.confirmed { background: #dcfce7; color: #166534; }
  .badge.ongoing { background: #ede9fe; color: #6b21a8; }
  .badge.completed { background: #e2e8f0; color: #475569; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .header { background: #1e40af !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .no-print { display: none; }
  }
  .no-print { text-align: center; margin-top: 30px; }
  .no-print button { padding: 10px 30px; background: #1e40af; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }
  .no-print button:hover { background: #1e3a8a; }
</style>
</head>
<body>
<div class="container" id="invoice">

  <!-- Header -->
  <div class="header">
    <div>
      <h1>🚗 BookingMobil</h1>
      <p class="subtitle">Invoice Pemesanan Sewa Mobil</p>
    </div>
    <div class="invoice-number">
      <p class="label">Invoice</p>
      <p class="code">#${bookingCode}</p>
    </div>
  </div>

  <!-- Body -->
  <div class="body">

    <!-- Status -->
    <div class="section" style="margin-bottom: 16px;">
      <span class="badge ${booking.status === "CONFIRMED" ? "confirmed" : booking.status === "ONGOING" ? "ongoing" : "completed"}">${
        booking.status === "CONFIRMED" ? "✅ Terkonfirmasi" :
        booking.status === "ONGOING" ? "🚗 Sewa Berlangsung" : "🏁 Selesai"
      }</span>
    </div>

    <!-- Customer & Booking Info -->
    <div class="section">
      <p class="section-title">Informasi Penyewa</p>
      <div class="grid">
        <div>
          <div class="info-row"><span class="label">Nama</span><span class="value">${escHtml(booking.customerName)}</span></div>
          <div class="info-row"><span class="label">No. HP</span><span class="value">${escHtml(booking.customerPhone)}</span></div>
          <div class="info-row"><span class="label">Email</span><span class="value">${escHtml(booking.customerEmail)}</span></div>
          <div class="info-row"><span class="label">No. KTP/SIM</span><span class="value">${escHtml(booking.identityNumber)}</span></div>
        </div>
        <div>
          <div class="info-row"><span class="label">Kode Booking</span><span class="value" style="font-family:monospace">${escHtml(bookingCode)}</span></div>
          <div class="info-row"><span class="label">Tanggal Pesan</span><span class="value">${fmtDateShort(booking.createdAt)}</span></div>
          <div class="info-row"><span class="label">Mulai Sewa</span><span class="value">${fmtDateShort(booking.startDate)}</span></div>
          <div class="info-row"><span class="label">Selesai Sewa</span><span class="value">${fmtDateShort(booking.endDate)}</span></div>
          <div class="info-row"><span class="label">Pengambilan</span><span class="value">${
            booking.deliveryOption === "PICKUP" ? "Ambil di Tempat" : "Diantar ke Alamat"
          }</span></div>
        </div>
      </div>
    </div>

    <!-- Car Info -->
    <div class="section">
      <p class="section-title">Armada</p>
      <div class="grid">
        <div>
          <div class="info-row"><span class="label">Mobil</span><span class="value">${escHtml(car.name)} (${escHtml(car.brand)})</span></div>
          <div class="info-row"><span class="label">Plat Nomor</span><span class="value">${escHtml(car.licensePlate)}</span></div>
        </div>
        <div>
          <div class="info-row"><span class="label">Kategori</span><span class="value">${escHtml(car.category)}</span></div>
          <div class="info-row"><span class="label">Transmisi</span><span class="value">${car.transmission === "AUTOMATIC" ? "Automatis" : "Manual"}</span></div>
        </div>
      </div>
    </div>

    <!-- Price Breakdown -->
    <div class="section">
      <p class="section-title">Rincian Biaya</p>
      <table>
        <thead>
          <tr><th>Deskripsi</th><th class="right">Jumlah</th></tr>
        </thead>
        <tbody>
          <tr><td>Tarif Sewa (${rupiah(pricePerDay)}/hari &times; ${booking.totalDays} hari)</td><td class="right">${rupiah(totalPrice)}</td></tr>
          <tr><td>Biaya Layanan &amp; Pajak</td><td class="right">Sudah Termasuk</td></tr>
          <tr><td colspan="2" style="padding: 0;"><div class="info-row total"><span class="label">Total Pembayaran</span><span class="value">${rupiah(totalPrice)}</span></div></td></tr>
        </tbody>
      </table>
    </div>

    <!-- Terms -->
    <div class="section">
      <p class="section-title">Syarat &amp; Ketentuan</p>
      <ul style="font-size: 12px; color: #64748b; padding-left: 16px; line-height: 1.8;">
        <li>Invoice ini sah sebagai bukti pemesanan resmi dari BookingMobil.</li>
        <li>Pembatalan dikenakan biaya sesuai kebijakan yang berlaku.</li>
        <li>Mobil wajib dikembalikan dalam kondisi bersih dan tangki bensin penuh.</li>
        <li>Keterlambatan pengembalian dikenakan biaya tambahan per jam.</li>
      </ul>
    </div>

  </div>

  <!-- Footer -->
  <div class="footer">
    BookingMobil &bull; Platform Sewa Mobil Online &bull; invoice@bookingmobil.com<br>
    Dicetak pada ${fmtDate(now)}
  </div>

  <!-- Print Button -->
  <div class="no-print">
    <button onclick="window.print()">🖨️ Cetak / Simpan sebagai PDF</button>
  </div>

</div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
