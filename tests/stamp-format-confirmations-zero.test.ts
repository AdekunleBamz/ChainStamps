import { describe, expect, it } from 'vitest'
import { formatConfirmations } from '../frontend/src/utils/stampFormat'

describe('confirmations formatter zero input', () => {
  it('formats zero as unconfirmed', () => {
    expect(formatConfirmations(0)).toBe('Unconfirmed')
  })
})
