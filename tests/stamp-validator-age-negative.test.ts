import { describe, expect, it } from 'vitest'
import { isValidStampAge } from '../frontend/src/utils/stampValidators'

describe('stamp age validator negative input', () => {
  it('rejects negative stamp age values', () => {
    expect(isValidStampAge(-1)).toBe(false)
  })
})
