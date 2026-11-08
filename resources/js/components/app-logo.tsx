import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-xs dark:border-neutral-700/80 dark:bg-neutral-800">
                <AppLogoIcon className="size-full object-cover" />
            </div>
            <div className="ml-2 grid flex-1 text-left">
                <span
                    className="truncate text-xs font-semibold leading-tight tracking-tight text-sidebar-foreground"
                    title="Sistem Manajemen Kepegawaian"
                >
                    Sistem Manajemen Kepegawaian
                </span>
            </div>
        </>
    );
}
