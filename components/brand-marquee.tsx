const BRANDS = [
  "Toyota",
  "Honda",
  "Daihatsu",
  "Mitsubishi",
  "Suzuki",
  "Nissan",
  "Hyundai",
  "KIA",
  "Wuling",
  "Mercedes-Benz",
  "BMW",
  "Mazda",
  "Lexus",
  "Isuzu",
  "DFSK",
  "Peugeot",
];

export function BrandMarquee() {
  const count = BRANDS.length;
  const ITEMS = [...BRANDS, ...BRANDS];
  const duration = Math.max(count * 3, 20);

  return (
    <section className="border-b border-[#1A1A1A]/10 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 pt-10 pb-6">
        <p className="text-center text-[11px] font-semibold tracking-[0.3em] uppercase text-[#1A1A1A]/40">
          Armada dari berbagai merek terpercaya di seluruh Indonesia
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-16 lg:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 lg:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div
          className="marquee-track flex gap-4 py-4"
          style={{ width: "max-content", animationDuration: `${duration}s` }}
        >
          {ITEMS.map((brand, i) => (
            <div
              key={i}
              className="w-[220px] flex-shrink-0 bg-[#FAFAF7] rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center gap-1 hover:border-[#1F4D3F]/30 hover:shadow-md transition-shadow"
            >
              <span className="font-serif text-2xl italic text-[#1A1A1A]/70">
                {brand}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1A1A1A]/30">
                Rental Mobil
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-8" />
    </section>
  );
}
