/** Haptic feedback type definitions for consistent tactile interactions. */
export type HapticType = 'light' | 'medium' | 'heavy' | 'error' | 'success' | 'notification';

/**
 * Triggers haptic feedback on supported devices.
 * Uses the Web Vibration API to provide sensory cues for user interactions.
 *
 * @param type - The intensity/pattern of the vibration.
 */
export const triggerHaptic = (type: HapticType): void => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        switch (type) {
            case 'light':
                navigator.vibrate(10);
                break;
            case 'medium':
                navigator.vibrate(20);
                break;
            case 'heavy':
                navigator.vibrate(50);
                break;
            case 'success':
                navigator.vibrate([10, 30, 10]);
                break;
            case 'error':
                navigator.vibrate([50, 50, 50]);
                break;
            case 'notification':
                navigator.vibrate([10, 50, 10]);
                break;
            default:
                navigator.vibrate(10);
        }
    }
};
