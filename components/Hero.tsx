export default function Hero() {

  return (
    <section
      className="relative h-screen bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/hero.jpg')",
      }}
    >
      {/* Overlay Gelap */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Konten */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">

        <p className="mt-6 text-xl md:text-2xl text-gray-200">
          The Home of Padel in Makassar
        </p>

        <div className="mt-10 flex gap-4">

          <button className="rounded-xl bg-lime-400 px-8 py-4 text-black font-bold hover:bg-lime-300 transition">
            Book Court
          </button>

          <button className="rounded-xl border border-white px-8 py-4 font-bold hover:bg-white hover:text-black transition">
            View Schedule
          </button>

        </div>

      </div>
    </section>
  );
}