import { describe, expect, it } from 'vitest'
import { formatStampType } from '../frontend/src/utils/stampFormat'

describe('stamp type formatter type guard', () => {
  it('returns an empty label for numeric input', () => {
    expect(formatStampType(7)).toBe('')
  })
})
