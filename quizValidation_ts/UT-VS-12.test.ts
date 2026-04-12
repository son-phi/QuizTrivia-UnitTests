/**
 * Test Case ID: UT-VS-12
 * Description: Verify type='fill_blanks': textWithBlanks rỗng -> false
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 52-53 (case 'fill_blanks': !q.textWithBlanks || !q.blanks || q.blanks.length === 0)
 * Technique: testNgoaile10
 */

import { validateStep } from '../../quizValidation';
import { QuizFormData } from '../../../pages/CreateQuizPage/types';

describe('UT-VS-12', () => {
  it("Verify type='fill_blanks': textWithBlanks rỗng -> false", () => {
    // 1. Dữ liệu test (Test Data)
    // textWithBlanks rỗng → !q.textWithBlanks = true → invalid
    const mockQuiz: Partial<QuizFormData> = {
      questions: [
        {
          id: 'q1',
          type: 'fill_blanks',
          text: 'Text',
          points: 10,
          textWithBlanks: '',   // rỗng → invalid
          blanks: [{ id: 'b1', position: 0, correctAnswer: 'x', acceptedAnswers: [], caseSensitive: false }]
        }
      ]
    };

    // 2. Hàm test (Test Function)
    const result = validateStep(mockQuiz as QuizFormData, 'questions');

    // 3. Kết quả mong đợi (Expected Result)
    // source :53 — !q.textWithBlanks = !'' = true → invalidQuestion → false
    expect(result).toBe(false);
  });
});