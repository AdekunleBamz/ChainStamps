import { describe, expect, it } from 'vitest'
import { isValidStampHash } from '../frontend/src/utils/stampValidators'

describe('stamp validators', () => {
  it('requires hexadecimal content for stamp hashes', () => {
    expect(isValidStampHash('a'.repeat(64))).toBe(true)
    expect(isValidStampHash('z'.repeat(64))).toBe(false)
  })
})
