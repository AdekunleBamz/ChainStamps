import { describe, expect, it } from 'vitest'
import { isValidProofLength } from '../frontend/src/utils/stampValidators'

describe('proof length validator zero input', () => {
  it('rejects zero proof length', () => {
    expect(isValidProofLength(0)).toBe(false)
  })
})
