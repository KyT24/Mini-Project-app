'use client';

import { useEffect, useState } from 'react';
import DeleteDoctorModal from '@/components/admin/doctor/delete-doctor-modal';
import DoctorFormModal from '@/components/admin/doctor/doctor-form-modal';
import ScheduleModal from '@/components/admin/doctor/schedule-modal';
import { formatRupiah, getApiErrorMessage, getInitials } from '@/components/admin/doctor/utils';
import { inputBase, primaryBtn, secondaryBtn } from '@/components/admin/styles';
import { formatPracticeDays } from '@/components/user/doctor/constants';
import { useDebounce } from '@/hooks/useDebounce';
import { useGetDoctors } from '@/hooks/useDoctors';
import type { TDoctor, TDoctorSort } from '@/types/doctor';

const LIMIT = 10;

type StatusFilter = 'all' | 'active' | 'inactive';

type ModalState =
  | { type: 'create' }
  | { type: 'edit'; doctor: TDoctor }
  | { type: 'delete'; doctor: TDoctor }
  | { type: 'schedule'; doctor: TDoctor }
  | null;

const SORT_OPTIONS: { value: TDoctorSort; label: string }[] = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'experience_desc', label: 'Pengalaman terlama' },
  { value: 'fee_asc', label: 'Biaya termurah' },
  { value: 'fee_desc', label: 'Biaya termahal' },
];

const actionLink =
  'inline-flex min-h-11 items-center rounded-lg px-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1B1B7A]';

export default function DoctorManagementPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<TDoctorSort>('newest');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<ModalState>(null);
  const [notice, setNotice] = useState('');

  // Tunda pencarian agar tidak memanggil API di setiap ketikan
  const debouncedSearch = useDebounce(search.trim());

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(''), 5000);
    return () => clearTimeout(t);
  }, [notice]);

  const { data, isPending, isError, error, refetch, isFetching } = useGetDoctors({
    page,
    limit: LIMIT,
    search: debouncedSearch,
    is_active: status === 'all' ? undefined : status === 'active',
    sort,
  });

  const doctors = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = Math.max(meta?.total_pages ?? 1, 1);

  function handleSuccess(message: string) {
    setNotice(message);
    // Kembali ke halaman sebelumnya bila baris terakhir di halaman ini dihapus
    if (modal?.type === 'delete' && doctors.length === 1 && page > 1)
      setPage((p) => p - 1);
  }

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1B1B7A]">Manajemen Dokter</h1>
          <p className="mt-1 text-neutral-600">
            Kelola data dokter yang tampil di halaman klinik.
          </p>
        </div>
        <button type="button" onClick={() => setModal({ type: 'create' })} className={primaryBtn}>
          Tambah dokter
        </button>
      </div>

      <div role="status" aria-live="polite">
        {notice && (
          <p className="mt-5 rounded-xl border border-green-300 bg-green-50 px-4 py-3 font-medium text-green-900">
            {notice}
          </p>
        )}
      </div>

      {/* FILTER */}
      <div className="mt-6 grid gap-4 rounded-3xl border border-neutral-200 bg-white p-5 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <label htmlFor="doctor-search" className="font-semibold">
            Cari dokter
          </label>
          <input
            id="doctor-search"
            type="search"
            placeholder="Nama dokter"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className={`mt-2 ${inputBase} border-neutral-300`}
          />
        </div>
        <div>
          <label htmlFor="doctor-status" className="font-semibold">
            Status
          </label>
          <select
            id="doctor-status"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as StatusFilter);
              setPage(1);
            }}
            className={`mt-2 ${inputBase} border-neutral-300`}
          >
            <option value="all">Semua</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
        <div>
          <label htmlFor="doctor-sort" className="font-semibold">
            Urutkan
          </label>
          <select
            id="doctor-sort"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value as TDoctorSort);
              setPage(1);
            }}
            className={`mt-2 ${inputBase} border-neutral-300`}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABEL */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-neutral-200 bg-white">
        {isPending ? (
          <p role="status" className="p-8 text-center text-neutral-600">
            Memuat data dokter...
          </p>
        ) : isError ? (
          <div role="alert" className="p-8 text-center">
            <p className="text-red-900">
              {getApiErrorMessage(error, 'Gagal memuat data dokter.')}
            </p>
            <button type="button" onClick={() => refetch()} className={`mt-4 ${secondaryBtn}`}>
              Coba lagi
            </button>
          </div>
        ) : doctors.length === 0 ? (
          <p className="p-8 text-center text-neutral-600">
            {debouncedSearch || status !== 'all'
              ? 'Tidak ada dokter yang cocok dengan filter.'
              : 'Belum ada data dokter. Tambahkan dokter pertama Anda.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table
              aria-busy={isFetching}
              className={`w-full min-w-220 text-left ${isFetching ? 'opacity-60' : ''}`}
            >
              <caption className="sr-only">Daftar dokter</caption>
              <thead className="border-b border-neutral-200 bg-neutral-50 text-sm text-neutral-700">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">Dokter</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Spesialis</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Pengalaman</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Biaya konsultasi</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Jadwal</th>
                  <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-5 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {doctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <th scope="row" className="px-5 py-4 font-normal">
                      <div className="flex items-center gap-3">
                        {doctor.photo ? (
                          <img
                            src={doctor.photo}
                            alt=""
                            className="h-11 w-11 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <span
                            aria-hidden="true"
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1B1B7A] text-sm font-bold text-white"
                          >
                            {getInitials(doctor.full_name)}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-neutral-900">{doctor.full_name}</p>
                          <p className="truncate text-sm text-neutral-600">{doctor.users?.email}</p>
                        </div>
                      </div>
                    </th>
                    <td className="px-5 py-4">{doctor.specialists?.name ?? '-'}</td>
                    <td className="px-5 py-4">{doctor.experience_years} tahun</td>
                    <td className="px-5 py-4">{formatRupiah(doctor.consultation_fee)}</td>
                    <td className="px-5 py-4">
                      {formatPracticeDays(doctor.doctor_schedules ?? []) || (
                        <span className="text-neutral-600">Belum ada</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                          doctor.is_active
                            ? 'bg-green-100 text-green-900'
                            : 'bg-neutral-200 text-neutral-800'
                        }`}
                      >
                        {doctor.is_active ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setModal({ type: 'schedule', doctor })}
                          className={`${actionLink} text-[#1B1B7A] hover:bg-neutral-100`}
                        >
                          Jadwal<span className="sr-only"> {doctor.full_name}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setModal({ type: 'edit', doctor })}
                          className={`${actionLink} text-[#1B1B7A] hover:bg-neutral-100`}
                        >
                          Ubah<span className="sr-only"> {doctor.full_name}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setModal({ type: 'delete', doctor })}
                          className={`${actionLink} text-red-700 hover:bg-red-50`}
                        >
                          Hapus<span className="sr-only"> {doctor.full_name}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PAGINASI */}
      {meta && meta.total > 0 && (
        <nav
          aria-label="Paginasi daftar dokter"
          className="mt-5 flex flex-col items-center justify-between gap-3 sm:flex-row"
        >
          <p className="text-neutral-600">
            Halaman {meta.page} dari {totalPages} · {meta.total} dokter
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page <= 1 || isFetching}
              className={secondaryBtn}
            >
              Sebelumnya
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages || isFetching}
              className={secondaryBtn}
            >
              Berikutnya
            </button>
          </div>
        </nav>
      )}

      {modal?.type === 'create' && (
        <DoctorFormModal onClose={() => setModal(null)} onSuccess={handleSuccess} />
      )}
      {modal?.type === 'edit' && (
        <DoctorFormModal
          doctor={modal.doctor}
          onClose={() => setModal(null)}
          onSuccess={handleSuccess}
        />
      )}
      {modal?.type === 'schedule' && (
        <ScheduleModal
          doctor={modal.doctor}
          onClose={() => setModal(null)}
          onSuccess={handleSuccess}
        />
      )}
      {modal?.type === 'delete' && (
        <DeleteDoctorModal
          doctor={modal.doctor}
          onClose={() => setModal(null)}
          onSuccess={handleSuccess}
        />
      )}
    </section>
  );
}
