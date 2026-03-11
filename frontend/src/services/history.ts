export interface TransactionRecord {
    id: string;
    type: 'hash' | 'stamp' | 'tag';
    timestamp: number;
    txid: string;
    details: string;
}

const HISTORY_KEY = 'chainstamps_tx_history';

/**
 * Service to manage local transaction history using localStorage.
 */
export const HistoryService = {
    /**
     * Adds a new transaction to the local history.
     */
    addRecord(record: Omit<TransactionRecord, 'id' | 'timestamp'>) {
        const history = this.getHistory();
        const newRecord: TransactionRecord = {
            ...record,
            id: crypto.randomUUID(),
            timestamp: Date.now(),
        };

        const updatedHistory = [newRecord, ...history].slice(0, 50); // Keep last 50
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

        // Dispatch custom event to notify components
        window.dispatchEvent(new CustomEvent('history_updated', { detail: newRecord }));
    },

    /**
     * Retrieves the full transaction history.
     */
    getHistory(): TransactionRecord[] {
        const data = localStorage.getItem(HISTORY_KEY);
        if (!data) return [];
        try {
            return JSON.parse(data);
        } catch {
            return [];
        }
    },

    /**
     * Clears the transaction history.
     */
    clearHistory() {
        localStorage.removeItem(HISTORY_KEY);
        window.dispatchEvent(new CustomEvent('history_updated'));
    }
};
