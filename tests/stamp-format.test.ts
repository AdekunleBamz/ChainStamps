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
  formatStampAge,
  formatStampCount,
  formatStampDate,
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

  it('truncates long wallet labels with visible ends', () => {
    expect(formatWalletAddress('SP5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT')).toBe('SP5K2R...9TJT')
  })

  it('normalizes whitespace before memo truncation', () => {
    expect(formatMemoText('   hello world   ')).toBe('hello world')
  })

  it('truncates long memo text for compact display', () => {
    expect(formatMemoText('x'.repeat(40))).toBe(`${'x'.repeat(32)}...`)
  })

  it('returns empty memo labels for non-string input', () => {
    expect(formatMemoText(12)).toBe('')
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

  it('returns an empty stamp date when timestamp is missing', () => {
    expect(formatStampDate(null)).toBe('')
  })

  it('formats new stamp ages as today', () => {
    expect(formatStampAge(0)).toBe('today')
  })

  it('keeps sub-day stamp ages as today', () => {
    expect(formatStampAge(143)).toBe('today')
  })

  it('formats one-day stamp ages with a singular label', () => {
    expect(formatStampAge(144)).toBe('1 day ago')
  })

  it('formats multi-day stamp ages with a plural label', () => {
    expect(formatStampAge(288)).toBe('2 days ago')
  })

  it('trims stamp hashes before display formatting', () => {
    expect(formatStampHash('  abc123  ')).toBe('abc123')
  })

  it('returns an empty stamp hash label for missing input', () => {
    expect(formatStampHash(undefined)).toBe('')
  })

  it('returns an empty stamp hash label for non-string input', () => {
    expect(formatStampHash(123)).toBe('')
  })

  it('keeps sixteen-character stamp hashes intact', () => {
    expect(formatStampHash('1234567890abcdef')).toBe('1234567890abcdef')
  })

  it('preserves both ends when truncating stamp hashes', () => {
    expect(formatStampHash('12345678abcdefghijklmnop87654321')).toBe('12345678...87654321')
  })

  it('formats zero stamp fees with fixed precision', () => {
    expect(formatStampFee(0)).toBe('0.000000 STX')
  })

  it('formats fractional STX stamp fees with fixed precision', () => {
    expect(formatStampFee(500_000)).toBe('0.500000 STX')
  })

  it('formats string stamp ids with the same prefix', () => {
    expect(formatStampId('alpha')).toBe('STAMP-alpha')
  })

  it('trims stamp statuses before title casing', () => {
    expect(formatStampStatus(' confirmed ')).toBe('Confirmed')
  })

  it('normalizes uppercase stamp statuses before display', () => {
    expect(formatStampStatus('FAILED')).toBe('Failed')
  })

  it('returns Unknown for blank stamp statuses', () => {
    expect(formatStampStatus('   ')).toBe('Unknown')
  })

  it('returns Unknown for non-string stamp statuses', () => {
    expect(formatStampStatus(12)).toBe('Unknown')
  })

  it('trims transaction ids before compact formatting', () => {
    expect(formatTxId('  abcdef123456  ')).toBe('abcdef12...')
  })

  it('returns an empty transaction id label for missing input', () => {
    expect(formatTxId(undefined)).toBe('')
  })

  it('keeps eight-character transaction ids intact', () => {
    expect(formatTxId('12345678')).toBe('12345678')
  })

  it('formats zero microSTX values with fixed precision', () => {
    expect(formatMicroStx(0)).toBe('0.000000 STX')
  })

  it('formats single microSTX values with six decimals', () => {
    expect(formatMicroStx(1)).toBe('0.000001 STX')
  })

  it('formats singular stamp count labels', () => {
    expect(formatStampCount(1)).toBe('1 stamp')
  })

  it('formats zero stamp count labels as plural', () => {
    expect(formatStampCount(0)).toBe('0 stamps')
  })

  it('formats numeric batch ids with a prefix', () => {
    expect(formatBatchId(42)).toBe('BATCH-42')
  })

  it('formats zero byte file sizes without decimals', () => {
    expect(formatFileSize(0)).toBe('0 B')
  })

  it('formats sub-kilobyte file sizes as bytes', () => {
    expect(formatFileSize(512)).toBe('512 B')
  })

  it('formats negative file sizes with the zero fallback', () => {
    expect(formatFileSize(-1)).toBe('0 B')
  })

  it('formats infinite file sizes with the zero fallback', () => {
    expect(formatFileSize(Number.POSITIVE_INFINITY)).toBe('0 B')
  })

  it('formats string proof lengths with labels', () => {
    expect(formatProofLength('64')).toBe('64 chars')
  })

  it('trims wallet addresses before compact formatting', () => {
    expect(formatWalletAddress('  SP1234  ')).toBe('SP1234')
  })

  it('returns an empty wallet address label for missing input', () => {
    expect(formatWalletAddress(undefined)).toBe('')
  })

  it('keeps ten-character wallet addresses intact', () => {
    expect(formatWalletAddress('SP12345678')).toBe('SP12345678')
  })
})
