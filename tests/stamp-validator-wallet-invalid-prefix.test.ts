import { describe, expect, it } from 'vitest'
import { isValidWalletAddress } from '../frontend/src/utils/stampValidators'

describe('wallet validator unsupported prefix', () => {
  it('rejects addresses outside SP and ST prefixes', () => {
    expect(isValidWalletAddress('SM5K2RHMSBH4PAP4PGX77MCVNK1ZEED07CWX9TJT')).toBe(false)
  })
})
