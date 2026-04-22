import { describe, expect, it } from 'vitest'
import {
  isValidMemoText,
  isValidStampHash,
  isValidTxId,
  isValidWalletAddress,
} from '../frontend/src/utils/stampValidators'

describe('stamp validators', () => {
  it('requires hexadecimal content for stamp hashes', () => {
    expect(isValidStampHash('a'.repeat(64))).toBe(true)
    expect(isValidStampHash('z'.repeat(64))).toBe(false)
  })

  it('accepts tx ids with or without 0x prefix', () => {
    expect(isValidTxId('b'.repeat(64))).toBe(true)
    expect(isValidTxId(`0x${'b'.repeat(64)}`)).toBe(true)
  })

  it('accepts trimmed mainnet and testnet wallet addresses', () => {
    expect(isValidWalletAddress(' SP5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT ')).toBe(true)
    expect(isValidWalletAddress(' ST5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT ')).toBe(true)
  })

  it('validates memo length after trimming whitespace', () => {
    expect(isValidMemoText(`   ${'x'.repeat(64)}   `)).toBe(true)
    expect(isValidMemoText(` ${'x'.repeat(65)} `)).toBe(false)
  })
})
