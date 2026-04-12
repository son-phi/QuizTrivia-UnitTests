/**
 * Test Case ID: UT-AG-03
 * Description: Verify parseQuestionsFromResponse: valid format but missing required fields -> filter invalid
 * Source File: src/features/quiz/services/aiResponseParser.ts
 */

import { parseQuestionsFromResponse } from '../../aiResponseParser';

describe('UT-AG-03', () => {
  it('Verify parseQuestionsFromResponse: valid format but missing required fields -> filter invalid', () => {
    const input = [
      { type: 'multiple', text: '' } // Missing text and answers
    ];
    expect(() => parseQuestionsFromResponse(input)).toThrow('Không có câu hỏi hợp lệ nào');
  });
});