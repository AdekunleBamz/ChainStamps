import { describe, expect, it } from 'vitest'
import { formatBlocksRemaining } from '../frontend/src/utils/stampFormat'

describe('blocks remaining formatter zero input', () => {
  it('formats zero remaining blocks', () => {
    expect(formatBlocksRemaining(0)).toBe('0 blocks left')
  })
})
