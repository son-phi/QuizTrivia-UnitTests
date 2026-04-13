/**
 * Test Case ID: UT-AG-03
 * Description: Verify empty array -> throw error
 * Source File: src/features/quiz/services/aiResponseParser.ts
 * Source Line: (parseQuestionsFromResponse — check empty input before processing)
 * Technique: Negative — empty input boundary
 * Notes: Spec v4: UT-AG-03 = empty array -> throw (no valid questions to return)
 */

import { parseQuestionsFromResponse } from '../../aiResponseParser';

describe('UT-AG-03', () => {
  it('Verify parseQuestionsFromResponse: empty array -> throw error', () => {
    // 1. Test Data — empty array, no questions at all
    const input: any[] = [];

    // 2. Test Function & 3. Expected Result: phai throw (khong co cau hoi nao)
    expect(() => parseQuestionsFromResponse(input)).toThrow('AI không trả về câu hỏi nào');
  });
});