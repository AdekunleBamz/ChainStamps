import { wcCallContract } from '../utils/walletconnect';
import { CONTRACT_ADDRESS, CONTRACTS, STACKS_API_URL } from '../config/contracts';
import {
    callReadOnlyFunction,
    bufferCV,
    stringUtf8CV,
    uintCV,
    standardPrincipalCV,
    cvToValue
} from '@stacks/transactions';
import { StacksMainnet } from '@stacks/network';

const network = new StacksMainnet();

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
     * Verifies if a hash exists on-chain.
     */
    async getHashInfo(hash: string): Promise<any> {
        try {
            const sanitizedHash = hash.replace('0x', '');
            const hashBuffer = Buffer.from(sanitizedHash, 'hex');

            const result = await callReadOnlyFunction({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACTS.hashRegistry.name,
                functionName: 'get-hash-info',
                functionArgs: [bufferCV(hashBuffer)],
                senderAddress: CONTRACT_ADDRESS,
                network,
            });

            return cvToValue(result);
        } catch (error: any) {
            this._logError('getHashInfo', error);
            return null;
        }
    },

    /**
     * Retrieves tag information by key.
     */
    async getTagInfo(key: string, owner: string): Promise<any> {
        try {
            const result = await callReadOnlyFunction({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACTS.tagRegistry.name,
                functionName: 'get-tag-by-ns-key',
                functionArgs: [
                    standardPrincipalCV(owner),
                    stringUtf8CV('default'),
                    stringUtf8CV(key)
                ],
                senderAddress: CONTRACT_ADDRESS,
                network,
            });

            return cvToValue(result);
        } catch (error: any) {
            this._logError('getTagInfo', error);
            return null;
        }
    },

    /**
     * Retrieves stamp information by ID.
     */
    async getStampInfo(id: number): Promise<any> {
        try {
            const result = await callReadOnlyFunction({
                contractAddress: CONTRACT_ADDRESS,
                contractName: CONTRACTS.stampRegistry.name,
                functionName: 'get-stamp',
                functionArgs: [uintCV(BigInt(id))],
                senderAddress: CONTRACT_ADDRESS,
                network,
            });

            return cvToValue(result);
        } catch (error: any) {
            this._logError('getStampInfo', error);
            return null;
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

