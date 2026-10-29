type Props = {
  title: string;
  children?: React.ReactNode;
};

// Layar penuh untuk keadaan memuat / gagal / belum login di halaman profil
export function StatusScreen({ title, children }: Props) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-5 text-neutral-900">
      <div className="w-full max-w-md rounded-3xl border border-neutral-200 bg-white p-6 text-center md:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#1B1B7A]">{title}</h1>
        {children}
      </div>
    </main>
  );
}
