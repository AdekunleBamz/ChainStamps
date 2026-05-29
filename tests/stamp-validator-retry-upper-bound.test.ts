import { describe, expect, it } from 'vitest'
import { isValidRetryCount } from '../frontend/src/utils/stampValidators'

describe('retry count validator upper bound', () => {
  it('accepts the maximum retry count', () => {
    expect(isValidRetryCount(3)).toBe(true)
  })
})
