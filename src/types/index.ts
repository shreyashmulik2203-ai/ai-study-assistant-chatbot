export interface Student {
  studentId: number;
  name: string;
  email: string;
  rollNo: string;
  department: string;
  semester: string;
  avatarUrl?: string;
}

export interface ChatMessage {
  id: string;
  chatId?: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  groundedInNotes?: boolean;
  suggestedFollowUps?: string[];
  audioUrl?: string;
}

export interface NoteDocument {
  id: string;
  title: string;
  subject: string;
  content: string;
  charCount: number;
  pageCount: number;
  uploadDate: string;
  isPreloaded?: boolean;
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'tf' | 'short';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topicTag: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface QuizAttempt {
  quizId: number;
  studentId: number;
  title: string;
  subject: string;
  totalQuestions: number;
  score: number;
  percentage: number;
  timestamp: string;
  weakTopics: string[];
  userAnswers: Record<string, number>;
}

export interface StudyRecommendation {
  summary: string;
  weakConcepts: string[];
  actionPlan: Array<{
    day: string;
    focus: string;
    priority: 'High' | 'Medium' | 'Normal';
  }>;
  vivaTips: string[];
}

export type ActiveTab = 'chat' | 'notes' | 'quiz' | 'dashboard' | 'viva';
export type AppLanguage = 'English' | 'Marathi' | 'Hindi';
