/**
 * Test Case ID: UT-AG-02
 * Description: Verify mixed valid+invalid: skip invalid, giu valid
 * Source File: src/features/quiz/services/aiResponseParser.ts
 * Source Line: (parseQuestionsFromResponse — filter invalid questions)
 * Technique: testChuan2
 * Notes: validQ co answers hop le, invalidQ co answers rong -> bi skip
 */

import { parseQuestionsFromResponse } from '../../aiResponseParser';

describe('UT-AG-02', () => {
  it('Verify parseQuestionsFromResponse: mixed valid+invalid -> skip invalid, giu valid', () => {
    // 1. Test Data
    const validQ   = { type: 'multiple', text: 'Q1', answers: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: false }] };
    const invalidQ = { type: 'multiple', text: 'Q2', answers: [] }; // answers rong -> bi skip

    const input = [validQ, invalidQ];

    // 2. Test Function
    const result = parseQuestionsFromResponse(input);

    // 3. Expected Result: chi Q1 duoc giu, Q2 bi skip
    expect(result.length).toBe(1);
    expect(result[0].text).toBe('Q1');
  });
});