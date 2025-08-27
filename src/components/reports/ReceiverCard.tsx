import { Receiver } from '@/generated/prisma';
import { formatPrice } from '@/lib/helpers/components/utils';

interface ReceiverProps {
    r: {
        receiver: Receiver;
        total: number;
    };
    percentage: string | number;
}

export default function ReceiverCard({ r, percentage }: ReceiverProps) {
    return (
        <div key={r.receiver} className="bg-surface p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-full border border-accent flex items-center justify-center">
                    <span className="text-accent font-semibold">{r.receiver.charAt(0)}</span>
                </div>
            </div>
            <h3 className="text-lg font-medium">{r.receiver}</h3>
            <div className="mt-4">
                <div className="text-sm text-muted">Monto recibido</div>
                <div className="text-2xl font-bold">{formatPrice(r.total)}</div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between text-sm">
                    <span className="text-muted">Porcentaje del total</span>
                    <span className="font-medium text-accent">{percentage}%</span>
                </div>
            </div>
        </div>
    );
}
