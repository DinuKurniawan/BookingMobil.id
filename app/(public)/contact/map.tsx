export function ContactMap() {
  return (
    <div className="relative w-full aspect-[4/3] bg-gray-100 flex items-center justify-center">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d106.8!3d-6.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sJl.%20Sudirman!5e0!3m2!1sid!2sid!4v1234567890"
        width="100%"
        height="100%"
        style={{ border: 0, position: "absolute", inset: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Lokasi Kantor BookingMobil.id"
      />
    </div>
  );
}
