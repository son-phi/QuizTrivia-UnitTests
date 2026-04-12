/**
 * Test Case ID: UT-AG-09
 * Description: Verify parseAIResponseJSON: null input -> throw error
 * Source File: functions/src/lib/aiResponseParser.ts
 * Source Line: 2-4 (if !generatedText -> throw 'AI khong tra ve text response')
 * Technique: testNgoaile — null/falsy input boundary
 */

import { parseAIResponseJSON } from '../../aiResponseParser';

describe('UT-AG-09', () => {
  it('Verify parseAIResponseJSON: null input -> throw error', () => {
    // 1. Test Data — null input (falsy)
    // 2. Expected Result: throw ngay lap tuc voi message ro rang
    expect(() => parseAIResponseJSON(null)).toThrow();
    expect(() => parseAIResponseJSON(undefined)).toThrow();
    expect(() => parseAIResponseJSON('')).toThrow();
  });
});
