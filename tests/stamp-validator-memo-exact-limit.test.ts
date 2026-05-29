import { describe, expect, it } from 'vitest'
import { MAX_MEMO_LENGTH } from '../frontend/src/utils/stampConstants'
import { isValidMemoText } from '../frontend/src/utils/stampValidators'

describe('memo validator exact limit', () => {
  it('accepts memo text at the configured limit', () => {
    expect(isValidMemoText('m'.repeat(MAX_MEMO_LENGTH))).toBe(true)
  })
})
