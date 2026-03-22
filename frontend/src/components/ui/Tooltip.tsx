import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Properties for the Tooltip component.
 */
interface TooltipProps {
    /** The static text or dynamic content to display inside the tooltip popover. */
    content: string;
    /** The trigger element (text, icon, button) that reveals the tooltip on hover/focus. */
    children: ReactNode;
    /** Additional CSS classes for styling the tooltip trigger container. */
    className?: string;
}

/**
 * A floating tooltip component that appears on hover.
 * 
 * @param {TooltipProps} props - The component properties.
 * @returns {JSX.Element} The rendered tooltip container and popover.
 */
export const Tooltip = ({ content, children, className }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className={twMerge("relative inline-block", className)}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full left-1/2 z-[100] mb-2 -translate-x-1/2"
                        style={{ left: '50%', transform: 'translateX(-50%)' }}
                    >
                        <div className="relative rounded-lg border border-border bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-xl backdrop-blur-md">
                            {content}
                            <div className="absolute top-full left-1/2 -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-popover" />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
