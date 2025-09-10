import { toast, ToastOptions } from 'react-hot-toast';

export const showErrorToast = (message: string, options?: ToastOptions) => {
    toast.error(message, {
        position: 'bottom-right',
        duration: 3000,
        style: {
            background: '#B91C1C',
            color: '#FEF2F2',
            border: '1px solid #991B1B',
            fontWeight: 500,
            padding: '10px 16px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            fontSize: '13px',
            lineHeight: '1.4',
            minWidth: '240px',
            maxWidth: '380px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
        },
        iconTheme: {
            primary: '#FCA5A5',
            secondary: '#B91C1C',
        },
        ...options,
    });
};

export const showSuccessToast = (message: string, options?: ToastOptions) => {
    toast.success(message, {
        position: 'bottom-right',
        duration: 3000,
        style: {
            background: '#15803D',
            color: '#F0FDF4',
            border: '1px solid #166534',
            fontWeight: 500,
            padding: '10px 16px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            fontSize: '13px',
            lineHeight: '1.4',
            minWidth: '240px',
            maxWidth: '380px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
        },
        iconTheme: {
            primary: '#A7F3D0',
            secondary: '#15803D',
        },
        ...options,
    });
};
