import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

/**
 * Properties for the Skeleton component.
 */
interface SkeletonProps {
    /** Additional CSS classes for the skeleton element. */
    className?: string;
}

/**
 * A placeholder component that displays an animated pulse effect for loading states.
 * 
 * @param {SkeletonProps} props - The component properties.
 * @returns {JSX.Element} The rendered skeleton element.
 */
export function Skeleton({ className }: SkeletonProps) {
    return (
        <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className={twMerge(
                "rounded-md bg-muted",
                className
            )}
        />
    );
}

export function CardSkeleton() {
    return (
        <div className="card space-y-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
            </div>
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-10 w-full" />
        </div>
    );
}
