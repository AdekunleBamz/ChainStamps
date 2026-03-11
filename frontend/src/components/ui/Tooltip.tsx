import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

/** Animation duration for tooltip transitions in seconds. */
const TOOLTIP_ANIMATION_DURATION = 0.15;

/**
 * Properties for the Tooltip component.
 */
interface TooltipProps {
    /** The static text or dynamic content to display inside the tooltip popover. */
    content: string | ReactNode;
    /** The trigger element (text, icon, button) that reveals the tooltip on hover/focus. */
    children: ReactNode;
    /** Additional CSS classes for styling the tooltip trigger container. */
    className?: string;
    /** Where the tooltip appears relative to the trigger. Defaults to 'top'. */
    placement?: 'top' | 'bottom';
}

export const Tooltip = memo(function Tooltip({ content, children, className }: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <div
            className={twMerge("relative inline-block", className)}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
            tabIndex={0}
        >
            {children}
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: placement === 'top' ? 10 : -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: placement === 'top' ? 10 : -10, scale: 0.95 }}
                        className={placement === 'top'
                            ? "absolute bottom-full left-1/2 z-[100] mb-2 -translate-x-1/2"
                            : "absolute top-full left-1/2 z-[100] mt-2 -translate-x-1/2"}
                        style={{ left: '50%', transform: 'translateX(-50%)' }}
                    >
                        <div className="relative rounded-lg border border-border bg-popover px-3 py-1.5 text-xs font-medium text-popover-foreground shadow-xl backdrop-blur-md" role="tooltip">
                            {content}
                            {placement === 'top' && (
                                <div className="absolute top-full left-1/2 -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-border bg-popover" />
                            )}
                            {placement === 'bottom' && (
                                <div className="absolute bottom-full left-1/2 mb-[-4px] h-2 w-2 -translate-x-1/2 rotate-45 border-t border-l border-border bg-popover" />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});
极
