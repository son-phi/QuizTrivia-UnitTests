/**
 * Test Case ID: UT-VS-11
 * Description: Verify type='matching': chỉ 1 cặp -> false (BVA min=2)
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 50-51 (case 'matching': q.matchingPairs.length < 2)
 * Technique: testNgoaile9 — BVA lower boundary
 */

import { validateStep } from '../../quizValidation';
import { QuizFormData } from '../../../pages/CreateQuizPage/types';

describe('UT-VS-11', () => {
  it("Verify type='matching': chỉ 1 cặp -> false (BVA min=2)", () => {
    // 1. Dữ liệu test (Test Data) — BVA: length=1, min=2 → invalid
    const mockQuiz: Partial<QuizFormData> = {
      questions: [
        {
          id: 'q1',
          type: 'matching',
          text: 'Text',
          points: 10,
          matchingPairs: [
            { id: '1', left: 'A', right: 'B' }  // chỉ 1 cặp → length < 2
          ]
        }
      ]
    };

    // 2. Hàm test (Test Function)
    const result = validateStep(mockQuiz as QuizFormData, 'questions');

    // 3. Kết quả mong đợi (Expected Result)
    // source :51 — q.matchingPairs.length < 2 → true → invalid
    expect(result).toBe(false);
  });
});