import { afterEach, describe, expect, it, vi } from 'vitest'

import { CONTRACTS } from '../frontend/src/config/contracts'
import {
  chainstampClient,
  clearFeeCache,
  fetchOnChainFees,
} from '../frontend/src/sdk/chainstamp'

describe('chainstamp sdk fee fetcher', () => {
  afterEach(() => {
    clearFeeCache()
    vi.restoreAllMocks()
  })

  it('falls back to configured hash fee when fee call rejects', async () => {
    vi.spyOn(chainstampClient, 'getHashFee').mockRejectedValueOnce(new Error('network'))
    vi.spyOn(chainstampClient, 'getStampFee').mockResolvedValueOnce(50_000n)
    vi.spyOn(chainstampClient, 'getTagFee').mockResolvedValueOnce(40_000n)

    const fees = await fetchOnChainFees(true)

    expect(fees.hash).toBe(CONTRACTS.hashRegistry.fee)
    expect(fees.stamp).toBe(0.05)
    expect(fees.tag).toBe(0.04)
  })
})
