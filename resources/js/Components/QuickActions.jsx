import { Building2, FileText, Home, Plus, UserPlus, Wallet } from 'lucide-react';

const actions = [
    { label: 'Add Building', icon: Building2, color: 'bg-blue-600' },
    { label: 'Add Flat', icon: Home, color: 'bg-violet-600' },
    { label: 'Add Tenant', icon: UserPlus, color: 'bg-emerald-600' },
    { label: 'Generate Invoice', icon: FileText, color: 'bg-amber-500' },
];

export default function QuickActions() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
                <p className="text-sm text-slate-500">Shortcut management</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                {actions.map((action) => {
                    const Icon = action.icon;

                    return (
                        <button
                            key={action.label}
                            type="button"
                            className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-white hover:shadow-md"
                        >
                            <span className="flex items-center gap-3">
                                <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.color} text-white shadow-sm transition-all duration-300 group-hover:scale-105`}>
                                    <Icon className="h-4 w-4" />
                                </span>
                                <span className="text-sm font-semibold text-slate-800">
                                    {action.label}
                                </span>
                            </span>
                            <Plus className="h-4 w-4 text-slate-400 transition-all duration-300 group-hover:rotate-90 group-hover:text-indigo-600" />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
