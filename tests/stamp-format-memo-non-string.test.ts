import { describe, expect, it } from 'vitest'
import { formatMemoText } from '../frontend/src/utils/stampFormat'

describe('memo formatter non-string input', () => {
  it('returns an empty memo label for non-string values', () => {
    expect(formatMemoText(42)).toBe('')
  })
})
