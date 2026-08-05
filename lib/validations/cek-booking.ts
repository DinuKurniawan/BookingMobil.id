import { z } from "zod";

export const cekBookingSchema = z.object({
  bookingCode: z
    .string()
    .trim()
    .min(3, "Kode booking minimal 3 karakter")
    .max(30, "Kode booking maksimal 30 karakter"),
  identity: z
    .string()
    .trim()
    .min(3, "Email atau No. HP minimal 3 karakter")
    .max(100, "Email atau No. HP maksimal 100 karakter"),
});
