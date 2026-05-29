import { describe, expect, it } from 'vitest'
import { isValidStampVersion } from '../frontend/src/utils/stampValidators'

describe('stamp version validator short version', () => {
  it('rejects incomplete semantic versions', () => {
    expect(isValidStampVersion('1.0')).toBe(false)
  })
})
