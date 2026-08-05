import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { TestimonialActions } from "./testimonial-actions";

export const metadata: Metadata = {
  title: "Kelola Testimoni - Admin BookingMobil",
  description: "Approve atau tolak testimoni pelanggan sebelum ditampilkan di halaman publik.",
};

function formatDateShort(date: Date) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminTestimonialsPage() {
  const [pendingTestimonials, approvedTestimonials] = await Promise.all([
    prisma.testimonial.findMany({
      where: { isApproved: false },
      orderBy: { createdAt: "desc" },
      include: {
        booking: { select: { bookingCode: true, car: { select: { name: true } } } },
      },
    }),
    prisma.testimonial.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        booking: { select: { bookingCode: true, car: { select: { name: true } } } },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Testimoni</h1>
          <p className="text-gray-500 text-sm mt-1">
            Review, approve, atau hapus testimoni pelanggan sebelum tampil di halaman publik.
          </p>
        </div>

        {pendingTestimonials.length > 0 && (
          <Link
            href="/"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-colors"
          >
            Lihat Halaman Publik →
          </Link>
        )}
      </div>

      {/* Pending Testimonials */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            ⏳ Menunggu Approval
            {pendingTestimonials.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                {pendingTestimonials.length}
              </span>
            )}
          </h2>
        </div>

        {pendingTestimonials.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">
            Tidak ada testimoni yang menunggu approval.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pendingTestimonials.map((t) => (
              <div key={t.id} className="p-5 flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-gray-400">
                      #{t.booking.bookingCode}
                    </span>
                    <span className="text-[11px] text-gray-400">·</span>
                    <span className="text-[11px] text-gray-400">
                      {t.booking.car.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, star) => (
                      <span
                        key={star}
                        className={star < t.rating ? "text-amber-400 text-sm" : "text-gray-200 text-sm"}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <blockquote className="text-gray-600 text-sm leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </blockquote>

                  <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                    <span className="font-semibold text-gray-700">{t.name}</span>
                    {t.role && <span>· {t.role}</span>}
                    <span>· {formatDateShort(t.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <TestimonialActions testimonialId={t.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Testimonials */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
            ✅ Disetujui &amp; Ditampilkan
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
              {approvedTestimonials.length}
            </span>
          </h2>
        </div>

        {approvedTestimonials.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">
            Belum ada testimoni yang disetujui.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 text-xs font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Nama</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Testimoni</th>
                  <th className="py-3 px-4">Booking</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4 w-0">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {approvedTestimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-900 text-xs">{t.name}</p>
                      {t.role && <p className="text-xs text-gray-400">{t.role}</p>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-amber-400 text-sm">
                        {"★".repeat(t.rating)}
                        <span className="text-gray-200">{"★".repeat(5 - t.rating)}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-xs text-gray-600 line-clamp-2">{t.text}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-mono text-gray-500">{t.booking.bookingCode}</span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-xs text-gray-500">
                      {formatDateShort(t.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <TestimonialActions testimonialId={t.id} approved />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
