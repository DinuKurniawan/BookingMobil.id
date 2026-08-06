"use client";

import { useState } from "react";

interface TestimonialItem {
  name: string;
  role?: string | null;
  text: string;
  rating: number;
}

interface TestimonialCarouselProps {
  testimonials: TestimonialItem[];
}

const FALLBACKS: TestimonialItem[] = [
  {
    name: "Rizky Pratama",
    role: "Pengusaha",
    text: "BookingMobil.id sangat membantu! Saya butuh mobil untuk meeting dadakan, dan proses booking hanya butuh 2 menit. Mobil bersih, terawat, dan harganya jelas. Recommend banget!",
    rating: 5,
  },
  {
    name: "Dewi Anggraini",
    role: "Ibu Rumah Tangga",
    text: "Pertama kali sewa mobil online dan ternyata semudah ini. Upload KTP, transfer, langsung dikonfirmasi admin via WhatsApp. Mobilnya wangi dan AC dingin. Anak-anak senang!",
    rating: 5,
  },
  {
    name: "Hendra Gunawan",
    role: "Tour Guide",
    text: "Sudah 3 kali sewa untuk antar tamu wisata. Armadanya lengkap dari MPV sampai Van. Yang paling saya suka: CS-nya fast response. Sekali WA langsung dibales.",
    rating: 4,
  },
  {
    name: "Sari Wulandari",
    role: "Karyawan Swasta",
    text: "Harga sewa terjangkau dibanding rental lain di Jakarta. Transparan, nggak ada biaya tambahan di akhir. Pengembalian juga mudah, tinggal foto kondisi mobil.",
    rating: 5,
  },
  {
    name: "Bambang Hermawan",
    role: "Driver Online",
    text: "Mobilnya selalu bersih dan wangi setiap kali ambil. Admin ramah, proses cepat. Sudah langganan 5x sewa dan nggak pernah kecewa.",
    rating: 5,
  },
  {
    name: "Fitriani Kusuma",
    role: "Mahasiswa",
    text: "Sewa untuk road trip bareng teman-teman kampus. Harganya pas di kantong mahasiswa, mobil irit bensin. Pasti repeat order!",
    rating: 4,
  },
];

export function TestimonialCarousel({ testimonials }: TestimonialCarouselProps) {
  const [paused, setPaused] = useState(false);

  const items = testimonials.length > 0 ? testimonials : FALLBACKS;
  const count = items.length;

  // Duplicate for seamless infinite scroll
  const ITEMS = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <style>{`
        @keyframes testimonial-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div
        className="flex gap-6 py-4"
        style={{
          width: "max-content",
          animation: `testimonial-scroll ${Math.max(count * 5, 15)}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {ITEMS.map((item, i) => (
          <div
            key={i}
            className="w-[360px] flex-shrink-0 bg-white rounded-2xl border border-gray-100 p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-1.5 mb-4">
              {Array.from({ length: 5 }).map((_, star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${star < item.rating ? "text-amber-400" : "text-gray-200"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-gray-600 text-sm leading-relaxed mb-5 italic">
              &ldquo;{item.text}&rdquo;
            </blockquote>
            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-blue-500/20">
                {item.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{item.name}</p>
                {item.role && (
                  <p className="text-xs text-gray-400">{item.role}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
