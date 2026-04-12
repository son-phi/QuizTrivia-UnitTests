/**
 * Test Case ID: UT-VS-03
 * Description: Verify step='info': duration=4 -> false (BVA: duoi min=5)
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 9 (durationValid = quiz.duration >= 5 && quiz.duration <= 120)
 * Technique: testNgoaile2 — BVA lower — below boundary
 */

import { validateStep } from '../../quizValidation';

describe('UT-VS-03', () => {
  it("Verify step='info': duration=4 -> false (BVA: duoi min=5)", () => {
    const quiz = { title: 'T', description: 'D', category: 'c', difficulty: 'easy', duration: 4, havePassword: 'no' };
    expect(validateStep(quiz, 'info')).toBe(false);
  });
});