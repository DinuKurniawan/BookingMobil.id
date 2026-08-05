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
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

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
          animation: `testimonial-scroll ${count * 5}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {ITEMS.map((item, i) => (
          <div
            key={i}
            className="w-[340px] flex-shrink-0 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, star) => (
                <span
                  key={star}
                  className={
                    star < item.rating ? "text-amber-400" : "text-gray-200"
                  }
                >
                  ★
                </span>
              ))}
            </div>
            <blockquote className="text-gray-600 text-sm leading-relaxed mb-4">
              &ldquo;{item.text}&rdquo;
            </blockquote>
            <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                {item.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{item.name}</p>
                {item.role && (
                  <p className="text-xs text-gray-500">{item.role}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
