"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

const bankAccountSchema = z.object({
  bankName: z.string().trim().min(1, "Nama bank wajib diisi"),
  accountNumber: z.string().trim().min(1, "Nomor rekening wajib diisi"),
  accountName: z.string().trim().min(1, "Atas nama wajib diisi"),
});

export type BankAccountFormState = {
  errors?: Record<string, string[] | undefined>;
  message?: string;
};

export async function addBankAccount(
  prevState: BankAccountFormState,
  formData: FormData
): Promise<BankAccountFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = bankAccountSchema.safeParse({
    bankName: formData.get("bankName"),
    accountNumber: formData.get("accountNumber"),
    accountName: formData.get("accountName"),
  });

  if (!parsed.success) {
    return {
      message: "Periksa kembali inputan form",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.bankAccount.create({ data: parsed.data });

  revalidatePath("/admin/settings");
  return { message: "Rekening berhasil ditambahkan" };
}

export async function updateBankAccount(
  id: string,
  prevState: BankAccountFormState,
  formData: FormData
): Promise<BankAccountFormState> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const parsed = bankAccountSchema.safeParse({
    bankName: formData.get("bankName"),
    accountNumber: formData.get("accountNumber"),
    accountName: formData.get("accountName"),
  });

  if (!parsed.success) {
    return {
      message: "Periksa kembali inputan form",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.bankAccount.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/admin/settings");
  return { message: "Rekening berhasil diperbarui" };
}

export async function toggleBankAccountStatus(id: string, isActive: boolean) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await prisma.bankAccount.update({
    where: { id },
    data: { isActive },
  });

  revalidatePath("/admin/settings");
}

export async function deleteBankAccount(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  await prisma.bankAccount.delete({ where: { id } });

  revalidatePath("/admin/settings");
}
