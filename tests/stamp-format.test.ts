import { describe, expect, it } from 'vitest'
import { formatStampHash } from '../frontend/src/utils/stampFormat'

describe('stamp format', () => {
  it('returns short hashes without truncation', () => {
    expect(formatStampHash('abc123')).toBe('abc123')
  })
})
