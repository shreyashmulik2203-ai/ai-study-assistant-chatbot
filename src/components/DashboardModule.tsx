import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Sparkles, 
  RotateCw, 
  ArrowRight,
  BookOpen,
  Target
} from 'lucide-react';
import { Student, QuizAttempt, StudyRecommendation, NoteDocument } from '../types';
import { DatabaseService } from '../services/database';
import { ApiService } from '../services/api';

interface DashboardModuleProps {
  student: Student;
  allNotes: NoteDocument[];
  onStartQuizOnTopic: (topic: string) => void;
  onNavigateToNotes: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  student,
  allNotes,
  onStartQuizOnTopic,
  onNavigateToNotes,
}) => {
  const [attempts, setAttempts] = useState<QuizAttempt[]>(() =>
    DatabaseService.getQuizAttempts(student.studentId)
  );
  const [recommendations, setRecommendations] = useState<StudyRecommendation | null>(null);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  useEffect(() => {
    const list = DatabaseService.getQuizAttempts(student.studentId);
    setAttempts(list);
  }, [student.studentId]);

  // Aggregate stats
  const totalQuizzes = attempts.length;
  const totalScore = attempts.reduce((acc, a) => acc + a.score, 0);
  const totalPossible = attempts.reduce((acc, a) => acc + a.totalQuestions, 0);
  const avgPercentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;

  // Aggregate all weak topics
  const allWeakTopics = Array.from(
    new Set(attempts.flatMap(a => a.weakTopics || []))
  );

  // Load study recommendations
  const loadRecommendations = async () => {
    setIsLoadingRecs(true);
    try {
      const recs = await ApiService.getRecommendations({
        studentName: student.name,
        quizHistory: attempts,
        frequentTopics: ['DBMS Normalization', 'Deadlock Detection', 'OS Paging'],
        weakTopics: allWeakTopics,
        notesTopic: 'Computer Science Core',
      });
      setRecommendations(recs);
    } catch (err: any) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setIsLoadingRecs(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [student.studentId]);

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              Module 6 & Feature 4
            </span>
            <span className="text-xs text-slate-400">Student Progress & Diagnostic Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Performance Dashboard & Study Recommendations</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time analytics on quiz attempts, accuracy rates, weak concept identification, and automated revision roadmaps for <span className="text-white font-medium">{student.name}</span>.
          </p>
        </div>

        <button
          onClick={loadRecommendations}
          disabled={isLoadingRecs}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-700 transition-all"
        >
          <RotateCw className={`h-3.5 w-3.5 ${isLoadingRecs ? 'animate-spin' : ''}`} />
          <span>Refresh Diagnostic</span>
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Quizzes */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quizzes Taken</span>
            <div className="h-8 w-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <BarChart3 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-2">{totalQuizzes}</p>
          <p className="text-xs text-slate-400 mt-1">Logged in Quiz Database Table</p>
        </div>

        {/* Card 2: Average Score */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Score</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-2">{avgPercentage}%</p>
          <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> {totalScore} of {totalPossible} questions correct
          </p>
        </div>

        {/* Card 3: Flagged Weak Topics */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weak Topics</span>
            <div className="h-8 w-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-2">{allWeakTopics.length}</p>
          <p className="text-xs text-slate-400 mt-1">Identified from wrong answers</p>
        </div>

        {/* Card 4: Academic Standing */}
        <div className="bg-slate-900/90 border border-slate-800 p-4 sm:p-5 rounded-2xl shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Viva Readiness</span>
            <div className="h-8 w-8 rounded-lg bg-violet-600/20 text-violet-400 flex items-center justify-center">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-bold text-white mt-2">
            {avgPercentage >= 75 ? 'Distinction' : avgPercentage >= 50 ? 'Prepared' : 'In Progress'}
          </p>
          <p className="text-xs text-slate-400 mt-1">Computer Science Dept</p>
        </div>
      </div>

      {/* Main Row: AI Study Recommendations & Weak Topic Quick Action */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: AI Study Recommendation System (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <h3 className="text-base font-bold text-white">Module 6: AI Study Recommendation Engine</h3>
            </div>
            <span className="text-[11px] bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded font-mono">
              Diagnostic Mode
            </span>
          </div>

          {isLoadingRecs ? (
            <div className="py-12 text-center animate-pulse">
              <Sparkles className="h-8 w-8 text-indigo-400 mx-auto mb-2 animate-spin" />
              <p className="text-sm font-semibold text-white">Analyzing quiz error patterns and study history...</p>
              <p className="text-xs text-slate-400 mt-1">Formulating 7-day personalized syllabus roadmap.</p>
            </div>
          ) : recommendations ? (
            <div className="space-y-4">
              
              {/* Summary Diagnostic */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed">
                <strong className="text-indigo-400 block mb-1">Academic Advisor Diagnosis:</strong>
                {recommendations.summary}
              </div>

              {/* 7-Day Targeted Action Plan */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-indigo-400" />
                  Recommended 7-Day Revision Schedule
                </h4>
                <div className="space-y-2">
                  {recommendations.actionPlan.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs"
                    >
                      <span className="font-bold text-indigo-400 shrink-0 w-16">{step.day}:</span>
                      <span className="text-slate-300 flex-1">{step.focus}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0 ${
                          step.priority === 'High'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        }`}
                      >
                        {step.priority} Priority
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Viva Defense Advice */}
              {recommendations.vivaTips && recommendations.vivaTips.length > 0 && (
                <div className="pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Award className="h-4 w-4" />
                    Viva Defense & Examination Tips
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {recommendations.vivaTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-violet-400 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Click Refresh to generate recommendations.</p>
          )}
        </div>

        {/* Right Column: Weak Topics Action Center & Quiz Log (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Weak Topics Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="h-4 w-4 text-amber-400" />
              Focus Areas & Weak Concepts
            </h3>
            <p className="text-xs text-slate-400">
              The algorithm flagged these topics where quiz answers were missed:
            </p>

            <div className="space-y-2">
              {allWeakTopics.length > 0 ? (
                allWeakTopics.map((topic, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-400" />
                      <span className="font-semibold text-slate-200">{topic}</span>
                    </div>
                    <button
                      onClick={() => onStartQuizOnTopic(topic)}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                    >
                      Practice <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-slate-400">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400 mx-auto mb-1" />
                  <p>Great job! No critical weak topics flagged.</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Quiz Attempts Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-400" />
              Recent Quiz History ({attempts.length})
            </h3>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {attempts.map((att) => (
                <div
                  key={att.quizId}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <h5 className="font-semibold text-white">{att.title}</h5>
                    <p className="text-[11px] text-slate-400">
                      {new Date(att.timestamp).toLocaleDateString()} • {att.subject}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`font-mono font-bold text-sm ${
                      att.percentage >= 75 ? 'text-emerald-400' :
                      att.percentage >= 50 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {att.score}/{att.totalQuestions} ({att.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
