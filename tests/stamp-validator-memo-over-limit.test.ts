import { describe, expect, it } from 'vitest'
import { MAX_MEMO_LENGTH } from '../frontend/src/utils/stampConstants'
import { isValidMemoText } from '../frontend/src/utils/stampValidators'

describe('memo validator over limit', () => {
  it('rejects memo text above the configured limit', () => {
    expect(isValidMemoText('m'.repeat(MAX_MEMO_LENGTH + 1))).toBe(false)
  })
})
