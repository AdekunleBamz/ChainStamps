import { describe, expect, it } from 'vitest'
import { formatHashAlgorithm } from '../frontend/src/utils/stampFormat'

describe('hash algorithm formatter whitespace input', () => {
  it('returns an empty label for whitespace', () => {
    expect(formatHashAlgorithm('   ')).toBe('')
  })
})
