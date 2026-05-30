import { describe, expect, it } from 'vitest'
import { formatStampHash } from '../frontend/src/utils/stampFormat'

describe('stamp hash formatter short value', () => {
  it('leaves short hashes unchanged', () => {
    expect(formatStampHash('abc123')).toBe('abc123')
  })
})
