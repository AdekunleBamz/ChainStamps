import { describe, expect, it } from 'vitest'
import { isValidBatchSize } from '../frontend/src/utils/stampValidators'

describe('batch size validator numeric string', () => {
  it('accepts whole-number strings', () => {
    expect(isValidBatchSize('2')).toBe(true)
  })
})
