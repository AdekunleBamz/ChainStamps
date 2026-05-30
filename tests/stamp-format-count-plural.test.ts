import { describe, expect, it } from 'vitest'
import { formatStampCount } from '../frontend/src/utils/stampFormat'

describe('stamp count formatter plural', () => {
  it('uses the plural stamp label for multiple items', () => {
    expect(formatStampCount(2)).toBe('2 stamps')
  })
})
