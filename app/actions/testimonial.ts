"use server";

import { prisma } from "@/lib/prisma";
import { testimonialSchema, type TestimonialActionState } from "@/lib/validations/testimonial";

export async function submitTestimonialAction(
  prevState: TestimonialActionState,
  formData: FormData
): Promise<TestimonialActionState> {
  try {
    const bookingId = formData.get("bookingId") as string;
    const name = formData.get("name") as string;
    const role = (formData.get("role") as string) || undefined;
    const text = formData.get("text") as string;
    const ratingStr = formData.get("rating") as string;

    if (!bookingId) {
      return { message: "ID booking tidak ditemukan" };
    }

    // Validate with Zod
    const validated = testimonialSchema.safeParse({
      bookingId,
      name,
      role,
      text,
      rating: Number(ratingStr),
    });

    if (!validated.success) {
      const errors = validated.error.flatten().fieldErrors;
      const firstError = Object.values(errors)[0]?.[0] || "Data form tidak valid";
      return { message: firstError, errors };
    }

    // Check booking exists and is COMPLETED
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { testimonial: true },
    });

    if (!booking) {
      return { message: "Pemesanan tidak ditemukan" };
    }

    if (booking.status !== "COMPLETED") {
      return { message: "Testimoni hanya bisa diberikan untuk pemesanan yang sudah selesai" };
    }

    if (booking.testimonial) {
      return { message: "Anda sudah memberikan testimoni untuk pemesanan ini" };
    }

    // Create testimonial
    await prisma.testimonial.create({
      data: {
        bookingId,
        name: validated.data.name,
        role: validated.data.role || null,
        text: validated.data.text,
        rating: validated.data.rating,
        isApproved: false,
      },
    });

    return { success: true, message: "Terima kasih! Testimoni Anda akan ditampilkan setelah disetujui admin." };
  } catch (error) {
    console.error("Testimonial submission error:", error);
    return { message: "Terjadi kesalahan saat menyimpan testimoni" };
  }
}
