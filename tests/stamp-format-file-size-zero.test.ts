import { describe, expect, it } from 'vitest'
import { formatFileSize } from '../frontend/src/utils/stampFormat'

describe('file size formatter zero input', () => {
  it('formats zero bytes', () => {
    expect(formatFileSize(0)).toBe('0 B')
  })
})
