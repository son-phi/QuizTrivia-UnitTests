/**
 * Test Case ID: UT-VS-08
 * Description: Verify type='multiple': không có isCorrect=true -> false
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 35-38 (case 'multiple': !q.answers.some(a => a.isCorrect))
 * Technique: testNgoaile6
 */

import { validateStep } from '../../quizValidation';
import { QuizFormData } from '../../../pages/CreateQuizPage/types';

describe('UT-VS-08', () => {
  it("Verify type='multiple': không có isCorrect=true -> false", () => {
    // 1. Dữ liệu test (Test Data)
    const mockQuiz: Partial<QuizFormData> = {
      questions: [
        {
          id: 'q1',
          type: 'multiple',
          text: 'Text',
          points: 10,
          answers: [
            { id: 'a1', text: 'A', isCorrect: false },
            { id: 'a2', text: 'B', isCorrect: false }
          ]
        }
      ]
    };

    // 2. Hàm test (Test Function)
    const result = validateStep(mockQuiz as QuizFormData, 'questions');

    // 3. Kết quả mong đợi (Expected Result)
    // source :38 — !q.answers.some(a => a.isCorrect) = !false = true → invalid
    expect(result).toBe(false);
  });
});