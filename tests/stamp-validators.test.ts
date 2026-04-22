import { describe, expect, it } from 'vitest'
import { isValidStampHash, isValidTxId } from '../frontend/src/utils/stampValidators'

describe('stamp validators', () => {
  it('requires hexadecimal content for stamp hashes', () => {
    expect(isValidStampHash('a'.repeat(64))).toBe(true)
    expect(isValidStampHash('z'.repeat(64))).toBe(false)
  })

  it('accepts tx ids with or without 0x prefix', () => {
    expect(isValidTxId('b'.repeat(64))).toBe(true)
    expect(isValidTxId(`0x${'b'.repeat(64)}`)).toBe(true)
  })
})
