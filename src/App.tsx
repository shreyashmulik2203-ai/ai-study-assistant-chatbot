import React, { useState, useEffect } from 'react';
import { ActiveTab, AppLanguage, NoteDocument, Student } from './types';
import { DatabaseService } from './services/database';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { ChatModule } from './components/ChatModule';
import { NotesModule } from './components/NotesModule';
import { QuizModule } from './components/QuizModule';
import { DashboardModule } from './components/DashboardModule';
import { VivaHubModule } from './components/VivaHubModule';

export default function App() {
  const [currentStudent, setCurrentStudent] = useState<Student>(() =>
    DatabaseService.getCurrentStudent()
  );
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [language, setLanguage] = useState<AppLanguage>('English');
  const [isNotesOnly, setIsNotesOnly] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Notes state
  const [notes, setNotes] = useState<NoteDocument[]>(() => DatabaseService.getNotes());
  const [activeNote, setActiveNote] = useState<NoteDocument | null>(() => notes[0] || null);

  const refreshNotes = () => {
    const updated = DatabaseService.getNotes();
    setNotes(updated);
  };

  const handleStartQuizFromNote = (note: NoteDocument) => {
    setActiveNote(note);
    setActiveTab('quiz');
  };

  const handleStartQuizOnTopic = (topic: string) => {
    setActiveTab('quiz');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        isNotesOnly={isNotesOnly}
        setIsNotesOnly={setIsNotesOnly}
        student={currentStudent}
        onOpenAuth={() => setIsAuthOpen(true)}
        hasActiveNotes={Boolean(activeNote)}
      />

      {/* Main Tab View */}
      <main className="flex-1 pb-10">
        {activeTab === 'chat' && (
          <ChatModule
            student={currentStudent}
            activeNote={activeNote}
            allNotes={notes}
            onSelectNote={setActiveNote}
            isNotesOnly={isNotesOnly}
            setIsNotesOnly={setIsNotesOnly}
            language={language}
            onOpenNotesTab={() => setActiveTab('notes')}
          />
        )}

        {activeTab === 'notes' && (
          <NotesModule
            notes={notes}
            activeNote={activeNote}
            onSelectNote={setActiveNote}
            onNotesUpdated={refreshNotes}
            onStartQuizFromNote={handleStartQuizFromNote}
            language={language}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizModule
            student={currentStudent}
            activeNote={activeNote}
            allNotes={notes}
            onQuizCompleted={() => {}}
            language={language}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardModule
            student={currentStudent}
            allNotes={notes}
            onStartQuizOnTopic={handleStartQuizOnTopic}
            onNavigateToNotes={() => setActiveTab('notes')}
          />
        )}

        {activeTab === 'viva' && (
          <VivaHubModule />
        )}
      </main>

      {/* Student Authentication & Profile Switch Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentStudent={currentStudent}
        onSelectStudent={(s) => setCurrentStudent(s)}
      />
    </div>
  );
}
