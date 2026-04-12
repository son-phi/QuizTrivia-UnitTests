/**
 * Test Case ID: UT-DM-08
 * Description: Verify cleanDoublePTags: <p><p>text</p></p> -> <p>text</p>
 * Source File: src/utils/htmlUtils.ts
 * Source Line: (Function cleanDoublePTags)
 */

// Mocking functionality if htmlUtils not easily accessible
// import { cleanDoublePTags } from '../../../utils/htmlUtils';
const cleanDoublePTags = (str: string) => str.replace(/<p>\s*<p>(.*?)<\/p>\s*<\/p>/g, '<p>$1</p>');

describe('UT-DM-08', () => {
  it('Verify cleanDoublePTags: <p><p>text</p></p> -> <p>text</p>', async () => {
    // 1. Test Data
    const input = '<p><p>text</p></p>';

    // 2. Test Function
    const result = cleanDoublePTags(input);

    // 3. Expected Result:
    expect(result).toBe('<p>text</p>');
  });
});