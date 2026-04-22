import { describe, expect, it } from 'vitest'
import {
  formatMemoText,
  formatNetworkName,
  formatStampHash,
  formatWalletAddress,
} from '../frontend/src/utils/stampFormat'

describe('stamp format', () => {
  it('returns short hashes without truncation', () => {
    expect(formatStampHash('abc123')).toBe('abc123')
  })

  it('returns short wallet labels without truncation', () => {
    expect(formatWalletAddress('SP1234')).toBe('SP1234')
  })

  it('normalizes whitespace before memo truncation', () => {
    expect(formatMemoText('   hello world   ')).toBe('hello world')
  })

  it('returns Unknown when network value is missing', () => {
    expect(formatNetworkName(undefined)).toBe('Unknown')
  })
})
