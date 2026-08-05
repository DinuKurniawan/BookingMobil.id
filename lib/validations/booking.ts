import { z } from "zod";

export const MAX_IDENTITY_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Regex untuk nomor HP Indonesia (format 08xx, +628xx, atau 628xx dengan 10-15 digit)
const INDONESIAN_PHONE_REGEX = /^(?:\+62|62|0)8[1-9][0-9]{7,11}$/;

export const bookingFormSchema = z
  .object({
    carId: z.string().min(1, "ID Mobil wajib diisi"),
    startDate: z
      .string()
      .min(1, "Tanggal mulai sewa wajib diisi")
      .refine((val) => !isNaN(Date.parse(val)), "Format tanggal mulai tidak valid")
      .refine((val) => {
        const start = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return start >= today;
      }, "Tanggal mulai sewa tidak boleh di masa lalu"),

    endDate: z
      .string()
      .min(1, "Tanggal selesai sewa wajib diisi")
      .refine((val) => !isNaN(Date.parse(val)), "Format tanggal selesai tidak valid"),

    customerName: z
      .string()
      .trim()
      .min(1, "Nama lengkap wajib diisi")
      .min(2, "Nama lengkap minimal 2 karakter")
      .max(100, "Nama lengkap maksimal 100 karakter"),

    customerPhone: z
      .string()
      .trim()
      .min(1, "Nomor HP wajib diisi")
      .regex(
        INDONESIAN_PHONE_REGEX,
        "Nomor HP harus berupa format Indonesia yang valid (contoh: 081234567890 / +6281234567890)"
      ),

    customerEmail: z
      .string()
      .trim()
      .min(1, "Alamat email wajib diisi")
      .email("Format alamat email tidak valid (contoh: nama@domain.com)"),

    customerAddress: z
      .string()
      .trim()
      .min(1, "Alamat lengkap wajib diisi")
      .min(5, "Alamat lengkap minimal 5 karakter")
      .max(500, "Alamat lengkap maksimal 500 karakter"),

    identityNumber: z
      .string()
      .trim()
      .min(1, "Nomor identitas (KTP/SIM) wajib diisi")
      .min(5, "Nomor identitas minimal 5 karakter")
      .max(30, "Nomor identitas maksimal 30 karakter"),

    deliveryOption: z.enum(["PICKUP", "DELIVERY"], {
      message: "Pilih metode pengambilan mobil",
    }),

    notes: z.string().trim().max(1000, "Catatan maksimal 1000 karakter").optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return end > start;
    },
    {
      message: "Tanggal selesai sewa harus setelah tanggal mulai sewa",
      path: ["endDate"],
    }
  );

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export type BookingActionState = {
  success?: boolean;
  message?: string;
  bookingCode?: string;
  errors?: Record<string, string[]>;
};

/**
 * Generates a unique booking code in the required format: BK-YYYYMMDD-XXXXX
 * Example: BK-20260804-A9F3K
 */
export function generateBookingCode(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomStr = "";
  for (let i = 0; i < 5; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BK-${dateStr}-${randomStr}`;
}
