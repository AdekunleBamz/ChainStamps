import { describe, expect, it } from 'vitest'
import { isValidExpiryBlocks } from '../frontend/src/utils/stampValidators'

describe('expiry blocks validator negative input', () => {
  it('rejects negative expiry blocks', () => {
    expect(isValidExpiryBlocks(-1)).toBe(false)
  })
})
