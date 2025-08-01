import { toast, ToastOptions } from 'react-hot-toast';

export const showErrorToast = (message: string, options?: ToastOptions) => {
    toast.error(message, {
        position: 'top-center',
        duration: 3000,
        style: {
            background: '#FEE2E2',
            color: '#A00000',
            border: '1px solid #EF4444',
            fontWeight: '600',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            maxWidth: 'none',
            width: 'auto',
            minWidth: '300px',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
        },
        iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFFFF',
        },
        ...options,
    });
};

export const showSuccessToast = (message: string, options?: ToastOptions) => {
    toast.success(message, {
        position: 'top-center',
        duration: 3000,
        style: {
            background: '#D1FAE5',
            color: '#065F46',
            border: '1px solid #10B981',
            fontWeight: '600',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        },
        iconTheme: {
            primary: '#10B981',
            secondary: '#FFFFFF',
        },
        ...options,
    });
};
