import { prisma } from "@/lib/prisma";
import { BankAccountList } from "./bank-account-list";
import { BankAccountForm } from "./bank-account-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const accounts = await prisma.bankAccount.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
        <p className="text-gray-500 text-sm mt-1">
          Atur rekening bank tujuan transfer pembayaran
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Tambah Rekening Baru</h2>
          <p className="text-sm text-gray-500 mt-1">
            Tambahkan rekening bank tujuan transfer untuk ditampilkan ke pelanggan
          </p>
        </div>

        <BankAccountForm />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Daftar Rekening</h2>
          <p className="text-sm text-gray-500 mt-1">
            {accounts.length} rekening tersimpan. Aktifkan/nonaktifkan untuk mengatur yang tampil ke pelanggan.
          </p>
        </div>

        <BankAccountList accounts={accounts} />
      </div>
    </div>
  );
}
