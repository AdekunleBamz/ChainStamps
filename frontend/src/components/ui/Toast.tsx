import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import { CheckCircle, AlertCircle, X, Info, AlertTriangle } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

/**
 * A container component that renders active toast notifications in a fixed position.
 * Listens to the toast context for updates.
 */
export const ToastContainer = () => {
    const { toasts, removeToast } = useToast();

    /** Mapping of notification types to their respective Lucide icons and colors. */
    const icons = {
        success: <CheckCircle className="text-green-500" size={20} />,
        error: <AlertCircle className="text-red-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
        warning: <AlertTriangle className="text-yellow-500" size={20} />,
    };

    /** Mapping of notification types to their glassmorphic background styles. */
    const variants = {
        success: "border-green-500/20 bg-green-500/10",
        error: "border-red-500/20 bg-red-500/10",
        info: "border-blue-500/20 bg-blue-500/10",
        warning: "border-yellow-500/20 bg-yellow-500/10",
    };

    return (
        <div 
            className="fixed bottom-6 right-6 z-[1000] flex flex-col gap-3 pointer-events-none"
            aria-live="polite"
            aria-relevant="additions"
            role="status"
        >
            <AnimatePresence>
                {toasts.map((toast) => (
                    <motion.div
                        key={toast.id}
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className={twMerge(
                            "pointer-events-auto flex items-center gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl min-w-[300px] max-w-md",
                            variants[toast.type]
                        )}
                    >
                        <div className="shrink-0">{icons[toast.type]}</div>
                        <p className="flex-1 text-sm font-medium text-foreground">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-2 shrink-0 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
