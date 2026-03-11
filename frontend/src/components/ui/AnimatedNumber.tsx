import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

interface AnimatedNumberProps {
    value: number;
    className?: string;
    prefix?: string;
    suffix?: string;
    decimals?: number;
}

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
        <span className={className}>
            {prefix}
            {displayValue.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            })}
            {suffix}
        </span>
    );
}
