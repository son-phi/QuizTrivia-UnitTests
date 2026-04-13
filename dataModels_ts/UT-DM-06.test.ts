/**
 * Test Case ID: UT-DM-06
 * Description: Verify cleanDataForFirestore: strip undefined, giu null
 * Source File: src/services/firebase/firestoreService.ts
 * Source Line: 515 (Function cleanDataForFirestore — recursive)
 * Technique: testChuan1
 * Notes: Mock firestoreService de tranh Firebase SDK crash trong jsdom
 */

// Mock Firebase config truoc khi import bat ky thu gi
jest.mock('../../../lib/firebase/config', () => ({
  db: {},
  auth: { onAuthStateChanged: jest.fn() },
  storage: {}
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
  Timestamp: { now: jest.fn(), fromDate: jest.fn() }
}));

import { cleanDataForFirestore } from '../../firestoreService';

describe('UT-DM-06', () => {
  it('Verify cleanDataForFirestore: strip undefined, giu null', () => {
    // 1. Test Data — nested object dung theo spec
    // input = { a: 1, b: undefined, c: { d: undefined, e: null } }
    const input = { a: 1, b: undefined, c: { d: undefined, e: null } };

    // 2. Test Function
    const result = cleanDataForFirestore(input);

    // 3. Expected Result: { a: 1, c: { e: null } }
    // - b bi xoa (undefined top-level)
    // - c.d bi xoa (undefined nested)
    // - c.e giu nguyen (null duoc giu)
    expect(result).not.toHaveProperty('b');
    expect(result.a).toBe(1);
    expect(result.c).toBeDefined();
    expect(result.c).not.toHaveProperty('d');
    expect(result.c).toHaveProperty('e', null);
  });
});