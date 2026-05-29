import { describe, expect, it } from 'vitest'
import { formatNetworkName } from '../frontend/src/utils/stampFormat'

describe('network formatter uppercase input', () => {
  it('formats uppercase network names', () => {
    expect(formatNetworkName('MAINNET')).toBe('Mainnet')
  })
})
