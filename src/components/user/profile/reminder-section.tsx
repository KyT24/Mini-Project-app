'use client';

import { useState } from 'react';
import { card, primaryBtn } from '@/lib/styles';

const checkboxClass = 'h-5 w-5 rounded border-neutral-300 accent-[#1B1B7A]';

// Kartu "Pengingat jadwal": pilihan pengingat lewat WhatsApp / email
export function ReminderSection() {
  const [remindWhatsapp, setRemindWhatsapp] = useState(true);
  const [remindEmail, setRemindEmail] = useState(false);
  const [status, setStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus('');
    setIsSaving(true);
    try {
      // TODO: panggil API simpan preferensi di sini, contoh:
      // await updatePreferences({ remindWhatsapp, remindEmail });
      setStatus('Preferensi pengingat berhasil disimpan.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section aria-labelledby="pengingat-title" className={card}>
      <h2 id="pengingat-title" className="text-2xl font-bold tracking-tight text-[#1B1B7A]">
        Pengingat jadwal
      </h2>
      <p className="mt-1 text-neutral-600">Pilih cara Anda ingin diingatkan sebelum kunjungan.</p>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid gap-4">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={remindWhatsapp}
              onChange={(event) => setRemindWhatsapp(event.target.checked)}
              className={checkboxClass}
            />
            <span>Kirim pengingat lewat WhatsApp</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={remindEmail}
              onChange={(event) => setRemindEmail(event.target.checked)}
              className={checkboxClass}
            />
            <span>Kirim pengingat lewat email</span>
          </label>
        </div>

        {status && (
          <div
            role="status"
            className="mt-5 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-green-900"
          >
            {status}
          </div>
        )}

        <button type="submit" disabled={isSaving} className={`mt-6 ${primaryBtn}`}>
          {isSaving ? 'Memproses...' : 'Simpan preferensi'}
        </button>
      </form>
    </section>
  );
}
