/**
 * @jest-environment node
 *
 * Test Case ID: UT-DM-12
 * Description: Verify createPasswordHash: trả về { salt, hash } object đúng cấu trúc
 * Source File: src/lib/utils/passwordHash.ts
 * Source Line: 48-52 (Function createPasswordHash — async)
 * Notes: @jest-environment node để dùng webcrypto. hash = SHA256(salt + ':' + password)
 *        SHA-256 hex string luôn dài đúng 64 ký tự.
 */

import { webcrypto } from 'crypto';
if (!(globalThis as any).crypto?.subtle) {
  Object.defineProperty(globalThis, 'crypto', { value: webcrypto, writable: false });
}

import { createPasswordHash } from '../../../lib/utils/passwordHash';

describe('UT-DM-12', () => {
  it('Verify createPasswordHash: trả về { salt, hash } object đúng cấu trúc', async () => {
    // 1. Test Data
    const input = 'mypassword';

    // 2. Test Function — createPasswordHash là async (returns Promise<{salt, hash}>)
    const result = await createPasswordHash(input);

    // 3. Expected Result
    expect(result).toHaveProperty('salt');
    expect(result).toHaveProperty('hash');
    expect(typeof result.salt).toBe('string');
    expect(typeof result.hash).toBe('string');
    expect(result.salt.length).toBeGreaterThan(0);
    // SHA-256 hex output luôn là 64 ký tự
    expect(result.hash.length).toBe(64);
  });
});