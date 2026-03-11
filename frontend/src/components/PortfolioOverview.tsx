import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownLeft, PieChart, Coins } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { Button } from './ui/Button';

export function PortfolioOverview() {
    const { isConnected, userAddress } = useWallet();
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isConnected || !userAddress) return;

        const fetchBalance = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${userAddress}/balances`);
                const data = await response.json();
                const stxBalance = parseInt(data.stx.balance) / 1000000;
                setBalance(stxBalance);
            } catch (err) {
                console.error('Failed to fetch balance:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchBalance();
    }, [isConnected, userAddress]);

    if (!isConnected) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-6 mb-8"
        >
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">Your Portfolio</h3>
                        <p className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                            {userAddress}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="text-center md:text-right">
                        <span className="text-xs text-muted-foreground uppercase tracking-widest block mb-1">STX Balance</span>
                        <div className="flex items-center gap-2 justify-center md:justify-end">
                            <Coins size={18} className="text-primary" />
                            <span className="text-2xl font-bold font-mono">
                                {balance !== null ? (
                                    <AnimatedNumber value={balance} decimals={2} />
                                ) : (
                                    '----'
                                )}
                            </span>
                            <span className="text-sm font-medium text-muted-foreground">STX</span>
                        </div>
                    </div>

                    <div className="h-10 w-px bg-border hidden md:block" />

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl">
                            <ArrowUpRight size={14} className="mr-1" /> Send
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl">
                            <ArrowDownLeft size={14} className="mr-1" /> Receive
                        </Button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
