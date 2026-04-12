/**
 * Test Case ID: UT-VS-13
 * Description: Verify type='multimedia': thiếu cả text VÀ mediaUrl -> false
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 44-47 (case 'multimedia' validation)
 * Notes: source check: a.text || a.imageUrl || a.audioUrl || a.videoUrl
 */

import { validateStep } from '../../quizValidation';
import { QuizFormData } from '../../../pages/CreateQuizPage/types';

describe('UT-VS-13', () => {
  it("Verify type='multimedia': thiếu cả text VÀ mediaUrl -> false", () => {
    // 1. Dữ liệu test (Test Data)
    // Câu hỏi multimedia với answer không có text VÀ không có bất kỳ media nào
    const mockQuiz: Partial<QuizFormData> = {
      questions: [
        {
          id: 'q1',
          type: 'multimedia',
          text: 'Text',
          points: 10,
          answers: [
            {
              id: '1',
              text: '',
              imageUrl: '',
              audioUrl: '',   // thêm đúng spec: source check a.audioUrl
              videoUrl: '',   // thêm đúng spec: source check a.videoUrl
              isCorrect: true
            }
          ]
        }
      ]
    };

    // 2. Hàm test (Test Function)
    const result = validateStep(mockQuiz as QuizFormData, 'questions');

    // 3. Kết quả mong đợi (Expected Result)
    // source :47 — return !q.answers.every(a => a.text || a.imageUrl || a.audioUrl || a.videoUrl)
    // '' || '' || '' || '' = '' = falsy → every() = false → !false = true → invalid → validateStep = false
    expect(result).toBe(false);
  });
});