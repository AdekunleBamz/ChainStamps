import { describe, expect, it } from 'vitest'
import { isValidConfirmations } from '../frontend/src/utils/stampValidators'

describe('confirmations validator negative input', () => {
  it('rejects negative confirmations', () => {
    expect(isValidConfirmations(-1)).toBe(false)
  })
})
