import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { Home } from 'lucide-react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900">
            <nav className="border-b border-indigo-300 bg-gradient-to-r from-indigo-300 via-white to-emerald-300 shadow-[0_10px_30px_-20px_rgba(79,70,229,0.55)] backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex items-center gap-3">
                            <Link
                                href={route('dashboard')}
                                className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition-all duration-300 hover:bg-slate-50"
                            >
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-500 text-white shadow-lg shadow-indigo-600/30">
                                    <Home className="h-5 w-5" />
                                </span>
                                <span className="hidden rounded-full bg-white/80 px-3 py-1 text-sm font-semibold tracking-wide text-slate-800 shadow-sm sm:block">
                                    House Rent
                                </span>
                            </Link>

                            <div className="hidden space-x-2 sm:-my-px sm:ms-2 sm:flex">
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    href={route('buildings.index')}
                                    active={route().current('buildings.*')}
                                >
                                    Buildings
                                </NavLink>
                                <NavLink
                                    href={route('flats.index')}
                                    active={route().current('flats.*')}
                                >
                                    Flats/Rooms
                                </NavLink>
                                <NavLink
                                    href={route('tenants.index')}
                                    active={route().current('tenants.*')}
                                >
                                    Tenants
                                </NavLink>
                                <NavLink
                                    href={route('invoices.index')}
                                    active={route().current('invoices.*')}
                                >
                                    Invoices
                                </NavLink>
                                <NavLink
                                    href={route('reports.index')}
                                    active={route().current('reports')}
                                >
                                    Reports
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-xl border border-indigo-200 bg-gradient-to-r from-white to-indigo-50 px-3 py-2 text-sm font-semibold leading-4 text-indigo-700 shadow-sm transition-all duration-300 hover:border-indigo-300 hover:from-indigo-50 hover:to-emerald-50 hover:text-emerald-700 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-xl p-2 text-slate-500 transition-all duration-300 hover:bg-gradient-to-br hover:from-indigo-500 hover:to-emerald-500 hover:text-white focus:bg-gradient-to-br focus:from-indigo-500 focus:to-emerald-500 focus:text-white focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('buildings.index')}
                            active={route().current('buildings.*')}
                        >
                            Buildings
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('flats.index')}
                            active={route().current('flats.*')}
                        >
                            Flats/Rooms
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('tenants.index')}
                            active={route().current('tenants.*')}
                        >
                            Tenants
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="border-b border-slate-200 bg-white/90">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
