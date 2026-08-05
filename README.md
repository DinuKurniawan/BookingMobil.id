# BookingMobil.id

Platform penyewaan mobil online — pelanggan bisa mencari armada, melakukan booking, upload bukti pembayaran, dan cek status pemesanan. Admin bisa mengelola mobil, verifikasi pembayaran, dan memantau performa dari dashboard analitik.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Frontend:** React 19, TypeScript, Tailwind CSS 4
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT (jose) + HTTP-only cookie
- **Email:** Resend
- **Validation:** Zod
- **Testing:** Vitest (unit/integrasi), Playwright (E2E)
- **Notifications:** Sonner (toast)

## Fitur Utama

### Sisi Pelanggan (Public)
- Katalog mobil dengan filter (kategori, transmisi, kapasitas)
- Detail mobil lengkap: galeri gambar, kalender ketersediaan
- Form booking dengan upload foto identitas (KTP/SIM)
- Halaman status booking lengkap dengan timeline
- Upload bukti pembayaran
- Cek booking via kode pemesanan

### Sisi Admin
- Dashboard ringkasan: pendapatan bulanan, booking aktif, mobil tersedia
- Grafik analitik: pendapatan bulanan, mobil terpopuler, tingkat okupansi
- CRUD mobil (nama, brand, kategori, transmisi, harga, foto, status)
- Manajemen booking: lihat detail, ubah status, verifikasi pembayaran
- Rate limiting di login dan upload bukti pembayaran

### Alur Status Booking
```
PENDING → PAYMENT_REVIEW → CONFIRMED → ONGOING → COMPLETED
                    ↘ REJECTED     ↘ CANCELLED
```

## Struktur Project

```
app/
├── (public)/         # Halaman publik
│   ├── page.tsx              # Landing page
│   ├── cars/                 # Katalog & detail mobil
│   ├── booking/[code]/       # Halaman status booking
│   └── cek-booking/          # Cek booking via kode
├── (admin)/admin/     # Panel admin (dashboard, mobil, booking)
├── actions/           # Server Actions
└── api/               # API Routes (auth, bookings, cars, health, invoice)
components/
├── ui/                # Komponen UI dasar (Button, Spinner)
├── admin/             # Komponen khusus admin (grafik, form, badge)
└── *.tsx              # Komponen fitur (CarCard, BookingForm, dll.)
lib/
├── auth.ts            # JWT auth helpers
├── prisma.ts          # Prisma client singleton
├── email.ts           # Template email (Resend)
├── upload.ts          # Upload gambar ke local storage
├── rate-limit.ts      # Rate limiter in-memory
├── queries.ts         # Cached database queries
├── config.ts          # Konfigurasi (bank, upload limits, email)
├── utils.ts           # Utility (cn, dll.)
└── validations/       # Zod schema (booking, car, cek-booking)
prisma/
├── schema.prisma      # Database schema
└── seed.ts            # Data awal (admin & mobil)
```

## Persiapan Awal

1. Clone repository dan install dependencies:

```bash
npm install
```

2. Copy `.env.example` ke `.env` dan isi variabel yang diperlukan:

```bash
cp .env.example .env
```

- `DATABASE_URL` — koneksi PostgreSQL
- `JWT_SECRET` — kunci enkripsi token admin
- `RESEND_API_KEY` — API key Resend untuk email
- `EMAIL_FROM`, `ADMIN_NOTIFICATION_EMAIL` — pengaturan email
- `BANK_BCA_*`, `BANK_MANDIRI_*`, `BANK_BRI_*` — info rekening bank (opsional)

3. Jalankan migrasi database & seed:

```bash
npx prisma migrate dev
npx prisma db seed
```

Ini akan membuat akun admin default:
- **Email:** `admin@example.com`
- **Password:** `admin123`

4. Jalankan development server:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) untuk halaman publik,
dan [http://localhost:3000/admin/login](http://localhost:3000/admin/login) untuk panel admin.

## Scripts

| Command | Deskripsi |
|---|---|
| `npm run dev` | Development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Jalankan production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run test` | Vitest unit/integrasi |
| `npm run test:e2e` | Playwright E2E |
| `npm run test:all` | Unit + E2E |

## Model Database

- **Admin** — akun admin (SUPERADMIN / STAFF)
- **Car** — armada mobil (nama, brand, kategori, transmisi, harga, foto, status)
- **Booking** — pemesanan (pelanggan, tanggal, total, status, bukti identitas)
- **PaymentProof** — bukti pembayaran (gambar, status verifikasi, admin verifikator)
