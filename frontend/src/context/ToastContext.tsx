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
    /** Array of currently active toast notifications visible on the screen. */
    toasts: Toast[];
    /** 
     * Adds a new toast notification.
     * @param {string} message - The text to display in the toast.
     * @param {ToastType} [type] - The visual style (success, error, info, warning).
     */
    addToast: (message: string, type?: ToastType) => void;
    /** 
     * Manually removes a toast by its ID.
     * @param {string} id - The unique identifier of the toast to remove.
     */
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Provider component for managing global toast notifications.
 * 
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - The child components to render within the provider.
 */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    /**
     * Adds a new toast notification and schedules its automatic removal.
     * 
     * @param {string} message - The message to display.
     * @param {ToastType} [type='info'] - The severity/type of the toast.
     */
    const addToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
