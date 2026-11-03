import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PegawaiItem } from '@/types';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    pegawai?: PegawaiItem | null;
    currentTeamSlug: string;
};

export default function PegawaiModal({
    open,
    onOpenChange,
    pegawai,
    currentTeamSlug,
}: Props) {
    const isEdit = Boolean(pegawai);

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            nama: '',
            jenis_kelamin: 'Laki-laki',
            pendidikan_terakhir: 'S1',
            tanggal_lahir: '',
        });

    useEffect(() => {
        if (open) {
            clearErrors();
            if (pegawai) {
                setData({
                    nama: pegawai.nama,
                    jenis_kelamin: pegawai.jenis_kelamin,
                    pendidikan_terakhir: pegawai.pendidikan_terakhir,
                    tanggal_lahir: pegawai.tanggal_lahir,
                });
            } else {
                reset();
            }
        }
    }, [open, pegawai]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && pegawai) {
            put(`/${currentTeamSlug}/pegawai/${pegawai.id}`, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        } else {
            post(`/${currentTeamSlug}/pegawai`, {
                onSuccess: () => {
                    onOpenChange(false);
                    reset();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] dark:border-neutral-800 dark:bg-neutral-900">
                <form onSubmit={handleSubmit} className="space-y-5">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-slate-900 dark:text-neutral-100">
                            {isEdit ? 'Ubah Data Pegawai' : 'Tambah Pegawai Baru'}
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 dark:text-neutral-400">
                            {isEdit
                                ? 'Perbarui informasi data pegawai di bawah ini.'
                                : 'Masukkan data atribut pegawai secara lengkap.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Nama Pegawai */}
                        <div className="space-y-1.5">
                            <Label htmlFor="nama" className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                                Nama Lengkap Pegawai <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="nama"
                                type="text"
                                value={data.nama}
                                onChange={(e) => setData('nama', e.target.value)}
                                placeholder="Contoh: Budi Santoso, S.Kom."
                                className="h-10 border-slate-300 text-sm focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                                autoFocus
                            />
                            <InputError message={errors.nama} />
                        </div>

                        {/* Jenis Kelamin */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                                Jenis Kelamin <span className="text-rose-500">*</span>
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                                <label
                                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition ${
                                        data.jenis_kelamin === 'Laki-laki'
                                            ? 'border-blue-500 bg-blue-50/70 text-blue-700 font-semibold dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-300'
                                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-750'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="jenis_kelamin"
                                        value="Laki-laki"
                                        checked={data.jenis_kelamin === 'Laki-laki'}
                                        onChange={() => setData('jenis_kelamin', 'Laki-laki')}
                                        className="sr-only"
                                    />
                                    <span>Laki-laki</span>
                                </label>
                                <label
                                    className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition ${
                                        data.jenis_kelamin === 'Perempuan'
                                            ? 'border-rose-500 bg-rose-50/70 text-rose-700 font-semibold dark:border-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-750'
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="jenis_kelamin"
                                        value="Perempuan"
                                        checked={data.jenis_kelamin === 'Perempuan'}
                                        onChange={() => setData('jenis_kelamin', 'Perempuan')}
                                        className="sr-only"
                                    />
                                    <span>Perempuan</span>
                                </label>
                            </div>
                            <InputError message={errors.jenis_kelamin} />
                        </div>

                        {/* Pendidikan Terakhir */}
                        <div className="space-y-1.5">
                            <Label htmlFor="pendidikan_terakhir" className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                                Pendidikan Terakhir <span className="text-rose-500">*</span>
                            </Label>
                            <select
                                id="pendidikan_terakhir"
                                value={data.pendidikan_terakhir}
                                onChange={(e) => setData('pendidikan_terakhir', e.target.value)}
                                className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                            >
                                <option value="SMA/SMK">SMA / SMK / Sederajat</option>
                                <option value="D3">Diploma 3 (D3)</option>
                                <option value="S1">Sarjana (S1)</option>
                                <option value="S2">Magister (S2)</option>
                                <option value="S3">Doktor (S3)</option>
                            </select>
                            <InputError message={errors.pendidikan_terakhir} />
                        </div>

                        {/* Tanggal Lahir */}
                        <div className="space-y-1.5">
                            <Label htmlFor="tanggal_lahir" className="text-xs font-semibold text-slate-700 dark:text-neutral-300">
                                Tanggal Lahir <span className="text-rose-500">*</span>
                            </Label>
                            <Input
                                id="tanggal_lahir"
                                type="date"
                                value={data.tanggal_lahir}
                                max={new Date().toISOString().split('T')[0]}
                                onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                className="h-10 border-slate-300 text-sm focus:border-blue-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                            />
                            <p className="text-[11px] text-slate-400 dark:text-neutral-500">
                                Usia akan otomatis dikalkulasi berdasarkan tanggal lahir ini.
                            </p>
                            <InputError message={errors.tanggal_lahir} />
                        </div>
                    </div>

                    <DialogFooter className="gap-3 sm:gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={processing}
                            className="border-slate-300 dark:border-neutral-700 dark:text-neutral-200"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        >
                            {processing
                                ? 'Menyimpan...'
                                : isEdit
                                  ? 'Simpan Perubahan'
                                  : 'Tambahkan Pegawai'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
