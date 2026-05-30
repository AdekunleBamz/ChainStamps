import { describe, expect, it } from 'vitest'
import { formatWalletAddress } from '../frontend/src/utils/stampFormat'

describe('wallet formatter long address', () => {
  it('preserves the beginning and end of long wallet addresses', () => {
    expect(formatWalletAddress('SP123456789ABCDEFG')).toBe('SP1234...DEFG')
  })
})
