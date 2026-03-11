import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface CopyButtonProps {
    value: string;
    className?: string;
    size?: number;
}

export function CopyButton({ value, className, size = 14 }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className={twMerge(
                "relative flex items-center justify-center rounded-md p-1.5 transition-colors hover:bg-accent hover:text-accent-foreground",
                className
            )}
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
        </button>
    );
}
