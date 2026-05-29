import { describe, expect, it } from 'vitest'
import { isValidBlockHeight } from '../frontend/src/utils/stampValidators'

describe('block height validator empty string', () => {
  it('treats an empty string as zero', () => {
    expect(isValidBlockHeight('')).toBe(true)
  })
})
