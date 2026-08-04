import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center rounded-t-xl border-b-2 px-3 pt-1 text-sm font-medium leading-5 transition-all duration-300 focus:outline-none ' +
                (active
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 focus:border-indigo-700'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 focus:border-slate-300 focus:text-slate-800') +
                className
            }
        >
            {children}
        </Link>
    );
}
