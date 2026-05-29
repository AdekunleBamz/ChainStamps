import { describe, expect, it } from 'vitest'
import { isValidStampType } from '../frontend/src/utils/stampValidators'

describe('stamp type validator type guard', () => {
  it('rejects numeric stamp types', () => {
    expect(isValidStampType(1)).toBe(false)
  })
})
