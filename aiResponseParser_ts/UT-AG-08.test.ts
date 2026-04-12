/**
 * Test Case ID: UT-AG-08
 * Description: Verify parseAIResponseJSON: JSON bị cắt → throw với message rõ ràng
 * Source File: functions/src/lib/aiResponseParser.ts
 * Source Line: 39-48 (catch block — throw với message + preview)
 * Technique: testNgoaile1
 * Notes: Root cause — 30 câu hỏi vượt token limit → JSON bị truncate giữa chừng.
 *        Code đã được extract với throw. TC test theo SPEC (throw), không silent fail.
 */

import { parseAIResponseJSON } from '../../aiResponseParser';

describe('UT-AG-08', () => {
  it('Verify parseAIResponseJSON: JSON bị cắt → throw với message rõ ràng', () => {
    // 1. Test Data — JSON bị truncate giữa chừng (simulate token limit exceeded)
    const rawText = '[{"question":"Q1","ques';

    // 2. Test Function — phải throw (không được silent fail)
    // 3. Expected Result: ném ra Error với message mô tả parse failure
    expect(() => parseAIResponseJSON(rawText)).toThrow();
    expect(() => parseAIResponseJSON(rawText)).toThrow(/parse/i);
  });
});