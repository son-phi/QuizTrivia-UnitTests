/**
 * Test Case ID: UT-DM-01
 * Description: Verify cleanQuizData: empty input -> tất cả 24 default values
 * Source File: src/services/firebase/dataModels.ts
 * Source Line: 396-422 (Function cleanQuizData)
 */

import { cleanQuizData } from '../../dataModels';

describe('UT-DM-01', () => {
  it('Verify cleanQuizData: empty input -> tất cả 24 default values', () => {
    // 1. Test Data
    const input = {}; // empty input

    // 2. Test Function
    const result = cleanQuizData(input as any);

    // 3. Expected Result: tất cả 24 default fields phải đúng (từ source :396-422)
    // Primitive defaults
    expect(result.title).toBe('');
    expect(result.description).toBe('');
    expect(result.category).toBe('');
    expect(result.difficulty).toBe('medium');    // source: quiz.difficulty || 'medium'
    expect(result.duration).toBe(15);
    expect(result.imageUrl).toBeNull();
    expect(result.language).toBe('vi');
    expect(result.status).toBe('draft');
    // Boolean defaults
    expect(result.isPublished).toBe(false);
    expect(result.isPublic).toBe(true);
    expect(result.allowRetake).toBe(true);
    expect(result.showAnswers).toBe(true);
    expect(result.randomizeQuestions).toBe(false);
    expect(result.randomizeAnswers).toBe(false);
    // Numeric defaults
    expect(result.passingScore).toBe(60);
    expect(result.attempts).toBe(0);
    expect(result.completions).toBe(0);
    expect(result.averageScore).toBe(0);
    expect(result.totalPlayers).toBe(0);
    expect(result.rating).toBe(0);
    expect(result.reviewCount).toBe(0);
    // Array defaults
    expect(result.questions).toEqual([]);
    expect(result.resources).toEqual([]);
    expect(result.tags).toEqual([]);
  });
});