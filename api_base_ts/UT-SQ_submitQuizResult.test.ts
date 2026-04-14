/**
 * ============================================================
 * FILE: UT-SQ_submitQuizResult.test.ts
 * MODULE: Quiz CRUD — Validation trước DB write + CheckDB
 * SOURCE: src/features/quiz/api/base.ts → submitQuizResult (lines 235-320)
 * TESTER: M4
 * TOTAL TCs: 7  (UT-SQ-01 → UT-SQ-07)
 *
 * STRATEGY:
 *   - Mock firebase/firestore (addDoc) và services/quizStatsService
 *   - Test validation paths TRƯỚC khi addDoc được gọi
 *   - Xác nhận CheckDB: addDoc gọi / không gọi theo expectations
 * ============================================================
 */

// ─── Mocks for Firebase (đã có trong setupTests.ts toàn cục) ──────────
// setupTests.ts đã mock 'firebase/firestore' và 'react-toastify'
// Thêm mock cho lib/firebase/config và quizStatsService ──────────────
jest.mock('../lib/firebase/config', () => ({
  db: {},
}));

jest.mock('../services/quizStatsService', () => ({
  quizStatsService: {
    trackCompletion: jest.fn().mockResolvedValue(undefined),
  },
}));

// ─── Lazy import after mocks ──────────────────────────────────────────
import { addDoc } from 'firebase/firestore';
import { submitQuizResult } from '../features/quiz/api/base';
import { QuizResult } from '../features/quiz/types';

// Cast addDoc as Jest mock so we can configure it
const mockAddDoc = addDoc as jest.Mock;

// ─── Helper: valid result object ─────────────────────────────────────
type QuizResultInput = Omit<QuizResult, 'id'>;

const validResult: QuizResultInput = {
  userId: 'user_abc',
  quizId: 'quiz_xyz',
  score: 80,
  correctAnswers: 4,
  totalQuestions: 5,
  timeSpent: 300,
  answers: [
    { questionId: 'q1', selectedAnswerId: 'a1', isCorrect: true, timeSpent: 60 },
    { questionId: 'q2', selectedAnswerId: 'a2', isCorrect: true, timeSpent: 60 },
    { questionId: 'q3', selectedAnswerId: 'a3', isCorrect: true, timeSpent: 60 },
    { questionId: 'q4', selectedAnswerId: 'a4', isCorrect: true, timeSpent: 60 },
    { questionId: 'q5', selectedAnswerId: 'a5', isCorrect: false, timeSpent: 60 },
  ],
  completedAt: new Date(),
};

// ============================================================
describe('submitQuizResult — base.ts', () => {
  beforeEach(() => {
    mockAddDoc.mockReset();
    // Default happy-path: addDoc resolves with fake doc reference
    mockAddDoc.mockResolvedValue({ id: 'doc_001' });
  });

  // UT-SQ-01 testChuan1 — Valid result → ghi đúng fields vào Firestore (CheckDB)
  it('UT-SQ-01 | Valid result → trả về docId + ghi đúng fields vào Firestore (CheckDB)', async () => {
    const docId = await submitQuizResult(validResult);

    // Returns docId
    expect(docId).toBe('doc_001');

    // ★ CheckDB: addDoc được gọi đúng 1 lần
    expect(mockAddDoc).toHaveBeenCalledTimes(1);

    // ★ CheckDB: args chứa đúng các fields: userId, quizId, score, correctAnswers, answers
    const callArgs = mockAddDoc.mock.calls[0];
    const writtenData = callArgs[1];
    expect(writtenData).toMatchObject({
      userId: 'user_abc',
      quizId: 'quiz_xyz',
      score: 80,
      correctAnswers: 4,
    });
    expect(Array.isArray(writtenData.answers)).toBe(true);
  });

  // UT-SQ-02 testChuan2 — score=0 (boundary lower) → valid, không throw
  it('UT-SQ-02 | score=0 (boundary lower) → still valid per spec, addDoc được gọi với score=0', async () => {
    const payload: QuizResultInput = { ...validResult, score: 0, correctAnswers: 0 };
    const docId = await submitQuizResult(payload);

    expect(docId).toBe('doc_001');
    // ★ CheckDB: addDoc được gọi với score=0
    expect(mockAddDoc).toHaveBeenCalledTimes(1);
    const writtenData = mockAddDoc.mock.calls[0][1];
    expect(writtenData.score).toBe(0);
  });

  // UT-SQ-03 testNgoale1 — thiếu userId → validation error TRƯỚC khi gọi DB
  it('UT-SQ-03 | Thiếu userId → throws validation error; mockAddDoc KHÔNG được gọi', async () => {
    const payload = { ...validResult, userId: '' };

    await expect(submitQuizResult(payload)).rejects.toThrow();

    // ★ CheckDB: addDoc KHÔNG được gọi khi validation thất bại
    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  // UT-SQ-04 testNgoale2 — thiếu quizId → validation error
  it('UT-SQ-04 | Thiếu quizId → throws; mockAddDoc KHÔNG được gọi', async () => {
    const payload = { ...validResult, quizId: '' };

    await expect(submitQuizResult(payload)).rejects.toThrow();

    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  // UT-SQ-05 testNgoale3 — score=150 (ngoài range 0-100) → throws
  it('UT-SQ-05 | score=150 (max=100, so invalid) → throws; mockAddDoc KHÔNG được gọi', async () => {
    const payload = { ...validResult, score: 150 };

    await expect(submitQuizResult(payload)).rejects.toThrow(/0-100|điểm số/i);

    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  // UT-SQ-06 testNgoale4 — correctAnswers > totalQuestions → throws (logic integrity)
  it('UT-SQ-06 | correctAnswers=6 > totalQuestions=5 → throws logic integrity error', async () => {
    const payload: QuizResultInput = {
      ...validResult,
      correctAnswers: 6,
      totalQuestions: 5,
      score: 100,
    };

    await expect(submitQuizResult(payload)).rejects.toThrow(/tổng số câu|correctAnswers/i);

    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  // UT-SQ-07 testNgoale5 — answers không phải Array → throws
  it('UT-SQ-07 | answers là string thay vì Array → throws; mockAddDoc KHÔNG được gọi', async () => {
    const payload = { ...validResult, answers: 'not-array' as any };

    await expect(submitQuizResult(payload)).rejects.toThrow();

    expect(mockAddDoc).not.toHaveBeenCalled();
  });
});
