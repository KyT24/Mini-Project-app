'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useRef, useState } from 'react';

/*
  Warna brand
  - Navy  #0D1266 : teks/ikon/fokus   (kontras di atas #FAF8F3 ≈ 16:1)
  - Ivory #FAF8F3 : latar navbar
  - Teks sekunder neutral-800 (#262626) ≈ 15:1 di atas ivory
  - Merah merah-800 (#991B1B) ≈ 8:1 di atas putih  (merah-700 hanya ≈ 6,5:1 -> gagal AAA)
  Semua teks lolos 7:1 (AAA). Batas komponen (input, avatar) lolos 3:1.
*/

const FOCUS =
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#0D1266]';

const MOTION = 'transition-colors motion-reduce:transition-none';

function navLinkClass(active: boolean, size: 'desktop' | 'mobile') {
  const base =
    size === 'desktop'
      ? 'rounded-full px-5 py-2 text-lg min-h-[44px] inline-flex items-center'
      : 'block rounded-xl px-4 py-3 text-lg min-h-[44px]';
  const state = active
    ? 'bg-[#0D1266]/10 font-bold text-[#0D1266] underline decoration-2 underline-offset-8'
    : 'font-medium text-neutral-800 hover:bg-[#0D1266]/10';
  return `${base} ${state} ${MOTION} ${FOCUS}`;
}

const menuItemBase = `flex min-h-[44px] w-full items-center rounded-xl px-4 py-2.5 text-base text-left ${MOTION} ${FOCUS}`;

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname() ?? '';
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false); // menu mobile
  const [profileOpen, setProfileOpen] = useState(false); // dropdown avatar
  const [query, setQuery] = useState('');

  const profileRef = useRef<HTMLDivElement>(null);
  const avatarBtnRef = useRef<HTMLButtonElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  // Tutup menu saat pindah halaman
  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Tutup dropdown saat klik di luar, fokus keluar, atau tekan Escape
  useEffect(() => {
    function outside(target: EventTarget | null) {
      return (
        profileRef.current && !profileRef.current.contains(target as Node)
      );
    }
    function onClick(e: MouseEvent) {
      if (outside(e.target)) setProfileOpen(false);
    }
    function onFocusIn(e: FocusEvent) {
      if (outside(e.target)) setProfileOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      if (profileOpen) {
        setProfileOpen(false);
        avatarBtnRef.current?.focus();
      } else if (menuOpen) {
        setMenuOpen(false);
        menuBtnRef.current?.focus();
      }
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('focusin', onFocusIn);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('focusin', onFocusIn);
      document.removeEventListener('keydown', onKey);
    };
  }, [profileOpen, menuOpen]);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setMenuOpen(false);
    router.push(`/treatment?q=${encodeURIComponent(q)}`);
  }

  function handleLogout() {
    setProfileOpen(false);
    // TODO: hapus sesi/token Anda di sini, lalu arahkan ke login
    router.push('/login');
  }

  const isHome = pathname === '/';
  const isTreatment = pathname.startsWith('/treatment');

  return (
    <header className="sticky top-0 z-50 border-b border-[#0D1266]/20 bg-[#FAF8F3]">
      {/* Lewati navigasi (WCAG 2.4.1). Pastikan <main id="main-content" tabIndex={-1}> ada di layout. */}
      <a
        href="#main-content"
        className={`sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[60] focus:rounded-full focus:bg-[#0D1266] focus:px-5 focus:py-3 focus:text-base focus:font-semibold focus:text-[#FAF8F3] ${FOCUS} focus-visible:outline-offset-4`}
      >
        Lewati ke konten utama
      </a>

      <nav
        aria-label="Navigasi utama"
        className="mx-auto flex w-full max-w-6xl items-center gap-3 px-5 py-3 md:px-8"
      >
        {/* LOGO: simpan di public/logo-klinik.png */}
        <Link
          href="/"
          aria-label="Ke beranda"
          className={`shrink-0 rounded-md ${FOCUS} focus-visible:outline-offset-4`}
        >
          <img
            src="/logo-klinik.png"
            alt=""
            className="h-9 w-auto md:h-10"
          />
        </Link>

        {/* MENU DESKTOP */}
        <div className="ml-4 hidden items-center gap-1 md:flex">
          <Link
            href="/"
            aria-current={isHome ? 'page' : undefined}
            className={navLinkClass(isHome, 'desktop')}
          >
            Beranda
          </Link>
          <Link
            href="/treatment"
            aria-current={isTreatment ? 'page' : undefined}
            className={navLinkClass(isTreatment, 'desktop')}
          >
            Treatment
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-3">
          {/* PENCARIAN (desktop) */}
          <form
            onSubmit={handleSearch}
            role="search"
            className="relative hidden md:block"
          >
            <label htmlFor="nav-search" className="sr-only">
              Cari treatment
            </label>
            <input
              id="nav-search"
              type="search"
              enterKeyHint="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari treatment"
              className={`min-h-[44px] w-44 rounded-full border-2 border-neutral-600 bg-white py-2.5 pl-4 pr-12 text-base text-neutral-900 placeholder:text-neutral-700 lg:w-60 ${FOCUS} focus-visible:border-[#0D1266]`}
            />
            <button
              type="submit"
              aria-label="Cari"
              className={`absolute right-0.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-[#0D1266] hover:bg-[#0D1266]/10 ${MOTION} ${FOCUS}`}
            >
              <SearchIcon />
            </button>
          </form>

          {/* AVATAR + DROPDOWN (pola disclosure: tombol + daftar tautan) */}
          <div ref={profileRef} className="relative">
            <button
              ref={avatarBtnRef}
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              aria-expanded={profileOpen}
              aria-controls="profile-menu"
              aria-label="Menu akun"
              className={`grid h-11 w-11 place-items-center overflow-hidden rounded-full border-2 border-[#0D1266] bg-[#FAF8F3] ${MOTION} ${FOCUS}`}
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
                className="absolute right-0 mt-3 w-60 rounded-2xl border-2 border-neutral-500 bg-white p-2 shadow-lg"
              >
                <li>
                  <Link
                    href="/profile"
                    onClick={() => setProfileOpen(false)}
                    className={`${menuItemBase} justify-between text-neutral-900 hover:bg-[#0D1266]/10`}
                  >
                    Profil
                    <span className="rounded-full bg-[#F29A9A] px-2.5 py-0.5 text-sm font-bold text-[#0D1266]">
                      Baru
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reservasi"
                    onClick={() => setProfileOpen(false)}
                    className={`${menuItemBase} text-neutral-900 hover:bg-[#0D1266]/10`}
                  >
                    Reservasi Saya
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pengaturan"
                    onClick={() => setProfileOpen(false)}
                    className={`${menuItemBase} text-neutral-900 hover:bg-[#0D1266]/10`}
                  >
                    Pengaturan
                  </Link>
                </li>
                <li className="mt-1 border-t border-neutral-400 pt-1">
                  <Link
                    href="/login"
                    onClick={() => setProfileOpen(false)}
                    className={`${menuItemBase} font-semibold text-[#0D1266] hover:bg-[#0D1266]/10`}
                  >
                    Masuk
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className={`${menuItemBase} font-semibold text-red-800 hover:bg-red-50 focus-visible:outline-red-800`}
                  >
                    Keluar
                  </button>
                </li>
              </ul>
            )}
          </div>

          {/* TOMBOL MENU MOBILE */}
          <button
            ref={menuBtnRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            className={`grid h-11 w-11 place-items-center rounded-full text-[#0D1266] hover:bg-[#0D1266]/10 md:hidden ${MOTION} ${FOCUS}`}
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
        <nav
          id="menu-mobile"
          aria-label="Navigasi seluler"
          className="border-t border-[#0D1266]/20 px-5 pb-5 pt-3 md:hidden"
        >
          <form onSubmit={handleSearch} role="search" className="relative">
            <label htmlFor="nav-search-mobile" className="sr-only">
              Cari treatment
            </label>
            <input
              id="nav-search-mobile"
              type="search"
              enterKeyHint="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari treatment"
              className={`min-h-[44px] w-full rounded-full border-2 border-neutral-600 bg-white py-3 pl-4 pr-12 text-base text-neutral-900 placeholder:text-neutral-700 ${FOCUS} focus-visible:border-[#0D1266]`}
            />
            <button
              type="submit"
              aria-label="Cari"
              className={`absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-[#0D1266] hover:bg-[#0D1266]/10 ${MOTION} ${FOCUS}`}
            >
              <SearchIcon />
            </button>
          </form>
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            aria-current={isHome ? 'page' : undefined}
            className={`mt-3 ${navLinkClass(isHome, 'mobile')}`}
          >
            Beranda
          </Link>
          <Link
            href="/treatment"
            onClick={() => setMenuOpen(false)}
            aria-current={isTreatment ? 'page' : undefined}
            className={`mt-1 ${navLinkClass(isTreatment, 'mobile')}`}
          >
            Treatment
          </Link>
        </nav>
      )}
    </header>
  );
}