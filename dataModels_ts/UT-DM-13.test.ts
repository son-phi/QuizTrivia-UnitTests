/**
 * Test Case ID: UT-DM-13
 * Description: Verify convertTimestamps: null input -> return null (chuong trinh khong crash)
 * Source File: src/features/quiz/utils/timestamps.ts
 * Source Line: 8-10 (if data === null || data === undefined -> return data)
 * Technique: testNgoaile — null input boundary
 */

import { convertTimestamps } from '../../../../features/quiz/utils/timestamps';

describe('UT-DM-13', () => {
  it('Verify convertTimestamps: null input -> return null', () => {
    expect(convertTimestamps(null)).toBeNull();
  });
});
