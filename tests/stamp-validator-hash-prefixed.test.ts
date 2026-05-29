import { describe, expect, it } from 'vitest'
import { isValidStampHash } from '../frontend/src/utils/stampValidators'

describe('stamp hash validator prefixed input', () => {
  it('rejects 0x-prefixed stamp hashes', () => {
    expect(isValidStampHash(`0x${'a'.repeat(64)}`)).toBe(false)
  })
})
