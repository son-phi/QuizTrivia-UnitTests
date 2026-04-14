/**
 * ============================================================
 * FILE: UT-FL_quizFilters.test.ts
 * MODULE: Quiz CRUD — Role-based visibility + Client-side filters
 * SOURCE: src/features/quiz/api/shared.ts [applyQuizFilters]
 *         src/features/quiz/api/creator.ts [filterCreatorQuizzes logic]
 *         src/features/quiz/api/user.ts    [filterUserQuizzes logic]
 * TESTER: M4
 * TOTAL TCs: 8  (UT-FL-01 → UT-FL-08)
 * ============================================================
 */

// ─── Jest hoists these mocks before any imports ──────────────
// Mock the firebase config so module-level firebase setup doesn't fail
jest.mock('../lib/firebase/config', () => ({
  db: {},
  auth: {},
  app: {},
}));

// Ensure firebase/auth mock includes all needed functions
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  setPersistence: jest.fn(() => Promise.resolve()),
  browserLocalPersistence: {},
}));

import { applyQuizFilters } from '../features/quiz/api/shared';
import { Quiz, QuizFilters } from '../features/quiz/types';

// ─── Helper: tạo mock quiz ────────────────────────────────
const makeQuiz = (overrides: Partial<Quiz> = {}): Quiz => ({
  id: 'q1',
  title: 'Test Quiz',
  description: 'A test quiz',
  category: 'math',
  difficulty: 'easy',
  questions: [],
  duration: 10,
  createdBy: 'u1',
  createdAt: new Date(),
  updatedAt: new Date(),
  isPublished: true,
  tags: [],
  status: 'approved',
  ...overrides,
});

// ─── Inline extract: filterCreatorQuizzes (logic từ creator.ts) ──────
const filterCreatorQuizzes = (quizzes: Quiz[], userId: string): Quiz[] =>
  quizzes.filter((quiz) => {
    if (quiz.createdBy === userId) return true;
    if (quiz.status === 'approved' && quiz.isPublished === true) return true;
    return false;
  });

// ─── Inline extract: filterUserQuizzes (logic từ user.ts) ─────────────
const filterUserQuizzes = (quizzes: Quiz[]): Quiz[] =>
  quizzes.filter(
    (quiz) => quiz.status === 'approved' && quiz.isPublished === true,
  );

// ============================================================
// NHÓM 1 — applyQuizFilters()  (UT-FL-01 → UT-FL-04)
// ============================================================
describe('applyQuizFilters — shared.ts', () => {
  const quizzes: Quiz[] = [
    makeQuiz({ id: 'q1', category: 'math', difficulty: 'easy' }),
    makeQuiz({ id: 'q2', category: 'science', difficulty: 'hard' }),
    makeQuiz({ id: 'q3', category: 'math', difficulty: 'hard' }),
  ];

  // UT-FL-01 testChuan1
  it('UT-FL-01 | Pure filter: lọc đúng category=math', () => {
    const filters: QuizFilters = { category: 'math' };
    const result = applyQuizFilters(quizzes, filters);

    expect(result.length).toBe(2);
    result.forEach((q) => expect(q.category).toBe('math'));
  });

  // UT-FL-02 testChuan2
  it('UT-FL-02 | Pure filter: lọc đúng difficulty=hard', () => {
    const filters: QuizFilters = { difficulty: 'hard' };
    const result = applyQuizFilters(quizzes, filters);

    expect(result.length).toBe(2);
    result.forEach((q) => expect(q.difficulty).toBe('hard'));
  });

  // UT-FL-03 testChuan3 (Pairwise AND condition)
  it('UT-FL-03 | AND condition: category=math AND difficulty=hard → chỉ trả về q3', () => {
    const filters: QuizFilters = { category: 'math', difficulty: 'hard' };
    const result = applyQuizFilters(quizzes, filters);

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('q3');
    expect(result[0].category).toBe('math');
    expect(result[0].difficulty).toBe('hard');
  });

  // UT-FL-04 testNgoale1
  it('UT-FL-04 | filters=undefined → trả về tất cả (no change)', () => {
    const result = applyQuizFilters(quizzes, undefined);

    expect(result).toHaveLength(quizzes.length);
    expect(result.map((q) => q.id)).toEqual(['q1', 'q2', 'q3']);
  });
});

// ============================================================
// NHÓM 2 — filterCreatorQuizzes()  (UT-FL-05 → UT-FL-07)
// ============================================================
describe('filterCreatorQuizzes — creator.ts logic', () => {
  const u1 = 'u1';

  // UT-FL-05 testChuan1
  it("UT-FL-05 | Creator thấy quiz CỦA MÌNH dù status='draft'", () => {
    const quizzes: Quiz[] = [
      makeQuiz({ id: 'q_own_draft', createdBy: u1, status: 'draft', isPublished: false }),
    ];
    const result = filterCreatorQuizzes(quizzes, u1);

    expect(result.length).toBe(1);
    expect(result[0].createdBy).toBe(u1);
    expect(result[0].status).toBe('draft');
  });

  // UT-FL-06 testChuan2
  it('UT-FL-06 | Creator thấy quiz người khác nếu approved+published', () => {
    const quizzes: Quiz[] = [
      makeQuiz({ id: 'q_other_approved', createdBy: 'u2', status: 'approved', isPublished: true }),
    ];
    const result = filterCreatorQuizzes(quizzes, u1);

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('q_other_approved');
  });

  // UT-FL-07 testNgoale1
  it('UT-FL-07 | Creator KHÔNG thấy quiz người khác nếu chưa approved (pending)', () => {
    const quizzes: Quiz[] = [
      makeQuiz({ id: 'q_other_pending', createdBy: 'u2', status: 'pending', isPublished: false }),
    ];
    const result = filterCreatorQuizzes(quizzes, u1);

    expect(result.length).toBe(0);
  });
});

// ============================================================
// NHÓM 3 — filterUserQuizzes()  (UT-FL-08)
// ============================================================
describe('filterUserQuizzes — user.ts logic', () => {
  // UT-FL-08 testChuan1
  it('UT-FL-08 | User role: chỉ thấy approved+published', () => {
    const quizzes: Quiz[] = [
      makeQuiz({ id: 'q_ok',       status: 'approved', isPublished: true }),
      makeQuiz({ id: 'q_no_pub',   status: 'approved', isPublished: false }),
      makeQuiz({ id: 'q_rejected', status: 'rejected', isPublished: true }),
    ];
    const result = filterUserQuizzes(quizzes);

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('q_ok');
    result.forEach((q) => {
      expect(q.status).toBe('approved');
      expect(q.isPublished).toBe(true);
    });
  });
});
