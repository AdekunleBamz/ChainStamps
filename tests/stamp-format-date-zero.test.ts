import { describe, expect, it } from 'vitest'
import { formatStampDate } from '../frontend/src/utils/stampFormat'

describe('stamp date formatter epoch input', () => {
  it('formats a zero timestamp as a date string', () => {
    expect(formatStampDate(0)).not.toBe('')
  })
})
