import { describe, expect, it } from 'vitest'
import { formatMemoText } from '../frontend/src/utils/stampFormat'

describe('memo formatter truncation', () => {
  it('truncates long memo text for compact displays', () => {
    expect(formatMemoText('abcdefghijklmnopqrstuvwxyz1234567890')).toBe('abcdefghijklmnopqrstuvwxyz123456...')
  })
})
