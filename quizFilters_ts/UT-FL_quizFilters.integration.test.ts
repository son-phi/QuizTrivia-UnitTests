/**
 * ============================================================
 * FILE: UT-FL_quizFilters.integration.test.ts
 * MODULE: Quiz CRUD — Role-based visibility + Client-side filters
 * SOURCE: src/features/quiz/api/shared.ts       [applyQuizFilters]
 *         src/features/quiz/utils/quizFilters.ts [filterCreatorQuizzes, filterUserQuizzes]
 * TESTER: M4
 * TOTAL TCs: 10  (UT-FL-01 → UT-FL-10)
 *
 * STRATEGY:
 *   - Kết nối Firestore Emulator thật (localhost:8080)
 *   - Mỗi TC: Insert quiz thật → getDocs → filter → Assert → Rollback
 *   - Import hàm filter trực tiếp từ source (không dùng inline copy)
 *   - Thêm UT-FL-09 (searchTerm) và UT-FL-10 (AND filter nhiễu)
 *     để đảm bảo filter đúng với DB thật có nhiều loại dữ liệu
 *
 * PREREQUISITE:
 *   firebase --config firebase.test.json emulators:start --only firestore
 * ============================================================
 */

// ─── Mock lib/firebase/config → emulator db ──────────────────────────
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
    // Already connected
  }

  return { db };
});

// ─── Imports ──────────────────────────────────────────────────────────
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../lib/firebase/config';
import { applyQuizFilters } from '../features/quiz/api/shared';
import { filterCreatorQuizzes, filterUserQuizzes } from '../features/quiz/utils/quizFilters';
import { Quiz, QuizFilters } from '../features/quiz/types';

const QUIZZES = 'quizzes';

// ─── Helpers ─────────────────────────────────────────────────────────
const insertedIds: string[] = [];

async function insertQuiz(overrides: Partial<Omit<Quiz, 'id'>> = {}): Promise<string> {
  const data = {
    title: 'Test Quiz',
    description: 'Test description',
    category: 'general',
    difficulty: 'easy',
    questions: [],
    duration: 10,
    createdBy: 'test-user',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublished: true,
    tags: [],
    status: 'approved',
    ...overrides,
  };
  const ref = await addDoc(collection(db, QUIZZES), data);
  insertedIds.push(ref.id);
  return ref.id;
}

async function fetchAllQuizzes(): Promise<Quiz[]> {
  const snap = await getDocs(collection(db, QUIZZES));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Quiz));
}

// ─── Rollback toàn bộ sau mỗi test ───────────────────────────────────
afterEach(async () => {
  if (insertedIds.length > 0) {
    await Promise.all(insertedIds.map(id => deleteDoc(doc(db, QUIZZES, id))));
    insertedIds.length = 0;
  }
});

// ============================================================
// NHÓM 1 — applyQuizFilters()  (UT-FL-01 → UT-FL-04)
// ============================================================
describe('NHÓM 1 — applyQuizFilters với dữ liệu Firestore thật', () => {
  beforeEach(async () => {
    // Insert 3 quiz với category/difficulty khác nhau vào emulator
    await insertQuiz({ title: 'Math Easy Quiz',    category: 'math',    difficulty: 'easy' });
    await insertQuiz({ title: 'Science Hard Quiz', category: 'science', difficulty: 'hard' });
    await insertQuiz({ title: 'Math Hard Quiz',    category: 'math',    difficulty: 'hard' });
  });

  // UT-FL-01
  it('UT-FL-01 | filter category=math → chỉ trả về quiz có category=math (CheckDB)', async () => {
    const quizzes = await fetchAllQuizzes();
    const filters: QuizFilters = { category: 'math' };

    const result = applyQuizFilters(quizzes, filters);

    expect(result).toHaveLength(2);
    result.forEach(q => expect(q.category).toBe('math'));
  });

  // UT-FL-02
  it('UT-FL-02 | filter difficulty=hard → chỉ trả về quiz có difficulty=hard (CheckDB)', async () => {
    const quizzes = await fetchAllQuizzes();
    const filters: QuizFilters = { difficulty: 'hard' };

    const result = applyQuizFilters(quizzes, filters);

    expect(result).toHaveLength(2);
    result.forEach(q => expect(q.difficulty).toBe('hard'));
  });

  // UT-FL-03
  it('UT-FL-03 | AND: category=math AND difficulty=hard → chỉ trả về đúng 1 quiz khớp cả 2 (CheckDB)', async () => {
    const quizzes = await fetchAllQuizzes();
    const filters: QuizFilters = { category: 'math', difficulty: 'hard' };

    const result = applyQuizFilters(quizzes, filters);

    expect(result).toHaveLength(1);
    expect(result[0].category).toBe('math');
    expect(result[0].difficulty).toBe('hard');
    expect(result[0].title).toBe('Math Hard Quiz');
  });

  // UT-FL-04
  it('UT-FL-04 | filters=undefined → trả về toàn bộ quiz từ DB (CheckDB)', async () => {
    const quizzes = await fetchAllQuizzes();

    const result = applyQuizFilters(quizzes, undefined);

    expect(result).toHaveLength(3);
    expect(result.map(q => q.title).sort()).toEqual([
      'Math Easy Quiz',
      'Math Hard Quiz',
      'Science Hard Quiz',
    ].sort());
  });
});

// ============================================================
// NHÓM 2 — filterCreatorQuizzes()  (UT-FL-05 → UT-FL-07)
// ============================================================
describe('NHÓM 2 — filterCreatorQuizzes với dữ liệu Firestore thật', () => {
  const u1 = 'creator-user-u1';

  // UT-FL-05
  it("UT-FL-05 | Creator thấy quiz CỦA MÌNH dù status='draft' (CheckDB + Rollback)", async () => {
    await insertQuiz({ createdBy: u1, status: 'draft', isPublished: false, title: 'My Draft Quiz' });

    const quizzes = await fetchAllQuizzes();
    const result = filterCreatorQuizzes(quizzes, u1);

    expect(result).toHaveLength(1);
    expect(result[0].createdBy).toBe(u1);
    expect(result[0].status).toBe('draft');
  });

  // UT-FL-06
  it('UT-FL-06 | Creator thấy quiz người khác nếu approved+published (CheckDB + Rollback)', async () => {
    await insertQuiz({ createdBy: 'other-user-u2', status: 'approved', isPublished: true, title: 'Other Approved Quiz' });

    const quizzes = await fetchAllQuizzes();
    const result = filterCreatorQuizzes(quizzes, u1);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Other Approved Quiz');
  });

  // UT-FL-07
  it('UT-FL-07 | Creator KHÔNG thấy quiz người khác nếu status=pending (CheckDB + Rollback)', async () => {
    await insertQuiz({ createdBy: 'other-user-u2', status: 'pending', isPublished: false, title: 'Other Pending Quiz' });

    const quizzes = await fetchAllQuizzes();
    const result = filterCreatorQuizzes(quizzes, u1);

    expect(result).toHaveLength(0);
  });
});

// ============================================================
// NHÓM 3 — filterUserQuizzes()  (UT-FL-08)
// ============================================================
describe('NHÓM 3 — filterUserQuizzes với dữ liệu Firestore thật', () => {

  // UT-FL-08
  it('UT-FL-08 | User role: chỉ thấy approved+published trong số 3 quiz khác nhau (CheckDB + Rollback)', async () => {
    await insertQuiz({ title: 'Quiz OK',       status: 'approved', isPublished: true  });
    await insertQuiz({ title: 'Quiz No Pub',   status: 'approved', isPublished: false });
    await insertQuiz({ title: 'Quiz Rejected', status: 'rejected', isPublished: true  });

    const quizzes = await fetchAllQuizzes();
    const result = filterUserQuizzes(quizzes);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Quiz OK');
    expect(result[0].status).toBe('approved');
    expect(result[0].isPublished).toBe(true);
  });
});

// ============================================================
// NHÓM 4 — Extra cases (UT-FL-09, UT-FL-10)
// Bổ sung theo yêu cầu giáo viên: test filter với DB có dữ liệu đa dạng
// ============================================================
describe('NHÓM 4 — searchTerm và AND filter với dữ liệu nhiễu', () => {

  // UT-FL-09: searchTerm filter
  it('UT-FL-09 | searchTerm="math" → trả đúng quiz có "math" trong title, không trả quiz Science (CheckDB + Rollback)', async () => {
    await insertQuiz({ title: 'Math Quiz Cơ Bản',     category: 'math',    description: 'Toán học cơ bản' });
    await insertQuiz({ title: 'Advanced Math Nâng Cao', category: 'math',  description: 'Toán nâng cao' });
    await insertQuiz({ title: 'Science Quiz',           category: 'science', description: 'Khoa học tự nhiên' });

    const quizzes = await fetchAllQuizzes();
    const filters: QuizFilters = { searchTerm: 'math' };

    const result = applyQuizFilters(quizzes, filters);

    // Phải trả về 2 quiz có "math" trong title
    expect(result).toHaveLength(2);
    result.forEach(q => expect(q.title.toLowerCase()).toContain('math'));

    // Không được trả về Science Quiz
    const titles = result.map(q => q.title);
    expect(titles).not.toContain('Science Quiz');
  });

  // UT-FL-10: AND filter với dữ liệu nhiễu
  it('UT-FL-10 | AND (category=math + difficulty=hard + searchTerm=algebra) → chỉ 1 quiz khớp đủ 3 tiêu chí, 4 quiz còn lại bị loại (CheckDB + Rollback)', async () => {
    // Khớp category nhưng sai difficulty → bị loại
    await insertQuiz({ title: 'Basic Math Algebra',    category: 'math',    difficulty: 'easy', description: 'algebra cơ bản' });
    // Khớp difficulty nhưng sai category → bị loại
    await insertQuiz({ title: 'Science Hard Quiz',     category: 'science', difficulty: 'hard', description: 'khoa học khó' });
    // Khớp cả 3 tiêu chí → GIỮ LẠI
    await insertQuiz({ title: 'Algebra Nâng Cao',      category: 'math',    difficulty: 'hard', description: 'đại số nâng cao' });
    // Khớp category + difficulty nhưng không có "algebra" trong title/desc/category → bị loại
    await insertQuiz({ title: 'Geometry Hard Quiz',    category: 'math',    difficulty: 'hard', description: 'hình học khó' });
    // Có "algebra" trong title nhưng sai category → bị loại
    await insertQuiz({ title: 'History Algebra Notes', category: 'history', difficulty: 'hard', description: 'lịch sử' });

    const quizzes = await fetchAllQuizzes();
    expect(quizzes).toHaveLength(5); // Xác nhận DB có đủ 5 quiz

    const filters: QuizFilters = { category: 'math', difficulty: 'hard', searchTerm: 'algebra' };
    const result = applyQuizFilters(quizzes, filters);

    // Chỉ đúng 1 quiz khớp cả 3 tiêu chí
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Algebra Nâng Cao');
    expect(result[0].category).toBe('math');
    expect(result[0].difficulty).toBe('hard');
  });
});
