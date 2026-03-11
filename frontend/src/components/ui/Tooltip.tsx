import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { TRANSITIONS } from '../../constants/animations';

interface TooltipProps {
    content: string;
    children: ReactNode;
    className?: string;
}

export const Tooltip = memo(function Tooltip({ content, children, className }: TooltipProps) {
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
                        {...TRANSITIONS.scaleIn}
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
});
极
