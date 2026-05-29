import { describe, expect, it } from 'vitest'
import { isValidNetworkName } from '../frontend/src/utils/stampValidators'

describe('network validator blank input', () => {
  it('rejects blank network labels', () => {
    expect(isValidNetworkName('')).toBe(false)
  })
})
