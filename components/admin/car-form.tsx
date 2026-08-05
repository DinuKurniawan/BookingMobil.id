"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { CarCategory, Transmission } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  CAR_CATEGORIES,
  CAR_CATEGORY_LABELS,
  TRANSMISSIONS,
  TRANSMISSION_LABELS,
  type CarFormState,
} from "@/lib/validations/car";
import { cn } from "@/lib/utils";

export type CarFormData = {
  id: string;
  name: string;
  brand: string;
  category: CarCategory;
  transmission: Transmission;
  seats: number;
  pricePerDay: number;
  licensePlate: string;
  description: string | null;
  images: string[];
};

type Props = {
  action: (prevState: CarFormState, formData: FormData) => Promise<CarFormState>;
  submitLabel: string;
  car?: CarFormData;
};

const initialState: CarFormState = {};

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 transition-colors outline-none";

const labelClass = "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return <p className="mt-1 text-xs font-medium text-red-600">{errors[0]}</p>;
}

export function CarForm({ action, submitLabel, car }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  const [keptImages, setKeptImages] = useState<string[]>(car?.images ?? []);
  const [newFiles, setNewFiles] = useState<{ file: File; preview: string }[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const previewUrls = useRef<string[]>([]);
  const hiddenFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      previewUrls.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const totalAfter = keptImages.length + newFiles.length + files.length;
    if (totalAfter > 10) {
      setImageError("Maksimal 10 foto");
      e.target.value = "";
      return;
    }

    const newPreviews = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    previewUrls.current.push(...newPreviews.map((n) => n.preview));

    setNewFiles((prev) => [...prev, ...newPreviews]);
    setImageError(null);

    e.target.value = "";
  };

  const removeNewFile = (preview: string) => {
    URL.revokeObjectURL(preview);
    previewUrls.current = previewUrls.current.filter((url) => url !== preview);
    setNewFiles((prev) => prev.filter((item) => item.preview !== preview));
    setImageError(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (keptImages.length + newFiles.length === 0) {
      e.preventDefault();
      setImageError("Minimal 1 foto mobil wajib diunggah");
      return;
    }

    const dt = new DataTransfer();
    newFiles.forEach(({ file }) => dt.items.add(file));
    if (hiddenFileInputRef.current) {
      hiddenFileInputRef.current.files = dt.files;
    }
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-5" noValidate>
      {state.message && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="name" className={labelClass}>
          Nama Mobil <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={car?.name ?? ""}
          placeholder="Contoh: Toyota Avanza 1.5 G"
          className={cn(inputClass, state.errors?.name && "border-red-400")}
        />
        <FieldError errors={state.errors?.name} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="brand" className={labelClass}>
            Brand <span className="text-red-500">*</span>
          </label>
          <input
            id="brand"
            name="brand"
            type="text"
            required
            defaultValue={car?.brand ?? ""}
            placeholder="Contoh: Toyota"
            className={cn(inputClass, state.errors?.brand && "border-red-400")}
          />
          <FieldError errors={state.errors?.brand} />
        </div>

        <div>
          <label htmlFor="category" className={labelClass}>
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={car?.category ?? ""}
            className={cn(inputClass, state.errors?.category && "border-red-400")}
          >
            <option value="" disabled>
              Pilih kategori
            </option>
            {CAR_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CAR_CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
          <FieldError errors={state.errors?.category} />
        </div>

        <div>
          <label htmlFor="transmission" className={labelClass}>
            Transmisi <span className="text-red-500">*</span>
          </label>
          <select
            id="transmission"
            name="transmission"
            required
            defaultValue={car?.transmission ?? ""}
            className={cn(inputClass, state.errors?.transmission && "border-red-400")}
          >
            <option value="" disabled>
              Pilih transmisi
            </option>
            {TRANSMISSIONS.map((t) => (
              <option key={t} value={t}>
                {TRANSMISSION_LABELS[t]}
              </option>
            ))}
          </select>
          <FieldError errors={state.errors?.transmission} />
        </div>

        <div>
          <label htmlFor="seats" className={labelClass}>
            Jumlah Kursi <span className="text-red-500">*</span>
          </label>
          <input
            id="seats"
            name="seats"
            type="number"
            min={1}
            max={60}
            required
            defaultValue={car?.seats ?? ""}
            placeholder="Contoh: 7"
            className={cn(inputClass, state.errors?.seats && "border-red-400")}
          />
          <FieldError errors={state.errors?.seats} />
        </div>

        <div>
          <label htmlFor="pricePerDay" className={labelClass}>
            Harga per Hari (Rp) <span className="text-red-500">*</span>
          </label>
          <input
            id="pricePerDay"
            name="pricePerDay"
            type="number"
            min={1}
            step="any"
            required
            defaultValue={car?.pricePerDay ?? ""}
            placeholder="Contoh: 350000"
            className={cn(inputClass, state.errors?.pricePerDay && "border-red-400")}
          />
          <FieldError errors={state.errors?.pricePerDay} />
        </div>

        <div>
          <label htmlFor="licensePlate" className={labelClass}>
            Nomor Plat <span className="text-red-500">*</span>
          </label>
          <input
            id="licensePlate"
            name="licensePlate"
            type="text"
            required
            defaultValue={car?.licensePlate ?? ""}
            placeholder="Contoh: B 1234 XYZ"
            className={cn(inputClass, state.errors?.licensePlate && "border-red-400")}
          />
          <FieldError errors={state.errors?.licensePlate} />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={car?.description ?? ""}
          placeholder="Deskripsi singkat mobil, fasilitas, ketentuan sewa, dll."
          className={cn(inputClass, "resize-y", state.errors?.description && "border-red-400")}
        />
        <FieldError errors={state.errors?.description} />
      </div>

      <div>
        <label htmlFor="images" className={labelClass}>
          Foto Mobil <span className="text-red-500">*</span>
        </label>
        <input
          id="images"
          name="imagesVisible"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className={cn(
            "w-full px-4 py-2.5 rounded-lg border border-dashed border-gray-300 text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-600 hover:file:bg-blue-100 cursor-pointer transition-colors",
            (imageError || state.errors?.images) && "border-red-400"
          )}
        />
        <p className="mt-1 text-xs text-gray-400">
          Maksimal 10 foto, format JPG/PNG/WEBP/GIF, maksimal 5MB per file.
        </p>
        <FieldError errors={imageError ? [imageError] : state.errors?.images} />

        {(keptImages.length > 0 || newFiles.length > 0) && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {keptImages.map((url) => (
              <div key={url} className="relative group rounded-lg overflow-hidden border border-gray-200">
                <input type="hidden" name="imagesKept" value={url} />
                <Image src={url} alt="Foto mobil" width={200} height={96} unoptimized className="h-24 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setKeptImages((prev) => prev.filter((u) => u !== url))}
                  className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  aria-label="Hapus foto"
                >
                  &times;
                </button>
              </div>
            ))}
            {newFiles.map(({ file, preview }) => (
              <div key={preview} className="relative group rounded-lg overflow-hidden border border-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt={file.name} className="h-24 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeNewFile(preview)}
                  className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  aria-label="Hapus foto"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <input ref={hiddenFileInputRef} type="file" name="images" multiple className="hidden" />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending} className="min-w-40">
          {pending ? "Menyimpan..." : submitLabel}
        </Button>
        <Button type="button" variant="outline" onClick={() => history.back()}>
          Batal
        </Button>
      </div>
    </form>
  );
}
