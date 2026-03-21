import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { triggerHaptic } from '../../utils/haptics';

/**
 * Properties for the Button component.
 * @extends {HTMLMotionProps<'button'>}
 */
interface ButtonProps extends HTMLMotionProps<'button'> {
    /** The content to be rendered inside the button. */
    children: ReactNode;
    /** The visual style variant of the button. Defaults to 'primary'. */
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    /** The size of the button. Defaults to 'md'. */
    size?: 'sm' | 'md' | 'lg' | 'icon';
    /** Additional CSS classes for the button. */
    className?: string;
    /** The type of haptic feedback to trigger on click. Defaults to 'light'. */
    haptic?: 'light' | 'medium' | 'heavy' | 'error' | 'success';
    /** Optional click handler. */
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    /** Optional title for the button. */
    title?: string;
    /** Whether the button is disabled. */
    disabled?: boolean;
}

/**
 * A reusable button component with haptic feedback and Framer Motion animations.
 * 
 * @param {ButtonProps} props - The button properties.
 * @returns {JSX.Element} The rendered button component.
 */
export function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    haptic = 'light',
    onClick,
    ...props
}: ButtonProps) {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        triggerHaptic(haptic);
        if (onClick) onClick(e);
    };
    const variants = {
        primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/20",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
        ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    };

    const sizes = {
        sm: "h-9 px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8",
        icon: "h-10 w-10 p-2",
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={twMerge(
                "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
            onClick={handleClick}
        >
            {children}
        </motion.button>
    );
}
