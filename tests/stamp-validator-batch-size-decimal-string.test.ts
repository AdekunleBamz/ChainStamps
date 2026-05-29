import { describe, expect, it } from 'vitest'
import { isValidBatchSize } from '../frontend/src/utils/stampValidators'

describe('batch size validator decimal string', () => {
  it('rejects fractional strings', () => {
    expect(isValidBatchSize('2.5')).toBe(false)
  })
})
