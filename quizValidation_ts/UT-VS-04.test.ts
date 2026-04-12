/**
 * Test Case ID: UT-VS-04
 * Description: Verify step='info': duration=5 -> true (BVA: dung min boundary)
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 9 (durationValid: duration >= 5 && duration <= 120)
 * Technique: testChuan2 — BVA lower boundary valid
 */

import { validateStep } from '../../quizValidation';

describe('UT-VS-04', () => {
  it("Verify step='info': duration=5 -> true (BVA: dung min boundary)", () => {
    const quiz = { title: 'T', description: 'D', category: 'c', difficulty: 'easy', duration: 5, havePassword: 'no' };
    expect(validateStep(quiz, 'info')).toBe(true);
  });
});