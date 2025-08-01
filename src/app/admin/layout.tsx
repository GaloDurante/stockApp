import type { Metadata } from 'next';

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
    return <>{children}</>;
}
