import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  FileText,
  AlertTriangle,
  Flame,
  Check,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, NoteDocument, Student, AppLanguage, QuizAttempt } from '../types';
import { ApiService } from '../services/api';
import { DatabaseService } from '../services/database';

interface QuizModuleProps {
  student: Student;
  activeNote: NoteDocument | null;
  allNotes: NoteDocument[];
  onQuizCompleted: () => void;
  language: AppLanguage;
}

export const QuizModule: React.FC<QuizModuleProps> = ({
  student,
  activeNote,
  allNotes,
  onQuizCompleted,
  language,
}) => {
  // Quiz Generator Configuration
  const [sourceMode, setSourceMode] = useState<'note' | 'topic'>('note');
  const [selectedNoteId, setSelectedNoteId] = useState<string>(activeNote?.id || allNotes[0]?.id || '');
  const [customTopic, setCustomTopic] = useState('Database Normalization & ACID');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Quiz State
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState<{ score: number; percentage: number; weakTopics: string[] } | null>(null);

  // Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning && !isSubmitted) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isSubmitted]);

  // Update selectedNoteId when activeNote changes
  useEffect(() => {
    if (activeNote) {
      setSelectedNoteId(activeNote.id);
    }
  }, [activeNote]);

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    setIsSubmitted(false);
    setUserAnswers({});
    setCurrentIndex(0);
    setScoreResult(null);

    const noteToUse = sourceMode === 'note' ? allNotes.find(n => n.id === selectedNoteId) : null;
    const topicToUse = sourceMode === 'note' ? (noteToUse?.subject || 'Computer Science') : customTopic;

    try {
      const res = await ApiService.generateQuiz({
        notesContext: noteToUse?.content || '',
        topic: topicToUse,
        difficulty: difficulty,
        count: questionCount,
        language: language,
      });

      if (res.questions && res.questions.length > 0) {
        setQuestions(res.questions);
        setTimerSeconds(0);
        setIsTimerRunning(true);
      } else {
        alert('Could not generate questions. Please try again with different notes or topics.');
      }
    } catch (err: any) {
      alert(`Quiz generation error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAnswer = (questionId: string, optionIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleSubmitQuiz = () => {
    if (Object.keys(userAnswers).length === 0) {
      alert('Please answer at least one question before submitting.');
      return;
    }

    setIsTimerRunning(false);

    let score = 0;
    const weakTopicsSet = new Set<string>();

    questions.forEach((q) => {
      const answered = userAnswers[q.id];
      if (answered === q.correctAnswer) {
        score += 1;
      } else {
        if (q.topicTag) weakTopicsSet.add(q.topicTag);
      }
    });

    const percentage = Math.round((score / questions.length) * 100);
    const weakTopics = Array.from(weakTopicsSet);

    setScoreResult({ score, percentage, weakTopics });
    setIsSubmitted(true);

    // Trigger celebration if percentage >= 80%
    if (percentage >= 80) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }

    // Save to Database Quiz Table
    const activeNoteObj = allNotes.find(n => n.id === selectedNoteId);
    DatabaseService.saveQuizAttempt({
      studentId: student.studentId,
      title: sourceMode === 'note' ? `${activeNoteObj?.title || 'Notes'} Quiz` : `${customTopic} Quiz`,
      subject: sourceMode === 'note' ? (activeNoteObj?.subject || 'Computer Science') : customTopic,
      totalQuestions: questions.length,
      score: score,
      percentage: percentage,
      timestamp: new Date().toISOString(),
      weakTopics: weakTopics,
      userAnswers: userAnswers,
    });

    onQuizCompleted();
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              Module 5 & Feature 3
            </span>
            <span className="text-xs text-slate-400">Interactive Exam Simulator & Evaluation</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Automatic Quiz Generator & Scorecard</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Test yourself with automatically generated MCQs, True/False, and conceptual viva questions grounded in your notes or syllabus topics.
          </p>
        </div>

        {questions.length > 0 && !isSubmitted && (
          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <Clock className="h-4 w-4 text-indigo-400 animate-pulse" />
            <span className="text-sm font-mono font-bold text-white">{formatTime(timerSeconds)}</span>
          </div>
        )}
      </div>

      {/* Quiz Generation Configuration Panel (If not taking quiz or want new quiz) */}
      {questions.length === 0 || isSubmitted ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              Configure & Generate New Quiz
            </h3>
            <span className="text-xs text-slate-400">Generates instant MCQs & answers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Source Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                1. Question Source
              </label>
              <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 mb-2">
                <button
                  type="button"
                  onClick={() => setSourceMode('note')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    sourceMode === 'note' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  From Uploaded Notes
                </button>
                <button
                  type="button"
                  onClick={() => setSourceMode('topic')}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    sourceMode === 'topic' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Custom Syllabus Topic
                </button>
              </div>

              {sourceMode === 'note' ? (
                <select
                  value={selectedNoteId}
                  onChange={(e) => setSelectedNoteId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {allNotes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.title} ({n.subject})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g., Computer Networks TCP Handshake, OS Paging"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              )}
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                2. Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Easy', 'Medium', 'Hard'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      difficulty === lvl
                        ? lvl === 'Easy'
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                          : lvl === 'Medium'
                          ? 'bg-amber-600/20 border-amber-500 text-amber-300'
                          : 'bg-rose-600/20 border-rose-500 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                3. Number of Questions
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[5, 8, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setQuestionCount(num)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                      questionCount === num
                        ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {num} Questions
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleGenerateQuiz}
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? 'AI is crafting university-grade questions...' : 'Generate Interactive Quiz Now'}
            </button>
          </div>
        </div>
      ) : null}

      {/* Active Quiz Test Taking Interface */}
      {questions.length > 0 && !isSubmitted && currentQ && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          
          {/* Question Stepper & Topic Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                Question {currentIndex + 1} of {questions.length}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">
                {currentQ.topicTag || 'Computer Science'}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                currentQ.difficulty === 'Easy' ? 'bg-emerald-500/20 text-emerald-400' :
                currentQ.difficulty === 'Hard' ? 'bg-rose-500/20 text-rose-400' :
                'bg-amber-500/20 text-amber-400'
              }`}>
                {currentQ.difficulty}
              </span>
            </div>

            {/* Answered Counter */}
            <span className="text-xs text-slate-400">
              Answered: {Object.keys(userAnswers).length} / {questions.length}
            </span>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((option, oIdx) => {
                const isSelected = userAnswers[currentQ.id] === oIdx;
                const optionLetter = String.fromCharCode(65 + oIdx);

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectAnswer(currentQ.id, oIdx)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/40 shadow-sm'
                        : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div
                      className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {optionLetter}
                    </div>
                    <span className="text-sm font-medium leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 px-3 py-2 rounded-lg bg-slate-800"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>

            {/* Quick jump pills */}
            <div className="hidden sm:flex items-center gap-1.5">
              {questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                    idx === currentIndex
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                      : userAnswers[q.id] !== undefined
                      ? 'bg-slate-800 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-950 text-slate-500 border border-slate-800'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(i => i + 1)}
                className="flex items-center gap-1.5 text-xs text-white px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-medium"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="flex items-center gap-1.5 text-xs text-white px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 font-semibold shadow-lg shadow-emerald-600/20"
              >
                <Check className="h-4 w-4" /> Submit & Evaluate
              </button>
            )}
          </div>
        </div>
      )}

      {/* Submitted Results & Scorecard Review */}
      {isSubmitted && scoreResult && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Scorecard Hero Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-4">
            <div className="inline-flex p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Award className="h-10 w-10" />
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Exam Scorecard: {scoreResult.percentage}%
              </h3>
              <p className="text-sm text-slate-300 mt-1">
                You correctly answered <span className="font-bold text-white">{scoreResult.score}</span> out of <span className="font-bold text-white">{questions.length}</span> questions.
              </p>
            </div>

            {/* Performance Grade Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-950 border border-slate-800">
              {scoreResult.percentage >= 85 ? (
                <span className="text-emerald-400">Distinction Grade (A+) • Ready for Final Viva</span>
              ) : scoreResult.percentage >= 60 ? (
                <span className="text-indigo-400">First Class (A) • Solid Conceptual Foundation</span>
              ) : (
                <span className="text-amber-400">Revision Recommended • See Diagnostic Study Plan</span>
              )}
            </div>

            {/* Weak Topics Detected Tag */}
            {scoreResult.weakTopics.length > 0 && (
              <div className="pt-2">
                <p className="text-xs text-amber-300 flex items-center justify-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" /> Weak Topics Flagged for Revision:
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 mt-2">
                  {scoreResult.weakTopics.map((wt, i) => (
                    <span key={i} className="text-xs bg-amber-950/60 border border-amber-600/40 text-amber-200 px-2.5 py-0.5 rounded-full">
                      {wt}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center gap-3 pt-3">
              <button
                onClick={handleGenerateQuiz}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-md"
              >
                <RotateCcw className="h-4 w-4" /> Retake Another Quiz
              </button>
            </div>
          </div>

          {/* Detailed Question Review & Explanations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Detailed Solutions & Viva Explanations
            </h4>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const studentAns = userAnswers[q.id];
                const isCorrect = studentAns === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border ${
                      isCorrect
                        ? 'bg-emerald-950/15 border-emerald-500/30'
                        : 'bg-rose-950/15 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-rose-400 shrink-0" />
                        )}
                        <h5 className="text-sm font-bold text-white">
                          Q{idx + 1}. {q.question}
                        </h5>
                      </div>
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 shrink-0">
                        {q.topicTag}
                      </span>
                    </div>

                    {/* Options list showing right and wrong */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 pl-7">
                      {q.options.map((opt, optIdx) => {
                        const isStudentChoice = studentAns === optIdx;
                        const isRightChoice = q.correctAnswer === optIdx;

                        return (
                          <div
                            key={optIdx}
                            className={`p-2.5 rounded-lg text-xs font-medium border flex items-center justify-between ${
                              isRightChoice
                                ? 'bg-emerald-500/10 border-emerald-500/60 text-emerald-200'
                                : isStudentChoice
                                ? 'bg-rose-500/10 border-rose-500/60 text-rose-200'
                                : 'bg-slate-950/50 border-slate-800/80 text-slate-400'
                            }`}
                          >
                            <span>
                              {String.fromCharCode(65 + optIdx)}. {opt}
                            </span>
                            {isRightChoice && (
                              <span className="text-[10px] font-bold text-emerald-400">Correct ✓</span>
                            )}
                            {isStudentChoice && !isRightChoice && (
                              <span className="text-[10px] font-bold text-rose-400">Your Answer ✗</span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    <div className="mt-3 pl-7 text-xs text-slate-300 bg-slate-950/80 p-3 rounded-lg border border-slate-800 leading-relaxed">
                      <strong className="text-indigo-400">Explanation & Viva Point:</strong> {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
