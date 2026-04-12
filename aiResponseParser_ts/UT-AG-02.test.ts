/**
 * Test Case ID: UT-AG-02
 * Description: Verify parseQuestionsFromResponse: invalid array (empty) -> throw Error
 * Source File: src/features/quiz/services/aiResponseParser.ts
 */

import { parseQuestionsFromResponse } from '../../aiResponseParser';

describe('UT-AG-02', () => {
  it('Verify parseQuestionsFromResponse: invalid array (empty) -> throw Error', () => {
    expect(() => parseQuestionsFromResponse([])).toThrow('AI không trả về câu hỏi nào');
  });
});