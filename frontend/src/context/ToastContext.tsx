import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

/** Duration in milliseconds before a toast auto-dismisses. */
const TOAST_AUTO_DISMISS_MS = 5000;
/** Character length of the randomly generated toast ID. */
const TOAST_ID_LENGTH = 9;

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
    /** Total number of active toast notifications. */
    toastCount: number;
    /** 
     * Adds a new toast notification.
     * @param {string} message - The text to display in the toast.
     * @param {ToastType} [type] - The visual style (success, error, info, warning).
     */
    addToast: (message: string, type?: ToastType) => void;
    /** Convenience method to add a success toast. */
    addSuccess: (message: string) => void;
    /** Convenience method to add an error toast. */
    addError: (message: string) => void;
    /** Convenience method to add a warning toast. */
    addWarning: (message: string) => void;
    /** Convenience method to add an info toast. */
    addInfo: (message: string) => void;
    /** 
     * Manually removes a toast by its ID.
     * @param {string} id - The unique identifier of the toast to remove.
     */
    removeToast: (id: string) => void;
    /** Removes all active toasts immediately. */
    clearAll: () => void;
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
        const id = Math.random().toString(36).substr(2, TOAST_ID_LENGTH);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto-remove after 5 seconds
        const timeoutId = setTimeout(() => {
            removeToast(id);
        }, TOAST_AUTO_DISMISS_MS);

        // Cleanup timeout on unmount or before re-adding
        return () => clearTimeout(timeoutId);
    }, [removeToast]);

    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    const addSuccess = useCallback((message: string) => addToast(message, 'success'), [addToast]);
    const addError = useCallback((message: string) => addToast(message, 'error'), [addToast]);
    const addWarning = useCallback((message: string) => addToast(message, 'warning'), [addToast]);
    const addInfo = useCallback((message: string) => addToast(message, 'info'), [addToast]);

    return (
        <ToastContext.Provider value={{ toasts, toastCount: toasts.length, addToast, addSuccess, addError, addWarning, addInfo, removeToast, clearAll }}>
            {children}
        </ToastContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
