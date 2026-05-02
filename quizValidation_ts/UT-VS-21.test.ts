/**
 * Test Case ID: UT-VS-21
 * Description: Verify unknown question type: lọt vào nhánh default của switch-case loại câu hỏi
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 55
 * Technique: Kiểm thử luồng ngoại lệ (Nhánh Default)
 */

import { validateStep } from '../../quizValidation';
import { QuizFormData } from '../../../pages/CreateQuizPage/types';

describe('UT-VS-21', () => {
  it("Verify unknown question type is allowed (returns false for invalidQuestion)", () => {
    // 1. Dữ liệu test (Test Data) - Truyền một loại câu hỏi không tồn tại trong switch case
    const mockQuiz: Partial<QuizFormData> = {
      questions: [
        {
          id: 'q1',
          type: 'unknown_type' as any,
          text: 'Unknown question',
          points: 10,
          answers: []
        }
      ]
    };

    // 2. Hàm test (Test Function) - Gọi hàm validate
    const result = validateStep(mockQuiz as QuizFormData, 'questions');

    // 3. Kết quả mong đợi (Expected Result) - Nhánh default trả về false (tức là không phải lỗi) -> Câu hỏi hợp lệ -> true
    expect(result).toBe(true);
  });
});
