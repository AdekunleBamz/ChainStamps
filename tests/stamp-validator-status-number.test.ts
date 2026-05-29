import { describe, expect, it } from 'vitest'
import { isValidStampStatus } from '../frontend/src/utils/stampValidators'

describe('stamp status validator type guard', () => {
  it('rejects numeric status values', () => {
    expect(isValidStampStatus(1)).toBe(false)
  })
})
