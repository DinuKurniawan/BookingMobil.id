import { CAR_CATEGORIES, CAR_CATEGORY_LABELS } from "@/lib/validations/car";

export function HeroSearchForm() {
  const today = new Date().toISOString().split("T")[0];

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 transition-all";

  const selectClass =
    "w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-500 transition-all appearance-none cursor-pointer pr-10";

  return (
    <form action="/cars" method="GET" className="space-y-4">
      <div className="flex-1 min-w-0">
        <label
          htmlFor="hero-category"
          className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-2"
        >
          Kategori Mobil
        </label>
        <div className="relative">
          <select
            id="hero-category"
            name="category"
            defaultValue=""
            className={selectClass}
          >
            <option value="">Semua Kategori</option>
            {CAR_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CAR_CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
          <svg
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="min-w-0">
          <label
            htmlFor="hero-start"
            className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-2"
          >
            Tanggal Mulai
          </label>
          <input
            id="hero-start"
            type="date"
            name="startDate"
            min={today}
            className={inputClass}
          />
        </div>

        <div className="min-w-0">
          <label
            htmlFor="hero-end"
            className="block text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-2"
          >
            Tanggal Selesai
          </label>
          <input
            id="hero-end"
            type="date"
            name="endDate"
            min={today}
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors active:scale-[0.98]"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        Cari Mobil
      </button>
    </form>
  );
}
