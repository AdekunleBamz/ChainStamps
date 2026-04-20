import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';

/** Animation duration in seconds for number transitions. */
const ANIMATED_NUMBER_DURATION = 1.5;
/** Cubic bezier easing for smooth deceleration of animated numbers. */
const ANIMATED_NUMBER_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

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
 * AnimatedNumber component for smooth numerical transitions.
 * Uses framer-motion to animate value changes.
 * 
 * @param {AnimatedNumberProps} props - Component properties.
 */
export function AnimatedNumber({ value, className, prefix = '', suffix = '', decimals = 0 }: AnimatedNumberProps) {
    const [displayValue, setDisplayValue] = useState(value);
    const latestValueRef = useRef(value);

    useEffect(() => {
        if (latestValueRef.current === value) return;

        const controls = animate(latestValueRef.current, value, {
            duration: ANIMATED_NUMBER_DURATION,
            ease: ANIMATED_NUMBER_EASE,
            onUpdate: (latest: number) => {
                latestValueRef.current = latest;
                setDisplayValue(latest);
            }
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
