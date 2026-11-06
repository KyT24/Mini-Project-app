import { Suspense } from 'react';
import { ResetPasswordForm } from '@/components/user/auth/reset-password-form';

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-5 py-10 text-neutral-900 md:px-10 md:py-14">
      {/* ResetPasswordForm membaca useSearchParams, wajib di dalam Suspense */}
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
