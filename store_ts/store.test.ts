/**
 * Unit Tests — src/features/quiz/store.ts
 * =========================================
 * Bao gồm 12 test cases theo đặc tả:
 *   UT-RX-01 → UT-RX-12
 *
 * Pattern: reducer(state, action) — pure reducer tests (không cần store thật)
 */

// ─── Mock các module bên ngoài TRƯỚC KHI import store ───────────────────────
jest.mock('../services/quiz', () => ({
  getQuizzes: jest.fn(),
  getQuizById: jest.fn(),
}));

jest.mock('../api/shared', () => ({
  getUserQuizResults: jest.fn(),
}));

// ─── Imports ─────────────────────────────────────────────────────────────────
import quizReducer, {
  setCurrentQuiz,
  setUserAnswer,
  clearUserAnswers,
  resetQuizState,
  updateTimeLeft,
  addQuiz,
  removeQuiz,
  fetchQuizzes,
} from '../store';
import { Quiz } from '../types';

// ─── Helper: tạo Quiz object tối thiểu hợp lệ ────────────────────────────────
function makeQuiz(overrides: Partial<Quiz> = {}): Quiz {
  return {
    id: 'q1',
    title: 'Test Quiz',
    description: '',
    category: 'general',
    difficulty: 'easy',
    questions: [],
    duration: 15, // minutes
    createdBy: 'user1',
    createdAt: new Date(),
    updatedAt: new Date(),
    isPublished: true,
    tags: [],
    ...overrides,
  };
}

// ─── initialState tham chiếu (không import trực tiếp vì private) ─────────────
const blankState = quizReducer(undefined, { type: '@@INIT' });

// ============================================================================
// NHÓM 1: setCurrentQuiz / setUserAnswer / clearUserAnswers / resetQuizState
// ============================================================================
describe('Nhóm 1 — setCurrentQuiz / setUserAnswer / clearUserAnswers / resetQuizState', () => {

  /**
   * UT-RX-01
   * Verify setCurrentQuiz: reset session + tính totalTime từ duration
   * Technique: testChuan1 — pure reducer
   */
  it('UT-RX-01: setCurrentQuiz(mockQuiz) — reset session và tính totalTime = duration × 60', () => {
    const mockQuiz = makeQuiz({ id: 'q1', duration: 15, questions: [] });

    const nextState = quizReducer(blankState, setCurrentQuiz(mockQuiz));

    // currentQuestionIndex phải reset về 0
    expect(nextState.currentQuestionIndex).toBe(0);
    // userAnswers phải là object rỗng
    expect(nextState.userAnswers).toEqual({});
    // totalTime = 15 phút × 60 giây = 900
    expect(nextState.totalTime).toBe(900);
    // currentQuiz phải được lưu đúng
    expect(nextState.currentQuiz).toEqual(mockQuiz);
  });

  /**
   * UT-RX-02
   * Verify setCurrentQuiz(null): clear toàn bộ về initial state
   * Technique: testNgoaile1 — reset path (payload = null)
   */
  it('UT-RX-02: setCurrentQuiz(null) — clear toàn bộ state quiz về giá trị mặc định', () => {
    // Tạo activeState: quiz đang chạy với answers và timer
    const activeState = quizReducer(
      blankState,
      setCurrentQuiz(makeQuiz({ id: 'q1', duration: 10 }))
    );
    // Thêm vài câu trả lời để activeState có dữ liệu
    const stateWithAnswers = quizReducer(
      activeState,
      setUserAnswer({ questionId: 'q1', answerId: 'A' })
    );

    // Dispatch setCurrentQuiz(null)
    const nextState = quizReducer(stateWithAnswers, setCurrentQuiz(null));

    expect(nextState.currentQuiz).toBeNull();
    expect(nextState.currentQuestionIndex).toBe(0);
    expect(nextState.userAnswers).toEqual({});
    expect(nextState.totalTime).toBe(0);
  });

  /**
   * UT-RX-03
   * Verify setUserAnswer: lưu đáp án vào userAnswers map
   * Technique: testChuan1
   */
  it('UT-RX-03: setUserAnswer — lưu đáp án đúng vào userAnswers map', () => {
    const nextState = quizReducer(
      blankState,
      setUserAnswer({ questionId: 'q1', answerId: 'A' })
    );

    expect(nextState.userAnswers['q1']).toBe('A');
  });

  /**
   * UT-RX-04
   * Verify setUserAnswer: thay đổi đáp án → ghi đè answer cũ (change-before-submit)
   * Technique: testChuan2
   */
  it('UT-RX-04: setUserAnswer — ghi đè đáp án cũ (change-before-submit behavior)', () => {
    // Step 1: trả lời câu q1 = 'A'
    const stateAfterStep1 = quizReducer(
      blankState,
      setUserAnswer({ questionId: 'q1', answerId: 'A' })
    );
    expect(stateAfterStep1.userAnswers['q1']).toBe('A');

    // Step 2: đổi sang 'B' với cùng questionId
    const stateAfterStep2 = quizReducer(
      stateAfterStep1,
      setUserAnswer({ questionId: 'q1', answerId: 'B' })
    );

    // 'A' phải bị overwrite thành 'B'
    expect(stateAfterStep2.userAnswers['q1']).toBe('B');
  });

  /**
   * UT-RX-05
   * Verify clearUserAnswers: reset về {} sau khi có 3 answers
   * Technique: testChuan3
   */
  it('UT-RX-05: clearUserAnswers — reset userAnswers về {} sau khi có 3 answers', () => {
    // Setup: state với 3 câu trả lời
    let state = blankState;
    state = quizReducer(state, setUserAnswer({ questionId: 'q1', answerId: 'A' }));
    state = quizReducer(state, setUserAnswer({ questionId: 'q2', answerId: 'B' }));
    state = quizReducer(state, setUserAnswer({ questionId: 'q3', answerId: 'C' }));

    // Xác nhận có đúng 3 câu trả lời
    expect(Object.keys(state.userAnswers)).toHaveLength(3);

    // Dispatch clearUserAnswers
    const nextState = quizReducer(state, clearUserAnswers());

    expect(nextState.userAnswers).toEqual({});
  });

  /**
   * UT-RX-06
   * Verify resetQuizState: tất cả quiz fields về initial values
   * Technique: testChuan4
   */
  it('UT-RX-06: resetQuizState — tất cả quiz-related fields về giá trị initial', () => {
    // Setup: activeState (quiz đang chạy)
    let activeState = quizReducer(
      blankState,
      setCurrentQuiz(makeQuiz({ id: 'q1', duration: 10 }))
    );
    activeState = quizReducer(activeState, setUserAnswer({ questionId: 'q1', answerId: 'A' }));

    // Dispatch resetQuizState
    const nextState = quizReducer(activeState, resetQuizState());

    expect(nextState.currentQuiz).toBeNull();
    expect(nextState.currentQuestionIndex).toBe(0);
    expect(nextState.userAnswers).toEqual({});
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
    // Các quiz-related timer fields
    expect(nextState.totalTime).toBe(0);
    expect(nextState.timeLeft).toBe(0);
    expect(nextState.isTimeWarning).toBe(false);
    // quizzes array không bị ảnh hưởng bởi resetQuizState
    // (resetQuizState không clear quizzes theo code)
  });

});

// ============================================================================
// NHÓM 2: updateTimeLeft / addQuiz / removeQuiz
// ============================================================================
describe('Nhóm 2 — updateTimeLeft / addQuiz / removeQuiz', () => {

  /**
   * UT-RX-07
   * Verify updateTimeLeft: còn <10% thời gian → isTimeWarning=true
   * Technique: testChuan1 — jest.spyOn(Date,'now') for clock mock
   *
   * Setup:
   *   quizStartTime = T = 1000 ms
   *   totalTime     = 100 seconds
   *   Date.now()    = T + 91_000 ms  →  elapsed = 91s  →  timeLeft = 9s
   *   threshold     = Math.ceil(100 × 0.1) = 10
   *   9 <= 10  →  isTimeWarning = true
   */
  it('UT-RX-07: updateTimeLeft — còn <10% tổng thời gian → isTimeWarning = true', () => {
    // Mock Date.now để kiểm soát thời gian
    const T = 1000;
    jest.spyOn(Date, 'now').mockReturnValue(T);

    // Khởi tạo state với quiz 100 giây (dùng setCurrentQuiz rồi ghi đè)
    const quizWith100s = makeQuiz({ id: 'q1', duration: 15 }); // duration tạm 15
    let state = quizReducer(blankState, setCurrentQuiz(quizWith100s));

    // Ghi đè totalTime & quizStartTime thủ công qua một action trung gian
    // Cách clean nhất: dùng setQuizTimer (nếu có export) hoặc khởi state trực tiếp.
    // Ở đây ta khởi tạo trực tiếp initial state với totalTime=100, quizStartTime=T
    const manualState = {
      ...state,
      totalTime: 100,
      quizStartTime: T,
      timeLeft: 100,
    };

    // Mock Date.now = T + 91_000 → elapsed = 91s → timeLeft = 9s
    jest.spyOn(Date, 'now').mockReturnValue(T + 91_000);

    const nextState = quizReducer(manualState, updateTimeLeft());

    expect(nextState.timeLeft).toBe(9);
    expect(nextState.isTimeWarning).toBe(true);

    jest.restoreAllMocks();
  });

  /**
   * UT-RX-08
   * Verify addQuiz: thêm quiz mới vào array
   * Technique: testChuan1
   */
  it('UT-RX-08: addQuiz — thêm quiz mới vào đầu array (unshift)', () => {
    const newQuiz = makeQuiz({ id: 'new1', title: 'Test Quiz' });

    const nextState = quizReducer(blankState, addQuiz(newQuiz));

    expect(nextState.quizzes).toHaveLength(1);
    expect(nextState.quizzes[0]).toEqual(newQuiz);
  });

  /**
   * UT-RX-09
   * Verify removeQuiz: xóa đúng quiz theo id
   * Technique: testChuan2
   */
  it('UT-RX-09: removeQuiz — xóa đúng quiz theo id, giữ lại quiz không liên quan', () => {
    const quiz1 = makeQuiz({ id: 'q1', title: 'Quiz 1' });
    const quiz2 = makeQuiz({ id: 'q2', title: 'Quiz 2' });

    // Setup: thêm 2 quiz vào state
    let state = quizReducer(blankState, addQuiz(quiz2));
    state = quizReducer(state, addQuiz(quiz1));
    expect(state.quizzes).toHaveLength(2);

    // Remove quiz q1
    const nextState = quizReducer(state, removeQuiz('q1'));

    expect(nextState.quizzes).toHaveLength(1);
    expect(nextState.quizzes[0].id).toBe('q2');
  });

});

// ============================================================================
// NHÓM 3: fetchQuizzes async thunk — extraReducers
// ============================================================================
describe('Nhóm 3 — fetchQuizzes extraReducers', () => {

  /**
   * UT-RX-10
   * Verify fetchQuizzes.pending: loading=true, error=null
   * Technique: testNgoaile1 — dispatch type string trực tiếp
   */
  it('UT-RX-10: fetchQuizzes.pending — loading = true, error = null', () => {
    const nextState = quizReducer(blankState, {
      type: 'quiz/fetchQuizzes/pending',
    });

    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  /**
   * UT-RX-11
   * Verify fetchQuizzes.fulfilled: populate quizzes array
   * Technique: testChuan1
   */
  it('UT-RX-11: fetchQuizzes.fulfilled — điền quizzes array, loading = false, error = null', () => {
    const quiz1 = makeQuiz({ id: 'q1', title: 'Quiz 1' });
    const quiz2 = makeQuiz({ id: 'q2', title: 'Quiz 2' });

    // Dispatch action fulfilled với payload = [quiz1, quiz2]
    const fulfilledAction = fetchQuizzes.fulfilled([quiz1, quiz2], 'requestId', {} as any);
    const nextState = quizReducer(blankState, fulfilledAction);

    expect(nextState.quizzes).toEqual([quiz1, quiz2]);
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBeNull();
  });

  /**
   * UT-RX-12
   * Verify fetchQuizzes.rejected: set error message, loading=false
   * Technique: testNgoaile2
   *
   * Lưu ý: store.ts dùng action.error.message (SerializedError),
   *         KHÔNG phải action.payload — vì không dùng rejectWithValue ở rejected handler.
   */
  it('UT-RX-12: fetchQuizzes.rejected — error = message từ error.message, loading = false', () => {
    // Tạo rejected action với error.message
    const rejectedAction = fetchQuizzes.rejected(
      new Error('Network error'),
      'requestId',
      {} as any
    );

    const nextState = quizReducer(blankState, rejectedAction);

    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe('Network error');
  });

});
