/**
 * Test Case ID: UT-AG-05
 * Description: Verify getDefaultPrompt: output chứa 'EXACTLY N' (N = numQuestions)
 * Source File: src/features/quiz/services/aiResponseParser.ts
 * Source Line: 62-64 (Return string contains "EXACTLY ${numQuestions}")
 * Technique: testChuan1
 */

import { getDefaultPrompt } from '../../aiResponseParser';

describe('UT-AG-05', () => {
  it("Verify getDefaultPrompt: output chua 'EXACTLY 10' (numQuestions = 10)", () => {
    // 1. Test Data
    const numQuestions = 10;
    const difficulty = 'medium';
    const language = 'vi';
    const questionTypes = ['multiple'];

    // 2. Test Function
    const result = getDefaultPrompt(numQuestions, difficulty, language, questionTypes);

    // 3. Expected Result: output phai chua 'EXACTLY 10' va ngon ngu tieng Viet
    expect(result).toContain('EXACTLY 10');
    expect(result).toContain('tiếng Việt');
  });
});