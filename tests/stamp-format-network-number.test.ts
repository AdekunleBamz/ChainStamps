import { describe, expect, it } from 'vitest'
import { formatNetworkName } from '../frontend/src/utils/stampFormat'

describe('network formatter type guard', () => {
  it('returns Unknown for numeric input', () => {
    expect(formatNetworkName(1)).toBe('Unknown')
  })
})
