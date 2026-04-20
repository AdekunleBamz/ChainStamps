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

  it('reuses cached values across repeated fetches', async () => {
    const hashSpy = vi.spyOn(chainstampClient, 'getHashFee').mockResolvedValue(30_000n)
    const stampSpy = vi.spyOn(chainstampClient, 'getStampFee').mockResolvedValue(50_000n)
    const tagSpy = vi.spyOn(chainstampClient, 'getTagFee').mockResolvedValue(40_000n)

    const first = await fetchOnChainFees()
    const second = await fetchOnChainFees()

    expect(first).toEqual(second)
    expect(hashSpy).toHaveBeenCalledTimes(1)
    expect(stampSpy).toHaveBeenCalledTimes(1)
    expect(tagSpy).toHaveBeenCalledTimes(1)
  })

  it('bypasses cache when force refresh is requested', async () => {
    const hashSpy = vi.spyOn(chainstampClient, 'getHashFee').mockResolvedValue(30_000n)
    const stampSpy = vi.spyOn(chainstampClient, 'getStampFee').mockResolvedValue(50_000n)
    const tagSpy = vi.spyOn(chainstampClient, 'getTagFee').mockResolvedValue(40_000n)

    await fetchOnChainFees()
    await fetchOnChainFees(true)

    expect(hashSpy).toHaveBeenCalledTimes(2)
    expect(stampSpy).toHaveBeenCalledTimes(2)
    expect(tagSpy).toHaveBeenCalledTimes(2)
  })
})
