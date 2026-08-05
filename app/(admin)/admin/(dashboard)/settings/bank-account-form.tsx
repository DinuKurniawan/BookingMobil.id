"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { addBankAccount, type BankAccountFormState } from "./actions";
import { cn } from "@/lib/utils";

const initialState: BankAccountFormState = {};

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 transition-colors outline-none";

const labelClass = "block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return <p className="mt-1 text-xs font-medium text-red-600">{errors[0]}</p>;
}

export function BankAccountForm() {
  const [state, formAction, pending] = useActionState(addBankAccount, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.message && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-xs font-medium">
          {state.message}
        </div>
      )}

      <div>
        <label htmlFor="bankName" className={labelClass}>
          Nama Bank <span className="text-red-500">*</span>
        </label>
        <input
          id="bankName"
          name="bankName"
          type="text"
          required
          placeholder="Contoh: Bank BCA"
          className={cn(inputClass, state.errors?.bankName && "border-red-400")}
        />
        <FieldError errors={state.errors?.bankName} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="accountNumber" className={labelClass}>
            Nomor Rekening <span className="text-red-500">*</span>
          </label>
          <input
            id="accountNumber"
            name="accountNumber"
            type="text"
            required
            placeholder="Contoh: 1234567890"
            className={cn(inputClass, state.errors?.accountNumber && "border-red-400")}
          />
          <FieldError errors={state.errors?.accountNumber} />
        </div>

        <div>
          <label htmlFor="accountName" className={labelClass}>
            Atas Nama <span className="text-red-500">*</span>
          </label>
          <input
            id="accountName"
            name="accountName"
            type="text"
            required
            placeholder="Contoh: PT Booking Mobil Indonesia"
            className={cn(inputClass, state.errors?.accountName && "border-red-400")}
          />
          <FieldError errors={state.errors?.accountName} />
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Tambah Rekening"}
      </Button>
    </form>
  );
}
