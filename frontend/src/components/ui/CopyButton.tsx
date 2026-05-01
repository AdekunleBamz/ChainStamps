import { useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useToast } from '../../context/ToastContext';
import { triggerHaptic } from '../../utils/haptics';

/** Duration in milliseconds for copy feedback before resetting state. */
const COPY_FEEDBACK_DURATION = 2000;

/**
 * Properties for the CopyButton component.
 */
interface CopyButtonProps {
    /** The string value to be copied to the clipboard. */
    value: string;
    /** Additional CSS classes for the button element. */
    className?: string;
    /** The size of the icon in pixels. Defaults to 14. */
    size?: number;
}

/**
 * A utility button that copies a given value to the clipboard and provides visual feedback.
 * 
 * @param {CopyButtonProps} props - The component properties.
 * @returns {JSX.Element} The rendered copy button.
 */
export const CopyButton = ({ value, className, size = 14 }: CopyButtonProps) => {
    const [copied, setCopied] = useState(false);
    const { addToast } = useToast();
    const controls = useAnimation();

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            triggerHaptic('success');
            controls.start({
                scale: [1, 1.2, 1],
                transition: { duration: 0.2 }
            });
            addToast('Copied to clipboard', 'success');
            const timeoutId = setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION);
            return () => clearTimeout(timeoutId);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            triggerHaptic('error');
            addToast('Failed to copy to clipboard', 'error');
        }
    };

    return (
        <motion.button
            animate={controls}
            onClick={handleCopy}
            className={twMerge(
                "relative flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-accent hover:text-accent-foreground",
                className
            )}
            aria-live={copied ? 'polite' : 'off'}
            title="Copy to clipboard"
        >
            <AnimatePresence mode="wait">
                {copied ? (
                    <motion.div
                        key="check"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                        className="text-green-500"
                    >
                        <Check size={size} strokeWidth={2.5} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="copy"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Copy size={size} strokeWidth={1.5} />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {copied && (
                    <motion.span
                        initial={{ opacity: 0, y: 10, x: '-50%' }}
                        animate={{ opacity: 1, y: 0, x: '-50%' }}
                        exit={{ opacity: 0, y: 10, x: '-50%' }}
                        className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-lg"
                    >
                        COPIED!
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.button>
    );
}
