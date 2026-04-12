/**
 * Test Case ID: UT-VS-02
 * Description: Verify step='info': title rong -> false
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 8 (basicInfoValid = !!(quiz.title && ...))
 * Technique: testNgoaile1
 */

import { validateStep } from '../../quizValidation';

describe('UT-VS-02', () => {
  it("Verify step='info': title rong -> false", () => {
    const quiz = { title: '', description: 'Desc', category: 'cat', difficulty: 'easy', duration: 15, havePassword: 'no' };
    expect(validateStep(quiz, 'info')).toBe(false);
  });
});