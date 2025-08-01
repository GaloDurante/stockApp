import type { Metadata } from 'next';

import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
    title: 'Admin | Stock App',
    description: 'Administrador para gestionar los productos del cliente',
    icons: {
        icon: '/logo.png',
        shortcut: '/logo.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            <Sidebar />
            <div className="flex-1 p-4 md:p-8 bg-main text-white">{children}</div>
        </div>
    );
}
