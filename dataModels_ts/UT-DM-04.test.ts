/**
 * Test Case ID: UT-DM-04
 * Description: Verify isQuiz: valid quiz data -> true
 * Source File: src/services/firebase/dataModels.ts
 * Source Line: 1-100 (Function isQuiz)
 */

import { isQuiz } from '../../dataModels';

describe('UT-DM-04', () => {
  it('Verify isQuiz: valid quiz data -> true', async () => {
    // 1. Test Data
    const input = { id: 'q1', title: 'Test', questions: [] };

    // 2. Test Function
    const result = isQuiz(input);

    // 3. Expected Result: 
    expect(result).toBe(true);
  });
});