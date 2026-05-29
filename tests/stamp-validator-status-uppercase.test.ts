import { describe, expect, it } from 'vitest'
import { isValidStampStatus } from '../frontend/src/utils/stampValidators'

describe('stamp status validator uppercase input', () => {
  it('rejects uppercase status values', () => {
    expect(isValidStampStatus('PENDING')).toBe(false)
  })
})
