/**
 * Test Case ID: UT-VS-16
 * Description: Verify step='type': quizType bi thieu -> false
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 5-6 (case 'type': return !!quiz.quizType)
 * Technique: testNgoaile12 — step='type' negative path [NEW TC - v2 chua co section nay]
 */

import { validateStep } from '../../quizValidation';

describe('UT-VS-16', () => {
  it("Verify step='type': quizType bi thieu -> false", () => {
    // quiz = {} → quiz.quizType = undefined → !!undefined = false
    expect(validateStep({}, 'type')).toBe(false);
  });
});