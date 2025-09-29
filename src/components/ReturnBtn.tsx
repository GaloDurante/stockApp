'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function ReturnBtn() {
    const router = useRouter();
    return (
        <button
            type="button"
            onClick={() => router.back()}
            className="bg-surface rounded-full p-2 mb-4 cursor-pointer hover:bg-border border border-border transition-all"
            title="Volver"
        >
            <ChevronLeft size={20} />
        </button>
    );
}
