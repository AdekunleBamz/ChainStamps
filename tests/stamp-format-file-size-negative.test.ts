import { describe, expect, it } from 'vitest'
import { formatFileSize } from '../frontend/src/utils/stampFormat'

describe('file size formatter negative input', () => {
  it('falls back to zero bytes', () => {
    expect(formatFileSize(-1)).toBe('0 B')
  })
})
