type ModalProps = {
    children: React.ReactNode;
    onClose: () => void;
    labelledBy?: string;
    describedBy?: string;
    isLarge?: boolean;
};

export default function Modal({ children, onClose, labelledBy, describedBy, isLarge = false }: ModalProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
        >
            <div className="absolute inset-0 bg-black/80" onClick={onClose} />
            <div
                className={`m-4 relative bg-surface rounded-xl shadow-lg w-full z-10 border border-border ${isLarge ? 'max-w-3xl' : 'max-w-lg'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}
