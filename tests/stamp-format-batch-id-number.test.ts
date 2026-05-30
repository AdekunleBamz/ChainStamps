import { describe, expect, it } from 'vitest'
import { formatBatchId } from '../frontend/src/utils/stampFormat'

describe('batch id formatter number input', () => {
  it('prefixes numeric batch ids', () => {
    expect(formatBatchId(12)).toBe('BATCH-12')
  })
})
