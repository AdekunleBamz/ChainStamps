import { describe, expect, it } from 'vitest'
import { formatStampVersion } from '../frontend/src/utils/stampFormat'

describe('stamp version formatter numeric input', () => {
  it('prefixes numeric versions', () => {
    expect(formatStampVersion(2)).toBe('v2')
  })
})
