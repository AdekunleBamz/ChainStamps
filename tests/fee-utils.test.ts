import { describe, expect, it } from 'vitest'
import {
  BASE_FEE,
  FEE_PER_BYTE,
  MAX_FEE,
  MICROSTX_PER_STX,
  estimateFee,
  estimateFeeDetailed,
  feeHeadroom,
  feesAreEqual,
  feeAsPercent,
  feeToUStxDisplay,
  formatFee,
  formatStx,
  formatUStx,
  isMinimumFee,
  isValidFee,
  microStxToStx,
  stxToMicroStx,
} from '../frontend/src/utils/fee'

describe('fee utils', () => {
  it('exposes the expected STX precision constant', () => {
    expect(MICROSTX_PER_STX).toBe(1_000_000)
  })

  it('exposes the configured base fee', () => {
    expect(BASE_FEE).toBe(0.001)
  })

  it('exposes the configured byte fee', () => {
    expect(FEE_PER_BYTE).toBe(0.00005)
  })

  it('exposes the configured maximum fee', () => {
    expect(MAX_FEE).toBe(10)
  })

  it('estimates fees from numeric payload sizes', () => {
    expect(estimateFee(100)).toBe(0.006)
    expect(estimateFee('100')).toBe(0.006)
  })

  it('rounds tiny payload fees to four decimals', () => {
    expect(estimateFee(1)).toBe(0.0011)
  })

  it('floors fractional numeric payload sizes to whole bytes', () => {
    expect(estimateFee(10.9)).toBe(0.0015)
  })

  it('estimates fees from UTF-8 payload strings', () => {
    expect(estimateFee('hello')).toBe(0.0013)
  })

  it('uses the base fee for an empty payload string', () => {
    expect(estimateFee('')).toBe(0.001)
  })

  it('prices whitespace payloads by byte length when non-numeric', () => {
    expect(estimateFee('   ')).toBe(0.0012)
  })

  it('treats scientific-notation strings as literal payload content', () => {
    expect(estimateFee('1e3')).toBe(0.0012)
  })

  it('caps estimated fees at the configured maximum', () => {
    expect(estimateFee(500_000)).toBe(10)
  })

  it('falls back to base fee for negative payload sizes', () => {
    expect(estimateFee(-100)).toBe(0.001)
  })

  it('falls back to base fee for negative numeric string payloads', () => {
    expect(estimateFee('-100')).toBe(0.001)
  })

  it('uses the base fee for zero-byte numeric payloads', () => {
    expect(estimateFee(0)).toBe(0.001)
  })

  it('parses and trims numeric string payload lengths', () => {
    expect(estimateFee(' 250 ')).toBe(0.0135)
  })

  it('floors decimal numeric string payload lengths to whole bytes', () => {
    expect(estimateFee('10.9')).toBe(0.0015)
  })

  it('treats a zero-length numeric string payload as base fee', () => {
    expect(estimateFee('0')).toBe(0.001)
  })

  it('parses numeric strings with leading zeroes', () => {
    expect(estimateFee('0008')).toBe(0.0014)
  })

  it('parses numeric strings with a leading plus sign', () => {
    expect(estimateFee('+8')).toBe(0.0014)
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

  it('formats invalid STX values as zero', () => {
    expect(formatStx(Number.NaN)).toBe('0.0000 STX')
    expect(formatStx(Number.POSITIVE_INFINITY)).toBe('0.0000 STX')
  })

  it('formats compact fee labels without trailing zeros', () => {
    expect(formatFee(0.03)).toBe('0.03 STX')
  })

  it('formats invalid compact fee labels as zero', () => {
    expect(formatFee(Number.NaN)).toBe('0 STX')
  })

  it('rounds tiny fractional STX values to nearest micro-STX', () => {
    expect(stxToMicroStx(0.00000049)).toBe(0)
    expect(stxToMicroStx(0.0000005)).toBe(1)
  })

  it('converts one micro-STX into decimal STX correctly', () => {
    expect(microStxToStx(1)).toBe(0.000001)
  })

  it('returns zero for non-finite micro-STX inputs', () => {
    expect(microStxToStx(Number.POSITIVE_INFINITY)).toBe(0)
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

  it('formats infinite micro-STX values as zero', () => {
    expect(formatUStx(Number.POSITIVE_INFINITY)).toBe('0 µSTX')
  })

  it('formats negative fractional micro-STX values as zero', () => {
    expect(formatUStx(-0.4)).toBe('0 µSTX')
  })

  it('accepts valid fee range boundaries', () => {
    expect(isValidFee(0)).toBe(true)
    expect(isValidFee(MAX_FEE)).toBe(true)
  })

  it('rejects fees above the maximum', () => {
    expect(isValidFee(MAX_FEE + 0.01)).toBe(false)
  })

  it('accepts fees at the base minimum', () => {
    expect(isMinimumFee(BASE_FEE)).toBe(true)
  })

  it('rejects fees below the base minimum', () => {
    expect(isMinimumFee(BASE_FEE / 2)).toBe(false)
  })

  it('keeps detailed fee size parsing consistent with estimateFee for numeric strings', () => {
    const detailed = estimateFeeDetailed('100')
    expect(detailed.total).toBe(estimateFee('100'))
  })

  it('includes the base fee in detailed estimates', () => {
    expect(estimateFeeDetailed(100).baseFee).toBe(BASE_FEE)
  })

  it('includes rounded payload fees in detailed estimates', () => {
    expect(estimateFeeDetailed(100).payloadFee).toBe(0.005)
  })

  it('includes microSTX totals in detailed estimates', () => {
    expect(estimateFeeDetailed(100).totalMicroStx).toBe(6_000)
  })

  it('returns false for non-finite fee comparison inputs', () => {
    expect(feesAreEqual(Number.NaN, 0.1)).toBe(false)
    expect(feesAreEqual(0.1, Number.POSITIVE_INFINITY)).toBe(false)
  })

  it('matches fees within the default tolerance', () => {
    expect(feesAreEqual(0.1, 0.100001)).toBe(true)
  })

  it('respects custom fee comparison tolerances', () => {
    expect(feesAreEqual(0.1, 0.101, 0.0001)).toBe(false)
  })

  it('falls back when fee comparison tolerance is invalid', () => {
    expect(feesAreEqual(0.1, 0.100001, -1)).toBe(true)
  })

  it('caps fee percentage display at 100%', () => {
    expect(feeAsPercent(100)).toBe('100.00%')
  })

  it('formats midrange fees as percentages', () => {
    expect(feeAsPercent(MAX_FEE / 2)).toBe('50.00%')
  })

  it('formats negative fees as zero percent', () => {
    expect(feeAsPercent(-1)).toBe('0.00%')
  })

  it('formats fees as microSTX display values', () => {
    expect(feeToUStxDisplay(0.001)).toBe('1,000 µSTX')
  })

  it('calculates remaining fee headroom', () => {
    expect(feeHeadroom(4)).toBe(6)
  })

  it('uses the full headroom for negative fee values', () => {
    expect(feeHeadroom(-1)).toBe(MAX_FEE)
  })

  it('returns zero headroom above the fee cap', () => {
    expect(feeHeadroom(MAX_FEE + 1)).toBe(0)
  })
})
