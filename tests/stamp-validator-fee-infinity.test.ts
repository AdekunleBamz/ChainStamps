import { describe, expect, it } from 'vitest'
import { isValidStampFee } from '../frontend/src/utils/stampValidators'

describe('stamp fee validator infinity', () => {
  it('accepts Infinity under current numeric rules', () => {
    expect(isValidStampFee(Infinity)).toBe(true)
  })
})
