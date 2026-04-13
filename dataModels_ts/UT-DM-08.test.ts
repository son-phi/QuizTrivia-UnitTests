/**
 * Test Case ID: UT-DM-08
 * Description: Verify cleanDoublePTags: <p><p>text</p></p> -> <p>text</p>
 * Source File: src/utils/htmlUtils.ts
 * Source Line: 54-67 (Function cleanDoublePTags — regex-based transformation)
 * Technique: testChuan1 — regex transformation test
 * Notes: Import ham that tu source, khong dung inline regex
 */

import { cleanDoublePTags } from '../../../../utils/htmlUtils';

describe('UT-DM-08', () => {
  it('Verify cleanDoublePTags: <p><p>text</p></p> -> <p>text</p>', () => {
    // 1. Test Data — double nested paragraph tags
    const input = '<p><p>text</p></p>';

    // 2. Test Function — goi ham that tu htmlUtils.ts
    const result = cleanDoublePTags(input);

    // 3. Expected Result: double tags duoc gop lai thanh 1
    expect(result).toBe('<p>text</p>');
  });

  it('Verify cleanDoublePTags: <p></p> -> "" (empty paragraph bi xoa)', () => {
    // Luu y them tu source: buoc cuoi xoa <p></p> rong
    const result = cleanDoublePTags('<p></p>');
    expect(result).toBe('');
  });
});