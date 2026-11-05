type Props = {
  title: string;
  description?: string;
};

// Placeholder untuk halaman admin yang belum dibuat
export default function ComingSoon({ title, description }: Props) {
  return (
    <section>
      <h1 className="text-3xl font-bold tracking-tight text-[#1B1B7A]">{title}</h1>
      <div className="mt-6 rounded-3xl border border-dashed border-neutral-300 bg-white p-8 text-neutral-700">
        {description ?? 'Halaman ini sedang dalam pengembangan.'}
      </div>
    </section>
  );
}
