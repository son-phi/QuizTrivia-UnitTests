// ============================================================
// File: src/features/quiz/pages/QuizPage/__tests__/utils.test.ts
// Module: Quiz Core — QuizPage Utility Functions
// TC IDs: UT-QU-01 to UT-QU-10
// Tester: Son Phi
// Source: src/features/quiz/pages/QuizPage/utils.ts
// ============================================================

import { checkShortAnswer, isAnswerProvided } from '../utils';
import { Question, AnswerValue } from '../../../types';

// ============================================================
// describe: checkShortAnswer
// Pure function — no mocks required
// ============================================================

describe('checkShortAnswer', () => {

  it('checkShortAnswer_testChuan1_exact_match_returns_true', () => {
    // TC: UT-QU-01 | testChuan1
    // Mục tiêu: Kiểm tra khi userAnswer khớp chính xác với correctAnswer (cùng chữ hoa/thường)
    // Expected từ spec: normalizeAnswer(correctAnswer) === normalizeAnswer(userAnswer) → return true

    // Khai báo input
    const mockQuestion = {
      id: 'q1',
      type: 'short_answer',
      text: 'What is the capital of France?',
      answers: [],
      points: 1,
      correctAnswer: 'Paris',
    } as unknown as Question;
    const userAnswer = 'Paris';

    // Gọi hàm cần test
    const result = checkShortAnswer(userAnswer, mockQuestion);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(true);
  });

  it('checkShortAnswer_testChuan2_case_insensitive_match_returns_true', () => {
    // TC: UT-QU-02 | testChuan2
    // Mục tiêu: Kiểm tra so sánh không phân biệt chữ hoa/thường (case-insensitive)
    // Expected từ spec: normalizeAnswer() gọi .toLowerCase() trước khi so sánh → 'PARIS' === 'paris' → true

    // Khai báo input
    const mockQuestion = {
      id: 'q2',
      type: 'short_answer',
      text: 'What is the capital of France?',
      answers: [],
      points: 1,
      correctAnswer: 'Paris',
    } as unknown as Question;
    const userAnswer = 'PARIS';

    // Gọi hàm cần test
    const result = checkShortAnswer(userAnswer, mockQuestion);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(true);
  });

  it('checkShortAnswer_testChuan3_whitespace_trimmed_returns_true', () => {
    // TC: UT-QU-03 | testChuan3
    // Mục tiêu: Kiểm tra khoảng trắng đầu/cuối được loại bỏ trước khi so sánh
    // Expected từ spec: normalizeAnswer() gọi .trim() → '  paris  ' trở thành 'paris' → khớp 'Paris' → true

    // Khai báo input
    const mockQuestion = {
      id: 'q3',
      type: 'short_answer',
      text: 'What is the capital of France?',
      answers: [],
      points: 1,
      correctAnswer: 'Paris',
    } as unknown as Question;
    const userAnswer = '  paris  ';

    // Gọi hàm cần test
    const result = checkShortAnswer(userAnswer, mockQuestion);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(true);
  });

  it('checkShortAnswer_testChuan4_synonym_in_acceptedAnswers_returns_true', () => {
    // TC: UT-QU-04 | testChuan4
    // Mục tiêu: Kiểm tra khi userAnswer khớp với một từ trong danh sách acceptedAnswers
    // Expected từ spec: question.acceptedAnswers.some(accepted => normalize(accepted) === normalize(userAnswer)) → true

    // Khai báo input
    const acceptedAnswers = ['automobile', 'car'];
    const mockQuestion = {
      id: 'q4',
      type: 'short_answer',
      text: 'What is another word for a motor vehicle?',
      answers: [],
      points: 1,
      correctAnswer: 'car',
      acceptedAnswers,
    } as unknown as Question;
    const userAnswer = 'automobile';

    // Gọi hàm cần test
    const result = checkShortAnswer(userAnswer, mockQuestion);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(true);
  });

  it('checkShortAnswer_testNgoaile1_wrong_answer_not_in_any_list_returns_false', () => {
    // TC: UT-QU-05 | testNgoaile1
    // Mục tiêu: Kiểm tra khi userAnswer sai hoàn toàn, không khớp correctAnswer lẫn acceptedAnswers
    // Expected từ spec: correctAnswer không khớp, acceptedAnswers.some() trả về false → hàm trả về false

    // Khai báo input
    const mockQuestion = {
      id: 'q5',
      type: 'short_answer',
      text: 'What is the capital of France?',
      answers: [],
      points: 1,
      correctAnswer: 'Paris',
      acceptedAnswers: [],
    } as unknown as Question;
    const userAnswer = 'London';

    // Gọi hàm cần test
    const result = checkShortAnswer(userAnswer, mockQuestion);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(false);
  });

});

// ============================================================
// describe: isAnswerProvided
// Pure function — no mocks required
// ============================================================

describe('isAnswerProvided', () => {

  it('isAnswerProvided_testChuan1_non_empty_string_returns_true', () => {
    // TC: UT-QU-06 | testChuan1
    // Mục tiêu: Kiểm tra chuỗi không rỗng được coi là đã cung cấp đáp án
    // Expected từ spec: typeof answer === 'string' && answer.trim().length > 0 → return true

    // Khai báo input
    const answer: AnswerValue = 'A';

    // Gọi hàm cần test
    const result = isAnswerProvided(answer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(true);
  });

  it('isAnswerProvided_testChuan2_non_empty_array_returns_true', () => {
    // TC: UT-QU-07 | testChuan2
    // Mục tiêu: Kiểm tra mảng không rỗng được coi là đã cung cấp đáp án
    // Expected từ spec: Array.isArray(answer) && answer.length > 0 → return true

    // Khai báo input
    const answer: AnswerValue = ['A', 'B'];

    // Gọi hàm cần test
    const result = isAnswerProvided(answer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(true);
  });

  it('isAnswerProvided_testNgoaile1_undefined_returns_false', () => {
    // TC: UT-QU-08 | testNgoaile1
    // Mục tiêu: Kiểm tra giá trị undefined được coi là chưa cung cấp đáp án
    // Expected từ spec: answer === undefined → return false (nhánh đầu tiên của hàm)

    // Khai báo input
    const answer: AnswerValue = undefined as unknown as AnswerValue;

    // Gọi hàm cần test
    const result = isAnswerProvided(answer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(false);
  });

  it('isAnswerProvided_testNgoaile2_empty_string_returns_false', () => {
    // TC: UT-QU-09 | testNgoaile2
    // Mục tiêu: Kiểm tra chuỗi rỗng được coi là chưa cung cấp đáp án
    // Expected từ spec: typeof answer === 'string' && answer.trim().length === 0 → return false

    // Khai báo input
    const answer: AnswerValue = '';

    // Gọi hàm cần test
    const result = isAnswerProvided(answer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(false);
  });

  it('isAnswerProvided_testNgoaile3_empty_array_returns_false', () => {
    // TC: UT-QU-10 | testNgoaile3
    // Mục tiêu: Kiểm tra mảng rỗng được coi là chưa cung cấp đáp án
    // Expected từ spec: Array.isArray(answer) && answer.length === 0 → return false

    // Khai báo input
    const answer: AnswerValue = [];

    // Gọi hàm cần test
    const result = isAnswerProvided(answer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(false);
  });

});
