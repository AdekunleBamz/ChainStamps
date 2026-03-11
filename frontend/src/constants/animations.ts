/**
 * Centralized animation constants for ChainStamps.
 * Ensures consistent motion feel across all components.
 */

export const SPRINGS = {
    // Snappy spring for buttons and small interactive elements
    snappy: {
        type: "spring",
        stiffness: 400,
        damping: 17
    },
    // Smooth spring for card entries and larger transitions
    smooth: {
        type: "spring",
        stiffness: 260,
        damping: 20
    },
    // Gentle spring for subtle layout shifts
    gentle: {
        type: "spring",
        stiffness: 120,
        damping: 14
    }
} as const;

export const TRANSITIONS = {
    // Standard entry transition
    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: SPRINGS.smooth
    },
    // Fade in only
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3, ease: "easeOut" }
    },
    // Scale in for tooltips and popovers
    scaleIn: {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: SPRINGS.snappy
    }
} as const;

export const HOVER_EFFECTS = {
    // Subtle lift and scale
    lift: {
        whileHover: { y: -4, scale: 1.02 },
        whileTap: { scale: 0.98 },
        transition: SPRINGS.snappy
    },
    // Interaction scale only
    press: {
        whileTap: { scale: 0.95 },
        transition: SPRINGS.snappy
    }
} as const;
