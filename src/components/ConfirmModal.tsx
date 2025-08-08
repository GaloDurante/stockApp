import { useState } from 'react';
import { X } from 'lucide-react';

type ConfirmModalProps = {
    entityItem: string;
    onClose: () => void;
    onTrigger: () => void;
    isDelete?: boolean;
    customMessage?: string;
    isTwoStep?: boolean;
    confirmationText?: string;
};

export default function ConfirmModal({
    isDelete = true,
    customMessage,
    entityItem,
    onClose,
    onTrigger,
    isTwoStep = false,
    confirmationText = '',
}: ConfirmModalProps) {
    const [inputValue, setInputValue] = useState('');
    const isConfirmEnabled = !isTwoStep || inputValue.trim() === confirmationText.trim();

    return (
        <>
            <div className="text-sm p-4 border-b border-border bg-main rounded-t-xl flex items-center justify-between">
                <h3 className="font-semibold">{isDelete ? `Eliminar ${entityItem}` : 'Confirmar'}</h3>
                <button type="button" onClick={onClose}>
                    <X className="h-7 w-7 p-1 hover:bg-border rounded-full cursor-pointer transition-all" />
                </button>
            </div>

            {customMessage ? (
                <p className="text-sm p-4">{customMessage}</p>
            ) : (
                <p className="text-sm p-4">
                    ¿Estás seguro de que deseas eliminar <span className="font-bold text-xs">{entityItem}</span>? Esto
                    no se puede deshacer luego.
                </p>
            )}

            {isTwoStep && (
                <div className="px-4 pb-4">
                    <label className="block text-sm mb-2">
                        Debes escribir <span className="font-semibold">"{confirmationText}"</span> para confirmar:
                    </label>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-200"
                    />
                </div>
            )}

            <div className="p-4 border-t border-border flex justify-between gap-4 text-sm">
                <button
                    type="button"
                    className="font-semibold shadow-md p-3 rounded-md cursor-pointer border border-border hover:bg-border-dark transition-all"
                    onClick={onClose}
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    className={`transition-all shadow-md p-3 rounded-md ${
                        isDelete ? 'bg-red-700 hover:bg-red-800' : 'bg-secondary hover:bg-muted text-main'
                    } font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                    onClick={onTrigger}
                    disabled={!isConfirmEnabled}
                >
                    {isDelete ? 'Eliminar' : 'Confirmar'}
                </button>
            </div>
        </>
    );
}
