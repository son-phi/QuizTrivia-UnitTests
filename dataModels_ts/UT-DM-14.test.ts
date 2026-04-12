/**
 * Test Case ID: UT-DM-14
 * Description: Verify convertTimestamps: array input -> de quy tung phan tu
 * Source File: src/features/quiz/utils/timestamps.ts
 * Source Line: 13-15 (if Array.isArray -> data.map(item => convertTimestamps(item)))
 * Technique: testChuan — array branch
 */

import { convertTimestamps } from '../../../features/quiz/utils/timestamps';

describe('UT-DM-14', () => {
  it('Verify convertTimestamps: array chua Timestamp -> moi item duoc convert', () => {
    // 1. Test Data — array chua 2 mock Timestamps
    const mockTs1 = { toDate: () => new Date('2026-01-01T00:00:00.000Z') };
    const mockTs2 = { toDate: () => new Date('2026-06-15T12:00:00.000Z') };
    const input = [mockTs1, mockTs2];

    // 2. Test Function
    const result = convertTimestamps(input);

    // 3. Expected Result: moi phan tu trong array duoc chuyen thanh ISO string
    expect(Array.isArray(result)).toBe(true);
    expect(result[0]).toBe('2026-01-01T00:00:00.000Z');
    expect(result[1]).toBe('2026-06-15T12:00:00.000Z');
  });
});
