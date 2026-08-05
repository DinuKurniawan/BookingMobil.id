"use client";

import { useState, useActionState } from "react";
import { createBookingAction } from "@/app/actions/booking";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/validations/car";
import type { BookingActionState } from "@/lib/validations/booking";

interface BookingFormProps {
  car: {
    id: string;
    name: string;
    brand: string;
    pricePerDay: number;
    images: string[];
  };
  initialStartDate?: string;
  initialEndDate?: string;
}

const STEPS = [
  { id: 1, title: "Detail Booking", description: "Jadwal & Biaya", icon: "📅" },
  { id: 2, title: "Data Diri", description: "Informasi Penyewa", icon: "👤" },
  { id: 3, title: "Upload Identitas", description: "KTP/SIM & Catatan", icon: "🪪" },
];

export function BookingForm({
  car,
  initialStartDate = "",
  initialEndDate = "",
}: BookingFormProps) {
  const [state, formAction, isPending] = useActionState<BookingActionState, FormData>(
    createBookingAction,
    {}
  );

  const todayStr = new Date().toISOString().split("T")[0];

  // Current Step state (1 | 2 | 3)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [stepError, setStepError] = useState<string | null>(null);

  // Form Field States
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [identityNumber, setIdentityNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryOption, setDeliveryOption] = useState<string>("PICKUP");
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Calculate rental duration & total price
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  let totalDays = 0;
  if (start && end && end > start) {
    const diffTime = Math.abs(end.getTime() - start.getTime());
    totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  const totalPrice = totalDays * car.pricePerDay;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Ukuran foto maksimal 5MB");
        return;
      }
      setIdentityFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Step 1 Validation -> Move to Step 2
  const goToStep2 = () => {
    setStepError(null);
    if (!startDate || !endDate) {
      setStepError("Mohon tentukan tanggal mulai dan selesai sewa");
      return;
    }
    if (totalDays <= 0) {
      setStepError("Tanggal selesai sewa harus setelah tanggal mulai sewa");
      return;
    }
    setCurrentStep(2);
  };

  // Step 2 Validation -> Move to Step 3
  const goToStep3 = () => {
    setStepError(null);
    if (!customerName.trim() || customerName.trim().length < 2) {
      setStepError("Nama lengkap minimal 2 karakter wajib diisi");
      return;
    }
    const phoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{7,11}$/;
    if (!phoneRegex.test(customerPhone.trim())) {
      setStepError("Nomor HP tidak valid (contoh: 081234567890)");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail.trim())) {
      setStepError("Format email tidak valid (contoh: nama@domain.com)");
      return;
    }
    if (!customerAddress.trim() || customerAddress.trim().length < 5) {
      setStepError("Alamat lengkap minimal 5 karakter wajib diisi");
      return;
    }
    setCurrentStep(3);
  };

  return (
    <div className="space-y-8">
      {/* Visual Step Indicator Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
        <div className="relative">
          {/* Connecting Progress Line */}
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-slate-200 -translate-y-1/2 z-0 hidden sm:block">
            <div
              className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
              style={{
                width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-3 gap-2 relative z-10">
            {STEPS.map((stepItem) => {
              const isActive = currentStep === stepItem.id;
              const isCompleted = currentStep > stepItem.id;

              return (
                <button
                  key={stepItem.id}
                  type="button"
                  onClick={() => {
                    if (isCompleted) {
                      setStepError(null);
                      setCurrentStep(stepItem.id);
                    }
                  }}
                  disabled={!isCompleted && !isActive}
                  className={`flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl transition-all text-left ${
                    isActive
                      ? "bg-blue-50/80 border border-blue-200/80 shadow-xs"
                      : isCompleted
                      ? "hover:bg-slate-50 cursor-pointer"
                      : "opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all flex-shrink-0 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-105"
                        : isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}
                  >
                    {isCompleted ? "✓" : stepItem.id}
                  </div>

                  <div className="text-center sm:text-left min-w-0">
                    <span
                      className={`text-xs font-bold block truncate ${
                        isActive
                          ? "text-blue-700"
                          : isCompleted
                          ? "text-slate-900"
                          : "text-slate-500"
                      }`}
                    >
                      {stepItem.title}
                    </span>
                    <span className="text-[11px] text-slate-400 hidden sm:block truncate">
                      {stepItem.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Global Server Action Error Alert */}
      {state.message && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-start gap-3 animate-[fadeIn_0.2s_ease-out]">
          <svg
            className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-bold text-red-800">Gagal Memproses Pemesanan</p>
            <p className="mt-0.5 text-xs">{state.message}</p>
          </div>
        </div>
      )}

      {/* Step Validation Error Alert */}
      {stepError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-3">
          <svg className="w-5 h-5 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{stepError}</span>
        </div>
      )}

      {/* Main Single Form - Executes Server Action */}
      <form action={formAction} className="space-y-6">
        {/* Hidden Input for Car ID */}
        <input type="hidden" name="carId" value={car.id} />

        {/* STEP 1: DETAIL BOOKING */}
        <div className={currentStep !== 1 ? "hidden" : "space-y-6"}>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Langkah 1: Jadwal Sewa Mobil
                </h3>
                <p className="text-xs text-slate-500">
                  Tentukan tanggal mulai dan selesai penyewaan armada.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Tanggal Mulai Sewa <span className="text-red-500">*</span>
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  min={todayStr}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all"
                />
                {state.errors?.startDate && (
                  <p className="text-xs text-red-500 mt-1">{state.errors.startDate[0]}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Tanggal Selesai Sewa <span className="text-red-500">*</span>
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  min={startDate || todayStr}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all"
                />
                {state.errors?.endDate && (
                  <p className="text-xs text-red-500 mt-1">{state.errors.endDate[0]}</p>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Summary Card for Step 1 */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-4 border border-slate-800">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Kalkulasi Biaya Sewa
              </h4>
              <span className="text-xs font-semibold text-blue-300 bg-blue-500/20 px-2.5 py-1 rounded-full border border-blue-500/30">
                Otomatis
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Tarif Sewa Harian ({car.name}):</span>
                <span className="font-semibold text-white">{formatCurrency(car.pricePerDay)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Durasi Sewa:</span>
                <span className="font-semibold text-white">
                  {totalDays > 0 ? `${totalDays} Hari` : "Tentukan tanggal mulai & selesai"}
                </span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="font-bold text-white">Estimasi Total Pembayaran:</span>
                <span className="text-2xl font-black text-blue-400">
                  {totalDays > 0 ? formatCurrency(totalPrice) : formatCurrency(car.pricePerDay)}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Button Step 1 */}
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={goToStep2}
              className="bg-blue-600 hover:bg-blue-500 font-bold px-6 py-3 text-sm shadow-md shadow-blue-600/30"
            >
              Lanjut ke Data Diri →
            </Button>
          </div>
        </div>

        {/* STEP 2: DATA DIRI */}
        <div className={currentStep !== 2 ? "hidden" : "space-y-6"}>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Langkah 2: Data Diri Penyewa
                </h3>
                <p className="text-xs text-slate-500">
                  Isi data kontak dan domisili Anda dengan benar.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="customerName"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  placeholder="Contoh: Ahmad Subagja"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all"
                />
                {state.errors?.customerName && (
                  <p className="text-xs text-red-500 mt-1">{state.errors.customerName[0]}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="customerPhone"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  No. HP / WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  id="customerPhone"
                  name="customerPhone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Contoh: 081234567890"
                  value={customerPhone}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "");
                    setCustomerPhone(digits);
                  }}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all"
                />
                {state.errors?.customerPhone && (
                  <p className="text-xs text-red-500 mt-1">{state.errors.customerPhone[0]}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="customerEmail"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Alamat Email <span className="text-red-500">*</span>
              </label>
              <input
                id="customerEmail"
                name="customerEmail"
                type="email"
                placeholder="nama@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all"
              />
              {state.errors?.customerEmail && (
                <p className="text-xs text-red-500 mt-1">{state.errors.customerEmail[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="customerAddress"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Alamat Lengkap (Domisili) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="customerAddress"
                name="customerAddress"
                rows={3}
                placeholder="Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan, Kota"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all"
              />
            {state.errors?.customerAddress && (
                <p className="text-xs text-red-500 mt-1">{state.errors.customerAddress[0]}</p>
              )}
            </div>

            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-2">
                Metode Pengambilan Mobil <span className="text-red-500">*</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryOption === "PICKUP"
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="PICKUP"
                    checked={deliveryOption === "PICKUP"}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    deliveryOption === "PICKUP" ? "border-blue-600" : "border-slate-300"
                  }`}>
                    {deliveryOption === "PICKUP" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div>
                    <span className={`text-sm font-bold block ${
                      deliveryOption === "PICKUP" ? "text-blue-700" : "text-slate-700"
                    }`}>
                      🏢 Ambil di Tempat
                    </span>
                    <span className="text-xs text-slate-500">
                      Saya akan datang langsung ke lokasi rental
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    deliveryOption === "DELIVERY"
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="deliveryOption"
                    value="DELIVERY"
                    checked={deliveryOption === "DELIVERY"}
                    onChange={(e) => setDeliveryOption(e.target.value)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    deliveryOption === "DELIVERY" ? "border-blue-600" : "border-slate-300"
                  }`}>
                    {deliveryOption === "DELIVERY" && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div>
                    <span className={`text-sm font-bold block ${
                      deliveryOption === "DELIVERY" ? "text-blue-700" : "text-slate-700"
                    }`}>
                      🚚 Diantar ke Alamat
                    </span>
                    <span className="text-xs text-slate-500">
                      Mobil diantar ke alamat domisili saya
                    </span>
                  </div>
                </label>
              </div>
              {state.errors?.deliveryOption && (
                <p className="text-xs text-red-500 mt-1">{state.errors.deliveryOption[0]}</p>
              )}
            </div>
          </div>

          {/* Navigation Buttons Step 2 */}
          <div className="flex justify-between pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStepError(null);
                setCurrentStep(1);
              }}
              className="px-5 py-3 text-sm font-semibold"
            >
              ← Kembali
            </Button>

            <Button
              type="button"
              onClick={goToStep3}
              className="bg-blue-600 hover:bg-blue-500 font-bold px-6 py-3 text-sm shadow-md shadow-blue-600/30"
            >
              Lanjut ke Upload Identitas →
            </Button>
          </div>
        </div>

        {/* STEP 3: UPLOAD IDENTITAS & SUBMIT */}
        <div className={currentStep !== 3 ? "hidden" : "space-y-6"}>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Langkah 3: Verifikasi Identitas &amp; Konfirmasi
                </h3>
                <p className="text-xs text-slate-500">
                  Unggah kartu identitas resmi Anda (KTP/SIM) untuk verifikasi.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="identityNumber"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Nomor Identitas KTP / SIM <span className="text-red-500">*</span>
              </label>
              <input
                id="identityNumber"
                name="identityNumber"
                type="text"
                inputMode="numeric"
                placeholder="16 Digit NIK KTP / No. SIM"
                value={identityNumber}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  setIdentityNumber(digits);
                }}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all"
              />
              {state.errors?.identityNumber && (
                <p className="text-xs text-red-500 mt-1">{state.errors.identityNumber[0]}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="identityFile"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Upload Foto KTP / SIM <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <label
                  htmlFor="identityFile"
                  className="cursor-pointer px-4 py-3 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl bg-slate-50 hover:bg-blue-50/50 text-slate-600 hover:text-blue-600 transition-all flex items-center gap-2 text-sm font-medium w-full sm:w-auto justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {identityFile ? identityFile.name : "Pilih Foto KTP/SIM"}
                </label>
                <input
                  id="identityFile"
                  name="identityFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  required
                  className="hidden"
                />
                <span className="text-xs text-slate-400">
                  Format: JPG, PNG, WEBP (Maksimal 5MB)
                </span>
              </div>
              {state.errors?.identityFile && (
                <p className="text-xs text-red-500 mt-1">{state.errors.identityFile[0]}</p>
              )}

              {previewUrl && (
                <div className="mt-3 relative w-48 h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview KTP/SIM"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-semibold px-2 py-1 bg-black/60 rounded-md">
                      Preview Foto
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="notes"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Catatan Tambahan (Opsional)
              </label>
              <input
                id="notes"
                name="notes"
                type="text"
                placeholder="Lokasi penjemputan khusus, permintaan sopir, dll."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Final Summary Card before submitting */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg space-y-4 border border-slate-800">
            <h4 className="text-base font-bold border-b border-slate-800 pb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ringkasan Akhir Pemesanan
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 block">Armada Mobil:</span>
                <span className="font-semibold text-white text-sm">{car.name} ({car.brand})</span>
              </div>

              <div>
                <span className="text-slate-400 block">Nama Pemesan:</span>
                <span className="font-semibold text-white text-sm">{customerName || "-"}</span>
              </div>

              <div>
                <span className="text-slate-400 block">Jadwal Sewa:</span>
                <span className="font-semibold text-white">
                  {startDate} s/d {endDate} ({totalDays} Hari)
                </span>
              </div>

              <div>
                <span className="text-slate-400 block">Metode Pengambilan:</span>
                <span className="font-semibold text-white text-sm">
                  {deliveryOption === "PICKUP" ? "🏢 Ambil di Tempat" : "🚚 Diantar ke Alamat"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block">Nomor WhatsApp:</span>
                <span className="font-semibold text-white">{customerPhone || "-"}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
              <span className="font-bold text-white">Total Tagihan:</span>
              <span className="text-2xl font-black text-blue-400">
                {totalDays > 0 ? formatCurrency(totalPrice) : formatCurrency(car.pricePerDay)}
              </span>
            </div>
          </div>

          {/* Action Buttons Step 3 */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setStepError(null);
                setCurrentStep(2);
              }}
              className="w-full sm:w-auto px-5 py-3 text-sm font-semibold"
            >
              ← Kembali ke Data Diri
            </Button>

            <Button
              type="submit"
              size="lg"
              disabled={isPending || totalDays <= 0 || !identityFile}
              className="w-full sm:w-auto px-8 py-3.5 text-base font-bold bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Memproses Server Action...
                </span>
              ) : (
                `Konfirmasi & Buat Pemesanan (${totalDays > 0 ? formatCurrency(totalPrice) : formatCurrency(car.pricePerDay)})`
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
