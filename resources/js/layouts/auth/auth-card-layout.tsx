import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-slate-50/60 p-6 md:p-10 dark:bg-background">
            <div className="flex w-full max-w-[420px] flex-col gap-6">
                {/* Card Wrapper Component with Smooth Entrance Animation */}
                <Card className="animate-auth-entrance rounded-2xl border border-slate-200/80 bg-white p-2 sm:p-4 shadow-xl shadow-slate-200/40 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
                    <CardHeader className="flex flex-col items-center px-6 pt-6 pb-2 text-center">
                        {/* Brand Logo & Name INSIDE Card */}
                        <Link
                            href={home()}
                            className="mb-3 flex flex-col items-center gap-2 transition hover:opacity-90"
                        >
                            <div className="flex size-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
                                <AppLogoIcon className="size-6 text-white" />
                            </div>
                            <span className="text-xs font-semibold tracking-tight text-slate-700 dark:text-neutral-300">
                                Sistem Manajemen Kepegawaian
                            </span>
                        </Link>

                        <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-neutral-100">
                            {title}
                        </CardTitle>
                        {description && (
                            <CardDescription className="text-xs text-slate-500 dark:text-neutral-400">
                                {description}
                            </CardDescription>
                        )}
                    </CardHeader>
                    <CardContent className="px-6 py-6">
                        {children}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
