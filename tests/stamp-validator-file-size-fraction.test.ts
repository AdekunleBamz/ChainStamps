import { describe, expect, it } from 'vitest'
import { isValidFileSize } from '../frontend/src/utils/stampValidators'

describe('file size validator fractions', () => {
  it('accepts positive fractional byte values', () => {
    expect(isValidFileSize(0.5)).toBe(true)
  })
})
