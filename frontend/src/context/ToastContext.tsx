import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Represents a single toast notification.
 */
interface Toast {
    /** Unique identifier for the toast. */
    id: string;
    /** The message to display. */
    message: string;
    /** The type of notification (success, error, etc.). */
    type: ToastType;
}

/**
 * The structure of the toast context, providing methods to add and remove notifications.
 */
interface ToastContextType {
    /** Array of currently active toast notifications. */
    toasts: Toast[];
    /** Function to add a new toast notification. */
    addToast: (message: string, type?: ToastType) => void;
    /** Function to remove a specific toast notification by its ID. */
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Provides toast notification state and methods to the application.
 * 
 * @param {Object} props - The component properties.
 * @param {ReactNode} props.children - The child components to be wrapped by the provider.
 * @returns {JSX.Element} The rendered provider component.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
