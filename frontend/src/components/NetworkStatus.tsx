import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Globe, Wifi, WifiOff } from 'lucide-react';
import { Tooltip } from './ui/Tooltip';

export function NetworkStatus() {
    const [status, setStatus] = useState<'online' | 'offline' | 'checking'>('checking');
    const [latency, setLatency] = useState<number | null>(null);

    useEffect(() => {
        const checkNetwork = async () => {
            const start = Date.now();
            try {
                // Simplified check using a public Stacks node or similar
                const response = await fetch('https://api.mainnet.hiro.so/v2/info', { mode: 'no-cors' });
                setLatency(Date.now() - start);
                setStatus('online');
            } catch (err) {
                setStatus('offline');
                setLatency(null);
            }
        };

        checkNetwork();
        const interval = setInterval(checkNetwork, 30000); // Every 30s
        return () => clearInterval(interval);
    }, []);

    return (
        <Tooltip content={status === 'online' ? `Connected to Stacks Mainnet (${latency}ms)` : 'Network Disconnected'}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border text-[10px] font-bold uppercase tracking-wider"
            >
                {status === 'online' ? (
                    <>
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                        </div>
                        <span className="text-success">Mainnet</span>
                        <Activity size={12} className="text-muted-foreground ml-1" />
                    </>
                ) : (
                    <>
                        <div className="h-2 w-2 rounded-full bg-error"></div>
                        <span className="text-error">Offline</span>
                        <WifiOff size={12} className="text-error ml-1" />
                    </>
                )}
            </motion.div>
        </Tooltip>
    );
}
