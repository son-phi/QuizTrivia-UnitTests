/**
 * Test Case ID: UT-VS-14
 * Description: Verify valid quiz đầy đủ tất cả fields -> true (happy path)
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 18-59 (case 'questions': find invalid → return !invalidQuestion)
 * Technique: testChuan2 — Full happy path
 */

import { validateStep } from '../../quizValidation';
import { QuizFormData } from '../../../pages/CreateQuizPage/types';

describe('UT-VS-14', () => {
  it('Verify valid quiz đầy đủ tất cả fields -> true (happy path)', () => {
    // 1. Dữ liệu test (Test Data) — MCQ hợp lệ hoàn toàn
    const mockQuiz: Partial<QuizFormData> = {
      questions: [
        {
          id: 'q1',
          type: 'multiple',
          text: 'Q?',
          points: 10,
          answers: [
            { id: 'a1', text: 'A', isCorrect: true },
            { id: 'a2', text: 'B', isCorrect: false }
          ]
        }
      ]
    };

    // 2. Hàm test (Test Function)
    const result = validateStep(mockQuiz as QuizFormData, 'questions');

    // 3. Kết quả mong đợi (Expected Result)
    // Tất cả validation rules passed → !invalidQuestion = true
    expect(result).toBe(true);
  });
});