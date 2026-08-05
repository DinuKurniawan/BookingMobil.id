import { z } from "zod";

export const testimonialSchema = z.object({
  bookingId: z.string().min(1),
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(100),
  role: z.string().trim().max(50).optional().or(z.literal("")),
  text: z
    .string()
    .trim()
    .min(10, "Testimoni minimal 10 karakter")
    .max(1000, "Testimoni maksimal 1000 karakter"),
  rating: z
    .number()
    .int()
    .min(1, "Rating minimal 1")
    .max(5, "Rating maksimal 5"),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

export type TestimonialActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};
