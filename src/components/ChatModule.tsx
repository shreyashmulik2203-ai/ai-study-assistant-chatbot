import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Trash2, 
  ShieldCheck, 
  BookOpen, 
  Sparkles, 
  FileText,
  AlertCircle,
  HelpCircle,
  CornerDownLeft
} from 'lucide-react';
import { ChatMessage, NoteDocument, Student, AppLanguage } from '../types';
import { ApiService } from '../services/api';
import { DatabaseService } from '../services/database';

interface ChatModuleProps {
  student: Student;
  activeNote: NoteDocument | null;
  allNotes: NoteDocument[];
  onSelectNote: (note: NoteDocument) => void;
  isNotesOnly: boolean;
  setIsNotesOnly: (val: boolean) => void;
  language: AppLanguage;
  onOpenNotesTab: () => void;
}

export const ChatModule: React.FC<ChatModuleProps> = ({
  student,
  activeNote,
  allNotes,
  onSelectNote,
  isNotesOnly,
  setIsNotesOnly,
  language,
  onOpenNotesTab,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => 
    DatabaseService.getChatHistory(student.studentId)
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Sync messages when student changes
  useEffect(() => {
    setMessages(DatabaseService.getChatHistory(student.studentId));
  }, [student.studentId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle Speech-to-Text via Web Speech API
  const toggleSpeechRecognition = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please type your query.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'Hindi' ? 'hi-IN' : language === 'Marathi' ? 'mr-IN' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => (prev ? `${prev} ${transcript}` : transcript));
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => setIsRecording(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  // Play audio TTS
  const playSpeech = async (msg: ChatMessage) => {
    if (playingAudioId === msg.id) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      window.speechSynthesis.cancel();
      setPlayingAudioId(null);
      return;
    }

    setPlayingAudioId(msg.id);

    // Try server-side Gemini TTS first
    try {
      const ttsRes = await ApiService.synthesizeSpeech(msg.content.slice(0, 400));
      if (ttsRes.audioUrl) {
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = ttsRes.audioUrl;
        audioRef.current.onended = () => setPlayingAudioId(null);
        audioRef.current.onerror = () => fallbackBrowserSpeech(msg.content);
        audioRef.current.play();
        return;
      }
    } catch {
      // Fallback to browser speech
    }

    fallbackBrowserSpeech(msg.content);
  };

  const fallbackBrowserSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 300));
      utterance.rate = 1.0;
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setPlayingAudioId(null);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Save and display user message
    const updatedHistory = DatabaseService.saveChatMessage(student.studentId, userMessage);
    setMessages(updatedHistory);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare payload with notes context if enabled
      const payloadMessages = updatedHistory.slice(-8).map(m => ({
        role: m.role,
        content: m.content,
      }));

      const res = await ApiService.sendChatMessage({
        messages: payloadMessages,
        notesContext: activeNote?.content || '',
        isNotesOnly: isNotesOnly && Boolean(activeNote),
        language: language,
        studentLevel: 'B.Sc. Computer Science Final Year',
        topic: activeNote?.subject || 'Computer Science',
      });

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundedInNotes: res.groundedInNotes,
        suggestedFollowUps: res.suggestedFollowUps,
      };

      const finalHistory = DatabaseService.saveChatMessage(student.studentId, assistantMessage);
      setMessages(finalHistory);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `⚠️ **Connection Error**: ${err.message || 'Unable to generate response. Please try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(DatabaseService.saveChatMessage(student.studentId, errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Clear conversation history for the current student?')) {
      DatabaseService.clearChatHistory(student.studentId);
      setMessages(DatabaseService.getChatHistory(student.studentId));
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-6xl mx-auto p-2 sm:p-4 gap-3">
      
      {/* Top Banner: Context & Grounding Control */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        
        {/* Left: Active Note Selector */}
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-300">Active Knowledge Base:</span>
          
          <select
            value={activeNote?.id || ''}
            onChange={(e) => {
              const note = allNotes.find(n => n.id === e.target.value);
              if (note) onSelectNote(note);
            }}
            className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white max-w-[220px] sm:max-w-xs truncate focus:outline-none focus:border-indigo-500"
          >
            {allNotes.map(n => (
              <option key={n.id} value={n.id}>
                {n.title} ({n.subject})
              </option>
            ))}
          </select>

          <button
            onClick={onOpenNotesTab}
            className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium ml-1"
          >
            Upload New PDF
          </button>
        </div>

        {/* Right: Grounding Status Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Strict Notes Mode:</span>
            <button
              onClick={() => setIsNotesOnly(!isNotesOnly)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isNotesOnly ? 'bg-emerald-600' : 'bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isNotesOnly ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button
            onClick={handleClearChat}
            title="Clear Chat History"
            className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grounded Mode Notice Bar if turned on */}
      {isNotesOnly && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl px-4 py-2 flex items-center justify-between text-xs text-emerald-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>
              <strong>Strict PDF Grounding Active:</strong> Chatbot answers only from "{activeNote?.title}". Outside facts and external hallucinations are rejected.
            </span>
          </div>
          <span className="text-[11px] bg-emerald-500/20 px-2 py-0.5 rounded font-mono text-emerald-300">
            Feature 1: Zero Hallucination
          </span>
        </div>
      )}

      {/* Chat Messages Area */}
      <div className="flex-1 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 overflow-y-auto space-y-4 shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group animate-in fade-in duration-150`}
            >
              {/* Message metadata */}
              <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400">
                <span className="font-semibold">{isUser ? student.name : 'EduBot'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
                {msg.groundedInNotes && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-600/30">
                    <ShieldCheck className="h-3 w-3" /> Note-Grounded
                  </span>
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`relative max-w-[90%] sm:max-w-[80%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed shadow-md ${
                  isUser
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none'
                    : 'bg-slate-800/90 border border-slate-700/70 text-slate-100 rounded-tl-none'
                }`}
              >
                {/* Content formatted */}
                <div className="space-y-2 prose prose-invert prose-sm max-w-none break-words">
                  {msg.content.split('\n\n').map((paragraph, idx) => {
                    // Render headers
                    if (paragraph.startsWith('### ')) {
                      return <h4 key={idx} className="font-bold text-indigo-300 text-base">{paragraph.replace('### ', '')}</h4>;
                    }
                    if (paragraph.startsWith('## ')) {
                      return <h3 key={idx} className="font-bold text-indigo-200 text-lg">{paragraph.replace('## ', '')}</h3>;
                    }
                    if (paragraph.startsWith('# ')) {
                      return <h2 key={idx} className="font-bold text-white text-xl">{paragraph.replace('# ', '')}</h2>;
                    }
                    // Render code blocks
                    if (paragraph.startsWith('```')) {
                      const codeContent = paragraph.replace(/```[a-z]*\n?/g, '');
                      return (
                        <pre key={idx} className="bg-slate-950 p-3 rounded-lg font-mono text-xs text-emerald-400 border border-slate-800 overflow-x-auto">
                          <code>{codeContent}</code>
                        </pre>
                      );
                    }
                    // Render bullet points
                    if (paragraph.includes('\n- ') || paragraph.startsWith('- ')) {
                      const lines = paragraph.split('\n');
                      return (
                        <ul key={idx} className="list-disc pl-5 space-y-1">
                          {lines.map((line, lIdx) => (
                            <li key={lIdx}>
                              <span dangerouslySetInnerHTML={{ __html: line.replace(/^- /, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    );
                  })}
                </div>

                {/* Assistant message action controls */}
                {!isUser && (
                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-700/60 text-slate-400">
                    <button
                      onClick={() => playSpeech(msg)}
                      title={playingAudioId === msg.id ? "Stop voice" : "Read explanation aloud"}
                      className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                        playingAudioId === msg.id
                          ? 'bg-indigo-600 text-white animate-pulse'
                          : 'hover:bg-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {playingAudioId === msg.id ? (
                        <>
                          <VolumeX className="h-3.5 w-3.5" />
                          <span>Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-3.5 w-3.5" />
                          <span>Read Aloud</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-slate-700 hover:text-slate-200 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Suggested follow-up questions */}
              {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 pl-1 max-w-[85%]">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="h-3 w-3 text-indigo-400" /> Suggested Viva Questions:
                  </span>
                  {msg.suggestedFollowUps.map((prompt, qIdx) => (
                    <button
                      key={qIdx}
                      onClick={() => handleSend(prompt)}
                      className="text-xs bg-slate-800/80 hover:bg-indigo-950/70 text-slate-300 hover:text-indigo-300 border border-slate-700/80 hover:border-indigo-500/50 px-2.5 py-1 rounded-full transition-all text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 text-sm text-slate-400 animate-pulse">
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce" />
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
            <span className="text-xs">EduBot is analyzing academic knowledge base...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2.5 shadow-xl">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          {/* Speech-to-text mic */}
          <button
            type="button"
            onClick={toggleSpeechRecognition}
            title={isRecording ? "Listening... click to stop" : "Speak query (Microphone)"}
            className={`p-2.5 rounded-xl transition-all ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse ring-2 ring-rose-400/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isNotesOnly
                ? `Ask anything strictly from "${activeNote?.title}"...`
                : 'Ask any academic question (e.g. Explain Normalization, Deadlock conditions)...'
            }
            disabled={isLoading}
            className="flex-1 bg-transparent px-2 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white p-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        {/* Input Footer Helper */}
        <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-slate-400 border-t border-slate-800/60 mt-1">
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-slate-300">Example:</span>
            <button
              onClick={() => handleSend('Explain Normalization in DBMS with 1NF, 2NF and 3NF examples')}
              className="text-indigo-400 hover:underline"
            >
              "Explain Normalization"
            </button>
            <span>•</span>
            <button
              onClick={() => handleSend('What are the 4 Coffman conditions for Deadlock?')}
              className="text-indigo-400 hover:underline"
            >
              "Deadlock Conditions"
            </button>
          </div>
          <span className="hidden sm:inline">Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};
