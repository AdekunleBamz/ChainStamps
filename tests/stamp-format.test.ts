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

  it('formats block heights with labels', () => {
    expect(formatBlockHeight(123)).toBe('Block #123')
  })

  it('formats stamp statuses with title casing', () => {
    expect(formatStampStatus('pending')).toBe('Pending')
  })

  it('formats transaction ids for compact display', () => {
    expect(formatTxId('abcdef123456')).toBe('abcdef12...')
  })

  it('formats microSTX stamp values', () => {
    expect(formatMicroStx(2_500_000)).toBe('2.500000 STX')
  })

  it('formats stamp count labels', () => {
    expect(formatStampCount(3)).toBe('3 stamps')
  })

  it('formats batch ids with a prefix', () => {
    expect(formatBatchId('alpha')).toBe('BATCH-alpha')
  })

  it('formats byte counts as kilobytes', () => {
    expect(formatFileSize(2048)).toBe('2.00 KB')
  })

  it('formats proof length labels', () => {
    expect(formatProofLength(64)).toBe('64 chars')
  })

  it('returns short hashes without truncation', () => {
    expect(formatStampHash('abc123')).toBe('abc123')
  })

  it('truncates long hashes with visible ends', () => {
    expect(formatStampHash('a'.repeat(64))).toBe('aaaaaaaa...aaaaaaaa')
  })

  it('returns short wallet labels without truncation', () => {
    expect(formatWalletAddress('SP1234')).toBe('SP1234')
  })

  it('normalizes whitespace before memo truncation', () => {
    expect(formatMemoText('   hello world   ')).toBe('hello world')
  })

  it('truncates long memo text for compact display', () => {
    expect(formatMemoText('x'.repeat(40))).toBe(`${'x'.repeat(32)}...`)
  })

  it('returns Unknown when network value is missing', () => {
    expect(formatNetworkName(undefined)).toBe('Unknown')
  })

  it('formats trimmed network names with title casing', () => {
    expect(formatNetworkName(' testnet ')).toBe('Testnet')
  })

  it('formats confirmation count labels', () => {
    expect(formatConfirmations(3)).toBe('3 confirmations')
  })

  it('formats stamp types in uppercase', () => {
    expect(formatStampType('hash')).toBe('HASH')
  })

  it('formats remaining block labels', () => {
    expect(formatBlocksRemaining(12)).toBe('12 blocks left')
  })

  it('formats hash algorithm labels in uppercase', () => {
    expect(formatHashAlgorithm('sha256')).toBe('SHA256')
  })

  it('formats stamp versions with a prefix', () => {
    expect(formatStampVersion('1.0.0')).toBe('v1.0.0')
  })
})
