import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateCar } from "../../actions";
import { CarForm } from "@/components/admin/car-form";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const car = await prisma.car.findUnique({ where: { id } });

  if (!car) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <Link href="/admin/cars" className="text-sm font-medium text-blue-600 hover:underline">
          &larr; Kembali ke daftar mobil
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Mobil</h1>
        <p className="text-gray-500 text-sm mt-1">Perbarui detail mobil {car.name}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <CarForm
          key={car.id}
          car={{
            id: car.id,
            name: car.name,
            brand: car.brand,
            category: car.category,
            transmission: car.transmission,
            seats: car.seats,
            pricePerDay: car.pricePerDay.toNumber(),
            licensePlate: car.licensePlate,
            description: car.description,
            images: car.images,
          }}
          action={updateCar.bind(null, car.id)}
          submitLabel="Simpan Perubahan"
        />
      </div>
    </div>
  );
}