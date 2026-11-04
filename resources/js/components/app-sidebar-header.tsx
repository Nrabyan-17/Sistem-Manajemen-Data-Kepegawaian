import { useEffect, useState } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        const updateTime = () => setCurrentTime(new Date());

        updateTime();
        const interval = window.setInterval(updateTime, 1000);

        return () => window.clearInterval(interval);
    }, []);

    const dateTimeLabel = currentTime
        ? new Intl.DateTimeFormat('id-ID', {
              dateStyle: 'full',
              timeStyle: 'medium',
          }).format(currentTime)
        : '';

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex min-w-0 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <time
                className="ml-auto shrink-0 whitespace-nowrap text-xs font-bold text-muted-foreground sm:text-sm"
                dateTime={currentTime?.toISOString()}
                aria-live="polite"
            >
                {dateTimeLabel}
            </time>
        </header>
    );
}
