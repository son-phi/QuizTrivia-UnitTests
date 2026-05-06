/**
 * ============================================================
 * FILE: UT-SQ_submitQuizResult.integration.test.ts
 * MODULE: Quiz CRUD — submitQuizResult với Firebase Emulator
 * SOURCE: src/features/quiz/api/base.ts → submitQuizResult (lines 235-320)
 * TESTER: M4
 * TOTAL TCs: 7  (UT-SQ-01 → UT-SQ-07)
 *
 * STRATEGY:
 *   - Kết nối Firestore Emulator thật (localhost:8080)
 *   - Mỗi TC: Action → CheckDB (query emulator) → Rollback (deleteDoc)
 *   - KHÔNG dùng jest.mock('firebase/firestore') — mọi thứ đều thật
 *
 * PREREQUISITE:
 *   firebase --config firebase.test.json emulators:start --only firestore
 * ============================================================
 */

// ─── Bước 1: Mock lib/firebase/config để trả về emulator db ─────────
// jest.mock được hoist lên đầu file, dùng jest.requireActual để lấy
// real Firebase SDK (không bị mock bởi setupTests.ts vì dùng config riêng)
jest.mock('../lib/firebase/config', () => {
  const { initializeApp, getApps } =
    jest.requireActual<typeof import('firebase/app')>('firebase/app');
  const { getFirestore, connectFirestoreEmulator } =
    jest.requireActual<typeof import('firebase/firestore')>('firebase/firestore');

  const appName = 'integration-test';
  const app =
    getApps().find((a: any) => a.name === appName) ||
    initializeApp({ projectId: 'demo-test' }, appName);
  const db = getFirestore(app);

  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch {
    // Emulator đã được kết nối trước đó — bỏ qua
  }

  return { db };
});

// ─── Bước 2: Mock quizStatsService — không cần test stats ────────────
jest.mock('../services/quizStatsService', () => ({
  quizStatsService: {
    trackCompletion: jest.fn().mockResolvedValue(undefined),
  },
}));

// ─── Imports (sau khi mock) ───────────────────────────────────────────
import {
  collection,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { submitQuizResult } from '../features/quiz/api/base';
import { QuizResult } from '../features/quiz/types';

type QuizResultInput = Omit<QuizResult, 'id'>;

const QUIZ_RESULTS = 'quizResults';

// ─── Helper: dữ liệu hợp lệ dùng chung ──────────────────────────────
const validResult: QuizResultInput = {
  userId: 'integration-test-user',
  quizId: 'integration-test-quiz',
  score: 80,
  correctAnswers: 4,
  totalQuestions: 5,
  timeSpent: 300,
  answers: [
    { questionId: 'q1', selectedAnswerId: 'a1', isCorrect: true,  timeSpent: 60 },
    { questionId: 'q2', selectedAnswerId: 'a2', isCorrect: true,  timeSpent: 60 },
    { questionId: 'q3', selectedAnswerId: 'a3', isCorrect: true,  timeSpent: 60 },
    { questionId: 'q4', selectedAnswerId: 'a4', isCorrect: true,  timeSpent: 60 },
    { questionId: 'q5', selectedAnswerId: 'a5', isCorrect: false, timeSpent: 60 },
  ],
  completedAt: new Date(),
};

// ============================================================
describe('submitQuizResult — Integration với Firestore Emulator', () => {
  // Track doc IDs được tạo trong mỗi test để xóa sau
  const createdDocIds: string[] = [];

  afterEach(async () => {
    // ── ROLLBACK: xóa tất cả doc được tạo trong test vừa chạy ──────
    if (createdDocIds.length > 0) {
      await Promise.all(
        createdDocIds.map(id => deleteDoc(doc(db, QUIZ_RESULTS, id)))
      );
      createdDocIds.length = 0;
    }
  });

  // ──────────────────────────────────────────────────────────────────
  // UT-SQ-01 | Valid result → ghi đúng fields vào Firestore
  // ──────────────────────────────────────────────────────────────────
  it('UT-SQ-01 | Valid result → trả về docId + ghi đúng fields vào Firestore (CheckDB + Rollback)', async () => {
    // ACTION
    const docId = await submitQuizResult(validResult);
    createdDocIds.push(docId);

    // CHECK DB
    const snap = await getDoc(doc(db, QUIZ_RESULTS, docId));

    expect(snap.exists()).toBe(true);
    expect(snap.data()).toMatchObject({
      userId: 'integration-test-user',
      quizId: 'integration-test-quiz',
      score: 80,
      correctAnswers: 4,
      totalQuestions: 5,
    });
    expect(Array.isArray(snap.data()?.answers)).toBe(true);
    expect(snap.data()?.answers).toHaveLength(5);
    expect(snap.data()?.mode).toBe('single');

    // ROLLBACK: handled by afterEach
  });

  // ──────────────────────────────────────────────────────────────────
  // UT-SQ-02 | score=0 (boundary lower) → ghi đúng score=0
  // ──────────────────────────────────────────────────────────────────
  it('UT-SQ-02 | score=0 (boundary lower) → ghi score=0 và correctAnswers=0 vào Firestore (CheckDB + Rollback)', async () => {
    const payload: QuizResultInput = { ...validResult, score: 0, correctAnswers: 0 };

    // ACTION
    const docId = await submitQuizResult(payload);
    createdDocIds.push(docId);

    // CHECK DB
    const snap = await getDoc(doc(db, QUIZ_RESULTS, docId));

    expect(snap.exists()).toBe(true);
    expect(snap.data()?.score).toBe(0);
    expect(snap.data()?.correctAnswers).toBe(0);

    // ROLLBACK: handled by afterEach
  });

  // ──────────────────────────────────────────────────────────────────
  // UT-SQ-03 | Thiếu userId → throws, KHÔNG ghi vào DB
  // ──────────────────────────────────────────────────────────────────
  it('UT-SQ-03 | Thiếu userId → throws validation error; KHÔNG có doc nào được ghi (CheckDB)', async () => {
    const payload = { ...validResult, userId: '' };

    // ACTION
    await expect(submitQuizResult(payload)).rejects.toThrow();

    // CHECK DB: query xem có doc nào với userId='' không
    const q = query(collection(db, QUIZ_RESULTS), where('userId', '==', ''));
    const snap = await getDocs(q);
    expect(snap.empty).toBe(true);

    // ROLLBACK: không có gì để xóa
  });

  // ──────────────────────────────────────────────────────────────────
  // UT-SQ-04 | Thiếu quizId → throws, KHÔNG ghi vào DB
  // ──────────────────────────────────────────────────────────────────
  it('UT-SQ-04 | Thiếu quizId → throws validation error; KHÔNG có doc nào được ghi (CheckDB)', async () => {
    const payload = { ...validResult, quizId: '' };

    // ACTION
    await expect(submitQuizResult(payload)).rejects.toThrow();

    // CHECK DB
    const q = query(collection(db, QUIZ_RESULTS), where('quizId', '==', ''));
    const snap = await getDocs(q);
    expect(snap.empty).toBe(true);
  });

  // ──────────────────────────────────────────────────────────────────
  // UT-SQ-05 | score=150 (ngoài range 0-100) → throws, KHÔNG ghi vào DB
  // ──────────────────────────────────────────────────────────────────
  it('UT-SQ-05 | score=150 (out of range) → throws; KHÔNG có doc nào được ghi (CheckDB)', async () => {
    const payload = { ...validResult, score: 150 };

    // ACTION
    await expect(submitQuizResult(payload)).rejects.toThrow(/0-100|điểm số/i);

    // CHECK DB: không có doc nào với score=150
    const q = query(collection(db, QUIZ_RESULTS), where('score', '==', 150));
    const snap = await getDocs(q);
    expect(snap.empty).toBe(true);
  });

  // ──────────────────────────────────────────────────────────────────
  // UT-SQ-06 | correctAnswers > totalQuestions → throws, KHÔNG ghi vào DB
  // ──────────────────────────────────────────────────────────────────
  it('UT-SQ-06 | correctAnswers=6 > totalQuestions=5 → throws logic error; KHÔNG có doc nào được ghi (CheckDB)', async () => {
    const payload: QuizResultInput = {
      ...validResult,
      correctAnswers: 6,
      totalQuestions: 5,
      score: 100,
    };

    // ACTION
    await expect(submitQuizResult(payload)).rejects.toThrow(/tổng số câu|correctAnswers/i);

    // CHECK DB: không có doc nào với correctAnswers=6
    const q = query(collection(db, QUIZ_RESULTS), where('correctAnswers', '==', 6));
    const snap = await getDocs(q);
    expect(snap.empty).toBe(true);
  });

  // ──────────────────────────────────────────────────────────────────
  // UT-SQ-07 | answers không phải Array → throws, KHÔNG ghi vào DB
  // ──────────────────────────────────────────────────────────────────
  it('UT-SQ-07 | answers là string thay vì Array → throws; KHÔNG có doc nào được ghi (CheckDB)', async () => {
    const payload = { ...validResult, answers: 'not-array' as any };

    // ACTION
    await expect(submitQuizResult(payload)).rejects.toThrow();

    // CHECK DB: toàn bộ collection phải rỗng (afterEach đã dọn test trước)
    const q = query(
      collection(db, QUIZ_RESULTS),
      where('userId', '==', 'integration-test-user')
    );
    const snap = await getDocs(q);
    expect(snap.empty).toBe(true);
  });
});
