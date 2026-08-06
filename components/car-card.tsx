import Link from "next/link";
import Image from "next/image";
import {
  CAR_CATEGORY_LABELS,
  TRANSMISSION_LABELS,
  formatCurrency,
} from "@/lib/validations/car";
import type { CarCategory, Transmission } from "@prisma/client";

export type CarCardData = {
  id: string;
  name: string;
  brand: string;
  category: CarCategory;
  transmission: Transmission;
  seats: number;
  pricePerDay: number;
  images: string[];
  badge?: { text: string; className: string };
};

export function CarCard({ car }: { car: CarCardData }) {
  const thumbUrl = car.images[0];

  return (
    <Link href={`/cars/${car.id}`} className="group block h-full">
      <article className="bg-[#FAFAF7] border border-[#1A1A1A]/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#1A1A1A]/25 hover:shadow-md flex flex-col h-full relative">
        {/* Badge */}
        {car.badge && (
          <span
            className={`absolute top-3 left-3 z-10 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${car.badge.className}`}
          >
            {car.badge.text}
          </span>
        )}

        {/* Image — fixed aspect ratio so all cards align */}
        <div className="relative aspect-[4/3] bg-[#1A1A1A]/5 overflow-hidden flex-shrink-0">
          {thumbUrl ? (
            <Image
              src={thumbUrl}
              alt={car.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#1A1A1A]/20">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1 min-h-[180px]">
          <div className="mb-3">
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#1F4D3F] mb-1.5 h-4 line-clamp-1">
              {car.brand}
            </p>
            <h3 className="font-serif text-lg leading-snug tracking-tight text-[#1A1A1A] group-hover:text-[#1F4D3F] transition-colors line-clamp-2 min-h-[2.75rem]">
              {car.name}
            </h3>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/55 mb-4 h-4">
            <span className="whitespace-nowrap">{car.seats} kursi</span>
            <span className="w-0.5 h-0.5 rounded-full bg-[#1A1A1A]/25 flex-shrink-0" />
            <span className="whitespace-nowrap">{TRANSMISSION_LABELS[car.transmission]}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-[#1A1A1A]/25 flex-shrink-0" />
            <span className="whitespace-nowrap truncate">{CAR_CATEGORY_LABELS[car.category]}</span>
          </div>

          {/* Price */}
          <div className="mt-auto pt-4 border-t border-[#1A1A1A]/10 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="font-serif text-xl font-bold tabular-nums text-[#1A1A1A] leading-none truncate">
                {formatCurrency(car.pricePerDay)}
              </p>
              <p className="text-[10px] text-[#1A1A1A]/45 uppercase tracking-wider mt-1">/ hari</p>
            </div>
            <span className="text-[11px] font-semibold text-[#1A1A1A]/60 group-hover:text-[#1F4D3F] group-hover:translate-x-0.5 transition-all inline-flex items-center gap-1 flex-shrink-0">
              Detail
              <span>→</span>
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
