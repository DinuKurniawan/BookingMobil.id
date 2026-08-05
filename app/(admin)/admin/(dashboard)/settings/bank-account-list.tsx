"use client";

import { useState } from "react";
import type { BankAccount } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  deleteBankAccount,
  toggleBankAccountStatus,
  updateBankAccount,
  type BankAccountFormState,
} from "./actions";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 outline-none";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return <p className="mt-1 text-xs font-medium text-red-600">{errors[0]}</p>;
}

function EditForm({
  account,
  onCancel,
}: {
  account: BankAccount;
  onCancel: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateBankAccount(account.id, {} as BankAccountFormState, formData);
    if (result.errors) {
      setErrors(result.errors);
    } else {
      onCancel();
    }
    setPending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          name="bankName"
          defaultValue={account.bankName}
          placeholder="Nama bank"
          className={cn(inputClass, errors?.bankName && "border-red-400")}
        />
        <input
          name="accountNumber"
          defaultValue={account.accountNumber}
          placeholder="No. rekening"
          className={cn(inputClass, errors?.accountNumber && "border-red-400")}
        />
        <input
          name="accountName"
          defaultValue={account.accountName}
          placeholder="Atas nama"
          className={cn(inputClass, errors?.accountName && "border-red-400")}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Menyimpan..." : "Simpan"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  );
}

export function BankAccountList({ accounts }: { accounts: BankAccount[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (accounts.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-4 text-center">
        Belum ada rekening tersimpan
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {accounts.map((account) => (
        <div
          key={account.id}
          className={cn(
            "rounded-lg border p-4",
            account.isActive
              ? "border-gray-200"
              : "border-gray-100 bg-gray-50 opacity-60"
          )}
        >
          {editingId === account.id ? (
            <EditForm account={account} onCancel={() => setEditingId(null)} />
          ) : (
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {account.bankName}
                  </span>
                  {account.isActive ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-500">
                      Nonaktif
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 font-mono">{account.accountNumber}</p>
                <p className="text-xs text-gray-400">a.n. {account.accountName}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => toggleBankAccountStatus(account.id, !account.isActive)}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  {account.isActive ? "Nonaktifkan" : "Aktifkan"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(account.id)}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteBankAccount(account.id)}
                  className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
