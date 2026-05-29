import { describe, expect, it } from 'vitest'
import { isValidTxId } from '../frontend/src/utils/stampValidators'

describe('tx id validator type guard', () => {
  it('rejects non-string values', () => {
    expect(isValidTxId(123)).toBe(false)
  })
})
