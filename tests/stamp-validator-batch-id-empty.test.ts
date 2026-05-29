import { describe, expect, it } from 'vitest'
import { isValidBatchId } from '../frontend/src/utils/stampValidators'

describe('batch id validator empty input', () => {
  it('rejects empty batch ids', () => {
    expect(isValidBatchId('')).toBe(false)
  })
})
