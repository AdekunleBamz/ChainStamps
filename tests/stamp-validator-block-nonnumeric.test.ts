import { describe, expect, it } from 'vitest'
import { isValidBlockHeight } from '../frontend/src/utils/stampValidators'

describe('block height validator nonnumeric input', () => {
  it('rejects nonnumeric strings', () => {
    expect(isValidBlockHeight('latest')).toBe(false)
  })
})
