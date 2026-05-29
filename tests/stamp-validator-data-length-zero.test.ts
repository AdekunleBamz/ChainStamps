import { describe, expect, it } from 'vitest'
import { isValidDataLength } from '../frontend/src/utils/stampValidators'

describe('data length validator zero input', () => {
  it('rejects zero data length', () => {
    expect(isValidDataLength(0)).toBe(false)
  })
})
