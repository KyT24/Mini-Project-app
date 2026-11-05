'use client';

import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Avatar } from '@/components/user/account-menu';
import { useLogout, useMe } from '@/hooks/api/use-auth';
import { useEscapeKey } from '@/hooks/use-escape-key';

const ROLE_LABEL = { ADMIN: 'Admin', STAFF: 'Staf', DOCTOR: 'Dokter', PATIENT: 'Pasien' };

const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]';

// Tombol akun di top bar admin; panelnya menampilkan profil admin yang login.
export default function AdminAccountMenu() {
  const router = useRouter();
  const { data: user } = useMe();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const logout = useLogout({ onSuccess: () => router.replace('/admin/login') });

  // Tutup saat tekan Escape (fokus kembali ke tombol) atau klik di luar panel
  useEscapeKey(open, () => {
    setOpen(false);
    buttonRef.current?.focus();
  });

  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  // RequireRole sudah memastikan user ada; ini hanya penjaga tipe
  if (!user) return null;

  const avatarUser = { name: user.full_name, avatarUrl: user.profile_picture };
  const joined = new Date(user.created_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        aria-controls="admin-account-panel"
        aria-label={`Profil ${user.full_name}`}
        className={`flex min-h-11 items-center gap-3 rounded-xl px-1.5 transition-colors hover:bg-neutral-100 sm:pl-2 sm:pr-3 motion-reduce:transition-none ${FOCUS} ${
          open ? 'bg-neutral-100' : ''
        }`}
      >
        <Avatar user={avatarUser} size="h-9 w-9" />
        <span className="hidden min-w-0 text-left sm:block">
          <span className="block max-w-40 truncate font-semibold leading-tight text-neutral-900">
            {user.full_name}
          </span>
          <span className="block text-sm leading-tight text-neutral-600">
            {ROLE_LABEL[user.role]}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`hidden h-4 w-4 text-neutral-600 transition-transform sm:block motion-reduce:transition-none ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          id="admin-account-panel"
          className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-neutral-200 bg-white shadow-lg"
        >
          <div className="flex items-center gap-3 border-b border-neutral-200 p-4">
            <Avatar user={avatarUser} size="h-12 w-12" />
            <div className="min-w-0">
              <p className="truncate font-bold text-[#1B1B7A]">{user.full_name}</p>
              <p className="text-sm text-neutral-600">
                {ROLE_LABEL[user.role]} ·{' '}
                {user.is_active ? 'Akun aktif' : 'Akun nonaktif'}
              </p>
            </div>
          </div>

          <dl className="grid gap-3 p-4 text-sm">
            <div>
              <dt className="text-neutral-600">Email</dt>
              <dd className="break-all font-medium text-neutral-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-neutral-600">No. telepon</dt>
              <dd className="font-medium text-neutral-900">{user.phone_number || '-'}</dd>
            </div>
            <div>
              <dt className="text-neutral-600">Terdaftar sejak</dt>
              <dd className="font-medium text-neutral-900">{joined}</dd>
            </div>
          </dl>

          <div className="border-t border-neutral-200 p-2">
            <button
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="flex min-h-11 w-full items-center rounded-lg px-3 text-left font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-red-700 disabled:opacity-60"
            >
              {logout.isPending ? 'Keluar...' : 'Keluar'}
            </button>
            {logout.isError && (
              <p role="alert" className="px-3 pb-2 text-sm text-red-700">
                Gagal keluar. Periksa koneksi lalu coba lagi.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
