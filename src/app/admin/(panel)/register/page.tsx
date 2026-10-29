import AdminRegisterForm from '@/components/admin/auth/admin-register-form';

export default function AdminRegisterPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold tracking-tight text-[#1B1B7A] md:text-3xl">
        Tambah admin
      </h1>
      <p className="mt-1 text-neutral-600">
        Akun yang dibuat di sini otomatis memiliki role admin dan bisa mengelola seluruh data
        klinik.
      </p>

      <AdminRegisterForm />
    </div>
  );
}
