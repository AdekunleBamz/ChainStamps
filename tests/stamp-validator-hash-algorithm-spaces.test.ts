import { describe, expect, it } from 'vitest'
import { isValidHashAlgorithm } from '../frontend/src/utils/stampValidators'

describe('hash algorithm validator whitespace', () => {
  it('accepts supported algorithms after trimming', () => {
    expect(isValidHashAlgorithm(' sha256 ')).toBe(true)
  })
})
