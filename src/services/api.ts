import { ChatMessage, QuizQuestion, StudyRecommendation } from '../types';

export interface ChatResponse {
  text: string;
  suggestedFollowUps?: string[];
  groundedInNotes?: boolean;
}

export interface SummarizeResponse {
  summary: string;
  keyConcepts: string[];
}

export interface QuizGenerateResponse {
  questions: QuizQuestion[];
}

export interface ParsePdfResponse {
  text: string;
  pageCount: number;
  charCount: number;
  filename: string;
}

export class ApiService {
  static async sendChatMessage(payload: {
    messages: Array<{ role: string; content: string }>;
    notesContext?: string;
    isNotesOnly?: boolean;
    language?: string;
    studentLevel?: string;
    topic?: string;
  }): Promise<ChatResponse> {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch response from study assistant');
    }
    return res.json();
  }

  static async summarizeNotes(payload: {
    text: string;
    type: 'key_points' | 'executive' | 'cheat_sheet' | 'viva_ready';
    subject?: string;
    language?: string;
  }): Promise<SummarizeResponse> {
    const res = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to summarize notes');
    }
    return res.json();
  }

  static async generateQuiz(payload: {
    notesContext?: string;
    topic?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
    count?: number;
    language?: string;
  }): Promise<QuizGenerateResponse> {
    const res = await fetch('/api/quiz/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate quiz');
    }
    return res.json();
  }

  static async getRecommendations(payload: {
    studentName: string;
    quizHistory: any[];
    frequentTopics: string[];
    weakTopics: string[];
    notesTopic?: string;
  }): Promise<StudyRecommendation> {
    const res = await fetch('/api/recommendations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch study recommendations');
    }
    return res.json();
  }

  static async parsePdf(base64Data: string, filename: string): Promise<ParsePdfResponse> {
    const res = await fetch('/api/parse-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Data, filename }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to parse PDF document');
    }
    return res.json();
  }

  static async synthesizeSpeech(text: string): Promise<{ audioUrl?: string; fallback?: boolean }> {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: 'Kore' }),
      });
      if (!res.ok) return { fallback: true };
      const data = await res.json();
      if (data.audioData) {
        return { audioUrl: `data:audio/wav;base64,${data.audioData}` };
      }
      return { fallback: true };
    } catch {
      return { fallback: true };
    }
  }
}
