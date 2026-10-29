'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useEscapeKey } from '@/hooks/use-escape-key';

const accountLinks = [
  { href: '/profile', label: 'Edit profil' },
  { href: '/history', label: 'Riwayat reservasi' },
];

export type NavbarUser = { name: string; avatarUrl?: string | null } | null;

// Foto profil; kalau belum punya foto, tampilkan inisial nama.
export function Avatar({
  user,
  size,
}: {
  user: NonNullable<NavbarUser>;
  size: string;
}) {
  const initials = user.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  return user.avatarUrl ? (
    <img
      src={user.avatarUrl}
      alt=""
      className={`${size} rounded-full object-cover ring-2 ring-[#C5A46D]`}
    />
  ) : (
    <span
      aria-hidden="true"
      className={`${size} grid place-items-center rounded-full bg-[#1B1B7A] text-sm font-bold text-white ring-2 ring-[#C5A46D]`}
    >
      {initials || 'U'}
    </span>
  );
}

// Dropdown akun di balik foto profil: edit profil, riwayat, dan keluar.
export function AccountMenu({
  user,
  onLogout,
  isLoggingOut,
}: {
  user: NonNullable<NavbarUser> & { email: string };
  onLogout: () => void;
  isLoggingOut: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Tutup saat tekan Escape (fokus kembali ke tombol) atau klik di luar menu
  useEscapeKey(open, () => {
    setOpen(false);
    buttonRef.current?.focus();
  });

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const itemClass =
    'flex w-full items-center rounded-lg px-3 py-2.5 text-left font-medium text-neutral-800 hover:bg-[#FAF8F3] hover:text-[#1B1B7A] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1B1B7A]';

  return (
    <div
      ref={rootRef}
      className="relative lg:order-last"
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="account-menu"
        aria-label={`Menu akun ${user.name}`}
        className="grid h-11 w-11 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]"
      >
        <Avatar
          user={user}
          size="h-9 w-9"
        />
      </button>

      {open && (
        <div
          id="account-menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg"
        >
          <div className="border-b border-neutral-200 px-3 pb-3 pt-1">
            <p className="truncate font-semibold text-[#1B1B7A]">{user.name}</p>
            <p className="truncate text-sm text-neutral-600">{user.email}</p>
          </div>
          <ul className="py-1">
            {accountLinks.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={itemClass}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-neutral-200 pt-1">
            <button
              type="button"
              onClick={onLogout}
              disabled={isLoggingOut}
              className={`${itemClass} text-red-700 hover:text-red-800 disabled:opacity-60`}
            >
              {isLoggingOut ? 'Keluar...' : 'Keluar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
