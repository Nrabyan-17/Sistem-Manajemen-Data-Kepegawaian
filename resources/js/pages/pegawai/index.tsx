import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Calendar,
    CheckCircle2,
    Edit,
    Filter,
    GraduationCap,
    Plus,
    RotateCcw,
    Search,
    Trash2,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PegawaiModal from '@/components/pegawai/pegawai-modal';
import DeletePegawaiModal from '@/components/pegawai/delete-pegawai-modal';
import { dashboard } from '@/routes';
import type { PaginatedData, PegawaiItem } from '@/types';

type Props = {
    pegawai: PaginatedData<PegawaiItem>;
    filters: {
        search: string;
        gender: string;
        pendidikan: string;
    };
    pendidikanOptions: string[];
    genderOptions: string[];
};

export default function PegawaiIndex({
    pegawai,
    filters,
    pendidikanOptions,
    genderOptions,
}: Props) {
    const page = usePage();
    const currentTeam = page.props.currentTeam;
    const teamSlug = currentTeam?.slug ?? '';
    const flash = page.props.flash as { success?: string; error?: string } | undefined;

    // Filter states
    const [search, setSearch] = useState(filters.search);
    const [gender, setGender] = useState(filters.gender);
    const [pendidikan, setPendidikan] = useState(filters.pendidikan);

    // Modal states
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPegawai, setSelectedPegawai] = useState<PegawaiItem | null>(null);

    // Delete modal states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [pegawaiToDelete, setPegawaiToDelete] = useState<PegawaiItem | null>(null);

    const applyFilters = (newSearch = search, newGender = gender, newPendidikan = pendidikan) => {
        router.get(
            `/${teamSlug}/pegawai`,
            {
                search: newSearch || undefined,
                gender: newGender || undefined,
                pendidikan: newPendidikan || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            applyFilters(search, gender, pendidikan);
        }
    };

    const handleResetFilters = () => {
        setSearch('');
        setGender('');
        setPendidikan('');
        router.get(`/${teamSlug}/pegawai`, {}, { preserveState: true, replace: true });
    };

    const handleOpenAddModal = () => {
        setSelectedPegawai(null);
        setModalOpen(true);
    };

    const handleOpenEditModal = (item: PegawaiItem) => {
        setSelectedPegawai(item);
        setModalOpen(true);
    };

    const handleOpenDeleteModal = (item: PegawaiItem) => {
        setPegawaiToDelete(item);
        setDeleteModalOpen(true);
    };

    return (
        <>
            <Head title="Manajemen Data Pegawai" />

            {/* Modal Tambah / Edit */}
            <PegawaiModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                pegawai={selectedPegawai}
                currentTeamSlug={teamSlug}
            />

            {/* Pop-up Konfirmasi Hapus */}
            <DeletePegawaiModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                pegawai={pegawaiToDelete}
                currentTeamSlug={teamSlug}
            />

            <div className="flex h-full flex-1 flex-col gap-6 bg-slate-50/60 p-6 md:p-8 dark:bg-background">
                {/* Flash Message Banner */}
                {flash?.success && (
                    <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 shadow-xs animate-in fade-in dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                        <span className="font-medium">{flash.success}</span>
                    </div>
                )}

                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-neutral-100">
                            Manajemen Data Pegawai
                        </h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
                            Kelola data pegawai, mulai dari penambahan, pembaruan, hingga penghapusan data secara terpusat.
                        </p>
                    </div>

                </div>

                {/* Filters & Search Card */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400 dark:text-neutral-500" />
                            <Input
                                type="text"
                                placeholder="Cari nama pegawai... (Enter)"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="h-10 pl-9 border-slate-300 text-sm focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                            />
                        </div>

                        {/* Filter Gender */}
                        <div>
                            <select
                                value={gender}
                                onChange={(e) => {
                                    setGender(e.target.value);
                                    applyFilters(search, e.target.value, pendidikan);
                                }}
                                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-xs focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                <option value="">Semua Jenis Kelamin</option>
                                {genderOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Filter Pendidikan */}
                        <div>
                            <select
                                value={pendidikan}
                                onChange={(e) => {
                                    setPendidikan(e.target.value);
                                    applyFilters(search, gender, e.target.value);
                                }}
                                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-xs focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                <option value="">Semua Pendidikan</option>
                                {pendidikanOptions.map((opt) => (
                                    <option key={opt} value={opt}>
                                        {opt}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Action buttons (Cari & Reset) */}
                        <div className="flex flex-wrap gap-2">
                            <Button
                                onClick={() => applyFilters(search, gender, pendidikan)}
                                variant="outline"
                                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                            >
                                <Filter className="mr-1.5 size-3.5" />
                                Terapkan
                            </Button>
                            <Button
                                onClick={handleOpenAddModal}
                                className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                            >
                                <Plus className="mr-1.5 size-4" />
                                Tambah Pegawai
                            </Button>
                            {(search || gender || pendidikan) && (
                                <Button
                                    onClick={handleResetFilters}
                                    variant="ghost"
                                    size="icon"
                                    title="Reset Filter"
                                    className="text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                                >
                                    <RotateCcw className="size-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Data Table Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-neutral-300">
                            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold text-slate-700 uppercase tracking-wider dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-300">
                                <tr>
                                    <th className="px-5 py-3.5 w-16 text-center">No</th>
                                    <th className="px-5 py-3.5">Nama Pegawai</th>
                                    <th className="px-5 py-3.5">Jenis Kelamin</th>
                                    <th className="px-5 py-3.5">Pendidikan Terakhir</th>
                                    <th className="px-5 py-3.5">Tanggal Lahir & Usia</th>
                                    <th className="px-5 py-3.5 text-center w-32">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/80">
                                {pegawai.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center">
                                            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-neutral-800 dark:text-neutral-500">
                                                <Users className="size-6" />
                                            </div>
                                            <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-neutral-200">
                                                Tidak Ada Data Pegawai
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
                                                {search || gender || pendidikan
                                                    ? 'Tidak ditemukan pegawai yang cocok dengan filter pencarian.'
                                                    : 'Belum ada data pegawai yang ditambahkan ke sistem.'}
                                            </p>
                                            <div className="mt-4">
                                                {search || gender || pendidikan ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={handleResetFilters}
                                                        className="dark:border-neutral-700 dark:text-neutral-200"
                                                    >
                                                        Bersihkan Filter
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        onClick={handleOpenAddModal}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                                    >
                                                        <Plus className="mr-1.5 size-3.5" />
                                                        Tambah Pegawai Sekarang
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    pegawai.data.map((item, index) => {
                                        const rowNumber =
                                            (pegawai.current_page - 1) * pegawai.per_page +
                                            index +
                                            1;

                                        return (
                                            <tr
                                                key={item.id}
                                                className="transition hover:bg-slate-50/70 dark:hover:bg-neutral-800/40"
                                            >
                                                <td className="px-5 py-4 text-center font-medium text-slate-400 dark:text-neutral-500">
                                                    {rowNumber}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 text-xs dark:bg-blue-950/60 dark:text-blue-300">
                                                            {item.nama
                                                                .split(' ')
                                                                .map((n) => n[0])
                                                                .slice(0, 2)
                                                                .join('')}
                                                        </div>
                                                        <div>
                                                            <span className="font-semibold text-slate-900 block dark:text-neutral-100">
                                                                {item.nama}
                                                            </span>
                                                            <span className="text-[11px] text-slate-400 dark:text-neutral-500">
                                                                Ditambahkan {item.created_at}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    {item.jenis_kelamin === 'Laki-laki' ? (
                                                        <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700 border border-sky-200/60 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-900/50">
                                                            Laki-laki
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 border border-rose-200/60 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-900/50">
                                                            Perempuan
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700">
                                                        <GraduationCap className="size-3 text-slate-500 dark:text-neutral-400" />
                                                        {item.pendidikan_terakhir}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div>
                                                        <span className="font-medium text-slate-800 block text-xs dark:text-neutral-200">
                                                            {item.tanggal_lahir_formatted}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 rounded bg-violet-50 px-1.5 py-0.5 text-[11px] font-semibold text-violet-700 border border-violet-100 mt-0.5 dark:bg-violet-950/50 dark:text-violet-300 dark:border-violet-900/50">
                                                            <Calendar className="size-2.5" />
                                                            {item.usia} tahun
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenEditModal(item)}
                                                            className="size-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:hover:bg-blue-950/50"
                                                            title="Ubah Data"
                                                        >
                                                            <Edit className="size-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleOpenDeleteModal(item)}
                                                            className="size-8 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/50"
                                                            title="Hapus Data (Pop-up Konfirmasi)"
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    {pegawai.total > 0 && (
                        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row dark:border-neutral-800">
                            <p className="text-xs text-slate-500 dark:text-neutral-400">
                                Menampilkan{' '}
                                <strong className="font-semibold text-slate-800 dark:text-neutral-200">
                                    {pegawai.from ?? 0}
                                </strong>{' '}
                                sampai{' '}
                                <strong className="font-semibold text-slate-800 dark:text-neutral-200">
                                    {pegawai.to ?? 0}
                                </strong>{' '}
                                dari{' '}
                                <strong className="font-semibold text-slate-800 dark:text-neutral-200">
                                    {pegawai.total}
                                </strong>{' '}
                                data pegawai
                            </p>

                            <div className="flex flex-wrap items-center gap-1">
                                {pegawai.links.map((link, i) => {
                                    // Sanitasi label dari entity HTML (misal &laquo; Previous)
                                    const cleanLabel = link.label
                                        .replace('&laquo;', '«')
                                        .replace('&raquo;', '»');

                                    if (!link.url) {
                                        return (
                                            <span
                                                key={i}
                                                className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-2 text-xs text-slate-300 dark:text-neutral-600 cursor-not-allowed"
                                                dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            preserveScroll
                                            preserveState
                                            className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-md px-2.5 text-xs font-medium transition ${
                                                link.active
                                                    ? 'bg-blue-600 text-white shadow-xs'
                                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: cleanLabel }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

PegawaiIndex.layout = (props: { currentTeam?: { slug: string } | null }) => {
    const slug = props.currentTeam?.slug;

    return {
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: slug ? dashboard(slug) : '/',
            },
            {
                title: 'Data Pegawai',
                href: slug ? `/${slug}/pegawai` : '/',
            },
        ],
    };
};
