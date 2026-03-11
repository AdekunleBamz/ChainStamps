import { wcCallContract } from '../utils/walletconnect';
import { CONTRACT_ADDRESS, CONTRACTS } from '../config/contracts';

/**
 * Normalized result for blockchain transactions.
 */
export interface TransactionResult {
    txid: string;
}

/**
 * Unified API service for ChainStamps blockchain interactions.
 * Centralizes all contract calls, error normalization, and logging.
 */
export const ChainStampsService = {
    /**
     * Stores a document hash on the Stacks blockchain.
     */
    async storeHash(hash: string, description: string = 'Document hash'): Promise<TransactionResult> {
        try {
            const result = await wcCallContract({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACTS.hashRegistry.name,
                functionName: 'store-hash',
                functionArgs: [`0x${hash}`, description],
                stxAmount: CONTRACTS.hashRegistry.fee,
            });
            return { txid: result.txid };
        } catch (error: any) {
            this._logError('storeHash', error);
            throw this._normalizeError(error);
        }
    },

    /**
     * Stamps a message on the Stacks blockchain.
     */
    async stampMessage(message: string): Promise<TransactionResult> {
        try {
            const result = await wcCallContract({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACTS.stampRegistry.name,
                functionName: 'stamp-message',
                functionArgs: [message],
                stxAmount: CONTRACTS.stampRegistry.fee,
            });
            return { txid: result.txid };
        } catch (error: any) {
            this._logError('stampMessage', error);
            throw this._normalizeError(error);
        }
    },

    /**
     * Stores a key-value tag on the Stacks blockchain.
     */
    async storeTag(key: string, value: string): Promise<TransactionResult> {
        try {
            const result = await wcCallContract({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACTS.tagRegistry.name,
                functionName: 'store-tag',
                functionArgs: [key, value],
                stxAmount: CONTRACTS.tagRegistry.fee,
            });
            return { txid: result.txid };
        } catch (error: any) {
            this._logError('storeTag', error);
            throw this._normalizeError(error);
        }
    },

    /**
     * Private helper to log errors with context.
     */
    _logError(method: string, error: any) {
        console.error(`[ChainStampsService] Error in ${method}:`, error);
    },

    /**
     * Private helper to normalize error messages for the UI.
     */
    _normalizeError(error: any): Error {
        const message = error.message || 'An unexpected blockchain error occurred.';
        return new Error(message);
    }
};
