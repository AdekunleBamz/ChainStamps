import { describe, expect, it } from 'vitest'
import { formatStampFee } from '../frontend/src/utils/stampFormat'

describe('stamp fee formatter one stx', () => {
  it('formats one million microSTX as one STX', () => {
    expect(formatStampFee(1_000_000)).toBe('1.000000 STX')
  })
})
