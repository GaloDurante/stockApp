type ModalProps = {
    children: React.ReactNode;
    onClose: () => void;
    labelledBy?: string;
    describedBy?: string;
};

export default function Modal({ children, onClose, labelledBy, describedBy }: ModalProps) {
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
                className="m-4 relative bg-surface rounded-xl shadow-lg max-w-lg w-full z-10 border border-border"
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}
