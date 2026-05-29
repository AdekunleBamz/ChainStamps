import { describe, expect, it } from 'vitest'
import { isValidTimestamp } from '../frontend/src/utils/stampValidators'

describe('timestamp validator numeric string', () => {
  it('accepts positive numeric strings', () => {
    expect(isValidTimestamp('1')).toBe(true)
  })
})
