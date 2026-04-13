/**
 * Test Case ID: UT-DM-15
 * Description: Verify convertTimestamps: Date instance -> ISO string
 * Source File: src/features/quiz/utils/timestamps.ts
 * Source Line: 24-26 (if data instanceof Date -> return data.toISOString())
 * Technique: testChuan — Date instance branch
 */

import { convertTimestamps } from '../../../../features/quiz/utils/timestamps';

describe('UT-DM-15', () => {
  it('Verify convertTimestamps: Date instance -> ISO string', () => {
    // 1. Test Data — Date object (khac voi Firestore Timestamp)
    const input = new Date('2026-03-15T08:00:00.000Z');

    // 2. Test Function
    const result = convertTimestamps(input);

    // 3. Expected Result: Date chuyen thanh ISO string truc tiep
    expect(result).toBe('2026-03-15T08:00:00.000Z');
  });
});
