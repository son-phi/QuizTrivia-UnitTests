/**
 * Test Case ID: UT-DM-09
 * Description: Verify convertTimestamps: Firestore Timestamp -> ISO string
 * Source File: src/features/quiz/utils/timestamps.ts
 * Source Line: 7-39 (Function convertTimestamps — duck-typing check)
 * Technique: testChuan1
 * Notes: Mock Timestamp bang duck-typing { toDate: fn } theo source :18
 *        Timestamp(1735689600, 0) = 2026-01-01T00:00:00.000Z
 */

import { convertTimestamps } from '../../../../features/quiz/utils/timestamps';

describe('UT-DM-09', () => {
  it('Verify convertTimestamps: Firestore Timestamp -> ISO string', () => {
    // 1. Test Data — duck-typing mock: object co ham toDate()
    const mockTimestamp = { toDate: () => new Date('2026-01-01T00:00:00.000Z') };
    const input = { createdAt: mockTimestamp };

    // 2. Test Function
    const result = convertTimestamps(input);

    // 3. Expected Result: Timestamp chuyen thanh ISO string chinh xac
    expect(result.createdAt).toBe('2026-01-01T00:00:00.000Z');
  });
});