/**
 * Test Case ID: UT-VS-17
 * Description: Verify step='review' -> true (review step luon hop le)
 * Source File: src/features/quiz/utils/quizValidation.ts
 * Source Line: 60-61 (case 'review': return true)
 * Technique: testChuan — review step happy path
 */

import { validateStep } from '../../quizValidation';

describe('UT-VS-17', () => {
  it("Verify step='review' -> true (luon hop le)", () => {
    // review step khong can validate gi ca, luon return true
    expect(validateStep({}, 'review')).toBe(true);
  });
});
