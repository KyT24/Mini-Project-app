'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false); // menu mobile
  const [profileOpen, setProfileOpen] = useState(false); // dropdown avatar
  const [query, setQuery] = useState('');

  const profileRef = useRef<HTMLDivElement>(null);
  const avatarBtnRef = useRef<HTMLButtonElement>(null);

  // Tutup dropdown saat klik di luar atau tekan Escape
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setProfileOpen(false);
        avatarBtnRef.current?.focus();
      }
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setMenuOpen(false);
    router.push(`/treatment?q=${encodeURIComponent(q)}`);
  }

  function handleLogout() {
    setProfileOpen(false);
    // TODO: hapus sesi/token Anda di sini, lalu arahkan ke login
    router.push('/user/login');
  }

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex w-full max-w-6xl items-center gap-3 px-5 py-3 md:px-8"
      >
        {/* LOGO: simpan di public/logo-klinik.png */}
        <Link
          href="/"
          aria-label="Ke beranda"
          className="shrink-0 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1B1B7A]"
        >
          <img
            src="/logo-klinik.png"
            alt="Logo klinik"
            className="h-9 w-auto md:h-10"
          />
        </Link>

        {/* MENU DESKTOP */}
        <div className="ml-4 hidden items-center gap-1 md:flex">
          <Link
            href="/user/home"
            aria-current={pathname === '/' ? 'page' : undefined}
            className={`rounded-full px-5 py-2 text-lg font-medium transition-colors hover:bg-[#1B1B7A]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A] ${
              pathname === '/'
                ? 'bg-[#1B1B7A]/10 font-bold text-[#1B1B7A]'
                : 'text-neutral-700'
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/treatment"
            aria-current={
              pathname.startsWith('/treatment') ? 'page' : undefined
            }
            className={`rounded-full px-5 py-2 text-lg font-medium transition-colors hover:bg-[#1B1B7A]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A] ${
              pathname.startsWith('/treatment')
                ? 'bg-[#1B1B7A]/10 font-bold text-[#1B1B7A]'
                : 'text-neutral-700'
            }`}
          >
            Treatment
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* PENCARIAN (desktop) */}
          <form
            onSubmit={handleSearch}
            role="search"
            className="hidden md:block"
          >
            <label
              htmlFor="nav-search"
              className="sr-only"
            >
              Cari treatment
            </label>
            <input
              id="nav-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari treatment"
              className="w-44 rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 placeholder:text-neutral-500 focus-visible:border-[#1B1B7A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A] lg:w-60"
            />
          </form>

          {/* AVATAR + DROPDOWN */}
          <div
            ref={profileRef}
            className="relative"
          >
            <button
              ref={avatarBtnRef}
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              aria-controls="profile-menu"
              aria-label="Menu akun"
              className="grid h-11 w-11 place-items-center overflow-hidden rounded-full border-2 border-[#1B1B7A]/20 bg-[#1B1B7A]/10 transition-colors hover:border-[#1B1B7A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]"
            >
              {/* Ganti dengan foto profil pengguna */}
              <img
                src="/avatar.jpg"
                alt=""
                className="h-full w-full object-cover"
              />
            </button>

            {profileOpen && (
              <ul
                id="profile-menu"
                role="menu"
                className="absolute right-0 mt-3 w-56 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg"
              >
                <li role="none">
                  <Link
                    href="/profil"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-2.5 text-neutral-800 hover:bg-[#1B1B7A]/10 focus-visible:outline-2 focus-visible:outline-[#1B1B7A]"
                  >
                    Profil
                    <span className="rounded-full bg-[#F29A9A] px-2 py-0.5 text-xs font-bold text-[#1B1B7A]">
                      Baru
                    </span>
                  </Link>
                </li>
                <li role="none">
                  <Link
                    href="/reservasi"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-neutral-800 hover:bg-[#1B1B7A]/10 focus-visible:outline-2 focus-visible:outline-[#1B1B7A]"
                  >
                    Reservasi Saya
                  </Link>
                </li>
                <li role="none">
                  <Link
                    href="/pengaturan"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-neutral-800 hover:bg-[#1B1B7A]/10 focus-visible:outline-2 focus-visible:outline-[#1B1B7A]"
                  >
                    Pengaturan
                  </Link>
                </li>
                <li
                  role="none"
                  className="mt-1 border-t border-neutral-200 pt-1"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="block w-full rounded-xl px-4 py-2.5 text-left font-semibold text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-700"
                  >
                    Keluar
                  </button>
                </li>
              </ul>
            )}
          </div>

          {/* TOMBOL MENU MOBILE */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            className="grid h-11 w-11 place-items-center rounded-full text-[#1B1B7A] hover:bg-[#1B1B7A]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A] md:hidden"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* MENU MOBILE */}
      {menuOpen && (
        <div
          id="menu-mobile"
          className="border-t border-neutral-200 px-5 pb-5 pt-3 md:hidden"
        >
          <form
            onSubmit={handleSearch}
            role="search"
          >
            <label
              htmlFor="nav-search-mobile"
              className="sr-only"
            >
              Cari treatment
            </label>
            <input
              id="nav-search-mobile"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari treatment"
              className="w-full rounded-full border border-neutral-300 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-500 focus-visible:border-[#1B1B7A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]"
            />
          </form>
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            aria-current={pathname === '/' ? 'page' : undefined}
            className={`mt-3 block rounded-xl px-4 py-3 text-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A] ${
              pathname === '/'
                ? 'bg-[#1B1B7A]/10 font-bold text-[#1B1B7A]'
                : 'text-neutral-700'
            }`}
          >
            Beranda
          </Link>
          <Link
            href="/treatment"
            onClick={() => setMenuOpen(false)}
            aria-current={
              pathname.startsWith('/treatment') ? 'page' : undefined
            }
            className={`mt-1 block rounded-xl px-4 py-3 text-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A] ${
              pathname.startsWith('/treatment')
                ? 'bg-[#1B1B7A]/10 font-bold text-[#1B1B7A]'
                : 'text-neutral-700'
            }`}
          >
            Treatment
          </Link>
        </div>
      )}
    </header>
  );
}
