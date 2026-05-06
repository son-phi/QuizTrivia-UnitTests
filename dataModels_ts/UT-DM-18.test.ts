/**
 * Test Case ID: UT-DM-18
 * Description: Test isQuizResult type guard
 * Source File: src/services/firebase/dataModels.ts
 * Source Line: 389
 * Technique: Phân vùng tương đương (Valid/Invalid Object)
 */

import { isQuizResult } from '../../dataModels';

describe('UT-DM-18: Test isQuizResult type guard', () => {
  it('should return true for valid QuizResult object', () => {
    // 1. Dữ liệu test (Test Data) - Object hợp lệ chứa quizId, userId và score
    const validResult = { quizId: 'q1', userId: 'u1', score: 100 };
    
    // 2. Hàm test (Test Function) & 3. Kết quả mong đợi (Expected Result)
    expect(isQuizResult(validResult)).toBe(true);
  });

  it('should return false for invalid object missing score', () => {
    // 1. Dữ liệu test - Object thiếu trường điểm số (score)
    const invalidResult = { quizId: 'q1', userId: 'u1' };
    
    // 2 & 3. Hàm sẽ chặn lại và trả về false
    expect(isQuizResult(invalidResult)).toBe(false);
  });

  it('should return false for null data', () => {
    // 1. Dữ liệu test - Dữ liệu null
    // 2 & 3. Gọi hàm và mong đợi trả về falsy để an toàn
    expect(isQuizResult(null)).toBeFalsy();
  });
});
