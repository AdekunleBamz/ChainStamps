import { describe, expect, it } from 'vitest'
import { isValidStampType } from '../frontend/src/utils/stampValidators'

describe('stamp type validator whitespace', () => {
  it('accepts whitespace because it is non-empty', () => {
    expect(isValidStampType('   ')).toBe(true)
  })
})
