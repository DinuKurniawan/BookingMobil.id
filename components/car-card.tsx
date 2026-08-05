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
};

export function CarCard({ car }: { car: CarCardData }) {
  const thumbUrl = car.images[0];

  return (
    <Link href={`/cars/${car.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
          {thumbUrl ? (
            <Image
              src={thumbUrl}
              alt={car.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1 gap-3">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{car.brand}</p>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {car.name}
            </h3>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {car.seats} Kursi
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>{TRANSMISSION_LABELS[car.transmission]}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>{CAR_CATEGORY_LABELS[car.category]}</span>
          </div>

          {/* Price */}
          <div className="mt-auto pt-3 border-t border-slate-100 flex items-end justify-between">
            <div>
              <span className="text-lg font-bold text-blue-600">{formatCurrency(car.pricePerDay)}</span>
              <span className="text-xs text-slate-400 ml-1">/hari</span>
            </div>
            <span className="text-xs font-medium text-blue-600 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5">
              Lihat Detail
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
