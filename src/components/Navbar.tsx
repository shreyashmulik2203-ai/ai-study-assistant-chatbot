import React from 'react';
import { 
  GraduationCap, 
  MessageSquare, 
  FileText, 
  HelpCircle, 
  BarChart3, 
  BookOpen, 
  User, 
  ShieldCheck, 
  Languages,
  Sparkles
} from 'lucide-react';
import { ActiveTab, AppLanguage, Student } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  isNotesOnly: boolean;
  setIsNotesOnly: (val: boolean) => void;
  student: Student;
  onOpenAuth: () => void;
  hasActiveNotes: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  isNotesOnly,
  setIsNotesOnly,
  student,
  onOpenAuth,
  hasActiveNotes,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">EduBot</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  AI Study Companion
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">AI-Powered Study Companion • B.Sc. CS</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/80">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Study Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'notes'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Notes & Summary</span>
              {hasActiveNotes && (
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <HelpCircle className="h-4 w-4" />
              <span>Quiz Generator</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('viva')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'viva'
                  ? 'bg-violet-600 text-white shadow-sm ring-1 ring-violet-400/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="h-4 w-4 text-violet-300" />
              <span>Viva & DB Hub</span>
              <span className="text-[9px] bg-violet-500/20 text-violet-300 px-1.5 py-0.2 rounded font-semibold">VIVA</span>
            </button>
          </nav>

          {/* Right Controls: Grounded Mode Toggle, Language, Student Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Grounded Notes Mode Toggle */}
            <button
              onClick={() => setIsNotesOnly(!isNotesOnly)}
              title={isNotesOnly ? "Strict Notes Mode Active: answers strictly from uploaded PDF" : "General Mode: answers from broader CS textbooks"}
              className={`hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-all ${
                isNotesOnly
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-800/70 text-slate-400 border-slate-700/60 hover:text-slate-300'
              }`}
            >
              <ShieldCheck className={`h-3.5 w-3.5 ${isNotesOnly ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{isNotesOnly ? 'Notes Grounded: ON' : 'General Mode'}</span>
            </button>

            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-xs text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
                <Languages className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden sm:inline font-medium">{language}</span>
              </button>
              <div className="absolute right-0 mt-1 w-32 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-1 hidden group-hover:block group-focus-within:block z-50">
                {(['English', 'Marathi', 'Hindi'] as AppLanguage[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`w-full text-left px-3 py-1.5 text-xs rounded-md transition-colors ${
                      language === lang
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {lang === 'English' ? 'English' : lang === 'Marathi' ? 'मराठी (Marathi)' : 'हिंदी (Hindi)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Student Auth / Profile Switch */}
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-750 px-2.5 py-1.5 rounded-lg border border-slate-700/80 transition-all text-left"
            >
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                {student.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-200 leading-none">{student.name.split(' ')[0]}</p>
                <p className="text-[10px] text-slate-400 leading-tight">{student.rollNo}</p>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-slate-800/80 gap-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 ${
              activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Study Chat
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 ${
              activeTab === 'notes' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Notes & Summary
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 ${
              activeTab === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Quiz
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('viva')}
            className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 flex items-center gap-1.5 ${
              activeTab === 'viva' ? 'bg-violet-600 text-white' : 'text-slate-400 bg-slate-900'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Viva & DB
          </button>
        </div>
      </div>
    </header>
  );
};
