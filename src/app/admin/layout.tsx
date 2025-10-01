import type { Metadata } from 'next';

import Sidebar from '@/components/Sidebar';
import ReturnBtn from '@/components/ReturnBtn';

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
        <div className="flex min-h-screen flex-col md:flex-row bg-main text-secondary">
            <Sidebar />
            <div className="flex-1 p-4 md:px-8 mg:py-4 min-w-0">
                <ReturnBtn />
                {children}
            </div>
        </div>
    );
}
