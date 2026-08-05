/**
 * Central Configuration for BookingMobil.id
 * Single source of truth for bank accounts, file upload limits, and email settings.
 */

import { prisma } from "@/lib/prisma";

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
  isActive: boolean;
}

export async function getBankAccounts(): Promise<BankAccount[]> {
  try {
    const accounts = await prisma.bankAccount.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "asc" },
    });

    if (accounts.length === 0) {
      // Fallback to env defaults if no accounts in DB
      return [
        {
          bankName: process.env.BANK_FALLBACK_NAME ?? "Bank BCA",
          accountNumber: process.env.BANK_FALLBACK_NUMBER ?? "1234567890",
          accountName: process.env.BANK_FALLBACK_HOLDER ?? "PT BOOKING MOBIL INDONESIA",
          isActive: true,
        },
      ];
    }

    return accounts;
  } catch {
    return [
      {
        bankName: "Bank BCA",
        accountNumber: "1234567890",
        accountName: "PT BOOKING MOBIL INDONESIA",
        isActive: true,
      },
    ];
  }
}

export const MAX_PAYMENT_PROOF_SIZE = 5 * 1024 * 1024; // 5MB limit
export const ALLOWED_PAYMENT_PROOF_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

export const ADMIN_NOTIFICATION_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL || "admin@bookingmobil.com";
export const EMAIL_FROM =
  process.env.EMAIL_FROM || "Booking Mobil <noreply@bookingmobil.com>";
