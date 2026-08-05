import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { CarStatusToggle } from "@/components/admin/car-status-toggle";
import { DeleteCarDialog } from "@/components/admin/delete-car-dialog";
import { CAR_CATEGORY_LABELS, formatCurrency } from "@/lib/validations/car";

export default async function AdminCarsPage() {
  const cars = await prisma.car.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Armada Mobil</h1>
          <p className="text-gray-500 text-sm mt-1">Kelola foto, detail, dan status ketersediaan mobil</p>
        </div>
        <Link href="/admin/cars/new">
          <Button>
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Mobil
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {cars.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">
            Belum ada mobil terdaftar. Klik &ldquo;Tambah Mobil&rdquo; untuk menambahkan armada pertama.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-700 text-xs font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Foto</th>
                  <th className="py-3 px-4">Nama</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Harga / Hari</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cars.map((car) => (
                  <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4">
                      {car.images[0] ? (
                        <Image
                          src={car.images[0]}
                          alt={car.name}
                          width={80}
                          height={56}
                          className="h-14 w-20 rounded-lg object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="h-14 w-20 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-300 text-xs">
                          No foto
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-900">{car.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {car.brand} &middot; {car.licensePlate}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                        {CAR_CATEGORY_LABELS[car.category]}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                      {formatCurrency(car.pricePerDay.toNumber())}
                    </td>
                    <td className="py-3 px-4">
                      <CarStatusToggle carId={car.id} currentStatus={car.status} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/cars/${car.id}/edit`}
                          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </Link>
                        <DeleteCarDialog carId={car.id} carName={car.name} />
                      </div>
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