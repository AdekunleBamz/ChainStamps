import { describe, expect, it } from 'vitest'
import { formatStampHash } from '../frontend/src/utils/stampFormat'

describe('stamp hash formatter long value', () => {
  it('preserves both ends of long hashes', () => {
    expect(formatStampHash('1234567890abcdefXYZ987654321')).toBe('12345678...87654321')
  })
})
