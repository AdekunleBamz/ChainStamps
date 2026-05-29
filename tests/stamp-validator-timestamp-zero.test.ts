import { describe, expect, it } from 'vitest'
import { isValidTimestamp } from '../frontend/src/utils/stampValidators'

describe('timestamp validator zero input', () => {
  it('rejects zero timestamps', () => {
    expect(isValidTimestamp(0)).toBe(false)
  })
})
