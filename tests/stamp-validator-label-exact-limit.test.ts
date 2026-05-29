import { describe, expect, it } from 'vitest'
import { isValidStampLabel } from '../frontend/src/utils/stampValidators'

describe('stamp label validator exact limit', () => {
  it('accepts labels at eighty characters', () => {
    expect(isValidStampLabel('l'.repeat(80))).toBe(true)
  })
})
