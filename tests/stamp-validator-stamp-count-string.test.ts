import { describe, expect, it } from 'vitest'
import { isValidStampCount } from '../frontend/src/utils/stampValidators'

describe('stamp count validator numeric string', () => {
  it('accepts whole-number strings', () => {
    expect(isValidStampCount('4')).toBe(true)
  })
})
