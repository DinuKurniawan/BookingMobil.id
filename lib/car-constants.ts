export const CAR_CATEGORIES = ["MPV", "SUV", "SEDAN", "HATCHBACK", "VAN"] as const;
export const TRANSMISSIONS = ["MANUAL", "AUTOMATIC"] as const;
export const CAR_STATUSES = ["AVAILABLE", "MAINTENANCE", "INACTIVE"] as const;

export const CAR_STATUS_LABELS: Record<(typeof CAR_STATUSES)[number], string> = {
  AVAILABLE: "Tersedia",
  MAINTENANCE: "Perawatan",
  INACTIVE: "Nonaktif",
};

export const CAR_CATEGORY_LABELS: Record<(typeof CAR_CATEGORIES)[number], string> = {
  MPV: "MPV",
  SUV: "SUV",
  SEDAN: "Sedan",
  HATCHBACK: "Hatchback",
  VAN: "Van",
};

export const TRANSMISSION_LABELS: Record<(typeof TRANSMISSIONS)[number], string> = {
  MANUAL: "Manual",
  AUTOMATIC: "Automatis",
};

export const ACTIVE_BOOKING_STATUSES = ["PENDING", "PAYMENT_REVIEW", "CONFIRMED", "ONGOING"] as const;

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB per file

export function formatCurrency(value: number | string): string {
  const num = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
}
