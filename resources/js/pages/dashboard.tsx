import { Head } from '@inertiajs/react';
import { useState } from 'react';
import {
    Briefcase,
    Calendar,
    GraduationCap,
    TrendingUp,
    UserCheck,
    Users,
} from 'lucide-react';
import PendingInvitationsModal from '@/components/pending-invitations-modal';
import { GenderChart } from '@/components/charts/gender-chart';
import { PendidikanChart } from '@/components/charts/pendidikan-chart';
import { UsiaChart } from '@/components/charts/usia-chart';
import { StatCard } from '@/components/charts/stat-card';
import { dashboard } from '@/routes';
import type { DashboardInvitation } from '@/types';

type ChartData = {
    name: string;
    value: number;
};

type Props = {
    pendingInvitations?: DashboardInvitation[];
    totalPegawai: number;
    genderData: ChartData[];
    pendidikanData: ChartData[];
    usiaData: ChartData[];
    avgUsia: number;
};

export default function Dashboard({
    pendingInvitations = [],
    totalPegawai,
    genderData,
    pendidikanData,
    usiaData,
    avgUsia,
}: Props) {
    const [showInvitations, setShowInvitations] = useState(
        pendingInvitations.length > 0,
    );

    // Hitung jumlah laki-laki dan perempuan
    const lakiLaki = genderData.find((d) => d.name === 'Laki-laki')?.value ?? 0;
    const perempuan = genderData.find((d) => d.name === 'Perempuan')?.value ?? 0;

    // Cari pendidikan terbanyak
    const pendidikanTerbanyak =
        pendidikanData.length > 0
            ? pendidikanData.reduce((max, item) =>
                  item.value > max.value ? item : max,
              )
            : null;

    return (
        <>
            <Head title="Dashboard - Sistem Manajemen Pegawai" />
            <PendingInvitationsModal
                invitations={pendingInvitations}
                open={pendingInvitations.length > 0 && showInvitations}
                onOpenChange={setShowInvitations}
            />

            <div className="flex h-full flex-1 flex-col gap-6 bg-slate-50/60 p-6 md:p-8 dark:bg-background">
                {/* Custom Hero Header Banner (Solid Blue Theme) */}
                <div className="relative overflow-hidden rounded-2xl bg-blue-600 p-6 text-white shadow-md shadow-blue-600/10 md:p-8">
                    <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white">
                                <Briefcase className="size-3.5" />
                                <span>Sistem Manajemen Kepegawaian</span>
                            </div>
                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
                                Dashboard Statistik Pegawai
                            </h1>
                            <p className="mt-1 max-w-xl text-sm text-blue-100">
                                Ringkasan visual demografi pegawai berdasarkan jenis kelamin, tingkat pendidikan, dan distribusi usia.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 self-start md:self-auto">
                            <div className="rounded-xl bg-white/20 px-4 py-2.5">
                                <span className="block text-xs font-medium text-blue-100">
                                    Total Personel
                                </span>
                                <span className="text-xl font-bold text-white">
                                    {totalPegawai} Pegawai
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4 Custom Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Pegawai"
                        value={totalPegawai}
                        subtitle="Pegawai aktif terdata"
                        icon={Users}
                        iconColor="text-blue-600 dark:text-blue-400"
                        iconBgColor="bg-blue-50 border border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/50"
                    />
                    <StatCard
                        title="Pegawai Pria"
                        value={lakiLaki}
                        subtitle={
                            totalPegawai > 0
                                ? `${((lakiLaki / totalPegawai) * 100).toFixed(1)}% dari total pegawai`
                                : '0%'
                        }
                        icon={UserCheck}
                        iconColor="text-sky-600 dark:text-sky-400"
                        iconBgColor="bg-sky-50 border border-sky-100 dark:bg-sky-950/40 dark:border-sky-900/50"
                    />
                    <StatCard
                        title="Pegawai Wanita"
                        value={perempuan}
                        subtitle={
                            totalPegawai > 0
                                ? `${((perempuan / totalPegawai) * 100).toFixed(1)}% dari total pegawai`
                                : '0%'
                        }
                        icon={UserCheck}
                        iconColor="text-rose-600 dark:text-rose-400"
                        iconBgColor="bg-rose-50 border border-rose-100 dark:bg-rose-950/40 dark:border-rose-900/50"
                    />
                    <StatCard
                        title="Rata-rata Usia"
                        value={`${avgUsia} Tahun`}
                        subtitle={
                            pendidikanTerbanyak
                                ? `Pendidikan terbanyak: ${pendidikanTerbanyak.name}`
                                : 'Distribusi usia produktif'
                        }
                        icon={Calendar}
                        iconColor="text-emerald-600 dark:text-emerald-400"
                        iconBgColor="bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/40 dark:border-emerald-900/50"
                    />
                </div>

                {/* Charts Row 1: Gender (Donut) & Pendidikan (Bar) */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-xl border border-slate-200/80 bg-white p-2 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
                        <GenderChart data={genderData} />
                    </div>
                    <div className="rounded-xl border border-slate-200/80 bg-white p-2 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
                        <PendidikanChart data={pendidikanData} />
                    </div>
                </div>

                {/* Charts Row 2: Distribusi Usia (Area Chart) */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-2 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
                    <UsiaChart data={usiaData} />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (props: { currentTeam?: { slug: string } | null }) => ({
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: props.currentTeam ? dashboard(props.currentTeam.slug) : '/',
        },
    ],
});
