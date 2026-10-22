import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  BookOpen, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  HelpCircle, 
  Trash2, 
  Plus, 
  Layers, 
  Zap, 
  Award,
  ArrowRight
} from 'lucide-react';
import { NoteDocument, AppLanguage } from '../types';
import { ApiService } from '../services/api';
import { DatabaseService } from '../services/database';

interface NotesModuleProps {
  notes: NoteDocument[];
  activeNote: NoteDocument | null;
  onSelectNote: (note: NoteDocument) => void;
  onNotesUpdated: () => void;
  onStartQuizFromNote: (note: NoteDocument) => void;
  language: AppLanguage;
}

export const NotesModule: React.FC<NotesModuleProps> = ({
  notes,
  activeNote,
  onSelectNote,
  onNotesUpdated,
  onStartQuizFromNote,
  language,
}) => {
  const [summaryMode, setSummaryMode] = useState<'key_points' | 'executive' | 'cheat_sheet' | 'viva_ready'>('key_points');
  const [summaryResult, setSummaryResult] = useState<string>('');
  const [keyConcepts, setKeyConcepts] = useState<string[]>([]);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Manual editor state
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editSubject, setEditSubject] = useState('');
  const [editContent, setEditContent] = useState('');

  // Handle PDF file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const base64Data = reader.result as string;
            const parseRes = await ApiService.parsePdf(base64Data, file.name);

            const newNote: NoteDocument = {
              id: `pdf-${Date.now()}`,
              title: file.name.replace('.pdf', ''),
              subject: 'Uploaded Notes',
              content: parseRes.text,
              pageCount: parseRes.pageCount || 1,
              charCount: parseRes.charCount || parseRes.text.length,
              uploadDate: new Date().toISOString().split('T')[0],
              isPreloaded: false,
            };

            DatabaseService.saveNote(newNote);
            onNotesUpdated();
            onSelectNote(newNote);
            setIsUploading(false);
          } catch (err: any) {
            setUploadError(err.message || 'Failed to extract text from PDF');
            setIsUploading(false);
          }
        };
        reader.readAsDataURL(file);
      } else {
        // Plain text / markdown
        const text = await file.text();
        const newNote: NoteDocument = {
          id: `txt-${Date.now()}`,
          title: file.name.replace(/\.[^/.]+$/, ''),
          subject: 'Custom Notes',
          content: text,
          pageCount: Math.ceil(text.length / 2500) || 1,
          charCount: text.length,
          uploadDate: new Date().toISOString().split('T')[0],
          isPreloaded: false,
        };
        DatabaseService.saveNote(newNote);
        onNotesUpdated();
        onSelectNote(newNote);
        setIsUploading(false);
      }
    } catch (err: any) {
      setUploadError('Failed to read file: ' + err.message);
      setIsUploading(false);
    }
  };

  // Generate Summary using Gemini endpoint
  const handleGenerateSummary = async (mode = summaryMode) => {
    if (!activeNote?.content) return;
    setIsSummarizing(true);
    setSummaryResult('');

    try {
      const res = await ApiService.summarizeNotes({
        text: activeNote.content,
        type: mode,
        subject: activeNote.subject,
        language: language,
      });

      setSummaryResult(res.summary);
      setKeyConcepts(res.keyConcepts || []);
    } catch (err: any) {
      setSummaryResult(`⚠️ **Error Generating Summary**: ${err.message || 'Please check your connection or try again.'}`);
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(summaryResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSummary = () => {
    const blob = new Blob([summaryResult], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote?.title || 'Notes'}_Summary.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateNewNote = () => {
    setEditTitle('');
    setEditSubject('Computer Science');
    setEditContent('');
    setIsEditing(true);
  };

  const handleSaveCustomNote = () => {
    if (!editTitle.trim() || !editContent.trim()) return;

    const newNote: NoteDocument = {
      id: `custom-${Date.now()}`,
      title: editTitle.trim(),
      subject: editSubject.trim() || 'Computer Science',
      content: editContent.trim(),
      charCount: editContent.length,
      pageCount: Math.ceil(editContent.length / 2500) || 1,
      uploadDate: new Date().toISOString().split('T')[0],
      isPreloaded: false,
    };

    DatabaseService.saveNote(newNote);
    onNotesUpdated();
    onSelectNote(newNote);
    setIsEditing(false);
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this note document?')) {
      const remaining = DatabaseService.deleteNote(id);
      onNotesUpdated();
      if (activeNote?.id === id) {
        onSelectNote(remaining[0] || null);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      
      {/* Module Title Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              Module 3 & 4
            </span>
            <span className="text-xs text-slate-400">Computer Science Academic Repository</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">PDF Notes Upload & 1-Click Summarizer</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Upload course lecture slides or textbook PDFs to extract text, produce instant structured revision sheets, and generate grounded exam quizzes.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-indigo-600/25 transition-all text-sm font-medium">
            <Upload className="h-4 w-4" />
            <span>Upload PDF / Text</span>
            <input
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={handleCreateNewNote}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2.5 rounded-xl border border-slate-700 transition-all text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="bg-rose-950/60 border border-rose-600/50 text-rose-200 p-3 rounded-xl text-xs flex items-center justify-between">
          <span>{uploadError}</span>
          <button onClick={() => setUploadError(null)} className="text-rose-400 font-bold ml-2">Dismiss</button>
        </div>
      )}

      {isUploading && (
        <div className="bg-indigo-950/40 border border-indigo-500/40 p-4 rounded-xl text-center animate-pulse">
          <p className="text-sm font-medium text-indigo-300">
            Extracting text and structure from PDF document via backend OCR/Parser...
          </p>
        </div>
      )}

      {/* Main Grid: Notes Sidebar & Content/Summary Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Repository of Notes (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-indigo-400" />
              Notes Repository ({notes.length})
            </h3>
            <span className="text-[11px] text-slate-400">Pre-loaded & Custom</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {notes.map((note) => {
              const isSelected = activeNote?.id === note.id;
              return (
                <div
                  key={note.id}
                  onClick={() => {
                    onSelectNote(note);
                    setSummaryResult('');
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <FileText className={`h-4 w-4 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <h4 className="text-sm font-semibold text-white truncate">{note.title}</h4>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{note.subject}</p>
                    </div>

                    {!note.isPreloaded && (
                      <button
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Delete note"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    <span>{note.pageCount} page(s)</span>
                    <span>•</span>
                    <span>{note.charCount.toLocaleString()} chars</span>
                    {note.isPreloaded && (
                      <span className="ml-auto text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                        Standard CS
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Note Content & Summarizer Engine (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {isEditing ? (
            /* Custom Note Editor */
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="h-4 w-4 text-indigo-400" /> Create Custom Study Note
              </h3>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g., Software Engineering - Agile vs Waterfall"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                <input
                  type="text"
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  placeholder="e.g., Software Engineering"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Content (Markdown supported)</label>
                <textarea
                  rows={10}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Paste lecture notes, syllabus concepts, code definitions..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustomNote}
                  className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md"
                >
                  Save to Notes Repository
                </button>
              </div>
            </div>
          ) : activeNote ? (
            /* Active Note Overview & Summarizer Engine */
            <div className="space-y-4">
              
              {/* Header Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {activeNote.subject}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">{activeNote.title}</h3>
                  </div>

                  {/* 1-Click Quick Quiz from these notes */}
                  <button
                    onClick={() => onStartQuizFromNote(activeNote)}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold px-3.5 py-2 rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Generate Quiz From This Note</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Summarizer Modes Tabs */}
                <div className="mt-5 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                      Module 4: One-Click Summary Generator
                    </span>
                    <span className="text-xs text-slate-400">Select summary format:</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      onClick={() => {
                        setSummaryMode('key_points');
                        handleGenerateSummary('key_points');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        summaryMode === 'key_points'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Layers className="h-4 w-4 text-indigo-400 mb-1" />
                      <p className="text-xs font-bold">Key Points</p>
                      <p className="text-[10px] text-slate-400">Bullet definitions</p>
                    </button>

                    <button
                      onClick={() => {
                        setSummaryMode('executive');
                        handleGenerateSummary('executive');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        summaryMode === 'executive'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <FileText className="h-4 w-4 text-indigo-400 mb-1" />
                      <p className="text-xs font-bold">1-Page Summary</p>
                      <p className="text-[10px] text-slate-400">Comprehensive review</p>
                    </button>

                    <button
                      onClick={() => {
                        setSummaryMode('cheat_sheet');
                        handleGenerateSummary('cheat_sheet');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        summaryMode === 'cheat_sheet'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Zap className="h-4 w-4 text-amber-400 mb-1" />
                      <p className="text-xs font-bold">Exam Cheat Sheet</p>
                      <p className="text-[10px] text-slate-400">Rules & Formulas</p>
                    </button>

                    <button
                      onClick={() => {
                        setSummaryMode('viva_ready');
                        handleGenerateSummary('viva_ready');
                      }}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        summaryMode === 'viva_ready'
                          ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/30'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Award className="h-4 w-4 text-violet-400 mb-1" />
                      <p className="text-xs font-bold">Viva Q&A Guide</p>
                      <p className="text-[10px] text-slate-400">Examiner questions</p>
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary Output Container */}
              {isSummarizing ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center animate-pulse">
                  <Sparkles className="h-8 w-8 text-indigo-400 mx-auto mb-2 animate-spin" />
                  <h4 className="text-base font-bold text-white">Synthesizing Notes into {summaryMode.replace('_', ' ').toUpperCase()}...</h4>
                  <p className="text-xs text-slate-400 mt-1">Filtering redundant text, identifying core definitions, and formatting key concepts.</p>
                </div>
              ) : summaryResult ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-400" />
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        Generated Academic Summary ({summaryMode.replace('_', ' ')})
                      </h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopySummary}
                        className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                      >
                        {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={handleDownloadSummary}
                        className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Export MD</span>
                      </button>
                    </div>
                  </div>

                  {/* Extracted Key Concepts tags */}
                  {keyConcepts.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-slate-400 font-semibold mr-1">Extracted Key Concepts:</span>
                      {keyConcepts.map((concept, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 px-2.5 py-0.5 rounded-full font-medium"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Markdown content */}
                  <div className="prose prose-invert prose-indigo max-w-none text-sm text-slate-200 leading-relaxed space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                    {summaryResult.split('\n\n').map((para, i) => {
                      if (para.startsWith('### ')) {
                        return <h4 key={i} className="font-bold text-indigo-300 text-base">{para.replace('### ', '')}</h4>;
                      }
                      if (para.startsWith('## ')) {
                        return <h3 key={i} className="font-bold text-white text-lg">{para.replace('## ', '')}</h3>;
                      }
                      if (para.startsWith('# ')) {
                        return <h2 key={i} className="font-bold text-white text-xl">{para.replace('# ', '')}</h2>;
                      }
                      if (para.includes('\n- ') || para.startsWith('- ')) {
                        const lines = para.split('\n');
                        return (
                          <ul key={i} className="list-disc pl-5 space-y-1">
                            {lines.map((line, lIdx) => (
                              <li key={lIdx}>
                                <span dangerouslySetInnerHTML={{ __html: line.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={i} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
                    })}
                  </div>
                </div>
              ) : (
                /* Raw note preview when no summary yet */
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400">
                    <span>Full Note Content Preview</span>
                    <button
                      onClick={() => handleGenerateSummary('key_points')}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="h-3.5 w-3.5" /> Click to Summarize Note
                    </button>
                  </div>
                  <pre className="font-mono text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800/80 max-h-80 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {activeNote.content}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <FileText className="h-10 w-10 text-slate-600 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-white">No Note Selected</h3>
              <p className="text-xs text-slate-400 mt-1">Select a note from the repository or upload a new PDF to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
