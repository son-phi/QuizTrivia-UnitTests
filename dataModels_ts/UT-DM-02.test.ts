/**
 * Test Case ID: UT-DM-02
 * Description: Verify cleanQuizData: partial input -> giữ values cũ + fill remaining defaults
 * Source File: src/services/firebase/dataModels.ts
 * Source Line: 1-100 (Function cleanQuizData)
 */

import { cleanQuizData } from '../../dataModels';

describe('UT-DM-02', () => {
  it('Verify cleanQuizData: partial input -> giữ values cũ + fill remaining defaults', async () => {
    // 1. Test Data
    const input = { title: 'Old Title' };

    // 2. Test Function
    const result = cleanQuizData(input as any);

    // 3. Expected Result: Keeps old values, fills the rest
    expect(result.title).toBe('Old Title');
    expect(result.duration).toBe(15);
  });
});