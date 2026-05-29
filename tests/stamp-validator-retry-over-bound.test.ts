import { describe, expect, it } from 'vitest'
import { isValidRetryCount } from '../frontend/src/utils/stampValidators'

describe('retry count validator over bound', () => {
  it('rejects values above the maximum retry count', () => {
    expect(isValidRetryCount(4)).toBe(false)
  })
})
