"use client";

export function TentangKamiMap() {
  return (
    <div className="w-full aspect-[16/9] sm:aspect-[2/1] bg-gray-100">
      <iframe
        title="Lokasi Kantor BookingMobil.id"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d106.823!3d-6.209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMzIuNCJTIDEwNsKwNDknMjIuOCJF!5e0!3m2!1sid!2sid!4v1690000000000"
        width="100%"
        height="100%"
        className="border-0"
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
