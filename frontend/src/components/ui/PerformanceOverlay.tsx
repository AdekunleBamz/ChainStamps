import { useState, useEffect, useRef } from 'react';
import { Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/** FPS value above which performance is considered good (green). */
const FPS_GOOD_THRESHOLD = 55;
/** Target maximum FPS used for the progress bar width calculation. */
const FPS_MAX_TARGET = 60;

/**
 * A floating overlay that displays real-time frame rate (FPS) and performance status.
 * Can be toggled on and off.
 */
export const PerformanceOverlay = () => {
    const [fps, setFps] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const frameCount = useRef(0);
    const lastTime = useRef(0);

    /**
     * Effect hook that calculates the current frames per second (FPS)
     * using requestAnimationFrame for high-precision measurement.
     */
    useEffect(() => {
        let animationId: number;
        lastTime.current = performance.now();

        const update = () => {
            frameCount.current++;
            const now = performance.now();

            if (now >= lastTime.current + 1000) {
                setFps(Math.round((frameCount.current * 1000) / (now - lastTime.current)));
                frameCount.current = 0;
                lastTime.current = now;
            }

            animationId = requestAnimationFrame(update);
        };

        animationId = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationId);
    }, []);

    return (
        <div className="fixed bottom-4 left-4 z-[100]">
            <button
                onClick={() => setIsVisible(!isVisible)}
                className="flex items-center gap-2 px-3 py-1.5 glass rounded-full text-[10px] font-bold tracking-widest uppercase hover:bg-white/10 transition-colors"
            >
                <Activity size={12} className={fps > FPS_GOOD_THRESHOLD ? "text-green-500" : "text-yellow-500"} />
                <span>Performance</span>
            </button>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-10 left-0 glass p-4 rounded-2xl min-w-[150px] space-y-3"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold">Frame Rate</span>
                            <span className={`text-sm font-mono font-bold ${fps > FPS_GOOD_THRESHOLD ? "text-green-500" : "text-yellow-500"}`}>
                                {fps} FPS
                            </span>
                        </div>

                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                className={`h-full ${fps > FPS_GOOD_THRESHOLD ? "bg-green-500" : "bg-yellow-500"}`}
                                animate={{ width: `${(fps / FPS_MAX_TARGET) * 100}%` }}
                            />
                        </div>

                        <div className="pt-2 border-t border-white/5">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] text-muted-foreground uppercase font-bold">Status</span>
                                <span className="text-[10px] text-green-500 font-bold">Optimal</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
