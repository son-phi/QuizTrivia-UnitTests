/**
 * Test Case ID: UT-DM-03
 * Description: Verify cleanQuestionData: points default = 1
 * Source File: src/services/firebase/dataModels.ts
 * Source Line: 1-100 (Function cleanQuestionData)
 */

import { cleanQuestionData } from '../../dataModels';

describe('UT-DM-03', () => {
  it('Verify cleanQuestionData: points default = 1', async () => {
    // 1. Test Data
    const input = { text: 'Question text' };

    // 2. Test Function
    const result = cleanQuestionData(input as any);

    // 3. Expected Result: Points defaults to 1
    expect(result.points).toBe(1);
  });
});