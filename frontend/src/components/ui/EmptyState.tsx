import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { Search } from 'lucide-react';

/**
 * Properties for the EmptyState component.
 */
interface EmptyStateProps {
    /** The title to display. */
    title: string;
    /** The descriptive text to display. */
    description: string;
    /** Optional action element (e.g., a button) to display. */
    action?: ReactNode;
}

/**
 * A component that displays a visually stunning empty state with an abstract SVG illustration.
 * Used when search results are empty or a category has no items.
 * 
 * @param {EmptyStateProps} props - Component properties.
 * @component
 */
export const EmptyState = ({ title, description, action }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative mb-6"
            >
                {/* Abstract Premium SVG Illustration */}
                <svg
                    width="160"
                    height="160"
                    viewBox="0 0 160 160"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-2xl"
                >
                    <circle cx="80" cy="80" r="70" fill="url(#paint0_radial)" fillOpacity="0.1" />
                    <path
                        d="M80 30C52.3858 30 30 52.3858 30 80C30 107.614 52.3858 130 80 130C107.614 130 130 107.614 130 80"
                        stroke="hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.3)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray="4 8"
                    />
                    <motion.path
                        d="M100 100L130 130"
                        stroke="var(--primary)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        animate={{
                            x: [0, 5, 0],
                            y: [0, 5, 0]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 3,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.circle
                        cx="75"
                        cy="75"
                        r="35"
                        stroke="var(--primary)"
                        strokeWidth="8"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 4,
                            ease: "easeInOut"
                        }}
                    />
                    <defs>
                        <radialGradient
                            id="paint0_radial"
                            cx="0"
                            cy="0"
                            r="1"
                            gradientUnits="userSpaceOnUse"
                            gradientTransform="translate(80 80) rotate(90) scale(70)"
                        >
                            <stop stopColor="var(--primary)" />
                            <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Search size={40} className="text-primary opacity-50" strokeWidth={1} />
                </div>
            </motion.div>

            <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-bold text-foreground mb-2"
            >
                {title}
            </motion.h3>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-muted-foreground max-w-sm mb-8"
            >
                {description}
            </motion.p>

            {action && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {action}
                </motion.div>
            )}
        </div>
    );
}
