/**
 * Test Case ID: UT-AG-04
 * Description: Verify parseQuestionsFromResponse: tất cả items invalid → throw error
 * Source File: src/features/quiz/services/aiResponseParser.ts
 * Source Line: 307-309 (throw when questions.length === 0 after filtering)
 * Technique: testNgoaile2
 */

import { parseQuestionsFromResponse } from '../../aiResponseParser';

describe('UT-AG-04', () => {
  it('Verify parseQuestionsFromResponse: tất cả items invalid → throw error', () => {
    // 1. Test Data — item invalid: có type 'multiple' nhưng answers rỗng → bị skip
    const input = [
      { type: 'multiple', text: 'Q?', answers: [] }  // answers < 2 → isValid = false → skip
    ];

    // 2. Test Function — sau khi filter, questions.length === 0 → throw
    // 3. Expected Result: throw Error (source :307-309)
    expect(() => parseQuestionsFromResponse(input)).toThrow();
  });
});