import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';
import { triggerHaptic } from '../../utils/haptics';

/** Loader size in pixels for each button size variant. */
const BUTTON_LOADER_SIZE: Record<string, number> = { sm: 14, md: 16, lg: 20, icon: 16 };

/** CSS classes for each button colour variant. */
const BUTTON_VARIANT_CLASSES = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground shadow-sm",
    ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg shadow-destructive/20",
};

/** CSS classes for each button size variant. */
const BUTTON_SIZE_CLASSES = {
    sm: "h-9 px-3 text-xs",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8",
    icon: "h-10 w-10 p-2",
};

/** Hover scale factor for button animation. */
const BUTTON_HOVER_SCALE = 1.02;

/** Tap scale factor for button animation. */
const BUTTON_TAP_SCALE = 0.98;

/**
 * Properties for the Button component.
 * @extends {HTMLMotionProps<'button'>}
 */
interface ButtonProps extends HTMLMotionProps<'button'> {
    /** The content to be rendered inside the button (text, icons, etc.). */
    children: ReactNode;
    /** The visual style variant. primary: solid, secondary: muted, outline: bordered, ghost: no background. */
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    /** The size of the button box and text. Defaults to 'md'. */
    size?: 'sm' | 'md' | 'lg' | 'icon';
    /** Additional CSS classes for custom styling. */
    className?: string;
    /** The intensity of haptic feedback triggered on click. Defaults to 'light'. */
    haptic?: 'light' | 'medium' | 'heavy' | 'error' | 'success';
    /** Click event handler with haptic feedback integration. */
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    /** Accessible title for the button used by screen readers. */
    title?: string;
    /** Disables the button and prevents interaction. */
    disabled?: boolean;
    /** Shows a loading spinner and disables the button. */
    isLoading?: boolean;
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
    isLoading = false,
    disabled,
    ...props
}: ButtonProps) {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        triggerHaptic(haptic);
        if (onClick) onClick(e);
    };

    const isDisabled = disabled || isLoading;
    const loaderSize = BUTTON_LOADER_SIZE[size] ?? 16;

    return (
        <motion.button
            whileHover={{ scale: BUTTON_HOVER_SCALE }}
            whileTap={{ scale: BUTTON_TAP_SCALE }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={twMerge(
                "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                BUTTON_VARIANT_CLASSES[variant],
                BUTTON_SIZE_CLASSES[size],
                className
            )}
            {...props}
            disabled={isDisabled}
            onClick={handleClick}
        >
            {isLoading ? <Loader2 className="animate-spin" size={loaderSize} /> : children}
        </motion.button>
    );
}
