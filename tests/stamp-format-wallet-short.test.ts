import { describe, expect, it } from 'vitest'
import { formatWalletAddress } from '../frontend/src/utils/stampFormat'

describe('wallet formatter short address', () => {
  it('leaves short wallet addresses unchanged', () => {
    expect(formatWalletAddress('SP123')).toBe('SP123')
  })
})
