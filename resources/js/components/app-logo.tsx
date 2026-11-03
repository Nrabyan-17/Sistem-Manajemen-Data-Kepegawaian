import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                <AppLogoIcon className="size-5" />
            </div>
            <div className="ml-1.5 grid flex-1 text-left">
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
