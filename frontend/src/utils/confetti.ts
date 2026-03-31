import confetti from 'canvas-confetti';

/**
 * Configuration options for confetti animations.
 * Uses brand colors (primary, accent, success) for consistency.
 */
const CONFETTI_COLORS = ['#6366f1', '#a855f7', '#3b82f6'];
const SUCCESS_COLORS = ['#6366f1', '#a855f7', '#22c55e'];

/**
 * Triggers a side-burst confetti effect that lasts for 3 seconds.
 * Creates a celebratory animation from both sides of the screen.
 * Ideal for milestone achievements or special events.
 */
export const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: ReturnType<typeof setInterval> = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: CONFETTI_COLORS
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: CONFETTI_COLORS
        });
    }, 250);
};

/**
 * Triggers a celebratory confetti animation on the screen.
 * Used to provide visual feedback for successful transactions.
 * Creates a single burst from the bottom center with success colors.
 */
export const triggerSuccessConfetti = () => {
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: SUCCESS_COLORS,
        ticks: 200,
        gravity: 1.2,
        scalar: 1.2,
        shapes: ['circle', 'square']
    });
};

/**
 * Triggers a subtle confetti burst for minor celebrations.
 * Uses fewer particles and a shorter duration.
 */
export const triggerSubtleConfetti = () => {
    confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.7 },
        colors: CONFETTI_COLORS,
        ticks: 100,
        gravity: 0.8,
        scalar: 0.8
    });
};
