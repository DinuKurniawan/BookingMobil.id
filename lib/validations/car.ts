import { z } from "zod";
import {
  CAR_CATEGORIES,
  TRANSMISSIONS,
  CAR_STATUSES,
  MAX_IMAGE_SIZE,
} from "@/lib/car-constants";

export {
  CAR_CATEGORIES,
  TRANSMISSIONS,
  CAR_STATUSES,
  CAR_STATUS_LABELS,
  CAR_CATEGORY_LABELS,
  TRANSMISSION_LABELS,
  ACTIVE_BOOKING_STATUSES,
  MAX_IMAGE_SIZE,
  formatCurrency,
} from "@/lib/car-constants";

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
