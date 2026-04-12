/**
 * Test Case ID: UT-AG-06
 * Description: Verify getDefaultPrompt: distribution 10 câu / 3 types → [4, 3, 3]
 * Source File: src/features/quiz/services/aiResponseParser.ts
 * Source Line: 36-40 (Distribution calculation: floor(N/types) + remainder)
 * Technique: testChuan2
 * Formula: floor(10/3)=3, remainder=1 → first type gets +1 → [4, 3, 3]
 */

import { getDefaultPrompt } from '../../aiResponseParser';

describe('UT-AG-06', () => {
  it('Verify getDefaultPrompt: distribution 10 câu / 3 types → [4, 3, 3]', () => {
    // 1. Test Data
    const numQuestions = 10;
    const questionTypes = ['multiple', 'boolean', 'short_answer'] as any;

    // 2. Test Function
    const result = getDefaultPrompt(numQuestions, 'medium', 'vi', questionTypes);

    // 3. Expected Result: prompt phải đề cập đúng phân bổ [4, 3, 3]
    // source :38-40: distributionStr = allowedTypes.map((t, i) => `${t}: ${base + (i < remainder ? 1 : 0)} câu`)
    expect(result).toContain('multiple: 4 câu');
    expect(result).toContain('boolean: 3 câu');
    expect(result).toContain('short_answer: 3 câu');
  });
});