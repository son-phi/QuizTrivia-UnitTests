/**
 * Test Case ID: UT-DM-07
 * Description: Verify cleanDataForFirestore: de quy qua nested arrays
 * Source File: src/services/firebase/firestoreService.ts
 * Source Line: 515 (Function cleanDataForFirestore — recursive)
 * Technique: testChuan2
 * Notes: Mock Firebase SDK de tranh crash trong jsdom
 */

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

describe('UT-DM-07', () => {
  it('Verify cleanDataForFirestore: de quy qua nested arrays', () => {
    // 1. Test Data — undefined trong object-item cua array bi xoa, primitive giu nguyen
    const input = { items: [{ x: 1, y: undefined }, { x: 2 }] };

    // 2. Test Function
    const result = cleanDataForFirestore(input);

    // 3. Expected Result: undefined trong object bi xoa
    expect(result.items[0]).not.toHaveProperty('y');
    expect(result.items[0].x).toBe(1);
    expect(result.items[1].x).toBe(2);
  });
});