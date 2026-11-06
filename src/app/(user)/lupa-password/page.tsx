import { ForgotPasswordForm } from '@/components/user/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-5 py-10 text-neutral-900 md:px-10 md:py-14">
      <ForgotPasswordForm />
    </main>
  );
}
