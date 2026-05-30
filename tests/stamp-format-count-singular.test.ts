import { describe, expect, it } from 'vitest'
import { formatStampCount } from '../frontend/src/utils/stampFormat'

describe('stamp count formatter singular', () => {
  it('uses the singular stamp label for one item', () => {
    expect(formatStampCount(1)).toBe('1 stamp')
  })
})
