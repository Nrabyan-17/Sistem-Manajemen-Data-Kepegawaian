import { useForm } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { PegawaiItem } from '@/types';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    pegawai?: PegawaiItem | null;
    currentTeamSlug: string;
};

export default function DeletePegawaiModal({
    open,
    onOpenChange,
    pegawai,
    currentTeamSlug,
}: Props) {
    const { delete: destroy, processing } = useForm();

    if (!pegawai) return null;

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(`/${currentTeamSlug}/pegawai/${pegawai.id}`, {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[420px] dark:border-neutral-800 dark:bg-neutral-900">
                <form onSubmit={handleDelete} className="space-y-4">
                    <DialogHeader>
                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 sm:mx-0 dark:bg-rose-950/60 dark:text-rose-400">
                            <AlertTriangle className="size-6" />
                        </div>
                        <DialogTitle className="text-lg font-bold text-slate-900 pt-2 dark:text-neutral-100">
                            Konfirmasi Hapus Pegawai
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-600 pt-1 leading-relaxed dark:text-neutral-400">
                            Apakah Anda yakin ingin menghapus data pegawai{' '}
                            <strong className="text-slate-900 dark:text-neutral-100">"{pegawai.nama}"</strong>?
                            <br />
                            <span className="text-rose-600 dark:text-rose-400 text-xs mt-1 block">
                                Tindakan ini bersifat permanen dan data yang dihapus tidak dapat dipulihkan.
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="mt-4 gap-3 sm:gap-3">
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
                            className="bg-rose-600 hover:bg-rose-700 text-white font-medium shadow-xs"
                        >
                            {processing ? 'Menghapus...' : 'Ya, Hapus Data Pegawai'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
