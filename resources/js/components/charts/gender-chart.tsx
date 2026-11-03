import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from 'recharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type GenderChartProps = {
    data: { name: string; value: number }[];
};

const COLORS = ['#2563eb', '#ec4899'];

export function GenderChart({ data }: GenderChartProps) {
    if (data.length === 0) {
        return (
            <Card className="flex flex-col border-0 bg-transparent shadow-none">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-bold text-slate-800 dark:text-neutral-100">
                        Perbandingan Jenis Kelamin
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-neutral-400">
                        Jumlah pegawai berdasarkan laki-laki dan perempuan
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

    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <Card className="flex flex-col border-0 bg-transparent shadow-none">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base font-bold text-slate-800 dark:text-neutral-100">
                            Perbandingan Jenis Kelamin
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-neutral-400">
                            Perbandingan proporsi pegawai laki-laki dan perempuan
                        </CardDescription>
                    </div>
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50">
                        {total} Total
                    </span>
                </div>
            </CardHeader>
            <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={95}
                            paddingAngle={5}
                            dataKey="value"
                            strokeWidth={2}
                            stroke="transparent"
                        >
                            {data.map((_entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
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
                                `${value ?? 0} orang (${((Number(value ?? 0) / (total || 1)) * 100).toFixed(1)}%)`,
                                'Jumlah',
                            ]}
                        />
                        <Legend
                            verticalAlign="bottom"
                            iconType="circle"
                            iconSize={10}
                            formatter={(value: string) => (
                                <span className="text-xs font-medium text-slate-700 dark:text-neutral-300">
                                    {value}
                                </span>
                            )}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
