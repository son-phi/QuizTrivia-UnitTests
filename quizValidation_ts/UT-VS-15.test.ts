/**
 * Test Case ID: UT-VS-15
 * Description: Verify step='type': quizType='standard' -> true
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 5-6 (case 'type': return !!quiz.quizType)
 * Technique: testChuan3 — step='type' happy path [NEW TC - v2 chua co section nay]
 */

import { validateStep } from '../../quizValidation';

describe('UT-VS-15', () => {
  it("Verify step='type': quizType='standard' -> true", () => {
    // quiz.quizType = 'standard' → !!('standard') = true
    expect(validateStep({ quizType: 'standard' }, 'type')).toBe(true);
  });
});