import { describe, expect, it } from 'vitest'
import { formatTxId } from '../frontend/src/utils/stampFormat'

describe('tx formatter whitespace input', () => {
  it('returns an empty label for whitespace', () => {
    expect(formatTxId('   ')).toBe('')
  })
})
