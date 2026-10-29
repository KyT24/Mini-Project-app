import { errorText } from '@/lib/styles';

type Props = {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
};

// Label + input + pesan error yang terhubung lewat id `${id}-error`
export function Field({ id, label, error, children }: Props) {
  return (
    <div>
      <label htmlFor={id} className="font-semibold">
        {label}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} role="alert" className={errorText}>
          {error}
        </p>
      )}
    </div>
  );
}
