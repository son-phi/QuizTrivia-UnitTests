/**
 * Test Case ID: UT-AG-01
 * Description: Verify parseQuestionsFromResponse: valid JSON array -> parse thành công
 * Source File: src/features/quiz/services/aiResponseParser.ts
 */

import { parseQuestionsFromResponse } from '../../aiResponseParser';

describe('UT-AG-01', () => {
  it('Verify parseQuestionsFromResponse: valid JSON array -> parse thành công', () => {
    const input = [
      { type: 'multiple', text: 'Q1', answers: [{ text: 'A', isCorrect: true }, { text: 'B', isCorrect: false }] }
    ];
    const result = parseQuestionsFromResponse(input);
    expect(result.length).toBe(1);
    expect(result[0].text).toBe('Q1');
  });
});