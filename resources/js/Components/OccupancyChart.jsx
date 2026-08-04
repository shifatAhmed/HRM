import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

const COLORS = ['#10B981', '#F59E0B'];

export default function OccupancyChart({ stats }) {
    const occupied = Number(stats.occupied_flats || 0);
    const vacant = Number(stats.vacant_flats || 0);
    const total = occupied + vacant;
    const occupancyRate = total ? Math.round((occupied / total) * 100) : 0;

    const data = [
        { name: 'Occupied', value: occupied },
        { name: 'Vacant', value: vacant },
    ];

    return (
        <div className="h-[360px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Flat Occupancy</h3>
                <p className="text-sm text-slate-500">Current availability</p>
            </div>

            <div className="relative h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={72}
                            outerRadius={96}
                            paddingAngle={4}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`${entry.name}-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: '16px',
                                borderColor: '#E2E8F0',
                                boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
                        Occupancy
                    </span>
                    <span className="mt-1 text-3xl font-bold text-slate-900">
                        {occupancyRate}%
                    </span>
                </div>
            </div>
        </div>
    );
}
