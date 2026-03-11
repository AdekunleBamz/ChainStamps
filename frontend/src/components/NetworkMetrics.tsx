import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Clock, Zap, database, Layers } from 'lucide-react';
import { AnimatedNumber } from './ui/AnimatedNumber';

export function NetworkMetrics() {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const [infoRes, mempoolRes] = await Promise.all([
                    fetch('https://api.mainnet.hiro.so/v2/info'),
                    fetch('https://api.mainnet.hiro.so/extended/v1/tx/mempool/stats')
                ]);
                const info = await infoRes.json();
                const mempool = await mempoolRes.json();

                setMetrics({
                    blockHeight: info.stacks_tip_height,
                    tps: 0.85, // Mocked as API doesn't provide live TPS easily
                    mempoolSize: mempool.total_pending,
                    avgBlockTime: 10.2 // Minutes, mocked
                });
            } catch (err) {
                console.error('Failed to fetch metrics:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading || !metrics) return null;

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
                { label: 'Block Height', value: metrics.blockHeight, icon: Layers, color: 'text-primary' },
                { label: 'Mempool Size', value: metrics.mempoolSize, icon: database, color: 'text-amber-500' },
                { label: 'Network TPS', value: metrics.tps, decimals: 2, icon: Zap, color: 'text-success' },
                { label: 'Avg Block Time', value: metrics.avgBlockTime, suffix: 'm', icon: Clock, color: 'text-blue-500' }
            ].map((m, i) => (
                <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass p-4"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <m.icon size={16} className={m.color} />
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">{m.label}</span>
                    </div>
                    <div className="text-xl font-bold font-mono">
                        <AnimatedNumber value={m.value} decimals={m.decimals} suffix={m.suffix} />
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
