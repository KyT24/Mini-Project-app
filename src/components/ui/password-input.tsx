'use client';

import { useState } from 'react';
import { inputClass, toggleBtn } from '@/lib/styles';

type Props = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder: string;
  error?: string;
  onBlur?: () => void;
  /** id teks bantuan yang dibacakan bila tidak ada error */
  hintId?: string;
};

// Input password dengan tombol "Tampilkan/Sembunyikan"
export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  placeholder,
  error,
  onBlur,
  hintId,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input
        id={id}
        name={id}
        type={show ? 'text' : 'password'}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hintId}
        className={`${inputClass(error)} pr-28`}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-pressed={show}
        className={toggleBtn}
      >
        {show ? 'Sembunyikan' : 'Tampilkan'}
      </button>
    </div>
  );
}
