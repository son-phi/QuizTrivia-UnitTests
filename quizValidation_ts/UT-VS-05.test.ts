/**
 * Test Case ID: UT-VS-05
 * Description: Verify step='info': duration=121 -> false (BVA: tren max=120)
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 9 (durationValid: duration >= 5 && duration <= 120)
 * Technique: testNgoaile3 — BVA upper — above boundary
 */

import { validateStep } from '../../quizValidation';

describe('UT-VS-05', () => {
  it("Verify step='info': duration=121 -> false (BVA: tren max=120)", () => {
    const quiz = { title: 'T', description: 'D', category: 'c', difficulty: 'easy', duration: 121, havePassword: 'no' };
    expect(validateStep(quiz, 'info')).toBe(false);
  });
});