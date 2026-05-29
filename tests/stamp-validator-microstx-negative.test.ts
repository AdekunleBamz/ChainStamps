import { describe, expect, it } from 'vitest'
import { isValidMicroStx } from '../frontend/src/utils/stampValidators'

describe('microSTX validator negative input', () => {
  it('rejects negative values', () => {
    expect(isValidMicroStx(-1)).toBe(false)
  })
})
