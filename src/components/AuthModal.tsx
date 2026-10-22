import React, { useState } from 'react';
import { X, User, Lock, Mail, BookMarked, Check, ArrowRight, UserCheck } from 'lucide-react';
import { Student } from '../types';
import { DatabaseService } from '../services/database';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: Student;
  onSelectStudent: (student: Student) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  onSelectStudent,
}) => {
  const [mode, setMode] = useState<'switch' | 'register'>('switch');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [password, setPassword] = useState('pass123');
  const [allStudents, setAllStudents] = useState<Student[]>(() => DatabaseService.getStudents());

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newStudent = DatabaseService.registerStudent({
      name: name.trim(),
      email: email.trim(),
      rollNo: rollNo.trim() || `CS-${Math.floor(10 + Math.random() * 89)}`,
      department: department,
      semester: 'Semester VI (Final Year)',
    });

    setAllStudents(DatabaseService.getStudents());
    onSelectStudent(newStudent);
    onClose();
  };

  const handleSwitch = (s: Student) => {
    DatabaseService.setCurrentStudent(s);
    onSelectStudent(s);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Module 1: Student Authentication</h3>
              <p className="text-xs text-slate-400">Manage user session & database student record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setMode('switch')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center transition-all ${
              mode === 'switch'
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Select Active Profile
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider text-center transition-all ${
              mode === 'register'
                ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register New Student
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === 'switch' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Switch between student accounts registered in the <code className="text-indigo-300 bg-slate-800 px-1 py-0.5 rounded">Student Table</code>:
              </p>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {allStudents.map((s) => {
                  const isCurrent = s.studentId === currentStudent.studentId;
                  return (
                    <div
                      key={s.studentId}
                      onClick={() => handleSwitch(s)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-indigo-600/15 border-indigo-500/50 shadow-sm ring-1 ring-indigo-500/30'
                          : 'bg-slate-800/40 border-slate-850 hover:bg-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm uppercase">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-semibold text-white">{s.name}</h4>
                            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                              ID: {s.studentId}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">
                            {s.rollNo} • {s.department}
                          </p>
                        </div>
                      </div>

                      {isCurrent ? (
                        <span className="flex items-center gap-1 text-xs text-indigo-400 font-semibold px-2 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                          <Check className="h-3.5 w-3.5" /> Active
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 flex items-center gap-1 hover:text-white">
                          Select <ArrowRight className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                <span>Database: Simulated SQLite / MySQL</span>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  + Add New Student
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Student Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Rajesh Kumar"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rajesh@college.edu"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Roll / Seat No.</label>
                  <div className="relative">
                    <BookMarked className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      placeholder="e.g., TY-CS-55"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Computer Science">Computer Science (B.Sc. CS)</option>
                    <option value="Information Technology">Information Technology (B.Sc. IT)</option>
                    <option value="Computer Engineering">Computer Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-sm flex items-center justify-center gap-2"
                >
                  <UserCheck className="h-4 w-4" /> Register & Login Student
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
