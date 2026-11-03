import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type StatCardProps = {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    iconColor?: string;
    iconBgColor?: string;
};

export function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    iconColor = 'text-blue-600 dark:text-blue-400',
    iconBgColor = 'bg-blue-50 border border-blue-100 dark:bg-blue-950/40 dark:border-blue-900/50',
}: StatCardProps) {
    return (
        <Card className="border border-slate-200/80 bg-white shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
            <CardContent className="flex items-center gap-4 p-5">
                <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl shadow-xs ${iconBgColor}`}
                >
                    <Icon className={`size-6 ${iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase dark:text-neutral-400">
                        {title}
                    </p>
                    <p className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {value}
                    </p>
                    {subtitle && (
                        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-neutral-400">
                            {subtitle}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
