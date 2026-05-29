import { describe, expect, it } from 'vitest'
import { formatStampStatus } from '../frontend/src/utils/stampFormat'

describe('status formatter mixed case', () => {
  it('normalizes mixed case values', () => {
    expect(formatStampStatus('pEnDiNg')).toBe('Pending')
  })
})
