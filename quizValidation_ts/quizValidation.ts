import { QuizFormData } from '../pages/CreateQuizPage/types';

export function validateStep(quiz: QuizFormData, step: string): boolean {
  switch (step) {
    case 'type': // Step 0: Quiz Type Selection
      return !!quiz.quizType;
    case 'info': { // Quiz Info step (includes password now)
      const basicInfoValid = !!(quiz.title && quiz.description && quiz.category && quiz.difficulty);
      const durationValid = quiz.duration >= 5 && quiz.duration <= 120;
      const passwordValid = quiz.havePassword === 'password'
        ? !!(quiz.password && quiz.password.length >= 6)
        : true;
      
      return basicInfoValid && durationValid && passwordValid;
    }
    case 'resources': // Resources step - Only for with-materials type
      return !!(quiz.resources && quiz.resources.length > 0);
    case 'questions': // Questions step
      if (!quiz.questions || quiz.questions.length === 0) {
        return false;
      }
      
      const invalidQuestion = quiz.questions.find(q => {
        // Kiểm tra text câu hỏi
        if (!q.text) return true;
        
        // Kiểm tra points (must be 1-100)
        if (!q.points || q.points < 1 || q.points > 100) return true;
        
        // Kiểm tra theo từng loại câu hỏi
        switch (q.type) {
          case 'short_answer':
            return !q.correctAnswer;
          case 'boolean':
          case 'multiple':
          case 'checkbox':
            // Standard types: Must have text for all answers
            return !q.answers.some(a => a.isCorrect) || !q.answers.every(a => a.text);
          case 'image':
          case 'audio':
          case 'video':
            // Legacy media types: Must have text
            return !q.answers.some(a => a.isCorrect) || !q.answers.every(a => a.text);
          case 'multimedia': // 🆕 Multimedia: Answer must have text OR media
            if (!q.answers.some(a => a.isCorrect)) return true; // Must have correct answer
            // Each answer must have either text OR media (image/audio/video)
            return !q.answers.every(a => a.text || a.imageUrl || a.audioUrl || a.videoUrl);
          case 'ordering':
            return !q.orderingItems || q.orderingItems.length < 2;
          case 'matching':
            return !q.matchingPairs || q.matchingPairs.length < 2;
          case 'fill_blanks':
            return !q.textWithBlanks || !q.blanks || q.blanks.length === 0;
          default:
            return false; // Allow other types
        }
      });
      
      return !invalidQuestion;
    case 'review': // Review step
      return true;
    default:
      return false;
  }
}
