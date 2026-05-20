import { describe, expect, it } from 'vitest'
import {
  isValidBatchId,
  isValidBatchSize,
  isValidBlockHeight,
  isValidConfirmations,
  isValidDataLength,
  isValidFileSize,
  isValidMemoText,
  isValidMicroStx,
  isValidHashAlgorithm,
  isValidNetworkName,
  isValidProofLength,
  isValidStampCount,
  isValidStampFee,
  isValidStampHash,
  isValidStampId,
  isValidStampStatus,
  isValidStampType,
  isValidStampVersion,
  isValidTxId,
  isValidWalletAddress,
} from '../frontend/src/utils/stampValidators'

describe('stamp validators', () => {
  it('accepts non-empty stamp ids', () => {
    expect(isValidStampId('stamp-1')).toBe(true)
  })

  it('rejects empty stamp ids', () => {
    expect(isValidStampId('')).toBe(false)
  })

  it('requires hexadecimal content for stamp hashes', () => {
    expect(isValidStampHash('a'.repeat(64))).toBe(true)
    expect(isValidStampHash('z'.repeat(64))).toBe(false)
  })

  it('accepts tx ids with or without 0x prefix', () => {
    expect(isValidTxId('b'.repeat(64))).toBe(true)
    expect(isValidTxId(`0x${'b'.repeat(64)}`)).toBe(true)
  })

  it('accepts non-negative block heights', () => {
    expect(isValidBlockHeight(0)).toBe(true)
  })

  it('rejects fractional block heights', () => {
    expect(isValidBlockHeight(1.5)).toBe(false)
  })

  it('accepts non-negative stamp fees', () => {
    expect(isValidStampFee(0)).toBe(true)
  })

  it('accepts positive file sizes', () => {
    expect(isValidFileSize(1)).toBe(true)
  })

  it('accepts batch size boundaries', () => {
    expect(isValidBatchSize(1)).toBe(true)
    expect(isValidBatchSize(10)).toBe(true)
  })

  it('rejects oversized batch sizes', () => {
    expect(isValidBatchSize(11)).toBe(false)
  })

  it('accepts trimmed mainnet and testnet wallet addresses', () => {
    expect(isValidWalletAddress(' SP5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT ')).toBe(true)
    expect(isValidWalletAddress(' ST5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT ')).toBe(true)
  })

  it('validates memo length after trimming whitespace', () => {
    expect(isValidMemoText(`   ${'x'.repeat(64)}   `)).toBe(true)
    expect(isValidMemoText(` ${'x'.repeat(65)} `)).toBe(false)
  })

  it('accepts hash algorithm names regardless of case', () => {
    expect(isValidHashAlgorithm('SHA256')).toBe(true)
    expect(isValidHashAlgorithm(' sha512 ')).toBe(true)
  })

  it('rejects unsupported hash algorithms', () => {
    expect(isValidHashAlgorithm('md5')).toBe(false)
  })

  it('accepts supported stamp statuses', () => {
    expect(isValidStampStatus('pending')).toBe(true)
    expect(isValidStampStatus('confirmed')).toBe(true)
    expect(isValidStampStatus('failed')).toBe(true)
  })

  it('rejects unsupported stamp statuses', () => {
    expect(isValidStampStatus('queued')).toBe(false)
  })

  it('accepts non-empty stamp types', () => {
    expect(isValidStampType('hash')).toBe(true)
  })

  it('accepts supported network names', () => {
    expect(isValidNetworkName('mainnet')).toBe(true)
    expect(isValidNetworkName('testnet')).toBe(true)
  })

  it('rejects unsupported network names', () => {
    expect(isValidNetworkName('devnet')).toBe(false)
  })

  it('accepts non-negative confirmation counts', () => {
    expect(isValidConfirmations(0)).toBe(true)
  })

  it('accepts semantic stamp versions', () => {
    expect(isValidStampVersion('1.0.0')).toBe(true)
  })

  it('accepts positive proof lengths', () => {
    expect(isValidProofLength(1)).toBe(true)
  })

  it('accepts non-negative stamp counts', () => {
    expect(isValidStampCount(0)).toBe(true)
  })

  it('accepts non-negative microSTX values', () => {
    expect(isValidMicroStx(0)).toBe(true)
  })

  it('accepts data length at the contract limit', () => {
    expect(isValidDataLength(256)).toBe(true)
  })

  it('rejects non-string stamp ids', () => {
    expect(isValidStampId(12)).toBe(false)
  })

  it('accepts trimmed uppercase stamp hashes', () => {
    expect(isValidStampHash(` ${'A'.repeat(64)} `)).toBe(true)
  })

  it('rejects short stamp hashes', () => {
    expect(isValidStampHash('a'.repeat(63))).toBe(false)
  })

  it('rejects non-string stamp hashes', () => {
    expect(isValidStampHash(123)).toBe(false)
  })

  it('rejects short transaction ids', () => {
    expect(isValidTxId('b'.repeat(63))).toBe(false)
  })

  it('rejects non-hex transaction ids', () => {
    expect(isValidTxId('z'.repeat(64))).toBe(false)
  })

  it('accepts trimmed prefixed transaction ids', () => {
    expect(isValidTxId(` 0x${'c'.repeat(64)} `)).toBe(true)
  })

  it('accepts numeric string block heights', () => {
    expect(isValidBlockHeight('123')).toBe(true)
  })

  it('rejects negative block heights', () => {
    expect(isValidBlockHeight(-1)).toBe(false)
  })

  it('rejects decimal string block heights', () => {
    expect(isValidBlockHeight('1.5')).toBe(false)
  })

  it('accepts numeric string stamp fees', () => {
    expect(isValidStampFee('1000')).toBe(true)
  })

  it('rejects negative stamp fees', () => {
    expect(isValidStampFee(-1)).toBe(false)
  })

  it('rejects nonnumeric stamp fees', () => {
    expect(isValidStampFee('free')).toBe(false)
  })

  it('rejects non-string wallet addresses', () => {
    expect(isValidWalletAddress(12)).toBe(false)
  })

  it('rejects short wallet addresses', () => {
    expect(isValidWalletAddress('SP123')).toBe(false)
  })

  it('accepts lowercase wallet address prefixes after normalization', () => {
    expect(isValidWalletAddress('sp5k2rhmsbh4pap4pgx77mcvnk1zeed07cwx9tjt')).toBe(true)
  })

  it('rejects non-string memo text', () => {
    expect(isValidMemoText(64)).toBe(false)
  })

  it('accepts empty memo text', () => {
    expect(isValidMemoText('')).toBe(true)
  })

  it('rejects zero file sizes', () => {
    expect(isValidFileSize(0)).toBe(false)
  })

  it('rejects negative file sizes', () => {
    expect(isValidFileSize(-1)).toBe(false)
  })

  it('accepts numeric string file sizes', () => {
    expect(isValidFileSize('1024')).toBe(true)
  })

  it('rejects zero batch sizes', () => {
    expect(isValidBatchSize(0)).toBe(false)
  })

  it('rejects fractional batch sizes', () => {
    expect(isValidBatchSize(1.5)).toBe(false)
  })

  it('accepts numeric string batch sizes', () => {
    expect(isValidBatchSize('2')).toBe(true)
  })

  it('rejects non-string hash algorithms', () => {
    expect(isValidHashAlgorithm(256)).toBe(false)
  })
})
