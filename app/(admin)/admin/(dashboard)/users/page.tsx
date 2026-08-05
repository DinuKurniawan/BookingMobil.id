import { prisma } from "@/lib/prisma";

const ROLE_LABELS: Record<string, string> = {
  SUPERADMIN: "Super Admin",
  STAFF: "Staff",
};

const ROLE_COLORS: Record<string, string> = {
  SUPERADMIN: "bg-purple-100 text-purple-700",
  STAFF: "bg-slate-100 text-slate-600",
};

export default async function AdminUsersPage() {
  const admins = await prisma.admin.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Daftar Pengguna (Admin)</h1>
        <p className="text-gray-500 text-sm mt-1">
          {admins.length} akun terdaftar di panel admin
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 text-xs font-semibold uppercase border-b border-gray-200">
              <tr>
                <th className="py-3 px-5">Nama</th>
                <th className="py-3 px-5">Email</th>
                <th className="py-3 px-5">Role</th>
                <th className="py-3 px-5 whitespace-nowrap">Tanggal Daftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-5">
                    <p className="font-semibold text-gray-900">{admin.name}</p>
                  </td>
                  <td className="py-3 px-5">
                    <span className="font-mono text-xs text-gray-500">{admin.email}</span>
                  </td>
                  <td className="py-3 px-5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[admin.role] ?? "bg-gray-100 text-gray-600"}`}
                    >
                      {ROLE_LABELS[admin.role] ?? admin.role}
                    </span>
                  </td>
                  <td className="py-3 px-5 whitespace-nowrap text-xs text-gray-500">
                    {new Date(admin.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {admins.length === 0 && (
          <div className="p-12 text-center text-sm text-gray-400">
            Belum ada akun admin terdaftar.
          </div>
        )}
      </div>
    </div>
  );
}
