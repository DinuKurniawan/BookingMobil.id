import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const getCar = cache(async (id: string) => {
  return prisma.car.findUnique({ where: { id } });
});
