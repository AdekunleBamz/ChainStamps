import { describe, expect, it } from 'vitest'
import { isValidStampFee } from '../frontend/src/utils/stampValidators'

describe('stamp fee validator empty string', () => {
  it('treats an empty string as zero', () => {
    expect(isValidStampFee('')).toBe(true)
  })
})
