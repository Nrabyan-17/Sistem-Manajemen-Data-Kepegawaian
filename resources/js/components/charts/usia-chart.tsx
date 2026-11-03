import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type UsiaChartProps = {
    data: { name: string; value: number }[];
};

export function UsiaChart({ data }: UsiaChartProps) {
    if (data.length === 0) {
        return (
            <Card className="flex flex-col border-0 bg-transparent shadow-none">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-slate-800 dark:text-neutral-100">
                        Distribusi Kelompok Usia
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-neutral-400">
                        Piramida sebaran usia pegawai berdasarkan tanggal lahir
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
                            Distribusi Kelompok Usia Pegawai
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-neutral-400">
                            Grafik sebaran kelompok usia pegawai (dihitung otomatis dari tanggal lahir)
                        </CardDescription>
                    </div>
                    <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-100 dark:border-violet-900/50">
                        Usia Produktif
                    </span>
                </div>
            </CardHeader>
            <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={280}>
                    <AreaChart
                        data={data}
                        margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient
                                id="usiaGradientCustom"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#6366f1"
                                    stopOpacity={0.4}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#6366f1"
                                    stopOpacity={0.0}
                                />
                            </linearGradient>
                        </defs>
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
                                `${value ?? 0} orang pegawai`,
                                'Jumlah',
                            ]}
                            cursor={{ stroke: 'var(--color-muted-foreground, #cbd5e1)', strokeDasharray: '3 3' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#6366f1"
                            strokeWidth={3}
                            fill="url(#usiaGradientCustom)"
                            dot={{
                                fill: '#6366f1',
                                strokeWidth: 2,
                                stroke: 'var(--color-card, #ffffff)',
                                r: 5,
                            }}
                            activeDot={{
                                fill: '#4f46e5',
                                strokeWidth: 2,
                                stroke: 'var(--color-card, #ffffff)',
                                r: 7,
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
