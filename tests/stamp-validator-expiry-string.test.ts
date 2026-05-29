import { describe, expect, it } from 'vitest'
import { isValidExpiryBlocks } from '../frontend/src/utils/stampValidators'

describe('expiry blocks validator numeric string', () => {
  it('accepts whole-number strings', () => {
    expect(isValidExpiryBlocks('144')).toBe(true)
  })
})
