import { describe, expect, it } from 'vitest'
import { formatHashAlgorithm } from '../frontend/src/utils/stampFormat'

describe('hash algorithm formatter type guard', () => {
  it('returns an empty label for numeric input', () => {
    expect(formatHashAlgorithm(256)).toBe('')
  })
})
