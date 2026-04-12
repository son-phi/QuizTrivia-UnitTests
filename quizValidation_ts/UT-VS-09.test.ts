/**
 * Test Case ID: UT-VS-09
 * Description: Verify type='short_answer': correctAnswer rỗng -> false
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 32-33 (case 'short_answer': return !q.correctAnswer)
 * Technique: testNgoaile7
 */

import { validateStep } from '../../quizValidation';
import { QuizFormData } from '../../../pages/CreateQuizPage/types';

describe('UT-VS-09', () => {
  it("Verify type='short_answer': correctAnswer rỗng -> false", () => {
    // 1. Dữ liệu test (Test Data)
    const mockQuiz: Partial<QuizFormData> = {
      questions: [
        {
          id: 'q1',
          type: 'short_answer',
          text: 'Text',
          points: 10,
          correctAnswer: ''   // rỗng → !q.correctAnswer = true → invalid
        }
      ]
    };

    // 2. Hàm test (Test Function)
    const result = validateStep(mockQuiz as QuizFormData, 'questions');

    // 3. Kết quả mong đợi (Expected Result)
    expect(result).toBe(false);
  });
});