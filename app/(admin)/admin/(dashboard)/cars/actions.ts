"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { deleteCarImage, uploadCarImage } from "@/lib/upload";
import {
  ACTIVE_BOOKING_STATUSES,
  carFormSchema,
  carImageFilesSchema,
  carStatusSchema,
  createCarImagesSchema,
  type CarFormState,
} from "@/lib/validations/car";

export async function createCar(
  prevState: CarFormState,
  formData: FormData
): Promise<CarFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const fields = carFormSchema.safeParse({
    name: formData.get("name"),
    brand: formData.get("brand"),
    category: formData.get("category"),
    transmission: formData.get("transmission"),
    seats: formData.get("seats"),
    pricePerDay: formData.get("pricePerDay"),
    licensePlate: formData.get("licensePlate"),
    description: formData.get("description") || undefined,
  });

  const newFiles = formData.getAll("images").filter((value): value is File => value instanceof File);
  const images = createCarImagesSchema.safeParse(newFiles);

  if (!fields.success || !images.success) {
    return {
      message: "Periksa kembali inputan form",
      errors: {
        ...(fields.success ? {} : fields.error.flatten().fieldErrors),
        ...(!images.success ? { images: images.error.issues.map((i) => i.message) } : {}),
      },
    };
  }

  const uploadedImages: string[] = [];
  for (const file of images.data) {
    const url = await uploadCarImage(file);
    if (!url) {
      return { message: "Gagal mengunggah foto, coba lagi" };
    }
    uploadedImages.push(url);
  }

  const data = fields.data;
  try {
    await prisma.car.create({
      data: {
        name: data.name,
        brand: data.brand,
        category: data.category,
        transmission: data.transmission,
        seats: data.seats,
        pricePerDay: new Prisma.Decimal(data.pricePerDay),
        licensePlate: data.licensePlate,
        description: data.description,
        images: uploadedImages,
        status: "AVAILABLE",
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        message: "Nomor plat sudah terdaftar pada mobil lain",
        errors: { licensePlate: ["Nomor plat sudah digunakan"] },
      };
    }
    console.error("createCar error:", error);
    return { message: "Gagal menyimpan data mobil. Silakan coba lagi." };
  }

  revalidatePath("/admin/cars");
  revalidatePath("/");
  revalidatePath("/cars");
  redirect("/admin/cars");
}

export async function updateCar(
  carId: string,
  prevState: CarFormState,
  formData: FormData
): Promise<CarFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const existing = await prisma.car.findUnique({ where: { id: carId } });
  if (!existing) {
    return { message: "Mobil tidak ditemukan" };
  }

  const fields = carFormSchema.safeParse({
    name: formData.get("name"),
    brand: formData.get("brand"),
    category: formData.get("category"),
    transmission: formData.get("transmission"),
    seats: formData.get("seats"),
    pricePerDay: formData.get("pricePerDay"),
    licensePlate: formData.get("licensePlate"),
    description: formData.get("description") || undefined,
  });

  const keptImages = formData
    .getAll("imagesKept")
    .map((v) => v.toString())
    .filter((v) => v.length > 0);

  const newFiles = formData.getAll("images").filter((value): value is File => value instanceof File);
  const images = carImageFilesSchema.safeParse(newFiles);

  if (!fields.success) {
    return {
      message: "Periksa kembali inputan form",
      errors: fields.error.flatten().fieldErrors,
    };
  }

  if (!images.success) {
    return {
      message: "Periksa kembali file foto",
      errors: { images: images.error.issues.map((i) => i.message) },
    };
  }

  if (keptImages.length + images.data.length === 0) {
    return {
      message: "Mobil harus memiliki minimal 1 foto",
      errors: { images: ["Minimal 1 foto mobil wajib ada"] },
    };
  }

  const newImageUrls: string[] = [];
  for (const file of images.data) {
    const url = await uploadCarImage(file);
    if (!url) {
      return { message: "Gagal mengunggah foto, coba lagi" };
    }
    newImageUrls.push(url);
  }

  const finalImages = [...keptImages, ...newImageUrls];

  try {
    await prisma.car.update({
      where: { id: carId },
      data: {
        name: fields.data.name,
        brand: fields.data.brand,
        category: fields.data.category,
        transmission: fields.data.transmission,
        seats: fields.data.seats,
        pricePerDay: new Prisma.Decimal(fields.data.pricePerDay),
        licensePlate: fields.data.licensePlate,
        description: fields.data.description,
        images: finalImages,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        message: "Nomor plat sudah terdaftar pada mobil lain",
        errors: { licensePlate: ["Nomor plat sudah digunakan"] },
      };
    }
    console.error("updateCar error:", error);
    return { message: "Gagal memperbarui data mobil. Silakan coba lagi." };
  }

  const removedImages = existing.images.filter((url) => !finalImages.includes(url));
  await Promise.all(removedImages.map((url) => deleteCarImage(url)));

  revalidatePath("/admin/cars");
  revalidatePath("/");
  revalidatePath("/cars");
  redirect("/admin/cars");
}

export async function deleteCar(carId: string): Promise<{ success: boolean; message: string }> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) {
    return { success: false, message: "Mobil tidak ditemukan atau sudah dihapus." };
  }

  const activeBookings = await prisma.booking.count({
    where: { carId, status: { in: [...ACTIVE_BOOKING_STATUSES] } },
  });

  if (activeBookings > 0) {
    return {
      success: false,
      message: `Mobil "${car.name}" tidak dapat dihapus karena masih memiliki ${activeBookings} booking aktif (PENDING/CONFIRMED/ONGOING). Selesaikan atau batalkan booking tersebut terlebih dahulu.`,
    };
  }

  await prisma.car.delete({ where: { id: carId } });
  await Promise.all(car.images.map((url) => deleteCarImage(url)));

  revalidatePath("/admin/cars");
  revalidatePath("/");
  revalidatePath("/cars");
  return { success: true, message: "Mobil berhasil dihapus." };
}

export async function updateCarStatus(
  carId: string,
  rawStatus: string
): Promise<{ success: boolean; message: string }> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const status = carStatusSchema.safeParse(rawStatus);
  if (!status.success) {
    return { success: false, message: "Status mobil tidak valid" };
  }

  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) {
    return { success: false, message: "Mobil tidak ditemukan" };
  }

  await prisma.car.update({ where: { id: carId }, data: { status: status.data } });

  revalidatePath("/admin/cars");
  revalidatePath("/");
  revalidatePath("/cars");
  return { success: true, message: "Status mobil berhasil diperbarui" };
}