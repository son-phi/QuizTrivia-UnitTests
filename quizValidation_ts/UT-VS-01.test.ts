/**
 * Test Case ID: UT-VS-01
 * Description: Verify step='info': tat ca fields hop le -> true (happy path)
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 7-14 (case 'info': basicInfoValid && durationValid && passwordValid)
 * Technique: testChuan1
 */

import { validateStep } from '../../quizValidation';

describe('UT-VS-01', () => {
  it("Verify step='info': tat ca fields hop le -> true (happy path)", () => {
    // 1. Du lieu test (Test Data)
    const validQuiz = {
      title: 'React Basics',
      description: 'Learn React',
      category: 'programming',
      difficulty: 'medium',
      duration: 15,
      havePassword: 'no'
    };

    // 2. Ham test (Test Function)
    const result = validateStep(validQuiz, 'info');

    // 3. Ket qua mong doi (Expected Result): All required fields present and valid
    expect(result).toBe(true);
  });
});