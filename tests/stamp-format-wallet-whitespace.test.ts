import { describe, expect, it } from 'vitest'
import { formatWalletAddress } from '../frontend/src/utils/stampFormat'

describe('wallet formatter whitespace input', () => {
  it('returns an empty label for whitespace', () => {
    expect(formatWalletAddress('   ')).toBe('')
  })
})
