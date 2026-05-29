import { describe, expect, it } from 'vitest'
import { isValidStampVersion } from '../frontend/src/utils/stampValidators'

describe('stamp version validator prefix', () => {
  it('rejects v-prefixed versions', () => {
    expect(isValidStampVersion('v1.0.0')).toBe(false)
  })
})
