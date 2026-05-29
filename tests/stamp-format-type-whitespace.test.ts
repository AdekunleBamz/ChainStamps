import { describe, expect, it } from 'vitest'
import { formatStampType } from '../frontend/src/utils/stampFormat'

describe('stamp type formatter whitespace input', () => {
  it('returns an empty label for whitespace', () => {
    expect(formatStampType('   ')).toBe('')
  })
})
