import { describe, expect, it } from 'vitest'
import { isValidNetworkFee } from '../frontend/src/utils/stampValidators'

describe('network fee validator upper bound', () => {
  it('accepts the maximum configured network fee', () => {
    expect(isValidNetworkFee(50_000_000)).toBe(true)
  })
})
