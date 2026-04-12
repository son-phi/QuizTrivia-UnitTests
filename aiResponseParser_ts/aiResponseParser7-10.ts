export function parseAIResponseJSON(generatedText: string | null | undefined): any[] {
  if (!generatedText) {
    throw new Error('AI không trả về text response');
  }

  let parsedQuestions;
  try {
    // Clean markdown code blocks and whitespace
    let cleanText = generatedText
      .replace(/```json\\s*/g, '')
      .replace(/```\\s*/g, '')
      .trim();

    console.log('🧹 Cleaned text (first 500 chars):', cleanText.substring(0, 500));

    const parsed = JSON.parse(cleanText);
    
    // Support both array format and {questions: []} format
    if (Array.isArray(parsed)) {
      parsedQuestions = parsed;
    } else if (parsed.questions && Array.isArray(parsed.questions)) {
      parsedQuestions = parsed.questions;
    } else {
      parsedQuestions = [];
    }

    console.log(`✅ Successfully parsed ${parsedQuestions.length} questions`);

    if (!Array.isArray(parsedQuestions)) {
      console.error('❌ parsed.questions is not an array:', typeof parsedQuestions);
      throw new Error('questions field is not an array');
    }

    if (parsedQuestions.length === 0) {
      console.error('❌ No questions in parsed response');
      throw new Error('AI returned 0 questions');
    }

  } catch (parseError) {
    console.error('❌ Error parsing JSON:', parseError);
    console.error('Raw response:', generatedText);
    
    // Return detailed error for debugging
    throw new Error(
      `Không thể phân tích câu hỏi từ AI. ` +
      `Parse error: ${parseError instanceof Error ? parseError.message : 'Unknown'}. ` +
      `Response preview: ${generatedText?.substring(0, 200) || 'empty'}`
    );
  }

  return parsedQuestions;
}
