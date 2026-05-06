/**
 * Test Case ID: UT-VS-19
 * Description: Verify step='resources': có resources -> true (happy path)
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 17 (case 'resources')
 * Technique: Kiểm thử luồng cơ bản (Happy path)
 */

import { validateStep } from '../../quizValidation';
import { QuizFormData } from '../../../pages/CreateQuizPage/types';

describe('UT-VS-19', () => {
  it("Verify step='resources': có resources -> true", () => {
    // 1. Dữ liệu test (Test Data) - Truyền vào mảng resources có 1 phần tử hợp lệ
    const mockQuiz: Partial<QuizFormData> = {
      resources: [{ id: '1', type: 'pdf', title: 'Test PDF', description: '', url: 'fake.pdf', required: false, threshold: { type: 'percentage', value: 80, unit: '%' }, estimatedTime: 5, order: 0, category: null, duration: null, size: null, mimeType: null, thumbnailUrl: null }]
    };

    // 2. Hàm test (Test Function) - Gọi hàm validate cho bước resources
    const result = validateStep(mockQuiz as QuizFormData, 'resources');

    // 3. Kết quả mong đợi (Expected Result) - Mảng có độ dài > 0 nên hợp lệ -> true
    expect(result).toBe(true);
  });
});
