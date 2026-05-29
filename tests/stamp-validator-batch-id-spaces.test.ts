import { describe, expect, it } from 'vitest'
import { isValidBatchId } from '../frontend/src/utils/stampValidators'

describe('batch id validator whitespace input', () => {
  it('accepts whitespace because it is non-empty', () => {
    expect(isValidBatchId('   ')).toBe(true)
  })
})
