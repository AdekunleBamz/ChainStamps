import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useToast } from '../../context/ToastContext';

/** Pull distance in pixels required to trigger a refresh. */
const PULL_REFRESH_THRESHOLD = 80;
/** Opacity divisor used to fade in the pull indicator. */
const PULL_OPACITY_DIVISOR = 60;

/**
 * Properties for the PullToRefresh component.
 */
interface PullToRefreshProps {
    /** Async function to call when a refresh is triggered. */
    onRefresh: () => Promise<void>;
}

/**
 * A mobile-friendly pull-to-refresh container that triggers an action when pulled down.
 * 
 * @param {PullToRefreshProps} props - The component properties.
 * @returns {JSX.Element} The rendered pull-to-refresh indicator.
 */
export const PullToRefresh = ({ onRefresh }: PullToRefreshProps) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [pullDistance, setPullDistance] = useState(0);
    const { addToast } = useToast();

    useEffect(() => {
        let startY = 0;

        const handleTouchStart = (e: TouchEvent) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].pageY;
            }
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (window.scrollY === 0 && startY > 0) {
                const currentY = e.touches[0].pageY;
                const diff = Math.max(0, (currentY - startY) * 0.4);
                setPullDistance(diff);

                if (diff > 0) {
                    // Prevent scroll if pulling
                    if (e.cancelable) e.preventDefault();
                }
            }
        };

        /**
         * Finalizes the pull interaction. If the pull distance exceeds the threshold,
         * triggers the onRefresh callback and provides visual/toast feedback.
         */
        const handleTouchEnd = async () => {
            if (pullDistance > PULL_REFRESH_THRESHOLD && !isRefreshing) {
                setIsRefreshing(true);
                setPullDistance(PULL_REFRESH_THRESHOLD);
                try {
                    await onRefresh();
                    addToast('Accounts refreshed successfully', 'success');
                } catch (err) {
                    console.error('Refresh failed:', err);
                    addToast('Failed to refresh accounts', 'error');
                } finally {
                    setIsRefreshing(false);
                }
            }

            setPullDistance(0);
            startY = 0;
        };

        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        window.addEventListener('touchend', handleTouchEnd);

        return () => {
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('touchend', handleTouchEnd);
        };
    }, [pullDistance, isRefreshing, onRefresh, addToast]);

    return (
        <motion.div
            style={{
                height: pullDistance,
                opacity: Math.min(1, pullDistance / PULL_OPACITY_DIVISOR)
            }}
            className="pull-to-refresh-indicator overflow-hidden flex items-center justify-center w-full"
        >
            <motion.div
                animate={isRefreshing ? { rotate: 360 } : { rotate: pullDistance * 2 }}
                transition={isRefreshing ? { repeat: Infinity, duration: 1, ease: "linear" } : { type: "spring" }}
            >
                <RefreshCw
                    size={24}
                    className={isRefreshing ? "text-primary" : "text-muted-foreground"}
                />
            </motion.div>
        </motion.div>
    );
}
