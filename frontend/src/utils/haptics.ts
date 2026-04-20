/** Haptic feedback type definitions for consistent tactile interactions. */
export type HapticType = 'light' | 'medium' | 'heavy' | 'error' | 'success' | 'notification';

/**
 * Returns true if the current environment supports the Web Vibration API.
 */
export const isHapticsSupported = (): boolean =>
  typeof window !== 'undefined' && 'vibrate' in navigator;

/** Vibration patterns for each haptic type in milliseconds. */
const HAPTIC_PATTERN: Record<HapticType, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 50,
    success: [10, 30, 10],
    error: [50, 50, 50],
    notification: [10, 50, 10],
};

/**
 * Triggers haptic feedback on supported devices.
 * Uses the Web Vibration API to provide sensory cues for user interactions.
 *
 * @param type - The intensity/pattern of the vibration.
 */
export const triggerHaptic = (type: HapticType): void => {
    if (!isHapticsSupported()) return;
    navigator.vibrate(HAPTIC_PATTERN[type] ?? 10);
};

/**
 * Triggers a sequence of haptic feedback patterns in order.
 *
 * @param types - Ordered list of haptic types to fire in sequence.
 */
export const triggerHapticSequence = (types: HapticType[]): void => {
    if (!isHapticsSupported() || types.length === 0) return;
    const pattern = types.flatMap(t => {
        const p = HAPTIC_PATTERN[t];
        return typeof p === 'number' ? [p, 50] : [...p, 50];
    });
    navigator.vibrate(pattern);
};

/**
 * Immediately cancels any ongoing haptic vibration.
 */
export const cancelHaptic = (): void => {
    if (!isHapticsSupported()) return;
    navigator.vibrate(0);
};

/** Convenience alias: triggers a 'success' haptic */
export const hapticSuccess = (): void => triggerHaptic('success');

/** Convenience alias: triggers an 'error' haptic */
export const hapticError = (): void => triggerHaptic('error');
