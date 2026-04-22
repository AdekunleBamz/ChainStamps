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
})
