export default function AdminCarsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-52 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-72 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="h-14 w-20 rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-48 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-200 rounded" />
            </div>
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
            <div className="h-6 w-20 bg-gray-200 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
