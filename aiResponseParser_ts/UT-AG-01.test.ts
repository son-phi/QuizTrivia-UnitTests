/**
 * Test Case ID: UT-AG-01
 * Description: Verify MCQ hợp lệ -> trả về Question[] với đúng structure
 * Source File: src/features/quiz/services/aiResponseParser.ts
 * Source Line: (parseQuestionsFromResponse — answer mapping)
 * Technique: testChuan1
 * Notes: Spec ghi id='a_0' nhung code dung index+1 => id='a_1', 'a_2'
 *        points = questionData.points || 10 (default 10 neu khong co points)
 */

import { parseQuestionsFromResponse } from '../../aiResponseParser';

describe('UT-AG-01', () => {
  it('Verify parseQuestionsFromResponse: valid MCQ -> tra ve Question[] dung structure', () => {
    // 1. Test Data — MCQ hop le voi 2 answers
    const input = [
      {
        type: 'multiple',
        text: 'What is JSX?',
        answers: [
          { text: 'JavaScript XML', isCorrect: true },
          { text: 'Java XML', isCorrect: false }
        ]
      }
    ];

    // 2. Test Function
    const result = parseQuestionsFromResponse(input);

    // 3. Expected Result
    expect(result.length).toBe(1);
    expect(result[0].text).toBe('What is JSX?');
    expect(result[0].type).toBe('multiple');

    // Auto-generated answer IDs: a_1, a_2 (source: `a_${index + 1}`)
    // NOTE: Spec ghi 'a_0' nhung code thuc te dung index+1 => 'a_1'
    expect(result[0].answers[0].id).toBe('a_1');
    expect(result[0].answers[1].id).toBe('a_2');

    // Default points = 10 (source: questionData.points || 10)
    expect(result[0].points).toBe(10);
  });
});