/**
 * Test Case ID: UT-VS-22
 * Description: Verify unknown step: lọt vào nhánh default của switch-case bước validate
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 63
 * Technique: Kiểm thử luồng ngoại lệ (Nhánh Default)
 */

import { validateStep } from '../../quizValidation';
import { QuizFormData } from '../../../pages/CreateQuizPage/types';

describe('UT-VS-22', () => {
  it("Verify unknown step returns false", () => {
    // 1. Dữ liệu test (Test Data) - Quiz rỗng, nhưng truyền step tào lao
    const mockQuiz: Partial<QuizFormData> = {};

    // 2. Hàm test (Test Function) - Gọi hàm validate với tham số step không có thực
    const result = validateStep(mockQuiz as QuizFormData, 'unknown_step_name');

    // 3. Kết quả mong đợi (Expected Result) - Không khớp case nào, lọt vào default -> false
    expect(result).toBe(false);
  });
});
