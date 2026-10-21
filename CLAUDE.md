# CLAUDE.md

This file guides Claude Code (claude.ai/code) when working in this repository.

## Project

A front-end for a beauty/aesthetic clinic ("Klinik Kecantikan"). Patients browse treatments, register or log in, and manage their profile. Admins will manage doctors, patients, appointments, queues and payments. It's a Purwadhika mini project (package name `arhe-app`). The UI copy is in **Indonesian**, and so are most code comments. Keep new user-facing text in Indonesian.

So far the app is **UI only**: no backend, API client, auth, or data layer exists yet. Forms validate on the client, and their submit handlers contain `// TODO: panggil API ... di sini` placeholders. Data such as treatments and the profile is hardcoded in the page files. Placeholder values still need replacing: WhatsApp `628xxxxxxxxxx`, `halo@klinikanda.com`, `@akunanda`, and the sample address.

## Commands

```bash
npm run dev     # dev server at http://localhost:3000 (Turbopack)
npm run build   # production build
npm start       # serve the production build
npm run lint    # ESLint (flat config: next core-web-vitals + typescript)
```

There is no test framework.

## Stack

- **Next.js 16.4** (App Router) with **React 19.3** and TypeScript (strict mode).
- `next.config.ts` turns on `cacheComponents` and `partialPrefetching`, and sends CSS through `@tailwindcss/turbopack`. There is no `postcss.config`.
- **Tailwind CSS v4**, configured CSS-first in `src/app/globals.css` (`@import "tailwindcss"`, with no `tailwind.config`). **daisyUI 5** is loaded via `@plugin "daisyui"` but isn't used much yet.
- Layouts and pages use the global `LayoutProps<'/'>` / `PageProps` helper types that Next 16 generates.
- The import alias `@/*` points to `src/*`.
- Next.js 16 APIs differ from older versions. Before relying on remembered APIs, check the bundled docs in `node_modules/next/dist/docs/`.

## Routing layout (`src/app`)

| Path | File | Notes |
|---|---|---|
| — | `layout.tsx` | Root layout: Geist fonts, `globals.css`. Metadata is still the create-next-app default. |
| `/` | `(user)/page.tsx` | Landing page: hero, before/after carousel, treatment tabs by category, stats, doctor cards with WhatsApp links. |
| `/profile` | `(user)/profile/page.tsx` | Profile view/edit, password change, reminder preferences. |
| `/treatment` | `(user)/treatment/page.tsx` | Stub. |
| `/login`, `/register` | `login/`, `register/` | Full-screen auth pages, **outside** the `(user)` group, so they have no navbar or footer. |
| `/admin/*` | `admin/{dashboard,login,doctorManagement,patientManagement,appointmentManagement,queueManagement,payment,statistic}/page.tsx` | **Empty (0-byte) files.** Each needs a default-exported component before `next build` will succeed. |

- `(user)/layout.tsx` wraps user pages with `<Navbar />` and `<Footer />` from `src/components/`. Admin pages will need their own layout.
- The navbar, footer and auth pages link to routes that don't exist yet: `/reservasi`, `/pengaturan`, `/lupa-password`, `/syarat-ketentuan`, `/kebijakan-privasi`.
- Images referenced under `/results/*`, `/stats/*` and the treatment images aren't in `public/` yet.
- The old `src/app/user/...` (non-group) routes have been removed in favour of the `(user)` route group.

## Conventions

- Interactive pages and components are client components (`'use client'`) that use local `useState` only. There is no global state library.
- Styling is done with Tailwind utility classes. Arbitrary hex values are used inline, and repeated class strings are pulled into module-level constants (`inputBase`, `primaryBtn`, `secondaryBtn`, `toggleBtn`, `linkClass`, `FOCUS`, `MOTION`). Reuse these patterns. Each page currently defines its own copies; nothing is shared from a common module yet.
- Brand colors:
  - Navy `#1B1B7A` (hover `#12125c`) on pages, `#0D1266` in the navbar
  - Pink accent `#F29A9A` (hover `#d96a6a`)
  - Ivory `#FAF8F3` (navbar background)
- **Accessibility is a deliberate priority.** The code follows these patterns:
  - It targets WCAG AAA contrast; the navbar comments document the ratios.
  - Focus styles use `focus-visible` outlines.
  - Touch targets are at least 44px.
  - It respects `motion-reduce`.
  - The navbar has a skip link to `#main-content`.
  - The landing page has ARIA tabs with arrow/Home/End keyboard navigation and a carousel with `aria-roledescription`.
  - Form errors are tied to inputs.
  - Dropdowns close on Escape, outside click, and focus loss.

  Keep new UI to the same standard.
- Formatting: single quotes in most hand-written files. The create-next-app files (`layout.tsx`, configs) use double quotes. There's no Prettier config.
