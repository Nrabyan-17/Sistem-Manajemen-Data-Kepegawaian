import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Calendar,
    Download,
    FileSpreadsheet,
    FileText,
    Filter,
    GraduationCap,
    Printer,
    RotateCcw,
    Search,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { dashboard } from '@/routes';
import type { PaginatedData, PegawaiItem } from '@/types';

type Summary = {
    total: number;
    laki: number;
    perempuan: number;
    avgUsia: number;
};

type Props = {
    pegawai: PaginatedData<PegawaiItem>;
    summary: Summary;
    filters: {
        search: string;
        gender: string;
        pendidikan: string;
        usia: string;
    };
    genderOptions: string[];
    pendidikanOptions: string[];
    usiaOptions: Array<{ value: string; label: string }>;
};

export default function LaporanIndex({
    pegawai,
    summary,
    filters,
    genderOptions,
    pendidikanOptions,
    usiaOptions,
}: Props) {
    const page = usePage();
    const currentTeam = page.props.currentTeam;
    const teamSlug = currentTeam?.slug ?? '';

    // Filter states
    const [search, setSearch] = useState(filters.search);
    const [gender, setGender] = useState(filters.gender);
    const [pendidikan, setPendidikan] = useState(filters.pendidikan);
    const [usia, setUsia] = useState(filters.usia);

    const applyFilters = (
        newSearch = search,
        newGender = gender,
        newPendidikan = pendidikan,
        newUsia = usia,
    ) => {
        router.get(
            `/${teamSlug}/laporan`,
            {
                search: newSearch || undefined,
                gender: newGender || undefined,
                pendidikan: newPendidikan || undefined,
                usia: newUsia || undefined,
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
            applyFilters(search, gender, pendidikan, usia);
        }
    };

    const handleClearSearch = () => {
        setSearch('');
        applyFilters('', gender, pendidikan, usia);
    };

    const handleResetFilters = () => {
        setSearch('');
        setGender('');
        setPendidikan('');
        setUsia('');
        router.get(`/${teamSlug}/laporan`, {}, { preserveState: true, replace: true });
    };

    // Bangun query string untuk URL ekspor
    const buildExportParams = (extraParams: Record<string, string> = {}) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (gender) params.append('gender', gender);
        if (pendidikan) params.append('pendidikan', pendidikan);
        if (usia) params.append('usia', usia);

        Object.entries(extraParams).forEach(([k, v]) => {
            params.append(k, v);
        });

        const qs = params.toString();
        return qs ? `?${qs}` : '';
    };

    // Ekspor Excel (.xls)
    const handleExportExcel = () => {
        const url = `/${teamSlug}/laporan/excel${buildExportParams({ format: 'excel' })}`;
        window.location.href = url;
    };

    // Ekspor CSV (.csv)
    const handleExportCsv = () => {
        const url = `/${teamSlug}/laporan/excel${buildExportParams({ format: 'csv' })}`;
        window.location.href = url;
    };

    // Cetak / Ekspor PDF
    const handleExportPdf = (autoPrint = true) => {
        const extra: Record<string, string> = autoPrint ? { auto_print: '1' } : {};
        const url = `/${teamSlug}/laporan/pdf${buildExportParams(extra)}`;
        window.open(url, '_blank');
    };

    const hasActiveFilters = Boolean(search || gender || pendidikan || usia);

    return (
        <>
            <Head title="Laporan & Ekspor Data Pegawai" />

            <div className="flex h-full flex-1 flex-col gap-6 bg-slate-50/60 p-6 md:p-8 dark:bg-background">
                {/* Header Section */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                <FileText className="size-4" />
                            </span>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl dark:text-neutral-100">
                                Laporan Data Pegawai
                            </h1>
                        </div>
                        <p className="mt-1.5 text-sm text-slate-500 dark:text-neutral-400">
                            Rekapitulasi dan ekspor data pegawai resmi dalam format PDF dan Excel (.xlsx) dengan filter yang fleksibel.
                        </p>
                    </div>

                    {/* Tombol Ekspor Cepat di Header */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <Button
                            onClick={() => handleExportPdf(true)}
                            className="bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
                        >
                            <Printer className="mr-1.5 size-4" />
                            Cetak / Ekspor PDF
                        </Button>
                        <Button
                            onClick={handleExportExcel}
                            className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm"
                        >
                            <FileSpreadsheet className="mr-1.5 size-4" />
                            Ekspor Excel (.xls)
                        </Button>
                        <Button
                            onClick={handleExportCsv}
                            variant="outline"
                            className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                        >
                            <Download className="mr-1.5 size-3.5" />
                            CSV
                        </Button>
                    </div>
                </div>

                {/* KPI Summary Cards */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                                Total Pegawai
                            </span>
                            <Users className="size-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-neutral-100">
                            {summary.total}
                        </div>
                        <p className="mt-1 text-xs text-slate-400 dark:text-neutral-500">
                            {hasActiveFilters ? 'Sesuai filter aktif' : 'Keseluruhan data'}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                                Laki-Laki
                            </span>
                            <span className="size-2 rounded-full bg-sky-500" />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-neutral-100">
                            {summary.laki}
                        </div>
                        <p className="mt-1 text-xs text-slate-400 dark:text-neutral-500">
                            {summary.total > 0 ? Math.round((summary.laki / summary.total) * 100) : 0}% dari total
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                                Perempuan
                            </span>
                            <span className="size-2 rounded-full bg-rose-500" />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-neutral-100">
                            {summary.perempuan}
                        </div>
                        <p className="mt-1 text-xs text-slate-400 dark:text-neutral-500">
                            {summary.total > 0 ? Math.round((summary.perempuan / summary.total) * 100) : 0}% dari total
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-neutral-400">
                                Rata-rata Usia
                            </span>
                            <Calendar className="size-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-neutral-100">
                            {summary.avgUsia} <span className="text-sm font-medium text-slate-500">tahun</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400 dark:text-neutral-500">
                            Rata-rata umur pegawai
                        </p>
                    </div>
                </div>

                {/* Filters Card */}
                <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-slate-900 dark:text-neutral-100">
                            Filter Laporan
                        </h2>
                        {hasActiveFilters && (
                            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                                Filter aktif
                            </span>
                        )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
                        {/* Search Input */}
                        <div className="relative sm:col-span-2 lg:col-span-4">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="size-4 text-slate-400 dark:text-neutral-500" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Cari nama pegawai... (Enter)"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="h-10 pl-9 pr-9 border-slate-300 text-sm focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    title="Reset pencarian"
                                    aria-label="Reset pencarian"
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:text-neutral-500 dark:hover:text-neutral-300 cursor-pointer"
                                >
                                    <RotateCcw className="size-4 transition-transform hover:rotate-180 duration-300" />
                                </button>
                            )}
                        </div>

                        {/* Filter Gender */}
                        <div className="lg:col-span-2">
                            <select
                                value={gender}
                                onChange={(e) => {
                                    setGender(e.target.value);
                                    applyFilters(search, e.target.value, pendidikan, usia);
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
                        <div className="lg:col-span-2">
                            <select
                                value={pendidikan}
                                onChange={(e) => {
                                    setPendidikan(e.target.value);
                                    applyFilters(search, gender, e.target.value, usia);
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

                        {/* Filter Rentang Usia */}
                        <div className="lg:col-span-2">
                            <select
                                value={usia}
                                onChange={(e) => {
                                    setUsia(e.target.value);
                                    applyFilters(search, gender, pendidikan, e.target.value);
                                }}
                                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-xs focus:border-blue-500 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                            >
                                <option value="">Semua Rentang Usia</option>
                                {usiaOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Action buttons (Terapkan & Reset) */}
                        <div className="flex items-center gap-2 lg:col-span-2">
                            <Button
                                onClick={() => applyFilters(search, gender, pendidikan, usia)}
                                variant="outline"
                                className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                            >
                                <Filter className="mr-1.5 size-3.5" />
                                Terapkan
                            </Button>
                            {hasActiveFilters && (
                                <Button
                                    onClick={handleResetFilters}
                                    variant="ghost"
                                    size="icon"
                                    title="Reset Semua Filter"
                                    className="shrink-0 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                                >
                                    <RotateCcw className="size-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Preview Table Card */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-neutral-800">
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-neutral-100">
                                Pratinjau Data Laporan
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-neutral-400">
                                Data yang ditampilkan di bawah ini adalah data yang akan diekspor ke file PDF / Excel.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleExportPdf(false)}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 cursor-pointer"
                            >
                                <FileText className="size-3.5 text-rose-500" />
                                Pratinjau PDF
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-neutral-300">
                            <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-300">
                                <tr>
                                    <th className="w-16 px-5 py-3.5 text-center">No</th>
                                    <th className="px-5 py-3.5">Nama Pegawai</th>
                                    <th className="px-5 py-3.5">Jenis Kelamin</th>
                                    <th className="px-5 py-3.5">Pendidikan Terakhir</th>
                                    <th className="px-5 py-3.5">Tanggal Lahir & Usia</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/80">
                                {pegawai.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center">
                                            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-neutral-800 dark:text-neutral-500">
                                                <Users className="size-6" />
                                            </div>
                                            <p className="mt-3 text-sm font-semibold text-slate-800 dark:text-neutral-200">
                                                Tidak ada data pegawai
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400 dark:text-neutral-500">
                                                Coba ubah kriteria filter untuk melihat data lainnya.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    pegawai.data.map((item, index) => {
                                        const initials = item.nama
                                            .split(' ')
                                            .map((n) => n[0])
                                            .slice(0, 2)
                                            .join('')
                                            .toUpperCase();

                                        const formattedDate = item.tanggal_lahir
                                            ? new Date(item.tanggal_lahir).toLocaleDateString('id-ID', {
                                                  day: '2-digit',
                                                  month: 'long',
                                                  year: 'numeric',
                                              })
                                            : '-';

                                        const rowNumber =
                                            (pegawai.current_page - 1) * pegawai.per_page + index + 1;

                                        return (
                                            <tr
                                                key={item.id}
                                                className="transition hover:bg-slate-50/60 dark:hover:bg-neutral-800/40"
                                            >
                                                <td className="px-5 py-3.5 text-center text-xs text-slate-400 dark:text-neutral-500">
                                                    {rowNumber}
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                                                            {initials}
                                                        </div>
                                                        <span className="font-semibold text-slate-900 dark:text-neutral-100">
                                                            {item.nama}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                            item.jenis_kelamin === 'Laki-laki'
                                                                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                                                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                                                        }`}
                                                    >
                                                        {item.jenis_kelamin}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">
                                                        <GraduationCap className="size-3 text-slate-400" />
                                                        {item.pendidikan_terakhir}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="text-xs text-slate-700 dark:text-neutral-300">
                                                        {formattedDate}
                                                    </div>
                                                    <div className="mt-0.5 inline-flex items-center gap-1 rounded bg-violet-50 px-1.5 py-0.5 text-[11px] font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                                                        <Calendar className="size-2.5" />
                                                        {item.usia} tahun
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {pegawai.last_page > 1 && (
                        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row dark:border-neutral-800">
                            <p className="text-xs text-slate-500 dark:text-neutral-400">
                                Menampilkan{' '}
                                <strong className="font-semibold text-slate-800 dark:text-neutral-200">
                                    {pegawai.from}
                                </strong>{' '}
                                sampai{' '}
                                <strong className="font-semibold text-slate-800 dark:text-neutral-200">
                                    {pegawai.to}
                                </strong>{' '}
                                dari{' '}
                                <strong className="font-semibold text-slate-800 dark:text-neutral-200">
                                    {pegawai.total}
                                </strong>{' '}
                                data pegawai
                            </p>

                            <div className="flex flex-wrap items-center gap-1">
                                {pegawai.links.map((link, i) => {
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

LaporanIndex.layout = (props: { currentTeam?: { slug: string } | null }) => {
    const slug = props.currentTeam?.slug;

    return {
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: slug ? dashboard(slug) : '/',
            },
            {
                title: 'Laporan Data Pegawai',
                href: slug ? `/${slug}/laporan` : '/',
            },
        ],
    };
};
