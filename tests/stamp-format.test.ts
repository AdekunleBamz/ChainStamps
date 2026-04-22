import { describe, expect, it } from 'vitest'
import { formatStampHash, formatWalletAddress } from '../frontend/src/utils/stampFormat'

describe('stamp format', () => {
  it('returns short hashes without truncation', () => {
    expect(formatStampHash('abc123')).toBe('abc123')
  })

  it('returns short wallet labels without truncation', () => {
    expect(formatWalletAddress('SP1234')).toBe('SP1234')
  })
})
