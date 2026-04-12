/**
 * Test Case ID: UT-VS-07
 * Description: Verify questions=[]: khong co cau hoi -> false
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 19-21 (questions.length === 0 -> return false)
 * Technique: testNgoaile5
 */

import { validateStep } from '../../quizValidation';

describe('UT-VS-07', () => {
  it("Verify questions=[]: khong co cau hoi -> false", () => {
    const quiz = { questions: [] };
    expect(validateStep(quiz, 'questions')).toBe(false);
  });
});