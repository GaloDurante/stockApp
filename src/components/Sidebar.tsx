'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

import { Menu, X, LogOut, ShoppingBag, Tags, ChartNoAxesCombined, Wallet } from 'lucide-react';

import Link from 'next/link';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(!isOpen);
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsOpen(false);
        }
    }, [pathname]);

    const renderNavLinks = () => (
        <>
            <Link
                href="/admin/sales"
                className={`flex items-center gap-2 px-3 py-2 rounded transition-colors hover:bg-border hover:text-accent ${
                    pathname.startsWith('/admin/sales') && 'text-accent'
                }`}
            >
                <span>
                    <ShoppingBag size={18} />
                </span>
                Ventas
            </Link>
            <Link
                href="/admin/products"
                className={`flex items-center gap-2 px-3 py-2 rounded transition-colors hover:bg-border hover:text-accent ${
                    pathname.startsWith('/admin/products') && 'text-accent'
                }`}
            >
                <span>
                    <Tags size={18} />
                </span>
                Productos
            </Link>
            <Link
                href="/admin/reports"
                className={`flex items-center gap-2 px-3 py-2 rounded transition-colors hover:bg-border hover:text-accent ${
                    pathname.startsWith('/admin/reports') && 'text-accent'
                }`}
            >
                <span>
                    <ChartNoAxesCombined size={18} />
                </span>
                Reportes
            </Link>
            <Link
                href="/admin/wallet"
                className={`flex items-center gap-2 px-3 py-2 rounded transition-colors hover:bg-border hover:text-accent ${
                    pathname.startsWith('/admin/wallet') && 'text-accent'
                }`}
            >
                <span>
                    <Wallet size={18} />
                </span>
                Saldo
            </Link>
            <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-border hover:text-accent transition-colors cursor-pointer text-left"
            >
                <span>
                    <LogOut size={18} />
                </span>
                Cerrar sesión
            </button>
        </>
    );

    return (
        <>
            <aside className="hidden md:flex w-42 xl:w-64 flex-col bg-surface border-r border-border">
                <nav className="flex flex-col gap-1 p-4 text-sm">{renderNavLinks()}</nav>
            </aside>

            <header className="md:hidden flex items-center justify-end px-4 py-3 bg-surface border-b border-border shadow-md">
                <button onClick={toggleMenu} className="focus:outline-none cursor-pointer">
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            <div
                className={`md:hidden bg-surface transition-all duration-300 ease-in-out overflow-hidden ${
                    isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <nav className="flex flex-col gap-2 p-4 text-sm">{renderNavLinks()}</nav>
            </div>
        </>
    );
}
