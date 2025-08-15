interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export default function Switch({ checked, onChange, disabled = false }: SwitchProps) {
    return (
        <button
            type="button"
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                checked ? 'bg-accent' : 'bg-muted'
            } ${disabled ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => onChange(!checked)}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checked ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );
}
