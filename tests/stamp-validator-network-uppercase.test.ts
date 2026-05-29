import { describe, expect, it } from 'vitest'
import { isValidNetworkName } from '../frontend/src/utils/stampValidators'

describe('network validator uppercase input', () => {
  it('rejects uppercase network labels', () => {
    expect(isValidNetworkName('MAINNET')).toBe(false)
  })
})
