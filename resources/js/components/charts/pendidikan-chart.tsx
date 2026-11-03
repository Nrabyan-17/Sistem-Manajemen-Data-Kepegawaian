import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    Cell,
} from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type PendidikanChartProps = {
    data: { name: string; value: number }[];
};

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];

export function PendidikanChart({ data }: PendidikanChartProps) {
    if (data.length === 0) {
        return (
            <Card className="flex flex-col border-0 bg-transparent shadow-none">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-slate-800 dark:text-neutral-100">
                        Jenjang Pendidikan Terakhir
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-neutral-400">
                        Distribusi pegawai berdasarkan kualifikasi akademik
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex h-64 items-center justify-center">
                    <p className="text-sm text-slate-400 dark:text-neutral-500">
                        Belum ada data pegawai yang tersimpan
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="flex flex-col border-0 bg-transparent shadow-none">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-800 dark:text-neutral-100">
                            Jenjang Pendidikan Terakhir
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-neutral-400">
                            Jumlah pegawai pada tiap kualifikasi akademik
                        </CardDescription>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900/50">
                        {data.length} Kategori
                    </span>
                </div>
            </CardHeader>
            <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--color-border, #f1f5f9)"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="name"
                            tick={{ fontSize: 12, fill: 'var(--color-muted-foreground, #64748b)' }}
                            axisLine={{ stroke: 'var(--color-border, #e2e8f0)' }}
                            tickLine={false}
                        />
                        <YAxis
                            allowDecimals={false}
                            tick={{ fontSize: 12, fill: 'var(--color-muted-foreground, #64748b)' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--color-card, #ffffff)',
                                borderColor: 'var(--color-border, #e2e8f0)',
                                borderRadius: '10px',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                fontSize: '13px',
                                color: 'var(--color-foreground, #0f172a)',
                            }}
                            formatter={(value) => [
                                `${value ?? 0} orang`,
                                'Total',
                            ]}
                            cursor={{ fill: 'var(--color-muted, #f8fafc)', opacity: 0.5 }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                            {data.map((_entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
