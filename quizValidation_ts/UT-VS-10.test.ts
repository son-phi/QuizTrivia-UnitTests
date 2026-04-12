/**
 * Test Case ID: UT-VS-10
 * Description: Verify type='ordering': chỉ 1 item -> false (BVA min=2)
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 48-49 (case 'ordering': q.orderingItems.length < 2)
 * Technique: testNgoaile8 — BVA lower boundary
 */

import { validateStep } from '../../quizValidation';
import { QuizFormData } from '../../../pages/CreateQuizPage/types';

describe('UT-VS-10', () => {
  it("Verify type='ordering': chỉ 1 item -> false (BVA min=2)", () => {
    // 1. Dữ liệu test (Test Data) — BVA: length=1, min=2 → invalid
    const mockQuiz: Partial<QuizFormData> = {
      questions: [
        {
          id: 'q1',
          type: 'ordering',
          text: 'Text',
          points: 10,
          orderingItems: [
            { id: '1', text: 'A', correctOrder: 1 }  // chỉ 1 item → length < 2
          ]
        }
      ]
    };

    // 2. Hàm test (Test Function)
    const result = validateStep(mockQuiz as QuizFormData, 'questions');

    // 3. Kết quả mong đợi (Expected Result)
    // source :49 — q.orderingItems.length < 2 → true → invalid
    expect(result).toBe(false);
  });
});