import { describe, expect, it } from 'vitest'
import { formatProofLength } from '../frontend/src/utils/stampFormat'

describe('proof length formatter string input', () => {
  it('formats string lengths', () => {
    expect(formatProofLength('64')).toBe('64 chars')
  })
})
