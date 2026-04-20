import { describe, expect, it } from 'vitest'
import {
  estimateFee,
  formatStx,
  formatUStx,
  microStxToStx,
  stxToMicroStx,
} from '../frontend/src/utils/fee'

describe('fee utils', () => {
  it('estimates fees from numeric payload sizes', () => {
    expect(estimateFee(100)).toBe(0.006)
    expect(estimateFee('100')).toBe(0.006)
  })

  it('estimates fees from UTF-8 payload strings', () => {
    expect(estimateFee('hello')).toBe(0.0013)
  })

  it('caps estimated fees at the configured maximum', () => {
    expect(estimateFee(500_000)).toBe(10)
  })

  it('falls back to base fee for negative payload sizes', () => {
    expect(estimateFee(-100)).toBe(0.001)
  })

  it('uses the base fee for zero-byte numeric payloads', () => {
    expect(estimateFee(0)).toBe(0.001)
  })

  it('parses and trims numeric string payload lengths', () => {
    expect(estimateFee(' 250 ')).toBe(0.0135)
  })

  it('treats a zero-length numeric string payload as base fee', () => {
    expect(estimateFee('0')).toBe(0.001)
  })

  it('uses UTF-8 byte length for multibyte payload strings', () => {
    expect(estimateFee('🔥')).toBe(0.0012)
  })

  it('estimates UTF-8 byte length correctly for repeated emoji payloads', () => {
    expect(estimateFee('🔥🔥')).toBe(0.0014)
  })

  it('uses UTF-8 byte length for CJK payload strings', () => {
    expect(estimateFee('你好')).toBe(0.0013)
  })

  it('falls back to base fee when payload size is NaN', () => {
    expect(estimateFee(Number.NaN)).toBe(0.001)
  })

  it('converts STX and microSTX values safely', () => {
    expect(stxToMicroStx(1.25)).toBe(1_250_000)
    expect(stxToMicroStx(-1)).toBe(0)
    expect(stxToMicroStx(Number.POSITIVE_INFINITY)).toBe(0)
    expect(microStxToStx(2_500_000)).toBe(2.5)
    expect(microStxToStx(-10)).toBe(0)
    expect(microStxToStx(Number.NaN)).toBe(0)
  })

  it('formats STX values with fixed precision', () => {
    expect(formatStx(1.23456)).toBe('1.2346 STX')
    expect(formatStx(-1)).toBe('0.0000 STX')
  })

  it('rounds tiny fractional STX values to nearest micro-STX', () => {
    expect(stxToMicroStx(0.00000049)).toBe(0)
    expect(stxToMicroStx(0.0000005)).toBe(1)
  })

  it('formats micro-STX values with grouping separators', () => {
    expect(formatUStx(1234567)).toBe('1,234,567 µSTX')
  })

  it('rounds fractional micro-STX values before formatting', () => {
    expect(formatUStx(12.6)).toBe('13 µSTX')
  })

  it('formats invalid micro-STX values as zero', () => {
    expect(formatUStx(Number.NaN)).toBe('0 µSTX')
  })
})
