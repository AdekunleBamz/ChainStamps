import { describe, expect, it } from 'vitest'
import { formatWalletAddress } from '../frontend/src/utils/stampFormat'

describe('wallet formatter type guard', () => {
  it('returns an empty label for non-string input', () => {
    expect(formatWalletAddress(123)).toBe('')
  })
})
