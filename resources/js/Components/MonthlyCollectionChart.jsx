import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const chartData = [
    { month: 'Jan', collection: 21000 },
    { month: 'Feb', collection: 24500 },
    { month: 'Mar', collection: 23400 },
    { month: 'Apr', collection: 26800 },
    { month: 'May', collection: 28700 },
    { month: 'Jun', collection: 32000 },
];

export default function MonthlyCollectionChart() {
    return (
        <div className="h-[360px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                    Monthly Rent Collection
                </h3>
                <p className="text-sm text-slate-500">Last 6 months</p>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <BarChart data={chartData}>
                    <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fill: '#64748B', fontSize: 12 }} />
                    <YAxis tick={{ fill: '#64748B', fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{
                            borderRadius: '16px',
                            borderColor: '#E2E8F0',
                            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.08)',
                        }}
                    />
                    <Legend />
                    <Bar dataKey="collection" fill="#4F46E5" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
