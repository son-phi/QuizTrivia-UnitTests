/**
 * Test Case ID: UT-DM-05
 * Description: Verify isQuiz: thiếu questions array -> false
 * Source File: src/services/firebase/dataModels.ts
 * Source Line: 1-100 (Function isQuiz)
 */

import { isQuiz } from '../../dataModels';

describe('UT-DM-05', () => {
  it('Verify isQuiz: thiếu questions array -> false', async () => {
    // 1. Test Data
    const input = { id: 'q1', title: 'Test' }; // missing questions

    // 2. Test Function
    const result = isQuiz(input);

    // 3. Expected Result:
    expect(result).toBe(false);
  });
});