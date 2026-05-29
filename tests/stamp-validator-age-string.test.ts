import { describe, expect, it } from 'vitest'
import { isValidStampAge } from '../frontend/src/utils/stampValidators'

describe('stamp age validator numeric string', () => {
  it('accepts whole-number strings', () => {
    expect(isValidStampAge('144')).toBe(true)
  })
})
