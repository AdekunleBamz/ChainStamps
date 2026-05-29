import { describe, expect, it } from 'vitest'
import { isValidHashAlgorithm } from '../frontend/src/utils/stampValidators'

describe('hash algorithm validator type guard', () => {
  it('rejects numeric values', () => {
    expect(isValidHashAlgorithm(256)).toBe(false)
  })
})
