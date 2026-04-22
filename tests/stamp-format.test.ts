import { describe, expect, it } from 'vitest'
import {
  formatBatchId,
  formatBlockHeight,
  formatBlocksRemaining,
  formatConfirmations,
  formatFileSize,
  formatHashAlgorithm,
  formatMemoText,
  formatMicroStx,
  formatNetworkName,
  formatProofLength,
  formatStampCount,
  formatStampFee,
  formatStampHash,
  formatStampId,
  formatStampStatus,
  formatStampType,
  formatStampVersion,
  formatTxId,
  formatWalletAddress,
} from '../frontend/src/utils/stampFormat'

describe('stamp format', () => {
  it('formats stamp fees from microSTX', () => {
    expect(formatStampFee(1_500_000)).toBe('1.500000 STX')
  })

  it('formats stamp ids with a prefix', () => {
    expect(formatStampId(12)).toBe('STAMP-12')
  })

  it('returns short hashes without truncation', () => {
    expect(formatStampHash('abc123')).toBe('abc123')
  })

  it('returns short wallet labels without truncation', () => {
    expect(formatWalletAddress('SP1234')).toBe('SP1234')
  })

  it('normalizes whitespace before memo truncation', () => {
    expect(formatMemoText('   hello world   ')).toBe('hello world')
  })

  it('returns Unknown when network value is missing', () => {
    expect(formatNetworkName(undefined)).toBe('Unknown')
  })
})
