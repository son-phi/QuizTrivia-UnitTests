/**
 * Test Case ID: UT-VS-06
 * Description: Verify step='info': password.length < 6 -> false
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 10-12 (passwordValid: havePassword==='password' ? password.length >= 6 : true)
 * Technique: testNgoaile4
 */

import { validateStep } from '../../quizValidation';

describe('UT-VS-06', () => {
  it("Verify step='info': password.length < 6 -> false", () => {
    const quiz = {
      title: 'T', description: 'D', category: 'c', difficulty: 'easy', duration: 15,
      havePassword: 'password', password: '123'  // 3 chars, minLength = 6
    };
    expect(validateStep(quiz, 'info')).toBe(false);
  });
});