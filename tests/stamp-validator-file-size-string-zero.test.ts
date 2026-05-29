import { describe, expect, it } from 'vitest'
import { isValidFileSize } from '../frontend/src/utils/stampValidators'

describe('file size validator string zero', () => {
  it('rejects string zero values', () => {
    expect(isValidFileSize('0')).toBe(false)
  })
})
