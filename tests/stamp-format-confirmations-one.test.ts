import { describe, expect, it } from 'vitest'
import { formatConfirmations } from '../frontend/src/utils/stampFormat'

describe('confirmations formatter singular input', () => {
  it('uses a singular confirmation label', () => {
    expect(formatConfirmations(1)).toBe('1 confirmation')
  })
})
