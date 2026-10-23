function AdvantageItem({ title, text }: { title: string; text: string }) {
  return (
    <li>
      <h3 className="text-xl font-semibold md:text-2xl">{title}</h3>
      <p className="mt-1 text-base md:text-lg">{text}</p>
    </li>
  );
}

export function Advantages() {
  return (
    <section
      aria-labelledby="advantages-heading"
      className="bg-white px-5 py-12 text-[#1B1B7A] md:px-8 md:py-20"
    >
      <div className="mx-auto w-full max-w-5xl">
        <h2
          id="advantages-heading"
          className="text-center text-2xl font-medium leading-tight tracking-tight md:text-4xl"
        >
          Keunggulan Klinik Kami Dibanding Beauty Clinic Lain
        </h2>

        <ul className="mt-8 grid gap-x-16 gap-y-6 md:mt-14 md:grid-cols-2 md:gap-y-8">
          <AdvantageItem
            title="Tenaga Medis Profesional"
            text="Ditangani oleh dokter berpengalaman"
          />
          <AdvantageItem
            title="Teknologi Terkini"
            text="Mesin berkualitas tinggi untuk hasil maksimal"
          />
          <AdvantageItem
            title="Pelayanan Terbaik"
            text="Klinik kecantikan yang nyaman dan ramah"
          />
          <AdvantageItem
            title="Konsultasi Dokter Gratis"
            text="Reservasi sekarang dan konsultasikan kondisi kulitmu"
          />
          <AdvantageItem
            title="Harga Terjangkau"
            text="Perawatan premium dengan harga terjangkau"
          />
          <AdvantageItem
            title="Klinik Kecantikan Terdekat"
            text="Tersebar di beberapa kota besar di Indonesia"
          />
        </ul>
      </div>
    </section>
  );
}
