/**
 * Test Case ID: UT-VS-20
 * Description: Verify type='image/audio/video': kiểm tra cấu trúc câu hỏi media cũ
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 43
 * Technique: Phân tích giá trị biên / Điều kiện logic
 */

import { validateStep } from '../../quizValidation';
import { QuizFormData } from '../../../pages/CreateQuizPage/types';

describe('UT-VS-20', () => {
  it("Verify type='image': hợp lệ khi có câu trả lời đúng và có text", () => {
    // 1. Dữ liệu test (Test Data) - Câu hỏi loại image, có ít nhất 1 câu đúng và mọi đáp án đều có text
    const mockQuiz: Partial<QuizFormData> = {
      questions: [
        {
          id: 'q1',
          type: 'image',
          text: 'Nhìn hình đoán chữ?',
          points: 10,
          answers: [
            { id: 'a1', text: 'Con mèo', isCorrect: true },
            { id: 'a2', text: 'Con chó', isCorrect: false }
          ]
        }
      ]
    };

    // 2. Hàm test (Test Function) - Gọi hàm validate cho mảng câu hỏi
    const result = validateStep(mockQuiz as QuizFormData, 'questions');

    // 3. Kết quả mong đợi (Expected Result) - Đáp ứng đủ điều kiện của nhánh 'image' -> true
    expect(result).toBe(true);
  });
});
