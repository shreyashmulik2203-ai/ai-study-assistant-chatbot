import { Student, ChatMessage, QuizAttempt, NoteDocument } from '../types';
import { SAMPLE_NOTES } from '../data/sampleNotes';

const STORAGE_KEYS = {
  STUDENTS: 'edubot_students_v1',
  CURRENT_STUDENT: 'edubot_current_student_v1',
  CHAT_HISTORY: 'edubot_chat_history_v1',
  QUIZ_ATTEMPTS: 'edubot_quiz_attempts_v1',
  NOTES: 'edubot_notes_v1',
};

const DEFAULT_STUDENTS: Student[] = [
  {
    studentId: 101,
    name: 'Shreyash Mulik',
    email: 'shreyashmulik2203@gmail.com',
    rollNo: 'TY-CS-42',
    department: 'Computer Science',
    semester: 'Semester VI (Final Year)',
  },
  {
    studentId: 102,
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    rollNo: 'TY-CS-18',
    department: 'Computer Science',
    semester: 'Semester VI (Final Year)',
  },
  {
    studentId: 103,
    name: 'Pooja Patil',
    email: 'pooja.patil@college.edu',
    rollNo: 'TY-CS-31',
    department: 'Information Technology',
    semester: 'Semester VI (Final Year)',
  }
];

export class DatabaseService {
  // Students Table
  static getStudents(): Student[] {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(DEFAULT_STUDENTS));
      return DEFAULT_STUDENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_STUDENTS;
    }
  }

  static getCurrentStudent(): Student {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_STUDENT);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {}
    }
    const defaultStudent = this.getStudents()[0];
    this.setCurrentStudent(defaultStudent);
    return defaultStudent;
  }

  static setCurrentStudent(student: Student) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STUDENT, JSON.stringify(student));
  }

  static registerStudent(studentData: Omit<Student, 'studentId'>): Student {
    const students = this.getStudents();
    const newId = (students[students.length - 1]?.studentId || 100) + 1;
    const newStudent: Student = {
      ...studentData,
      studentId: newId,
    };
    students.push(newStudent);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    this.setCurrentStudent(newStudent);
    return newStudent;
  }

  static updateStudent(student: Student): Student {
    const students = this.getStudents();
    const idx = students.findIndex(s => s.studentId === student.studentId);
    if (idx >= 0) {
      students[idx] = student;
    } else {
      students.push(student);
    }
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    this.setCurrentStudent(student);
    return student;
  }

  // Notes Table
  static getNotes(): NoteDocument[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(SAMPLE_NOTES));
      return SAMPLE_NOTES;
    }
    try {
      const parsed = JSON.parse(raw);
      return parsed.length > 0 ? parsed : SAMPLE_NOTES;
    } catch {
      return SAMPLE_NOTES;
    }
  }

  static saveNote(note: NoteDocument): NoteDocument[] {
    const notes = this.getNotes();
    const index = notes.findIndex(n => n.id === note.id);
    if (index >= 0) {
      notes[index] = note;
    } else {
      notes.unshift(note);
    }
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    return notes;
  }

  static deleteNote(id: string): NoteDocument[] {
    const notes = this.getNotes().filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    return notes;
  }

  // Chat History Table
  static getChatHistory(studentId: number): ChatMessage[] {
    const raw = localStorage.getItem(`${STORAGE_KEYS.CHAT_HISTORY}_${studentId}`);
    if (!raw) {
      const initial: ChatMessage[] = [
        {
          id: 'welcome-1',
          chatId: 1,
          role: 'assistant',
          content: `👋 Hello **${this.getCurrentStudent().name}**! Welcome to **EduBot: AI-Powered Study Companion**. 

I am your 24×7 academic tutor for your B.Sc. Computer Science coursework. Here's how I can assist your studies today:
- 📖 **Explain Concepts**: Ask me anything from DBMS, OS, Networks, Algorithms, or Software Engineering.
- 📌 **Strict Notes Grounding**: Upload your lecture PDF and click **"Strict Notes Grounding Mode"** — I will answer strictly from your notes without hallucination.
- 📝 **1-Click Summarizer**: Condense 20 pages of notes into high-yield revision bullet points.
- 🎯 **Quiz & Exam Simulator**: Practice MCQs and True/False questions with instant explanations.

What topic would you like to master today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedFollowUps: [
            'Explain Normalization with 1NF, 2NF, 3NF examples',
            'What is the difference between TCP and UDP?',
            'Explain Deadlock conditions and Banker\'s algorithm',
          ],
        }
      ];
      localStorage.setItem(`${STORAGE_KEYS.CHAT_HISTORY}_${studentId}`, JSON.stringify(initial));
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveChatMessage(studentId: number, message: ChatMessage): ChatMessage[] {
    const history = this.getChatHistory(studentId);
    message.chatId = history.length + 1;
    history.push(message);
    localStorage.setItem(`${STORAGE_KEYS.CHAT_HISTORY}_${studentId}`, JSON.stringify(history));
    return history;
  }

  static clearChatHistory(studentId: number) {
    localStorage.removeItem(`${STORAGE_KEYS.CHAT_HISTORY}_${studentId}`);
  }

  // Quiz Attempts Table
  static getQuizAttempts(studentId: number): QuizAttempt[] {
    const raw = localStorage.getItem(`${STORAGE_KEYS.QUIZ_ATTEMPTS}_${studentId}`);
    if (!raw) {
      // Default pre-seeded attempt to make dashboard immediately rich for viva
      const seedAttempt: QuizAttempt = {
        quizId: 201,
        studentId: studentId,
        title: 'DBMS Normalization & ACID Test',
        subject: 'Database Management Systems',
        totalQuestions: 5,
        score: 4,
        percentage: 80,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        weakTopics: ['Indexing - B+ Trees'],
        userAnswers: { q1: 0, q2: 1, q3: 0, q4: 0, q5: 1 },
      };
      localStorage.setItem(`${STORAGE_KEYS.QUIZ_ATTEMPTS}_${studentId}`, JSON.stringify([seedAttempt]));
      return [seedAttempt];
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveQuizAttempt(attempt: Omit<QuizAttempt, 'quizId'>): QuizAttempt {
    const attempts = this.getQuizAttempts(attempt.studentId);
    const newId = 200 + attempts.length + 1;
    const newAttempt: QuizAttempt = {
      ...attempt,
      quizId: newId,
    };
    attempts.unshift(newAttempt);
    localStorage.setItem(`${STORAGE_KEYS.QUIZ_ATTEMPTS}_${attempt.studentId}`, JSON.stringify(attempts));
    return newAttempt;
  }

  // Export all relational tables for SQLite/MySQL Schema preview
  static getAllDatabaseTables() {
    const students = this.getStudents();
    const current = this.getCurrentStudent();
    const chats = this.getChatHistory(current.studentId);
    const quizzes = this.getQuizAttempts(current.studentId);
    const notes = this.getNotes();

    return {
      studentTable: students.map(s => ({
        StudentID: s.studentId,
        Name: s.name,
        Email: s.email,
        RollNo: s.rollNo,
        Department: s.department,
      })),
      chatHistoryTable: chats.map((c, i) => ({
        ChatID: c.chatId || i + 1,
        StudentID: current.studentId,
        Role: c.role,
        Snippet: c.content.slice(0, 60) + (c.content.length > 60 ? '...' : ''),
        Timestamp: c.timestamp,
        GroundedInNotes: c.groundedInNotes ? 'TRUE' : 'FALSE',
      })),
      quizTable: quizzes.map(q => ({
        QuizID: q.quizId,
        StudentID: q.studentId,
        Subject: q.subject,
        Score: `${q.score}/${q.totalQuestions}`,
        Percentage: `${q.percentage}%`,
        WeakTopics: q.weakTopics.join(', ') || 'None',
        Date: new Date(q.timestamp).toLocaleDateString(),
      })),
      notesTable: notes.map(n => ({
        NoteID: n.id,
        Title: n.title,
        Subject: n.subject,
        Pages: n.pageCount,
        Characters: n.charCount,
        UploadDate: n.uploadDate,
      })),
    };
  }
}
