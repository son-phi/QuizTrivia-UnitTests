/**
 * Test Case ID: UT-VS-18
 * Description: Verify questions: points=0 -> false (points phai >= 1)
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 28 (if !q.points || q.points < 1 || q.points > 100 -> return true invalid)
 * Technique: testNgoaile — BVA points below minimum (min=1)
 */

import { validateStep } from '../../quizValidation';

describe('UT-VS-18', () => {
  it('Verify questions: points=0 -> false (BVA: below min points=1)', () => {
    // 1. Test Data — cau hoi co points=0, vi pham rang buoc 1<=points<=100
    const quiz = {
      questions: [
        {
          id: 'q1',
          type: 'multiple',
          text: 'Q?',
          points: 0,   // vi pham: points < 1 -> invalid
          answers: [
            { id: 'a1', text: 'A', isCorrect: true },
            { id: 'a2', text: 'B', isCorrect: false }
          ]
        }
      ]
    };

    // 2. Test Function
    const result = validateStep(quiz, 'questions');

    // 3. Expected Result: points=0 la invalid -> validateStep = false
    expect(result).toBe(false);
  });
});
