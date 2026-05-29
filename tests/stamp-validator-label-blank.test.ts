import { describe, expect, it } from 'vitest'
import { isValidStampLabel } from '../frontend/src/utils/stampValidators'

describe('stamp label validator blank input', () => {
  it('rejects blank labels', () => {
    expect(isValidStampLabel('   ')).toBe(false)
  })
})
