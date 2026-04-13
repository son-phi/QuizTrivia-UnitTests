/**
 * @jest-environment node
 *
 * Test Case ID: UT-DM-10
 * Description: Verify sha256: input cố định -> hash xác định (deterministic)
 * Source File: src/lib/utils/passwordHash.ts
 * Source Line: 11-17 (Function sha256 — async, uses Web Crypto API)
 * Notes: @jest-environment node để dùng Node.js crypto.subtle (jsdom không support)
 *        SHA-256('hello') = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
 */

import { webcrypto } from 'crypto';
// Polyfill cho Node.js test environment (crypto.subtle cần từ webcrypto)
if (!(globalThis as any).crypto?.subtle) {
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto, writable: false });
}

import { sha256 } from '../../../../lib/utils/passwordHash';

describe('UT-DM-10', () => {
  it('Verify sha256: input cố định -> hash xác định (deterministic)', async () => {
    // 1. Test Data — 'hello' có hash SHA-256 đã biết (verified offline)
    const input = 'hello';

    // 2. Test Function — sha256 là async (dùng Web Crypto API)
    const result = await sha256(input);

    // 3. Expected Result: hash SHA-256 cố định, deterministic
    expect(result).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });
});