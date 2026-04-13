/**
 * Unit Tests cho src/features/quiz/pages/ResultPage/utils.ts
 * ==========================================================
 * Bao gồm 11 test cases theo đặc tả:
 * UT-RU-01 -> UT-RU-11
 */

import {
  formatTime,
  formatDetailedTime,
  safeNumber,
  getScoreColor,
  getPerformanceMessage,
  getRankDisplay,
  getRankBackgroundColor,
} from '../utils';

describe('Nhóm 1 — formatTime / formatDetailedTime', () => {
  /**
   * UT-RU-01
   * Verify formatTime: 90s, isMs=false → '01:30'
   * Technique: testChuan1
   */
  it("UT-RU-01: formatTime(90, false) — Trả về '01:30'", () => {
    // Note: Cài đặt thực tế sử dụng padStart(2, '0') cho cả phút và giây nên 1:30 trở thành 01:30
    const result = formatTime(90, false);
    expect(result).toBe('01:30');
  });

  /**
   * UT-RU-02
   * Verify formatTime: 90000ms, isMs=true → '01:30'
   * Technique: testChuan2
   */
  it("UT-RU-02: formatTime(90000, true) — Trả về '01:30' (90000ms = 90s)", () => {
    const result = formatTime(90000, true);
    expect(result).toBe('01:30');
  });

  /**
   * UT-RU-03
   * Verify formatTime: 0s → '00:00' (boundary lower)
   * Technique: testNgoaile1
   */
  it("UT-RU-03: formatTime(0, false) — Trả về '00:00' cho giá trị biên là 0", () => {
    const result = formatTime(0, false);
    expect(result).toBe('00:00');
  });

  /**
   * UT-RU-04
   * Verify formatDetailedTime: 3661s → '1h 1m 1s'
   * Technique: testChuan3
   */
  it("UT-RU-04: formatDetailedTime(3661) — Trả về '1h 1m 1s'", () => {
    const result = formatDetailedTime(3661);
    expect(result).toBe('1h 1m 1s');
  });
});

describe('Nhóm 2 — safeNumber', () => {
  /**
   * UT-RU-05
   * Verify safeNumber: valid number → chính giá trị
   * Technique: testChuan1
   */
  it('UT-RU-05: safeNumber(85) — Trả về chính giá trị số nguyên vẹn là 85', () => {
    const result = safeNumber(85);
    expect(result).toBe(85);
  });

  /**
   * UT-RU-06
   * Verify safeNumber: NaN → fallback 0
   * Technique: testNgoaile1
   */
  it('UT-RU-06: safeNumber(NaN, 0) — Trả về giá trị fallback là 0', () => {
    const result = safeNumber(NaN, 0);
    expect(result).toBe(0);
  });
});

describe('Nhóm 3 — getScoreColor / getPerformanceMessage', () => {
  /**
   * UT-RU-07
   * Verify getScoreColor: score=95 → CSS class cho excellent (≥80 theo code)
   * Technique: testChuan1
   */
  it("UT-RU-07: getScoreColor(95) — Trả về class 'text-green-600' (score >= 80)", () => {
    const result = getScoreColor(95);
    expect(result).toBe('text-green-600');
  });

  /**
   * UT-RU-08
   * Verify getScoreColor: score=45 → CSS class cho fail (<60 theo code)
   * Technique: testNgoaile1
   */
  it("UT-RU-08: getScoreColor(45) — Trả về class 'text-red-600' (score < 60)", () => {
    const result = getScoreColor(45);
    expect(result).toBe('text-red-600');
  });

  /**
   * UT-RU-09
   * Verify getPerformanceMessage: 100% → top performance message
   * Technique: testChuan2
   */
  it("UT-RU-09: getPerformanceMessage(100) — Trả về 'Outstanding! 🏆' (percentage >= 90)", () => {
    const result = getPerformanceMessage(100);
    expect(result).toBe('Outstanding! 🏆');
  });
});

describe('Nhóm 4 — getRankDisplay / getRankBackgroundColor', () => {
  /**
   * UT-RU-10
   * Verify getRankDisplay: index=0 → '🥇'
   * Technique: testChuan1
   */
  it("UT-RU-10: getRankDisplay(0) — Trả về huy chương '🥇'", () => {
    const result = getRankDisplay(0);
    expect(result).toBe('🥇');
  });

  /**
   * UT-RU-11
   * Verify getRankDisplay: index=3 → số 4 (non-medal)
   * Technique: testChuan2
   */
  it('UT-RU-11: getRankDisplay(3) — Trả về số thứ tự là 4', () => {
    const result = getRankDisplay(3);
    // Hàm trả về index+1 dưới dạng số (dựa vào cấu trúc code)
    expect(result).toBe(4);
  });
});
