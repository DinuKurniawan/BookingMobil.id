import Link from "next/link";
import { createCar } from "../actions";
import { CarForm } from "@/components/admin/car-form";

export default function NewCarPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/admin/cars" className="text-sm font-medium text-blue-600 hover:underline">
          &larr; Kembali ke daftar mobil
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Tambah Mobil Baru</h1>
        <p className="text-gray-500 text-sm mt-1">Lengkapi detail armada mobil baru</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <CarForm action={createCar} submitLabel="Simpan Mobil" />
      </div>
    </div>
  );
}