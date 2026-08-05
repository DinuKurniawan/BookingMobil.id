import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { testimonialId, action } = await request.json();

    if (!testimonialId || !["approve", "reject", "delete"].includes(action)) {
      return NextResponse.json({ message: "Data tidak valid" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.findUnique({
      where: { id: testimonialId },
    });

    if (!testimonial) {
      return NextResponse.json({ message: "Testimoni tidak ditemukan" }, { status: 404 });
    }

    if (action === "delete") {
      await prisma.testimonial.delete({ where: { id: testimonialId } });
      return NextResponse.json({ success: true, message: "Testimoni dihapus" });
    }

    if (action === "approve") {
      await prisma.testimonial.update({
        where: { id: testimonialId },
        data: { isApproved: true },
      });
      return NextResponse.json({ success: true, message: "Testimoni disetujui" });
    }

    if (action === "reject") {
      // Delete rejected testimonials (they won't be shown)
      await prisma.testimonial.delete({ where: { id: testimonialId } });
      return NextResponse.json({ success: true, message: "Testimoni ditolak dan dihapus" });
    }

    return NextResponse.json({ message: "Aksi tidak dikenal" }, { status: 400 });
  } catch (error) {
    console.error("Testimonial action error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}
