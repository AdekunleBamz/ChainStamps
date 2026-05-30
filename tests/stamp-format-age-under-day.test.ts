import { describe, expect, it } from 'vitest'
import { formatStampAge } from '../frontend/src/utils/stampFormat'

describe('stamp age formatter under day boundary', () => {
  it('formats fewer than 144 blocks as today', () => {
    expect(formatStampAge(143)).toBe('today')
  })
})
