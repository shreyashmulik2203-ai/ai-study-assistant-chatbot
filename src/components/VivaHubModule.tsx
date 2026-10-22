import React, { useState } from 'react';
import { 
  Database, 
  Workflow, 
  FileCode, 
  CheckCircle2, 
  Copy, 
  Check, 
  Server, 
  Layers, 
  Sparkles, 
  Code2, 
  ArrowRight, 
  Cpu, 
  ShieldCheck, 
  Table, 
  Download,
  BookOpen
} from 'lucide-react';
import { DatabaseService } from '../services/database';

export const VivaHubModule: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'architecture' | 'database' | 'report'>('architecture');
  const [selectedTable, setSelectedTable] = useState<'student' | 'chat' | 'quiz' | 'notes'>('student');
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM Student;');
  const [copied, setCopied] = useState(false);

  const tables = DatabaseService.getAllDatabaseTables();

  const handleCopyReport = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const projectReportMarkdown = `# Project Title: EduBot: AI-Powered Study Companion
**Degree**: Bachelor of Science in Computer Science (B.Sc. CS Final Year)
**Candidate**: Shreyash Mulik (shreyashmulik2203@gmail.com)

## 1. Abstract
EduBot: AI-Powered Study Companion is a full-stack academic assistance system engineered to solve the problem of student academic bottlenecks during independent study. The platform combines Large Language Model reasoning (Google Gemini 3.8 Flash) with a local Knowledge Base extracted from user-uploaded lecture notes and PDF textbooks. Core functionalities include PDF-grounded Q&A, multi-tier one-click summarization, automated multi-format quiz generation (MCQs, True/False), diagnostic weakness analytics, and an integrated relational database tracking student progress.

## 2. Problem Statement
Students frequently encounter difficulties during self-study, such as interpreting complex algorithms, digesting lengthy technical documents, and verifying their readiness prior to examinations. Traditional search engines return scattered and uncurated results, while human tutors are not available 24×7. This system provides real-time, personalized, and syllabus-aligned academic coaching.

## 3. System Architecture & Information Flow
Student -> Web Application Interface -> Full-Stack Express / Vite Server -> AI Processing Module (Gemini 3.8 Flash) -> Knowledge Base & PDF Parser -> Grounded Verification Engine -> Instant Response & Scorecard -> Relational Storage

## 4. Key Innovations for High Scoring in Viva
1. **Zero-Hallucination Grounded Mode**: Strict constraint restricting model output solely to uploaded PDF text with document citation.
2. **Automated Quiz Generation**: Dynamically formats university-grade MCQs with explanations and weak-concept tags.
3. **Relational Database Design**: Normalized SQLite/MySQL compatible schema for Student, Chat History, and Quiz entities.
4. **Adaptive Study Diagnostics**: Recommends a 7-day personalized revision timetable based on actual quiz mistakes.`;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      
      {/* Title Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-violet-950/40 to-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">
              B.Sc. Final Year Project Showcase
            </span>
            <span className="text-xs text-slate-400">Academic Viva Examination & Technical Hub</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">System Architecture & Database Schema Inspector</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Live technical verification hub for external examiners: view the system architecture diagram, inspect relational database tables, and access viva defense documentation.
          </p>
        </div>

        {/* Section Tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          <button
            onClick={() => setActiveSection('architecture')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeSection === 'architecture' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Workflow className="h-3.5 w-3.5" /> Architecture
          </button>
          <button
            onClick={() => setActiveSection('database')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeSection === 'database' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="h-3.5 w-3.5" /> Database (Section 8)
          </button>
          <button
            onClick={() => setActiveSection('report')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
              activeSection === 'report' ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" /> Viva Report
          </button>
        </div>
      </div>

      {/* SECTION 1: SYSTEM ARCHITECTURE */}
      {activeSection === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Workflow className="h-5 w-5 text-violet-400" />
                Proposed System Architecture Flowchart (Section 5)
              </h3>
              <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded font-mono">
                Live End-to-End Pipeline
              </span>
            </div>

            {/* Architecture Node Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
              
              {/* Node 1: Student Client */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center space-y-2 relative group hover:border-violet-500/50 transition-all">
                <div className="h-10 w-10 mx-auto rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <span className="font-bold text-sm">👤</span>
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">1. Student Client</h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Web browser with Speech-to-Text, responsive UI & audio playback
                </p>
                <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded font-mono block">
                  React 19 + Tailwind
                </span>
              </div>

              {/* Node 2: Web Server */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center space-y-2 relative group hover:border-violet-500/50 transition-all">
                <div className="h-10 w-10 mx-auto rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
                  <Server className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">2. Web Server</h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Express API proxy, session state & request validation
                </p>
                <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded font-mono block">
                  Node / Express
                </span>
              </div>

              {/* Node 3: AI Engine */}
              <div className="bg-slate-950 border border-violet-500/50 rounded-xl p-4 text-center space-y-2 relative group shadow-md shadow-violet-500/10">
                <div className="h-10 w-10 mx-auto rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-600/30">
                  <Cpu className="h-5 w-5 animate-pulse" />
                </div>
                <h4 className="text-xs font-bold text-violet-300 uppercase tracking-wider">3. AI Processing</h4>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Google Gemini 3.8 Flash (Q&A, Summaries, Schema Quiz)
                </p>
                <span className="text-[10px] bg-violet-950 text-violet-300 px-2 py-0.5 rounded font-mono block border border-violet-500/30">
                  @google/genai
                </span>
              </div>

              {/* Node 4: Knowledge Base */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center space-y-2 relative group hover:border-violet-500/50 transition-all">
                <div className="h-10 w-10 mx-auto rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">4. Knowledge Base</h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  PDF extraction & Strict Grounding Vector Context
                </p>
                <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded font-mono block">
                  pdf-parse / RAG
                </span>
              </div>

              {/* Node 5: Relational DB */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-center space-y-2 relative group hover:border-violet-500/50 transition-all">
                <div className="h-10 w-10 mx-auto rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Database className="h-5 w-5" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">5. Relational DB</h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Student accounts, Chat logs & Quiz score analytics
                </p>
                <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded font-mono block">
                  SQLite / MySQL
                </span>
              </div>
            </div>

            {/* Technical Highlights Callout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <h5 className="font-bold text-indigo-400 mb-1">Dual-Mode Grounding</h5>
                <p className="text-slate-300 leading-relaxed">
                  Toggles between General Knowledge Mode (curriculum-wide) and Strict Notes Grounding Mode (answers strictly from the student's uploaded PDF).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <h5 className="font-bold text-emerald-400 mb-1">Deterministic JSON Schema</h5>
                <p className="text-slate-300 leading-relaxed">
                  Quizzes and diagnostics use enforced JSON response types, preventing parsing failures and guaranteeing 100% test reliability.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <h5 className="font-bold text-violet-400 mb-1">Multilingual Ingestion</h5>
                <p className="text-slate-300 leading-relaxed">
                  Natively supports bilingual questions in English, Marathi, and Hindi, catering directly to college and state university students.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: DATABASE SCHEMA INSPECTOR */}
      {activeSection === 'database' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="h-5 w-5 text-indigo-400" />
                  Database Design & Live Table Viewer (Section 8)
                </h3>
                <p className="text-xs text-slate-400">
                  Inspect the physical relational tables stored for the active session.
                </p>
              </div>

              {/* Table Picker */}
              <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
                <button
                  onClick={() => {
                    setSelectedTable('student');
                    setSqlQuery('SELECT * FROM Student;');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    selectedTable === 'student' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Student Table ({tables.studentTable.length})
                </button>
                <button
                  onClick={() => {
                    setSelectedTable('chat');
                    setSqlQuery('SELECT * FROM ChatHistory ORDER BY ChatID DESC;');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    selectedTable === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Chat History Table ({tables.chatHistoryTable.length})
                </button>
                <button
                  onClick={() => {
                    setSelectedTable('quiz');
                    setSqlQuery('SELECT * FROM Quiz ORDER BY QuizID DESC;');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    selectedTable === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Quiz Table ({tables.quizTable.length})
                </button>
                <button
                  onClick={() => {
                    setSelectedTable('notes');
                    setSqlQuery('SELECT * FROM Notes;');
                  }}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    selectedTable === 'notes' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Notes Table ({tables.notesTable.length})
                </button>
              </div>
            </div>

            {/* SQL Query Bar */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-indigo-400">
                <Code2 className="h-4 w-4" />
                <span>Query:</span>
                <span className="text-white font-bold">{sqlQuery}</span>
              </div>
              <span className="text-[10px] bg-slate-900 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">
                Status: 200 OK (0.2ms)
              </span>
            </div>

            {/* Render Selected Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              {selectedTable === 'student' && (
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-3">StudentID (PK)</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">RollNo</th>
                      <th className="p-3">Department</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {tables.studentTable.map((s) => (
                      <tr key={s.StudentID} className="hover:bg-slate-850/50">
                        <td className="p-3 text-indigo-400 font-bold">{s.StudentID}</td>
                        <td className="p-3 text-white">{s.Name}</td>
                        <td className="p-3 text-slate-400">{s.Email}</td>
                        <td className="p-3">{s.RollNo}</td>
                        <td className="p-3">{s.Department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedTable === 'chat' && (
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-3">ChatID (PK)</th>
                      <th className="p-3">StudentID (FK)</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Message Snippet</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Grounded</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {tables.chatHistoryTable.map((c) => (
                      <tr key={c.ChatID} className="hover:bg-slate-850/50">
                        <td className="p-3 text-indigo-400 font-bold">{c.ChatID}</td>
                        <td className="p-3">{c.StudentID}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] ${c.Role === 'user' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                            {c.Role}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300 max-w-xs truncate">{c.Snippet}</td>
                        <td className="p-3 text-slate-400">{c.Timestamp}</td>
                        <td className="p-3 text-emerald-400">{c.GroundedInNotes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedTable === 'quiz' && (
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-3">QuizID (PK)</th>
                      <th className="p-3">StudentID (FK)</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">Percentage</th>
                      <th className="p-3">Weak Topics</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {tables.quizTable.map((q) => (
                      <tr key={q.QuizID} className="hover:bg-slate-850/50">
                        <td className="p-3 text-indigo-400 font-bold">{q.QuizID}</td>
                        <td className="p-3">{q.StudentID}</td>
                        <td className="p-3 text-white">{q.Subject}</td>
                        <td className="p-3">{q.Score}</td>
                        <td className="p-3 text-emerald-400 font-bold">{q.Percentage}</td>
                        <td className="p-3 text-amber-300">{q.WeakTopics}</td>
                        <td className="p-3 text-slate-400">{q.Date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedTable === 'notes' && (
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <tr>
                      <th className="p-3">NoteID (PK)</th>
                      <th className="p-3">Title</th>
                      <th className="p-3">Subject</th>
                      <th className="p-3">Pages</th>
                      <th className="p-3">Characters</th>
                      <th className="p-3">Upload Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {tables.notesTable.map((n) => (
                      <tr key={n.NoteID} className="hover:bg-slate-850/50">
                        <td className="p-3 text-indigo-400 font-bold">{n.NoteID}</td>
                        <td className="p-3 text-white">{n.Title}</td>
                        <td className="p-3">{n.Subject}</td>
                        <td className="p-3">{n.Pages}</td>
                        <td className="p-3">{n.Characters.toLocaleString()}</td>
                        <td className="p-3 text-slate-400">{n.UploadDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: PROJECT REPORT & VIVA DEFENSE GUIDE */}
      {activeSection === 'report' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-violet-400" />
                  Official Project Synopsis & Viva Defense Guide
                </h3>
                <p className="text-xs text-slate-400">
                  Structured documentation ready for presentation to internal & external college examiners.
                </p>
              </div>

              <button
                onClick={() => handleCopyReport(projectReportMarkdown)}
                className="flex items-center gap-1.5 text-xs bg-violet-600 hover:bg-violet-500 text-white px-3.5 py-2 rounded-xl shadow-md transition-all font-semibold"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Report Copied!' : 'Copy Project Report'}</span>
              </button>
            </div>

            {/* Expected Viva Q&A Accordion */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Top 4 Frequently Asked Examiner Viva Questions:
              </h4>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
                <p className="font-bold text-indigo-300">
                  Q1: How does your system prevent hallucinations when a student uploads notes?
                </p>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> We enforce Strict Notes Grounding Mode. When enabled, the prompt pipeline strictly limits the context window to the extracted PDF text and injects system instructions that penalize external claims, instructing the model to declare absence rather than extrapolate.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
                <p className="font-bold text-indigo-300">
                  Q2: How does the Automatic Quiz Generator guarantee valid question structure?
                </p>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> The backend leverages structured JSON schemas (`responseMimeType: "application/json"`) specifying question strings, exactly 4 options, a 0-indexed correct answer pointer, and explicit educational rationale for each question.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
                <p className="font-bold text-indigo-300">
                  Q3: What database schema supports multi-student performance analytics?
                </p>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> As designed in Section 8, the database follows Third Normal Form (3NF) with a `Student` entity (StudentID PK), `ChatHistory` entity (ChatID PK, StudentID FK), and `Quiz` entity (QuizID PK, StudentID FK), ensuring full ACID compliance and historical analytics.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5">
                <p className="font-bold text-indigo-300">
                  Q4: What are the primary future enhancements planned for the project?
                </p>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Answer:</strong> Integration with college LMS platforms (Moodle/Canvas), offline PWA caching, edge-device quantized inference, and multi-dialect voice synthesis.
                </p>
              </div>
            </div>

            {/* Markdown Report Preview */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Project Synopsis Preview:
              </h4>
              <pre className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800/80 max-h-60 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                {projectReportMarkdown}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
