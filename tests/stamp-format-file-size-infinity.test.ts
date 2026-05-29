import { describe, expect, it } from 'vitest'
import { formatFileSize } from '../frontend/src/utils/stampFormat'

describe('file size formatter infinite input', () => {
  it('falls back to zero bytes', () => {
    expect(formatFileSize(Infinity)).toBe('0 B')
  })
})
