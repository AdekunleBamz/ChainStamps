import { describe, expect, it } from 'vitest'
import { isValidTxId } from '../frontend/src/utils/stampValidators'

describe('tx id validator uppercase prefix', () => {
  it('rejects uppercase 0X prefixes', () => {
    expect(isValidTxId(`0X${'c'.repeat(64)}`)).toBe(false)
  })
})
