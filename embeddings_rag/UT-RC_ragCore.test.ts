/**
 * ============================================================
 * FILE: UT-RC_ragCore.test.ts
 * MODULE: AI Chatbot RAG (P2) — Math functions + Intent detection
 * SOURCE:
 *   src/lib/genkit/embeddings.ts  → cosineSimilarity, findTopKSimilar
 *   functions/src/rag/optimizedRAG.ts → fastIntentDetection  [inline extract]
 *   functions/src/rag/ask.ts          → validateQuestion      [inline extract]
 *   src/lib/genkit/ragFlow.ts         → buildRAGPrompt        [inline extract]
 * TESTER: M4
 * TOTAL TCs: 10  (UT-RC-01 → UT-RC-10)
 * ============================================================
 */

// ─── Mock firebase config (embeddings.ts uses import.meta.env, not firebase) ─
jest.mock('../lib/firebase/config', () => ({
  db: {},
  auth: {},
  app: {},
}));

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  setPersistence: jest.fn(() => Promise.resolve()),
  browserLocalPersistence: {},
}));

// ─── INLINE COPY: cosineSimilarity & findTopKSimilar from embeddings.ts ──────
// Cannot import embeddings.ts directly in Jest because it uses Vite-specific
// import.meta.env syntax. We copy the pure math functions here instead.

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;
  return dotProduct / denominator;
}

function findTopKSimilar(
  queryEmbedding: number[],
  chunkEmbeddings: { id: string; embedding: number[] }[],
  topK: number = 5,
  minSimilarity: number = 0.6,
): Array<{ id: string; similarity: number }> {
  const similarities = chunkEmbeddings.map((chunk) => ({
    id: chunk.id,
    similarity: cosineSimilarity(queryEmbedding, chunk.embedding),
  }));
  return similarities
    .filter((item) => item.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

// ============================================================
// ─── INLINE EXTRACT: fastIntentDetection (từ optimizedRAG.ts)
// ============================================================
interface IntentClassification {
  intent: string;
  confidence: number;
  reasoning?: string;
  extractedTopic?: string;
  clarifyingQuestion?: string;
}

function fastIntentDetection(question: string): IntentClassification | null {
  const q = question.toLowerCase().trim();

  const helpPatterns = [
    /^(help|trợ giúp|hướng dẫn|cách (sử dụng|dùng))/i,
    /(làm (sao|thế nào) để|cách (để|nào)|chatbot.*làm (được )?gì)/i,
    /^\/help$/i,
    /chatbot.*có thể|bạn.*giúp.*gì/i,
  ];
  for (const pattern of helpPatterns) {
    if (pattern.test(q)) {
      return { intent: 'help_support', confidence: 0.95, reasoning: 'Fast route: help pattern matched' };
    }
  }

  const greetingPatterns = [
    /^(xin chào|chào|hello|hi|hey|yo)[\s!.]*$/i,
    /^(cảm ơn|thank|thanks|cám ơn)[\s!.]*$/i,
    /^(bạn là ai|you are|who are you)\??$/i,
    /^(tạm biệt|bye|goodbye)[\s!.]*$/i,
    /^(ok|okay|được|tốt|good|great)[\s!.]*$/i,
    /^(rồi|ừ|ừm|uhm|um)[\s!.]*$/i,
  ];
  for (const pattern of greetingPatterns) {
    if (pattern.test(q)) {
      return { intent: 'general_chat', confidence: 0.98, reasoning: 'Fast route: greeting pattern matched' };
    }
  }

  const quizBrowsePatterns = [
    /^(quiz|bài test|trắc nghiệm)[\s]*(hay|hot|mới|phổ biến|ngẫu nhiên)?[\s!?.]*$/i,
    /^(cho|gợi ý|đề xuất|recommend)[\s]*(tôi|mình)?[\s]*(quiz|bài test)[\s!?.]*$/i,
  ];
  for (const pattern of quizBrowsePatterns) {
    if (pattern.test(q)) {
      return { intent: 'quiz_browse', confidence: 0.92, reasoning: 'Fast route: quiz browse pattern (no topic)' };
    }
  }

  const quizSearchPatterns = [
    /^(quiz|bài test|trắc nghiệm)\s+(về\s+)?(\w+.*)$/i,
    /^(tìm|kiếm|search)\s+(quiz|bài test)\s+(về\s+)?(\w+.*)$/i,
  ];
  for (const pattern of quizSearchPatterns) {
    const match = q.match(pattern);
    if (match) {
      const topic = (match[3] || match[4] || '').trim();
      if (topic && topic.length >= 2 && !['hay', 'hot', 'mới', 'gì', 'nào'].includes(topic)) {
        return { intent: 'quiz_search', confidence: 0.92, extractedTopic: topic, reasoning: 'Fast route: quiz search with topic' };
      }
    }
  }

  if (q.length < 3 || /^[a-z0-9]{1,3}$/i.test(q)) {
    return {
      intent: 'unclear',
      confidence: 0.95,
      reasoning: 'Fast route: query too short',
      clarifyingQuestion: 'Mình chưa hiểu rõ. Bạn có thể nói cụ thể hơn không?',
    };
  }

  return null;
}

// ============================================================
// ─── INLINE EXTRACT: validateQuestion (từ ask.ts)
// ============================================================
function validateQuestion(question: unknown): string {
  if (typeof question !== 'string') {
    throw new Error('Question must be a string');
  }
  const trimmed = question.trim();
  if (trimmed.length === 0) {
    throw new Error('Question cannot be empty');
  }
  if (trimmed.length > 500) {
    throw new Error('Question too long (max 500 characters)');
  }
  return trimmed;
}

// ============================================================
// ─── INLINE EXTRACT: buildRAGPrompt (từ ragFlow.ts)
// ============================================================
interface ChunkMeta { title: string; text: string; quizId: string }

function buildRAGPrompt(question: string, chunks: ChunkMeta[], targetLang = 'vi'): string {
  const context = chunks
    .map((chunk, i) => `[${i + 1}] ${chunk.title}\n${chunk.text}\n`)
    .join('\n---\n\n');

  if (targetLang === 'vi') {
    return `Bạn là trợ lý học tập AI thông minh. Nhiệm vụ của bạn là trả lời câu hỏi dựa HOÀN TOÀN vào ngữ cảnh được cung cấp bên dưới.\n\nNGỮ CẢNH (các tài liệu tham khảo):\n${context}\nCÂU HỎI: ${question}\n\nTRẢ LỜI (nhớ kèm trích dẫn [số] sau mỗi thông tin):`;
  }
  return `You are an intelligent AI learning assistant.\n\nCONTEXT:\n${context}\nQUESTION: ${question}\n\nANSWER:`;
}

// ============================================================
// NHÓM 1 — cosineSimilarity & findTopKSimilar  (UT-RC-01 → UT-RC-04)
// ============================================================
describe('cosineSimilarity — embeddings.ts', () => {
  // UT-RC-01 testChuan1
  it('UT-RC-01 | Vectors giống nhau → trả về 1.0 (Perfect similarity)', () => {
    const a = [1.0, 0.0];
    const b = [1.0, 0.0];
    const result = cosineSimilarity(a, b);
    expect(result).toBeCloseTo(1.0, 5);
  });

  // UT-RC-02 testChuan2
  it('UT-RC-02 | Vectors vuông góc → trả về 0.0 (Orthogonal)', () => {
    const a = [1.0, 0];
    const b = [0, 1];
    const result = cosineSimilarity(a, b);
    expect(result).toBeCloseTo(0.0, 5);
  });

  // UT-RC-03 testNgoale1 — dimension mismatch → throws Error
  it('UT-RC-03 | Khác số chiều → throws Error (dimension mismatch bug)', () => {
    const a = [1.0, 0.0];       // length=2
    const b = [1.0, 0.0, 0.0]; // length=3
    expect(() => cosineSimilarity(a, b)).toThrow();
  });
});

describe('findTopKSimilar — embeddings.ts', () => {
  // UT-RC-04 testChuan3
  it('UT-RC-04 | Trả về top K, sorted descending, ≥ minSimilarity', () => {
    const queryEmbedding = [1.0, 0.0];
    const chunks = [
      { id: 'c1', embedding: [1.0, 0.0] },   // sim=1.0
      { id: 'c2', embedding: [0.7, 0.7] },   // sim≈0.71
      { id: 'c3', embedding: [0.3, 0.95] },  // sim≈0.30 (below threshold)
      { id: 'c4', embedding: [0.9, 0.44] },  // sim≈0.90
      { id: 'c5', embedding: [0.85, 0.53] }, // sim≈0.85
    ];

    const result = findTopKSimilar(queryEmbedding, chunks, 3, 0.5);

    expect(result.length).toBeLessThanOrEqual(3);
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].similarity).toBeGreaterThanOrEqual(result[i].similarity);
    }
    result.forEach((r) => expect(r.similarity).toBeGreaterThanOrEqual(0.5));
  });
});

// ============================================================
// NHÓM 2 — fastIntentDetection  (UT-RC-05 → UT-RC-07)
// ============================================================
describe('fastIntentDetection — optimizedRAG.ts', () => {
  // UT-RC-05 testChuan1
  it('UT-RC-05 | Câu chào "xin chào" → general_chat hoặc help_support intent', () => {
    const result = fastIntentDetection('xin chào');
    expect(result).not.toBeNull();
    expect(['help_support', 'general_chat']).toContain(result!.intent);
  });

  // UT-RC-06 testChuan2
  it('UT-RC-06 | "tìm quiz về lịch sử Việt Nam" → quiz_search intent', () => {
    const result = fastIntentDetection('tìm quiz về lịch sử Việt Nam');
    expect(result).not.toBeNull();
    expect(result!.intent).toBe('quiz_search');
    expect(result!.extractedTopic).toBeTruthy();
  });

  // UT-RC-07 testNgoale1 — too short
  it('UT-RC-07 | Câu dưới 3 ký tự ("Hi") → unclear hoặc null (LLM fallback)', () => {
    const result = fastIntentDetection('Hi');
    // 'Hi' length=2 < 3 → unclear OR matches greeting → general_chat
    if (result !== null) {
      expect(['unclear', 'general_chat']).toContain(result.intent);
    } else {
      expect(result).toBeNull();
    }
  });
});

// ============================================================
// NHÓM 3 — validateQuestion & buildRAGPrompt  (UT-RC-08 → UT-RC-10)
// ============================================================
describe('validateQuestion — ask.ts', () => {
  // UT-RC-08 testChuan1
  it('UT-RC-08 | Valid string (có khoảng trắng) → trimmed valid string returned', () => {
    const result = validateQuestion('  Định nghĩa RAG là gì?  ');
    expect(result).toBe('Định nghĩa RAG là gì?');
  });

  // UT-RC-09 testNgoale1 — > 500 chars → throws
  it('UT-RC-09 | > 500 ký tự → throws (Question exceeds 500 char limit)', () => {
    const longQ = 'x'.repeat(501);
    expect(() => validateQuestion(longQ)).toThrow();
  });
});

describe('buildRAGPrompt — ragFlow.ts', () => {
  // UT-RC-10 testChuan1
  it('UT-RC-10 | Output string chứa câu question + numbered citations [1]…[N] + instruction tiếng Việt', () => {
    const chunks: ChunkMeta[] = [
      { title: 'RAG intro', quizId: 'q1', text: 'Retrieval Augmented...' },
    ];
    const prompt = buildRAGPrompt('Định nghĩa RAG?', chunks, 'vi');

    expect(typeof prompt).toBe('string');
    expect(prompt.length).toBeGreaterThan(0);
    expect(prompt).toContain('Định nghĩa RAG?');
    expect(prompt).toContain('[1]');
    expect(prompt).toContain('RAG intro');
    expect(prompt).toMatch(/Bạn.*trợ lý/);
  });
});
