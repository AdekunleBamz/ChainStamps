import { describe, expect, it } from 'vitest'
import { isValidWalletAddress } from '../frontend/src/utils/stampValidators'

describe('wallet validator lowercase testnet', () => {
  it('accepts lowercase ST prefixes after normalization', () => {
    expect(isValidWalletAddress('st5k2rhmsbh4pap4pgx77mcvnk1zeed07cwx9tjt')).toBe(true)
  })
})
