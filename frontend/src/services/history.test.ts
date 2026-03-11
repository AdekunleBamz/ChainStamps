import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HistoryService } from './history';

describe('HistoryService', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should add a record and persist to localStorage', () => {
        const record = {
            type: 'hash' as const,
            txid: '0x123',
            details: 'Test record'
        };

        HistoryService.addRecord(record);
        const history = HistoryService.getHistory();

        expect(history).toHaveLength(1);
        expect(history[0].txid).toBe('0x123');
        expect(localStorage.getItem('chainstamps_tx_history')).toBeTruthy();
    });

    it('should limit history to last 50 items', () => {
        for (let i = 0; i < 60; i++) {
            HistoryService.addRecord({
                type: 'hash',
                txid: `tx-${i}`,
                details: `Record ${i}`
            });
        }

        const history = HistoryService.getHistory();
        expect(history).toHaveLength(50);
        expect(history[0].txid).toBe('tx-59'); // Most recent first
    });

    it('should clear history', () => {
        HistoryService.addRecord({ type: 'hash', txid: '123', details: 'test' });
        HistoryService.clearHistory();
        expect(HistoryService.getHistory()).toHaveLength(0);
    });
});
