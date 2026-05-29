import { describe, expect, it } from 'vitest'
import { isValidStampHash } from '../frontend/src/utils/stampValidators'

describe('stamp hash validator whitespace', () => {
  it('accepts valid hashes after trimming', () => {
    expect(isValidStampHash(`  ${'b'.repeat(64)}  `)).toBe(true)
  })
})
