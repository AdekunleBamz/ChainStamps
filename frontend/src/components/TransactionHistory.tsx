import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ExternalLink, Trash2, Hash, Tag, Stamp, Search } from 'lucide-react';
import { HistoryService, TransactionRecord } from '../services/history';
import { Button } from './ui/Button';
import { Breadcrumbs } from './ui/Breadcrumbs';
import { EmptyState } from './ui/EmptyState';

export function TransactionHistory() {
    const [history, setHistory] = useState<TransactionRecord[]>([]);
    const [search, setSearch] = useState('');

    const loadHistory = () => {
        setHistory(HistoryService.getHistory());
    };

    useEffect(() => {
        loadHistory();
        window.addEventListener('history_updated', loadHistory);
        return () => window.removeEventListener('history_updated', loadHistory);
    }, []);

    const filteredHistory = history.filter(item =>
        item.details.toLowerCase().includes(search.toLowerCase()) ||
        item.txid.toLowerCase().includes(search.toLowerCase()) ||
        item.type.toLowerCase().includes(search.toLowerCase())
    );

    const getIcon = (type: string) => {
        switch (type) {
            case 'hash': return <Hash size={16} />;
            case 'tag': return <Tag size={16} />;
            case 'stamp': return <Stamp size={16} />;
            default: return <Clock size={16} />;
        }
    };

    const formatDate = (timestamp: number) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(timestamp));
    };

    return (
        <section id="history" className="card">
            <Breadcrumbs items={[{ label: 'Transaction History' }]} />
            <div className="card-header">
                <Clock className="card-icon" size={24} strokeWidth={1.5} />
                <h2>Local History</h2>
                {history.length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            if (confirm('Clear all local transaction history?')) {
                                HistoryService.clearHistory();
                            }
                        }}
                        className="text-error hover:bg-error/10 ml-auto"
                    >
                        <Trash2 size={16} className="mr-2" />
                        Clear
                    </Button>
                )}
            </div>

            <p className="card-description">
                Your last 50 transactions stored locally in this browser.
            </p>

            {history.length > 0 && (
                <div className="search-wrapper mb-6">
                    <Search className="search-icon" size={16} />
                    <input
                        type="text"
                        placeholder="Search history..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                </div>
            )}

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                    {filteredHistory.length > 0 ? (
                        filteredHistory.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                            {getIcon(item.type)}
                                        </span>
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                            {item.type}
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {formatDate(item.timestamp)}
                                    </span>
                                </div>

                                <p className="text-sm font-medium mb-2 truncate">
                                    {item.details}
                                </p>

                                <div className="flex items-center justify-between gap-4">
                                    <code className="text-[10px] text-muted-foreground truncate bg-muted px-1 rounded">
                                        {item.txid}
                                    </code>
                                    <a
                                        href={`https://explorer.stacks.co/txid/${item.txid}?chain=mainnet`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-xs text-primary hover:underline group-hover:visible"
                                    >
                                        Explorer <ExternalLink size={10} />
                                    </a>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <EmptyState
                            title={search ? "No matches found" : "No history yet"}
                            description={search ? "Try a different search term." : "Transactions you make will appear here."}
                        />
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
