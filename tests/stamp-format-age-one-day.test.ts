import { describe, expect, it } from 'vitest'
import { formatStampAge } from '../frontend/src/utils/stampFormat'

describe('stamp age formatter one day boundary', () => {
  it('formats 144 blocks as one day ago', () => {
    expect(formatStampAge(144)).toBe('1 day ago')
  })
})
