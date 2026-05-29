import { describe, expect, it } from 'vitest'
import { isValidConfirmations } from '../frontend/src/utils/stampValidators'

describe('confirmations validator decimal input', () => {
  it('rejects fractional confirmations', () => {
    expect(isValidConfirmations(1.5)).toBe(false)
  })
})
