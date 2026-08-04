import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

const chartData = [
    { name: 'Paid', value: 58 },
    { name: 'Pending', value: 30 },
    { name: 'Overdue', value: 12 },
];

export default function InvoiceStatusChart() {
    return (
        <div className="h-[360px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Invoice Status</h3>
                <p className="text-sm text-slate-500">Current invoice mix</p>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        dataKey="value"
                        paddingAngle={4}
                    >
                        {chartData.map((entry, index) => (
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
        </div>
    );
}
