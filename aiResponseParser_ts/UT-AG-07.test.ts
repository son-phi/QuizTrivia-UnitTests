/**
 * Test Case ID: UT-AG-07
 * Description: Verify parseAIResponseJSON: JSON array thuần → parsed thành công
 * Source File: functions/src/lib/aiResponseParser.ts
 * Source Line: 1-51 (Function parseAIResponseJSON)
 * Technique: testChuan1
 * Notes: Cloud Function parser — khác với client-side parseQuestionsFromResponse
 */

import { parseAIResponseJSON } from '../../aiResponseParser';

describe('UT-AG-07', () => {
  it('Verify parseAIResponseJSON: JSON array thuần → parsed thành công', () => {
    // 1. Test Data — clean JSON array string (không có markdown code block)
    const rawText = '[{"type":"multiple","text":"Q?"}]';

    // 2. Test Function
    const result = parseAIResponseJSON(rawText);

    // 3. Expected Result: parse thành công, trả về array đúng
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('multiple');
    expect(result[0].text).toBe('Q?');
  });
});