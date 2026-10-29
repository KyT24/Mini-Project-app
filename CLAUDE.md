# CLAUDE.md

This file guides Claude Code (claude.ai/code) when working in this repository.

## Project

A front-end for a beauty/aesthetic clinic ("Klinik Kecantikan"). Patients browse treatments and doctors, book a session, upload a payment proof, and see their history and QR code. Admins manage doctors (with schedules), specialists and payment verification. It's a Purwadhika mini project (package name `arhe-app`). The UI copy is in **Indonesian**, and so are most code comments. Keep new user-facing text in Indonesian.

The app talks to the backend `Mini-Project.api` through axios + React Query. The base URL comes from `NEXT_PUBLIC_API_URL` (see `example.env`; it defaults to `http://localhost:8000/api/v1`). Auth is a cookie session (`withCredentials: true`), and `useMe()` returns `null` when the user isn't logged in.

Still placeholder or TODO:
- Changing the password and saving reminder preferences on `/profile` have no API yet.
- The admin sidebar logout and the admin name in the shell are TODOs.
- The bank account in `payment-upload.tsx` is a placeholder.
- The admin pages `dashboard`, `patientManagement`, `appointmentManagement`, `queueManagement` and `statistic` render `ComingSoon`.

## Commands

```bash
npm run dev     # dev server at http://localhost:3000 (Turbopack)
npm run build   # production build
npm start       # serve the production build
npm run lint    # ESLint (flat config: next core-web-vitals + typescript)
npx tsc --noEmit
```

There is no test framework.

## Stack

- **Next.js 16.4** (App Router) with **React 19.3** and TypeScript (strict mode).
- `next.config.ts` turns on `cacheComponents` and `partialPrefetching`, and sends CSS through `@tailwindcss/turbopack`. Because `cacheComponents` is on, a client component that reads `useSearchParams`/`useParams`/`usePathname` must sit inside `<Suspense>`.
- **@tanstack/react-query** for server state (client in `src/app/providers.tsx`), **axios** (`src/config/axiosInstance.ts`), and **zod** for form validation (`src/validations/**`).
- **Tailwind CSS v4**, configured CSS-first in `src/app/globals.css`. **daisyUI 5** is loaded but barely used.
- Layouts and pages use the global `LayoutProps<'/'>` / `PageProps` helper types that Next 16 generates.
- The import alias `@/*` points to `src/*`.
- Next.js 16 APIs differ from older versions. Before relying on remembered APIs, check the bundled docs in `node_modules/next/dist/docs/`.

## Routing (`src/app`)

| Path | Notes |
|---|---|
| `(user)/layout.tsx` | Navbar (inside `Suspense`) and footer for every user page |
| `/` | Landing page |
| `/treatment`, `/treatment/[treatmentSlug]`, `/treatment/[treatmentSlug]/booking` | Treatment list, detail and booking form (static treatment data in `constants/treatments.ts`) |
| `/doctor`, `/doctor/[doctorDetail]` | Doctor list with URL filters, doctor profile |
| `/payment/[appointmentId]`, `/history`, `/profile` | Patient-only pages (`RequirePatient`) |
| `/login`, `/register` | Inside `(user)` |
| `/admin/login` | Outside `(panel)`, so no sidebar |
| `/admin/(panel)/*` | `AdminShell` + `RequireRole`. `doctorManagement`, `specialistManagement`, `payment` and `register` have their own layout that limits roles |

Links that still point nowhere: `/lupa-password`, `/syarat-ketentuan`, `/kebijakan-privasi`.

## Where code lives (placement rules)

| # | Kind of code | Location |
|---|---|---|
| R1 | Hooks that call the backend (React Query + axios) | `src/hooks/api/use-<resource>.ts` |
| R2 | Generic UI hooks used by ≥2 features, no domain knowledge | `src/hooks/use-<name>.ts` (`use-debounce`, `use-debounced-callback`, `use-now`, `use-auto-dismiss`, `use-escape-key`, `use-lock-body-scroll`) |
| R3 | A hook used by only one feature | Next to that feature's components, e.g. `components/user/doctor/use-doctor-filters.ts`, `components/user/landing-page/use-carousel.ts` |
| R4 | Never define a hook inside a component file or a `page.tsx` | — |
| R5 | Call `useState`/`useQuery` in the deepest component that uses the data | e.g. `DoctorFilters` loads specialists itself; each `/profile` section owns its own form state |
| R6 | `page.tsx` is a server component: no `'use client'`, no hooks. It only lays out the page and renders feature components (plus `<Suspense>` when needed) | `src/app/**/page.tsx` |
| R7 | Pure helpers shared across features | `src/lib/` (`api-error`, `format`, `schedule`, `appointment`, `styles`) |
| R8 | Static data/constants shared across features | `src/constants/` (`treatments`, `contact`, `transaction-status`) |
| R9 | Domain-free UI components | `src/components/ui/` (`modal`, `pagination`, `field`, `password-input`) |
| R10 | `components/user/**` never imports `components/admin/**`, and vice versa. Shared code goes to `lib`/`constants`/`ui` | — |
| R11 | File names are kebab-case (hooks too). Hooks are `useXxx`, types are `TXxx` | — |

Quick checks (all should print nothing):

```bash
grep -rn "@/components/admin" src/components/user "src/app/(user)"
grep -rn "@/components/user" src/components/admin src/app/admin
grep -rln "use client" src/app --include=page.tsx
grep -rnE "^(export )?(default )?function use[A-Z]" src/components src/app | grep -v "/use-"
```

## Conventions

- API hooks: one file per backend resource. Mutations take optional `TMutationCallbacks` (`src/types/api.ts`) and invalidate the related query keys. Don't rename query keys; other hooks invalidate them by name.
- Errors: use `getApiErrorMessage(error, fallback)` and `getApiStatus(error)` from `@/lib/api-error`. With no response, the message is "Tidak dapat terhubung ke server."
- Response types: `TApiSuccessResponse<T>`, `TPaginateResponse<T>` and `TPaginateMeta` live in `@/types/api`. Domain types live in `src/types/<domain>.ts`.
- Lists: render loading, error (with "Coba lagi"), empty and data states as early returns. Paginate with `<Pagination>` + `getTotalPages(meta)`.
- Styling: Tailwind utility classes. Patient pages use `@/lib/styles` (`inputBase`, `inputClass(error)`, `primaryBtn`, `secondaryBtn`, `dangerBtn`, `toggleBtn`, `linkClass`, `errorText`, `card`). Admin pages use `@/components/admin/styles`, where buttons are smaller, plus `actionLink`/`actionLinkNavy`. Don't redefine these locally.
- Export style: user feature components use named exports; admin components and modals use default exports.
- Brand colors:
  - Navy `#1B1B7A` (hover `#12125c`) on pages, `#0D1266` in the navbar
  - Pink accent `#F29A9A` (hover `#d96a6a`)
  - Ivory `#FAF8F3`
- **Accessibility is a deliberate priority:**
  - Target WCAG AAA contrast.
  - Use `focus-visible` outlines.
  - Keep touch targets at least 44px (`min-h-11`).
  - Respect `motion-reduce`.
  - Keep the skip links.
  - Use ARIA tabs/carousel on the landing page.
  - Tie form errors to inputs via `${id}-error` + `aria-describedby`.
  - Menus close on Escape (with focus returned), on outside click, and when the viewport grows.

  Keep new UI to the same standard.
- Formatting: single quotes in hand-written files. The create-next-app files (`layout.tsx`, configs) use double quotes. There's no Prettier config.
