/**
 * Test Case ID: UT-AG-10
 * Description: Verify parseAIResponseJSON: format {questions: [...]} -> parse thanh cong
 * Source File: functions/src/lib/aiResponseParser.ts
 * Source Line: 21-22 (else if parsed.questions && Array.isArray -> parsedQuestions = parsed.questions)
 * Technique: testChuan — object wrapper format branch
 * Notes: AI doi khi tra ve {questions: [...]} thay vi [...] truc tiep
 */

import { parseAIResponseJSON } from '../../aiResponseParser';

describe('UT-AG-10', () => {
  it('Verify parseAIResponseJSON: {questions:[...]} format -> parse thanh cong', () => {
    // 1. Test Data — AI tra ve object co truong questions thay vi array truc tiep
    const rawText = '{"questions":[{"type":"multiple","text":"Q?"}]}';

    // 2. Test Function
    const result = parseAIResponseJSON(rawText);

    // 3. Expected Result: lay dung mang tu truong questions
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('multiple');
  });
});
