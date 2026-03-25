import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

/**
 * Properties for the LoadingSpinner component.
 */
interface LoadingSpinnerProps {
    /** The size of the spinner in pixels. Defaults to 24. */
    size?: number;
    /** Additional CSS classes for custom styling. */
    className?: string;
    /** Accessible label for screen readers. Defaults to "Loading...". */
    label?: string;
}

/**
 * A reusable loading spinner component with smooth rotation and accessibility support.
 * 
 * @param {LoadingSpinnerProps} props - The loading spinner properties.
 * @returns {JSX.Element} The rendered loading spinner.
 */
export const LoadingSpinner = ({ 
    size = 24, 
    className, 
    label = "Loading..." 
}: LoadingSpinnerProps) => {
    return (
        <div 
            className={twMerge("flex items-center justify-center p-2", className)}
            role="status"
            aria-label={label}
        >
            <motion.div
                animate={{ rotate: 360 }}
                transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear"
                }}
                className="text-primary"
            >
                <Loader2 size={size} strokeWidth={2} />
            </motion.div>
            <span className="sr-only">{label}</span>
        </div>
    );
};
