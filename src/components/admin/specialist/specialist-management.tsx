'use client';

import { useState } from 'react';
import { getTotalPages, Pagination } from '@/components/ui/pagination';
import { useAutoDismiss } from '@/hooks/use-auto-dismiss';
import { getApiErrorMessage } from '@/lib/api-error';
import { actionLink, inputBase, primaryBtn, secondaryBtn } from '@/components/admin/styles';
import { useDebounce } from '@/hooks/use-debounce';
import { useGetSpecialists } from '@/hooks/api/use-specialists';
import type { TSpecialist } from '@/types/specialist';
import DeleteSpecialistModal from './delete-specialist-modal';
import SpecialistFormModal from './specialist-form-modal';

const PAGE_SIZE = 10;

type StatusFilter = 'all' | 'active' | 'inactive';

type ModalState =
  | { type: 'create' }
  | { type: 'edit'; specialist: TSpecialist }
  | { type: 'delete'; specialist: TSpecialist }
  | null;

// Halaman admin: tabel spesialis + pencarian, filter status, dan modal tambah/ubah/hapus
export default function SpecialistManagement() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<ModalState>(null);
  const [notice, setNotice] = useAutoDismiss();

  // Tunda pencarian agar tidak memanggil API di setiap ketikan
  const debouncedSearch = useDebounce(search.trim());

  const { data, isPending, isError, error, refetch, isFetching } = useGetSpecialists({
    page,
    limit: PAGE_SIZE,
    search: debouncedSearch,
    is_active: status === 'all' ? undefined : status === 'active',
  });

  const specialists = data?.data ?? [];
  const meta = data?.meta;

  function handleSuccess(message: string) {
    setNotice(message);
    // Kembali ke halaman sebelumnya bila baris terakhir di halaman ini dihapus
    if (modal?.type === 'delete' && specialists.length === 1 && page > 1) setPage((previousPage) => previousPage - 1);
  }

  // Isi tabel: loading → error → kosong → data
  let tableContent;
  if (isPending) {
    tableContent = (
      <p role="status" className="p-8 text-center text-neutral-600">
        Memuat data spesialis...
      </p>
    );
  } else if (isError) {
    tableContent = (
      <div role="alert" className="p-8 text-center">
        <p className="text-red-900">
          {getApiErrorMessage(error, 'Gagal memuat data spesialis.')}
        </p>
        <button type="button" onClick={() => refetch()} className={`mt-4 ${secondaryBtn}`}>
          Coba lagi
        </button>
      </div>
    );
  } else if (specialists.length === 0) {
    tableContent = (
      <p className="p-8 text-center text-neutral-600">
        {debouncedSearch || status !== 'all'
          ? 'Tidak ada spesialis yang cocok dengan filter.'
          : 'Belum ada data spesialis. Tambahkan spesialis pertama.'}
      </p>
    );
  } else {
    tableContent = (
      <div className="overflow-x-auto">
        <table
          aria-busy={isFetching}
          className={`w-full min-w-180 text-left ${isFetching ? 'opacity-60' : ''}`}
        >
          <caption className="sr-only">Daftar spesialis</caption>
          <thead className="border-b border-neutral-200 bg-neutral-50 text-sm text-neutral-700">
            <tr>
              <th scope="col" className="px-5 py-3 font-semibold">Spesialis</th>
              <th scope="col" className="px-5 py-3 font-semibold">Jumlah dokter</th>
              <th scope="col" className="px-5 py-3 font-semibold">Status</th>
              <th scope="col" className="px-5 py-3 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {specialists.map((specialist) => (
              <tr key={specialist.id}>
                <th scope="row" className="px-5 py-4 font-normal">
                  <p className="font-semibold text-neutral-900">{specialist.name}</p>
                  {specialist.description && (
                    <p className="line-clamp-2 max-w-md text-sm text-neutral-600">
                      {specialist.description}
                    </p>
                  )}
                </th>
                <td className="px-5 py-4">{specialist._count.doctors} dokter</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${
                      specialist.is_active
                        ? 'bg-green-100 text-green-900'
                        : 'bg-neutral-200 text-neutral-800'
                    }`}
                  >
                    {specialist.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setModal({ type: 'edit', specialist })}
                      className={`${actionLink} text-[#1B1B7A] hover:bg-neutral-100`}
                    >
                      Ubah<span className="sr-only"> {specialist.name}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setModal({ type: 'delete', specialist })}
                      className={`${actionLink} text-red-700 hover:bg-red-50`}
                    >
                      Hapus<span className="sr-only"> {specialist.name}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1B1B7A]">Manajemen Spesialis</h1>
          <p className="mt-1 text-neutral-600">Kelola bidang spesialis yang dimiliki dokter.</p>
        </div>
        <button type="button" onClick={() => setModal({ type: 'create' })} className={primaryBtn}>
          Tambah spesialis
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
      <div className="mt-6 grid gap-4 rounded-3xl border border-neutral-200 bg-white p-5 md:grid-cols-[2fr_1fr]">
        <div>
          <label htmlFor="specialist-search" className="font-semibold">
            Cari spesialis
          </label>
          <input
            id="specialist-search"
            type="search"
            placeholder="Nama spesialis"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className={`mt-2 ${inputBase} border-neutral-300`}
          />
        </div>
        <div>
          <label htmlFor="specialist-status" className="font-semibold">
            Status
          </label>
          <select
            id="specialist-status"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as StatusFilter);
              setPage(1);
            }}
            className={`mt-2 ${inputBase} border-neutral-300`}
          >
            <option value="all">Semua</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* TABEL */}
      <div className="mt-6 overflow-hidden rounded-3xl border border-neutral-200 bg-white">
        {tableContent}
      </div>

      {/* PAGINASI */}
      {meta && meta.total > 0 && (
        <Pagination
          label="Paginasi daftar spesialis"
          className="mt-5"
          page={meta.page}
          totalPages={getTotalPages(meta)}
          summary={`${meta.total} spesialis`}
          disabled={isFetching}
          onPageChange={setPage}
          buttonClassName={secondaryBtn}
        />
      )}

      {modal?.type === 'create' && (
        <SpecialistFormModal onClose={() => setModal(null)} onSuccess={handleSuccess} />
      )}
      {modal?.type === 'edit' && (
        <SpecialistFormModal
          specialist={modal.specialist}
          onClose={() => setModal(null)}
          onSuccess={handleSuccess}
        />
      )}
      {modal?.type === 'delete' && (
        <DeleteSpecialistModal
          specialist={modal.specialist}
          onClose={() => setModal(null)}
          onSuccess={handleSuccess}
        />
      )}
    </section>
  );
}
