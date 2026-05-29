import { describe, expect, it } from 'vitest'
import { isValidStampCount } from '../frontend/src/utils/stampValidators'

describe('stamp count validator negative input', () => {
  it('rejects negative counts', () => {
    expect(isValidStampCount(-1)).toBe(false)
  })
})
