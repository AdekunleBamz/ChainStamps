import { describe, expect, it } from 'vitest'
import { isValidConfirmations } from '../frontend/src/utils/stampValidators'

describe('confirmations validator numeric string', () => {
  it('accepts whole-number strings', () => {
    expect(isValidConfirmations('3')).toBe(true)
  })
})
