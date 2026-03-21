import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

/**
 * Properties for the AnimatedNumber component.
 */
interface AnimatedNumberProps {
    /** The target numeric value to animate to. */
    value: number;
    /** Additional CSS classes for the container. */
    className?: string;
    /** Optional prefix to display before the number. */
    prefix?: string;
    /** Optional suffix to display after the number. */
    suffix?: string;
    /** The number of decimal places to display. Defaults to 0. */
    decimals?: number;
}

/**
 * A component that animates numeric value transitions using Framer Motion.
 * 
 * @param {AnimatedNumberProps} props - The component properties.
 * @returns {JSX.Element} The rendered animated number.
 */
export function AnimatedNumber({ value, className, prefix = '', suffix = '', decimals = 0 }: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        const controls = animate(displayValue, value, {
            duration: 1.5,
            ease: "easeOut",
            onUpdate: (latest) => setDisplayValue(latest)
        });

        return () => controls.stop();
    }, [value]);

    return (
        <span 
            className={className}
            aria-live="polite"
            aria-atomic="true"
        >
            {prefix}
            {displayValue.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            })}
            {suffix}
        </span>
    );
}
