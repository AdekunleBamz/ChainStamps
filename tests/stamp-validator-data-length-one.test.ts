import { describe, expect, it } from 'vitest'
import { isValidDataLength } from '../frontend/src/utils/stampValidators'

describe('data length validator minimum', () => {
  it('accepts a one-byte data length', () => {
    expect(isValidDataLength(1)).toBe(true)
  })
})
