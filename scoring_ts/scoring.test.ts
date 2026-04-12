// ============================================================
// File: src/features/quiz/pages/QuizPage/hooks/__tests__/scoring.test.ts
// Module: Quiz Core — Scoring Logic
// TC IDs: UT-SC-01 to UT-SC-19
// Tester: Tư Sơn
// Extracted from: useQuizSession.ts (isAnswerCorrect, calculateScore)
//                 utils.ts (checkShortAnswer — called by isAnswerCorrect)
// Run: npx jest scoring.test.ts
// ============================================================

import { Question, AnswerValue, AnswerMap } from '../../../../types';

// ============================================================
// SECTION: Standalone pure functions extracted from useQuizSession.ts
// These are extracted here for unit testing without the React hook wrapper.
// ============================================================

/**
 * checkShortAnswer — extracted from utils.ts
 * Normalizes both sides: trim + lowercase + collapse whitespace.
 * Checks correctAnswer first, then acceptedAnswers[].
 */
const checkShortAnswer = (userAnswer: string, question: Question): boolean => {
  if (question.type !== 'short_answer') return false;

  const normalizeAnswer = (answer: string) =>
    answer.trim().toLowerCase().replace(/\s+/g, ' ');

  const normalizedUserAnswer = normalizeAnswer(userAnswer);

  if (question.correctAnswer && normalizeAnswer(question.correctAnswer) === normalizedUserAnswer) {
    return true;
  }

  if (question.acceptedAnswers) {
    return question.acceptedAnswers.some(
      (accepted) => normalizeAnswer(accepted) === normalizedUserAnswer
    );
  }

  return false;
};

/**
 * isAnswerCorrect — extracted from useQuizSession.ts
 * Core grading engine — handles all 11 question types.
 */
const isAnswerCorrect = (question: Question, userAnswer: AnswerValue): boolean => {
  if (userAnswer === undefined || userAnswer === null) {
    return false;
  }

  switch (question.type) {
    case 'boolean':
    case 'multiple':
    case 'image':
    case 'audio':
    case 'video':
    case 'multimedia': {
      const correctAnswerId = question.answers.find((a) => a.isCorrect)?.id;
      return userAnswer === correctAnswerId;
    }

    case 'checkbox': {
      const correctIds = question.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.id)
        .sort();
      const userIds = Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
      return JSON.stringify(correctIds) === JSON.stringify(userIds);
    }

    case 'short_answer': {
      if (typeof userAnswer === 'string') {
        return checkShortAnswer(userAnswer, question);
      }
      return false;
    }

    case 'ordering': {
      const userOrder = Array.isArray(userAnswer) ? userAnswer : [];
      const items = question.orderingItems || [];
      if (userOrder.length !== items.length) return false;
      const correctOrder = [...items]
        .sort((a, b) => a.correctOrder - b.correctOrder)
        .map((item) => item.id);
      return JSON.stringify(userOrder) === JSON.stringify(correctOrder);
    }

    case 'matching': {
      const userMatches =
        typeof userAnswer === 'object' && !Array.isArray(userAnswer)
          ? (userAnswer as Record<string, string>)
          : {};
      const pairs = question.matchingPairs || [];
      if (Object.keys(userMatches).length !== pairs.length) return false;
      return pairs.every((pair) => userMatches[pair.left] === pair.right);
    }

    case 'fill_blanks': {
      const userAnswers =
        typeof userAnswer === 'object' && !Array.isArray(userAnswer)
          ? (userAnswer as Record<string, string>)
          : {};
      const blanks = question.blanks || [];
      return blanks.every((blank) => {
        const userText = (userAnswers[blank.id] || '').trim();
        const correctText = blank.correctAnswer.trim();
        const matches = blank.caseSensitive
          ? userText === correctText
          : userText.toLowerCase() === correctText.toLowerCase();
        if (matches) return true;
        if (blank.acceptedAnswers && blank.acceptedAnswers.length > 0) {
          return blank.acceptedAnswers.some((accepted) =>
            blank.caseSensitive
              ? userText === accepted.trim()
              : userText.toLowerCase() === accepted.trim().toLowerCase()
          );
        }
        return false;
      });
    }

    default:
      return false;
  }
};

/**
 * calculateScore — extracted from useQuizSession.ts
 * Unanswered questions (key absent from answersMap) count as wrong.
 * Percentage = Math.round((correct / total) * 100); returns 0 when total = 0.
 */
const calculateScore = (
  questions: Question[],
  answersMap: AnswerMap
): { correct: number; total: number; percentage: number } => {
  let correctAnswers = 0;
  const totalQuestions = questions.length;

  questions.forEach((question) => {
    const userAnswer = answersMap[question.id];
    if (isAnswerCorrect(question, userAnswer)) {
      correctAnswers++;
    }
  });

  const percentage =
    totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  return {
    correct: correctAnswers,
    total: totalQuestions,
    percentage,
  };
};

// ============================================================
// TEST SUITES
// ============================================================

describe('isAnswerCorrect', () => {
  // ----------------------------------------------------------
  // MCQ / boolean / media — ID-based grading
  // ----------------------------------------------------------

  it('isAnswerCorrect_testChuan1_MCQ_correct_option_returns_true', () => {
    // TC: UT-SC-01 | testChuan1
    // Purpose: Kiểm tra câu hỏi trắc nghiệm một đáp án khi người dùng chọn đúng
    // Expected from spec: type='multiple' — compare userAnswer against the answer whose isCorrect===true

    // Khai báo input
    const mockQuestion = {
      id: 'q1',
      text: 'What is 2 + 2?',
      type: 'multiple',
      answers: [
        { id: 'a1', text: '3', isCorrect: false },
        { id: 'a2', text: '4', isCorrect: true },
        { id: 'a3', text: '5', isCorrect: false },
      ],
      points: 1,
    } as unknown as Question;
    const userAnswer: AnswerValue = 'a2';

    // Gọi hàm cần test
    const result = isAnswerCorrect(mockQuestion, userAnswer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(true);
  });

  it('isAnswerCorrect_testNgoaile1_MCQ_wrong_option_returns_false', () => {
    // TC: UT-SC-02 | testNgoaile1
    // Purpose: Kiểm tra câu hỏi trắc nghiệm một đáp án khi người dùng chọn sai
    // Expected from spec: type='multiple' — ID không khớp với isCorrect===true → false

    // Khai báo input
    const mockQuestion = {
      id: 'q2',
      text: 'What is 2 + 2?',
      type: 'multiple',
      answers: [
        { id: 'a1', text: '3', isCorrect: false },
        { id: 'a2', text: '4', isCorrect: true },
        { id: 'a3', text: '5', isCorrect: false },
      ],
      points: 1,
    } as unknown as Question;
    const userAnswer: AnswerValue = 'a3';

    // Gọi hàm cần test
    const result = isAnswerCorrect(mockQuestion, userAnswer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(false);
  });

  it('isAnswerCorrect_testChuan2_TrueFalse_correct_answer_returns_true', () => {
    // TC: UT-SC-03 | testChuan2
    // Purpose: Kiểm tra câu hỏi Đúng/Sai khi người dùng chọn đúng ID
    // Expected from spec: type='boolean' — dùng cùng logic ID-match với multiple

    // Khai báo input
    const mockQuestion = {
      id: 'q3',
      text: 'The sky is blue.',
      type: 'boolean',
      answers: [
        { id: 'true', text: 'True', isCorrect: true },
        { id: 'false', text: 'False', isCorrect: false },
      ],
      points: 1,
    } as unknown as Question;
    const userAnswer: AnswerValue = 'true';

    // Gọi hàm cần test
    const result = isAnswerCorrect(mockQuestion, userAnswer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(true);
  });

  it('isAnswerCorrect_testNgoaile2_TrueFalse_wrong_answer_returns_false', () => {
    // TC: UT-SC-04 | testNgoaile2
    // Purpose: Kiểm tra câu hỏi Đúng/Sai khi người dùng chọn sai ID
    // Expected from spec: type='boolean' — ID không khớp với isCorrect===true → false

    // Khai báo input
    const mockQuestion = {
      id: 'q4',
      text: 'The sky is blue.',
      type: 'boolean',
      answers: [
        { id: 'true', text: 'True', isCorrect: true },
        { id: 'false', text: 'False', isCorrect: false },
      ],
      points: 1,
    } as unknown as Question;
    const userAnswer: AnswerValue = 'false';

    // Gọi hàm cần test
    const result = isAnswerCorrect(mockQuestion, userAnswer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------
  // Ordering — all-or-nothing sequence match
  // ----------------------------------------------------------

  it('isAnswerCorrect_testChuan3_Ordering_exact_sequence_returns_true', () => {
    // TC: UT-SC-05 | testChuan3
    // Purpose: Kiểm tra câu hỏi sắp xếp khi người dùng sắp xếp đúng thứ tự
    // Expected from spec: type='ordering' — toàn bộ chuỗi phải khớp với correctOrder đã sắp xếp

    // Khai báo input
    const mockQuestion = {
      id: 'q5',
      text: 'Order the planets by distance from the Sun.',
      type: 'ordering',
      answers: [],
      points: 1,
      orderingItems: [
        { id: 'item1', text: 'Mercury', correctOrder: 0 },
        { id: 'item2', text: 'Venus', correctOrder: 1 },
        { id: 'item3', text: 'Earth', correctOrder: 2 },
      ],
    } as unknown as Question;
    const userAnswer: AnswerValue = ['item1', 'item2', 'item3'];

    // Gọi hàm cần test
    const result = isAnswerCorrect(mockQuestion, userAnswer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(true);
  });

  it('isAnswerCorrect_testNgoaile3_Ordering_one_wrong_position_returns_false', () => {
    // TC: UT-SC-06 | testNgoaile3
    // Purpose: Kiểm tra câu hỏi sắp xếp khi một mục bị đặt sai vị trí
    // Expected from spec: type='ordering' — all-or-nothing, sai một vị trí → toàn bộ false

    // Khai báo input
    const mockQuestion = {
      id: 'q6',
      text: 'Order the planets by distance from the Sun.',
      type: 'ordering',
      answers: [],
      points: 1,
      orderingItems: [
        { id: 'item1', text: 'Mercury', correctOrder: 0 },
        { id: 'item2', text: 'Venus', correctOrder: 1 },
        { id: 'item3', text: 'Earth', correctOrder: 2 },
      ],
    } as unknown as Question;
    const userAnswer: AnswerValue = ['item1', 'item3', 'item2']; // item2 và item3 bị hoán đổi

    // Gọi hàm cần test
    const result = isAnswerCorrect(mockQuestion, userAnswer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------
  // Matching — all-or-nothing pair match
  // ----------------------------------------------------------

  it('isAnswerCorrect_testChuan4_Matching_all_pairs_correct_returns_true', () => {
    // TC: UT-SC-07 | testChuan4
    // Purpose: Kiểm tra câu hỏi ghép cặp khi tất cả các cặp đều đúng
    // Expected from spec: type='matching' — mọi pair.left → pair.right phải khớp

    // Khai báo input
    const mockQuestion = {
      id: 'q7',
      text: 'Match the capitals.',
      type: 'matching',
      answers: [],
      points: 1,
      matchingPairs: [
        { id: 'p1', left: 'France', right: 'Paris' },
        { id: 'p2', left: 'Germany', right: 'Berlin' },
        { id: 'p3', left: 'Japan', right: 'Tokyo' },
      ],
    } as unknown as Question;
    const userAnswer: AnswerValue = {
      France: 'Paris',
      Germany: 'Berlin',
      Japan: 'Tokyo',
    };

    // Gọi hàm cần test
    const result = isAnswerCorrect(mockQuestion, userAnswer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(true);
  });

  it('isAnswerCorrect_testNgoaile4_Matching_one_pair_wrong_returns_false', () => {
    // TC: UT-SC-08 | testNgoaile4
    // Purpose: Kiểm tra câu hỏi ghép cặp khi có một cặp bị ghép sai
    // Expected from spec: type='matching' — all-or-nothing, sai một cặp → false

    // Khai báo input
    const mockQuestion = {
      id: 'q8',
      text: 'Match the capitals.',
      type: 'matching',
      answers: [],
      points: 1,
      matchingPairs: [
        { id: 'p1', left: 'France', right: 'Paris' },
        { id: 'p2', left: 'Germany', right: 'Berlin' },
        { id: 'p3', left: 'Japan', right: 'Tokyo' },
      ],
    } as unknown as Question;
    const userAnswer: AnswerValue = {
      France: 'Paris',
      Germany: 'Berlin',
      Japan: 'Osaka', // sai
    };

    // Gọi hàm cần test
    const result = isAnswerCorrect(mockQuestion, userAnswer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------
  // Checkbox — all-or-nothing exact set match
  // ----------------------------------------------------------

  it('isAnswerCorrect_testChuan5_Checkbox_exact_set_returns_true', () => {
    // TC: UT-SC-09 | testChuan5
    // Purpose: Kiểm tra câu hỏi checkbox khi chọn đúng tất cả các đáp án đúng
    // Expected from spec: type='checkbox' — tập hợp ID phải khớp hoàn toàn (so sánh sau khi sort)

    // Khai báo input
    const mockQuestion = {
      id: 'q9',
      text: 'Which of the following are prime numbers?',
      type: 'checkbox',
      answers: [
        { id: 'a1', text: '2', isCorrect: true },
        { id: 'a2', text: '4', isCorrect: false },
        { id: 'a3', text: '3', isCorrect: true },
        { id: 'a4', text: '6', isCorrect: false },
      ],
      points: 1,
    } as unknown as Question;
    const userAnswer: AnswerValue = ['a3', 'a1']; // thứ tự khác nhưng tập hợp đúng

    // Gọi hàm cần test
    const result = isAnswerCorrect(mockQuestion, userAnswer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(true);
  });

  it('isAnswerCorrect_testNgoaile5_Checkbox_partial_set_returns_false', () => {
    // TC: UT-SC-10 | testNgoaile5
    // Purpose: Kiểm tra câu hỏi checkbox khi chỉ chọn một phần đáp án đúng
    // Expected from spec: type='checkbox' — all-or-nothing, thiếu ID đúng → false

    // Khai báo input
    const mockQuestion = {
      id: 'q10',
      text: 'Which of the following are prime numbers?',
      type: 'checkbox',
      answers: [
        { id: 'a1', text: '2', isCorrect: true },
        { id: 'a2', text: '4', isCorrect: false },
        { id: 'a3', text: '3', isCorrect: true },
        { id: 'a4', text: '6', isCorrect: false },
      ],
      points: 1,
    } as unknown as Question;
    const userAnswer: AnswerValue = ['a1']; // thiếu a3

    // Gọi hàm cần test
    const result = isAnswerCorrect(mockQuestion, userAnswer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(false);
  });

  // ----------------------------------------------------------
  // Short answer — normalize + acceptedAnswers
  // ----------------------------------------------------------

  it('isAnswerCorrect_testChuan6_ShortAnswer_exact_match_returns_true', () => {
    // TC: UT-SC-11 | testChuan6
    // Purpose: Kiểm tra câu hỏi tự luận ngắn khi người dùng nhập đúng chính xác
    // Expected from spec: type='short_answer' — so sánh sau khi trim + lowercase + collapse spaces

    // Khai báo input
    const mockQuestion = {
      id: 'q11',
      text: 'What is the capital of France?',
      type: 'short_answer',
      answers: [],
      points: 1,
      correctAnswer: 'Paris',
    } as unknown as Question;
    const userAnswer: AnswerValue = 'Paris';

    // Gọi hàm cần test
    const result = isAnswerCorrect(mockQuestion, userAnswer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(true);
  });

  it('isAnswerCorrect_testChuan7_ShortAnswer_case_insensitive_returns_true', () => {
    // TC: UT-SC-12 | testChuan7
    // Purpose: Kiểm tra câu hỏi tự luận ngắn khi người dùng nhập đúng nhưng khác chữ hoa/thường
    // Expected from spec: checkShortAnswer normalizes cả hai vế về lowercase trước khi so sánh

    // Khai báo input
    const mockQuestion = {
      id: 'q12',
      text: 'What is the capital of France?',
      type: 'short_answer',
      answers: [],
      points: 1,
      correctAnswer: 'Paris',
    } as unknown as Question;
    const userAnswer: AnswerValue = 'PARIS';

    // Gọi hàm cần test
    const result = isAnswerCorrect(mockQuestion, userAnswer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(true);
  });

  it('isAnswerCorrect_testChuan8_ShortAnswer_trim_whitespace_returns_true', () => {
    // TC: UT-SC-13 | testChuan8
    // Purpose: Kiểm tra câu hỏi tự luận ngắn khi người dùng nhập đúng nhưng có khoảng trắng thừa
    // Expected from spec: checkShortAnswer gọi .trim() và collapse /\s+/ trước khi so sánh

    // Khai báo input
    const mockQuestion = {
      id: 'q13',
      text: 'What is the capital of France?',
      type: 'short_answer',
      answers: [],
      points: 1,
      correctAnswer: 'Paris',
    } as unknown as Question;
    const userAnswer: AnswerValue = '   Paris   ';

    // Gọi hàm cần test
    const result = isAnswerCorrect(mockQuestion, userAnswer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(true);
  });

  it('isAnswerCorrect_testChuan9_ShortAnswer_synonym_in_acceptedAnswers_returns_true', () => {
    // TC: UT-SC-14 | testChuan9
    // Purpose: Kiểm tra câu hỏi tự luận ngắn khi người dùng nhập từ đồng nghĩa trong acceptedAnswers
    // Expected from spec: checkShortAnswer kiểm tra acceptedAnswers[] sau khi không khớp correctAnswer

    // Khai báo input
    const mockQuestion = {
      id: 'q14',
      text: 'Name the largest ocean on Earth.',
      type: 'short_answer',
      answers: [],
      points: 1,
      correctAnswer: 'Pacific Ocean',
      acceptedAnswers: ['Pacific', 'the Pacific', 'Pacific ocean'],
    } as unknown as Question;
    const userAnswer: AnswerValue = 'the pacific';

    // Gọi hàm cần test
    const result = isAnswerCorrect(mockQuestion, userAnswer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(true);
  });

  it('isAnswerCorrect_testNgoaile6_ShortAnswer_wrong_answer_returns_false', () => {
    // TC: UT-SC-15 | testNgoaile6
    // Purpose: Kiểm tra câu hỏi tự luận ngắn khi người dùng nhập sai và không nằm trong acceptedAnswers
    // Expected from spec: checkShortAnswer trả về false khi không khớp correctAnswer lẫn acceptedAnswers

    // Khai báo input
    const mockQuestion = {
      id: 'q15',
      text: 'What is the capital of France?',
      type: 'short_answer',
      answers: [],
      points: 1,
      correctAnswer: 'Paris',
      acceptedAnswers: ['paris'],
    } as unknown as Question;
    const userAnswer: AnswerValue = 'London';

    // Gọi hàm cần test
    const result = isAnswerCorrect(mockQuestion, userAnswer);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toBe(false);
  });
});

// ============================================================

describe('calculateScore', () => {
  it('calculateScore_testChuan1_mixed_correct_answers_returns_correct_percentage', () => {
    // TC: UT-SC-16 | testChuan1
    // Purpose: Kiểm tra tính điểm với 7/10 câu đúng → percentage = 70
    // Expected from spec: percentage = Math.round((correct / total) * 100)

    // Khai báo input — 10 câu multiple choice, 7 câu trả lời đúng
    const buildMCQ = (id: string, correctId: string): Question =>
      ({
        id,
        text: `Question ${id}`,
        type: 'multiple',
        answers: [
          { id: `${correctId}`, text: 'Correct', isCorrect: true },
          { id: `${correctId}_wrong`, text: 'Wrong', isCorrect: false },
        ],
        points: 1,
      } as unknown as Question);

    const mockQuestions: Question[] = [
      buildMCQ('q1', 'c1'),
      buildMCQ('q2', 'c2'),
      buildMCQ('q3', 'c3'),
      buildMCQ('q4', 'c4'),
      buildMCQ('q5', 'c5'),
      buildMCQ('q6', 'c6'),
      buildMCQ('q7', 'c7'),
      buildMCQ('q8', 'c8'),
      buildMCQ('q9', 'c9'),
      buildMCQ('q10', 'c10'),
    ];

    const answersMap: AnswerMap = {
      q1: 'c1',        // đúng
      q2: 'c2',        // đúng
      q3: 'c3',        // đúng
      q4: 'c4',        // đúng
      q5: 'c5',        // đúng
      q6: 'c6',        // đúng
      q7: 'c7',        // đúng
      q8: 'c8_wrong',  // sai
      q9: 'c9_wrong',  // sai
      q10: 'c10_wrong', // sai
    };

    const expectedScore = { correct: 7, total: 10, percentage: 70 };

    // Gọi hàm cần test
    const result = calculateScore(mockQuestions, answersMap);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toEqual(expectedScore);
  });

  it('calculateScore_testChuan2_all_correct_returns_100_percent', () => {
    // TC: UT-SC-17 | testChuan2
    // Purpose: Kiểm tra điểm khi toàn bộ câu trả lời đúng → percentage = 100 (BVA upper bound)
    // Expected from spec: percentage = Math.round((correct / total) * 100) = 100 khi correct === total

    // Khai báo input
    const mockQuestions: Question[] = [
      {
        id: 'q1',
        text: 'Q1',
        type: 'multiple',
        answers: [
          { id: 'a1', text: 'Correct', isCorrect: true },
          { id: 'a2', text: 'Wrong', isCorrect: false },
        ],
        points: 1,
      } as unknown as Question,
      {
        id: 'q2',
        text: 'Q2',
        type: 'multiple',
        answers: [
          { id: 'b1', text: 'Correct', isCorrect: true },
          { id: 'b2', text: 'Wrong', isCorrect: false },
        ],
        points: 1,
      } as unknown as Question,
    ];

    const answersMap: AnswerMap = {
      q1: 'a1',
      q2: 'b1',
    };

    const expectedScore = { correct: 2, total: 2, percentage: 100 };

    // Gọi hàm cần test
    const result = calculateScore(mockQuestions, answersMap);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toEqual(expectedScore);
  });

  it('calculateScore_testChuan3_all_wrong_returns_0_percent', () => {
    // TC: UT-SC-18 | testChuan3
    // Purpose: Kiểm tra điểm khi toàn bộ câu trả lời sai → percentage = 0 (BVA lower bound)
    // Expected from spec: percentage = Math.round((0 / total) * 100) = 0

    // Khai báo input
    const mockQuestions: Question[] = [
      {
        id: 'q1',
        text: 'Q1',
        type: 'multiple',
        answers: [
          { id: 'a1', text: 'Correct', isCorrect: true },
          { id: 'a2', text: 'Wrong', isCorrect: false },
        ],
        points: 1,
      } as unknown as Question,
      {
        id: 'q2',
        text: 'Q2',
        type: 'multiple',
        answers: [
          { id: 'b1', text: 'Correct', isCorrect: true },
          { id: 'b2', text: 'Wrong', isCorrect: false },
        ],
        points: 1,
      } as unknown as Question,
    ];

    const answersMap: AnswerMap = {
      q1: 'a2',  // sai
      q2: 'b2',  // sai
    };

    const expectedScore = { correct: 0, total: 2, percentage: 0 };

    // Gọi hàm cần test
    const result = calculateScore(mockQuestions, answersMap);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toEqual(expectedScore);
  });

  it('calculateScore_testNgoaile1_unanswered_questions_count_as_wrong', () => {
    // TC: UT-SC-19 | testNgoaile1
    // Purpose: Kiểm tra rằng câu hỏi chưa trả lời (key không tồn tại trong answersMap) bị tính là sai
    // Expected from spec: userAnswer = undefined khi key vắng mặt → isAnswerCorrect trả false → không cộng điểm

    // Khai báo input — 3 câu, chỉ trả lời 1, bỏ qua 2
    const mockQuestions: Question[] = [
      {
        id: 'q1',
        text: 'Q1',
        type: 'multiple',
        answers: [
          { id: 'a1', text: 'Correct', isCorrect: true },
          { id: 'a2', text: 'Wrong', isCorrect: false },
        ],
        points: 1,
      } as unknown as Question,
      {
        id: 'q2',
        text: 'Q2',
        type: 'multiple',
        answers: [
          { id: 'b1', text: 'Correct', isCorrect: true },
          { id: 'b2', text: 'Wrong', isCorrect: false },
        ],
        points: 1,
      } as unknown as Question,
      {
        id: 'q3',
        text: 'Q3',
        type: 'multiple',
        answers: [
          { id: 'c1', text: 'Correct', isCorrect: true },
          { id: 'c2', text: 'Wrong', isCorrect: false },
        ],
        points: 1,
      } as unknown as Question,
    ];

    // q2 và q3 không có key trong answersMap → undefined → sai
    const answersMap: AnswerMap = {
      q1: 'a1', // đúng
      // q2: không có key
      // q3: không có key
    };

    const expectedScore = { correct: 1, total: 3, percentage: 33 };

    // Gọi hàm cần test
    const result = calculateScore(mockQuestions, answersMap);

    // Kiểm tra kết quả với expected output từ spec
    expect(result).toEqual(expectedScore);
  });
});
