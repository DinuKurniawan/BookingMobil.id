import { z } from "zod";

export const CAR_CATEGORIES = ["MPV", "SUV", "SEDAN", "HATCHBACK", "VAN"] as const;
export const TRANSMISSIONS = ["MANUAL", "AUTOMATIC"] as const;
export const CAR_STATUSES = ["AVAILABLE", "MAINTENANCE", "INACTIVE"] as const;

export const CAR_STATUS_LABELS: Record<(typeof CAR_STATUSES)[number], string> = {
  AVAILABLE: "Tersedia",
  MAINTENANCE: "Perawatan",
  INACTIVE: "Nonaktif",
};

export const CAR_CATEGORY_LABELS: Record<(typeof CAR_CATEGORIES)[number], string> = {
  MPV: "MPV",
  SUV: "SUV",
  SEDAN: "Sedan",
  HATCHBACK: "Hatchback",
  VAN: "Van",
};

export const TRANSMISSION_LABELS: Record<(typeof TRANSMISSIONS)[number], string> = {
  MANUAL: "Manual",
  AUTOMATIC: "Automatis",
};

/**
 * Booking statuses that count as "active" — a car with any of these
 * cannot be deleted because it would orphan an in-progress booking.
 */
export const ACTIVE_BOOKING_STATUSES = ["PENDING", "PAYMENT_REVIEW", "CONFIRMED", "ONGOING"] as const;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB per file

export const carFormSchema = z.object({
  name: z.string().trim().min(1, "Nama mobil wajib diisi"),
  brand: z.string().trim().min(1, "Brand mobil wajib diisi"),
  category: z.enum(CAR_CATEGORIES, { message: "Pilih kategori mobil" }),
  transmission: z.enum(TRANSMISSIONS, { message: "Pilih jenis transmisi" }),
  seats: z.coerce
    .number("Jumlah kursi harus berupa angka")
    .int("Jumlah kursi harus bilangan bulat")
    .min(1, "Jumlah kursi minimal 1")
    .max(60, "Jumlah kursi maksimal 60"),
  pricePerDay: z.coerce
    .number("Harga harus berupa angka")
    .positive("Harga harus angka positif (lebih dari 0)")
    .max(1_000_000_000, "Harga terlalu besar"),
  licensePlate: z.string().trim().min(1, "Nomor plat wajib diisi").max(20),
  description: z.string().trim().max(2000, "Deskripsi maksimal 2000 karakter").optional(),
});

export type CarFormValues = z.infer<typeof carFormSchema>;

const imageFileCheck = z
  .instanceof(File, { message: "File foto tidak valid" })
  .refine((file) => file.size > 0, "File kosong")
  .refine((file) => file.size <= MAX_IMAGE_SIZE, "Ukuran foto maksimal 5MB")
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type),
    "Format foto harus JPG, PNG, WEBP, atau GIF"
  );

export const carImageFilesSchema = z.array(imageFileCheck).max(10, "Maksimal 10 foto");

export const createCarImagesSchema = carImageFilesSchema.min(
  1,
  "Minimal 1 foto mobil wajib diunggah"
);

export const carStatusSchema = z.enum(CAR_STATUSES, { message: "Status tidak valid" });

export type CarFormState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
  success?: boolean;
};

export function formatCurrency(value: number | string): string {
  const num = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}
