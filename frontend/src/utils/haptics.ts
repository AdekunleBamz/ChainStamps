/**
 * Triggers a subtle haptic vibration on supported devices.
 * 
 * @param {'light' | 'medium' | 'heavy' | 'error' | 'success'} type - The intensity or pattern of haptic feedback.
 */
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'error' | 'success' = 'light') => {
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
            default:
                navigator.vibrate(10);
        }
    }
};
