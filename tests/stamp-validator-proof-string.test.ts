import { describe, expect, it } from 'vitest'
import { isValidProofLength } from '../frontend/src/utils/stampValidators'

describe('proof length validator numeric string', () => {
  it('accepts whole-number strings', () => {
    expect(isValidProofLength('64')).toBe(true)
  })
})
