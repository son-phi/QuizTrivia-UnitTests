/**
 * Test Case ID: UT-DM-17
 * Description: Test isUserProfile type guard
 * Source File: src/services/firebase/dataModels.ts
 * Source Line: 386
 * Technique: Phân vùng tương đương (Valid/Invalid Object)
 */

import { isUserProfile } from '../../dataModels';

describe('UT-DM-17: Test isUserProfile type guard', () => {
  it('should return true for valid UserProfile object', () => {
    // 1. Dữ liệu test (Test Data) - Object chứa đầy đủ uid và email kiểu string
    const validUser = { uid: 'user123', email: 'test@gmail.com', displayName: 'Test' };
    
    // 2. Hàm test (Test Function) & 3. Kết quả mong đợi (Expected Result)
    expect(isUserProfile(validUser)).toBe(true);
  });

  it('should return false for invalid object missing uid', () => {
    // 1. Dữ liệu test - Object bị thiếu trường bắt buộc (uid)
    const invalidUser = { email: 'test@gmail.com' };
    
    // 2 & 3. Gọi hàm và mong đợi trả về false
    expect(isUserProfile(invalidUser)).toBe(false);
  });

  it('should return false for null data', () => {
    // 1. Dữ liệu test - Dữ liệu là null
    // 2 & 3. Gọi hàm và mong đợi trả về falsy (false hoặc null) để không sập app
    expect(isUserProfile(null)).toBeFalsy();
  });
});
