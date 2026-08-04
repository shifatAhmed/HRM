import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const chartData = [
    { month: 'Jan', income: 25000, expense: 18000 },
    { month: 'Feb', income: 28000, expense: 19500 },
    { month: 'Mar', income: 26000, expense: 20000 },
    { month: 'Apr', income: 32000, expense: 21000 },
    { month: 'May', income: 35000, expense: 24000 },
    { month: 'Jun', income: 38000, expense: 26000 },
];

export default function IncomeExpenseChart() {
    return (
        <div className="h-[360px] w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                        Monthly Income vs Expense
                    </h3>
                    <p className="text-sm text-slate-500">Performance overview</p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={chartData}>
                    <defs>
                        <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.35} />
                            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.02} />
                        </linearGradient>
                        <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                        </linearGradient>
                    </defs>

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
                    <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#4F46E5"
                        strokeWidth={3}
                        fill="url(#incomeFill)"
                        activeDot={{ r: 6 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="expense"
                        stroke="#10B981"
                        strokeWidth={3}
                        fill="url(#expenseFill)"
                        activeDot={{ r: 6 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
