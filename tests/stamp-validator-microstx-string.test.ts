import { describe, expect, it } from 'vitest'
import { isValidMicroStx } from '../frontend/src/utils/stampValidators'

describe('microSTX validator numeric string', () => {
  it('accepts numeric strings', () => {
    expect(isValidMicroStx('100')).toBe(true)
  })
})
