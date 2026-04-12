/**
 * @jest-environment node
 *
 * Test Case ID: UT-DM-11
 * Description: Verify generateSalt: 2 lan goi -> 2 gia tri KHAC NHAU (unique)
 * Source File: src/lib/utils/passwordHash.ts
 * Source Line: 37-41 (Function generateSalt — crypto.getRandomValues)
 * Technique: testChuan1 — Randomness / uniqueness test
 * Notes: @jest-environment node cho phep dung Node.js webcrypto
 */

import { webcrypto } from 'crypto';
if (!(globalThis as any).crypto) {
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto, writable: false });
}

import { generateSalt } from '../../../lib/utils/passwordHash';

describe('UT-DM-11', () => {
  it('Verify generateSalt: 2 lan goi -> 2 gia tri KHAC NHAU (unique)', () => {
    // 1. Test Data — goi 2 lan lien tiep
    const s1 = generateSalt();
    const s2 = generateSalt();

    // 2. Expected Result: moi lan generate ra string khac nhau (unique per call)
    expect(s1).not.toBe(s2);
    expect(typeof s1).toBe('string');
    expect(s1.length).toBeGreaterThan(0);
    expect(typeof s2).toBe('string');
    expect(s2.length).toBeGreaterThan(0);
  });
});