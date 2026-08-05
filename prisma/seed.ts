import { PrismaClient, Role, CarCategory, Transmission, CarStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Seed Default Admin
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.admin.upsert({
    where: { email: "admin@example.com" },
    update: {
      password: hashedPassword,
      name: "Super Admin",
      role: Role.SUPERADMIN,
    },
    create: {
      email: "admin@example.com",
      password: hashedPassword,
      name: "Super Admin",
      role: Role.SUPERADMIN,
    },
  });
  console.log(`✅ Admin seeded: ${admin.email}`);

  // 2. Seed 5 Sample Cars
  const carsData = [
    {
      name: "Toyota Avanza",
      brand: "Toyota",
      category: CarCategory.MPV,
      transmission: Transmission.MANUAL,
      seats: 7,
      pricePerDay: 350000,
      images: ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800"],
      description:
        "Toyota Avanza All New dengan AC double blower, kabin luas, dan irit bahan bakar. Sangat cocok untuk perjalanan keluarga.",
      status: CarStatus.AVAILABLE,
      licensePlate: "B 1234 ABC",
    },
    {
      name: "Honda HR-V",
      brand: "Honda",
      category: CarCategory.SUV,
      transmission: Transmission.AUTOMATIC,
      seats: 5,
      pricePerDay: 500000,
      images: ["https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=800"],
      description:
        "Honda HR-V bergaya sporty dengan sunroof, fitur keselamatan canggih, dan kenyamanan berkendara yang luar biasa.",
      status: CarStatus.AVAILABLE,
      licensePlate: "B 5678 DEF",
    },
    {
      name: "Toyota Innova Zenix",
      brand: "Toyota",
      category: CarCategory.MPV,
      transmission: Transmission.AUTOMATIC,
      seats: 7,
      pricePerDay: 750000,
      images: ["https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800"],
      description:
        "Innova Zenix Hybrid dengan efisiensi bahan bakar maksimal, captain seat mewah, dan kenyamanan suspensi kelas atas.",
      status: CarStatus.AVAILABLE,
      licensePlate: "B 9101 GHI",
    },
    {
      name: "Mitsubishi Pajero Sport",
      brand: "Mitsubishi",
      category: CarCategory.SUV,
      transmission: Transmission.AUTOMATIC,
      seats: 7,
      pricePerDay: 950000,
      images: ["https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800"],
      description:
        "SUV tangguh 4x4 untuk segala medan dengan interior kulit premium dan sistem audio kelas atas.",
      status: CarStatus.AVAILABLE,
      licensePlate: "B 1122 JKL",
    },
    {
      name: "Honda Brio",
      brand: "Honda",
      category: CarCategory.HATCHBACK,
      transmission: Transmission.AUTOMATIC,
      seats: 5,
      pricePerDay: 300000,
      images: ["https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800"],
      description:
        "Mobil lincah, compact, dan hemat BBM. Sangat praktis untuk mobilitas perkotaan.",
      status: CarStatus.AVAILABLE,
      licensePlate: "B 3344 MNO",
    },
  ];

  for (const car of carsData) {
    const seededCar = await prisma.car.upsert({
      where: { licensePlate: car.licensePlate },
      update: car,
      create: car,
    });
    console.log(`✅ Car seeded: ${seededCar.name} (${seededCar.licensePlate})`);
  }

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
