import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  AlertTriangle, 
  ChevronDown, 
  Plus, 
  BookOpen, 
  MapPin, 
  Sparkles,
  CheckCircle,
  X
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function ExamCountdown({ exams, activeExamId, onSelectExam, onAddExam }) {
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, totalHours: 0 });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newExamType, setNewExamType] = useState('Final Semester Exam');
  const [newDaysOffset, setNewDaysOffset] = useState('5');
  const [newLocation, setNewLocation] = useState('Main Examination Hall');

  const activeExam = exams.find(e => e.id === activeExamId) || exams[0] || null;

  useEffect(() => {
    if (!activeExam) return;

    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(activeExam.date).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0, totalHours: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const totalHours = Math.round(diff / (1000 * 60 * 60));

      setTimeRemaining({ days, hours, minutes, seconds, totalHours });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [activeExam]);

  if (!activeExam) return null;

  const isUrgent = timeRemaining.days < 5;

  const handleCreateExam = (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    const targetDate = new Date(Date.now() + parseFloat(newDaysOffset || 5) * 24 * 60 * 60 * 1000).toISOString();
    const created = {
      id: `exam-${Date.now()}`,
      subject: newSubject.trim(),
      examType: newExamType,
      date: targetDate,
      topics: ['Key Chapter Review', 'Past Year Numericals', 'Important Viva Questions'],
      location: newLocation,
      weight: '30% of Grade'
    };

    onAddExam(created);
    setShowAddModal(false);
    setNewSubject('');
    sounds.playSuccess();
  };

  return (
    <div className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
      isUrgent 
        ? 'border-purple-500/50 bg-gradient-to-r from-[#1E1428] via-[#1A1A22] to-[#14141A] shadow-glow-purple-sm' 
        : 'border-[#2E2E38] bg-[#1A1A1E]'
    } p-4 sm:p-5 mb-6`}>
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-10" />

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left: Exam Info & Switcher */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {isUrgent && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Urgent Priority Boost (&lt; 5 Days)</span>
              </span>
            )}
            <span className="text-[11px] font-mono text-purple-400 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
              {activeExam.examType}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-500" />
              {activeExam.location}
            </span>
          </div>

          <div className="flex items-center gap-2 relative">
            <h2 className="text-base sm:text-xl font-bold text-white tracking-tight truncate">
              {activeExam.subject}
            </h2>

            {/* Exam Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-1 text-gray-400 hover:text-white rounded-lg hover:bg-[#26262E] transition-colors"
                title="Switch Exam or Add Exam"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showDropdown && (
                <div className="absolute left-0 mt-2 w-72 rounded-xl bg-[#1A1A20] border border-[#2E2E38] shadow-2xl p-2 z-50 animate-fade-in backdrop-blur-xl">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-gray-400 px-2 py-1 mb-1">
                    Select Target Exam
                  </div>
                  <div className="space-y-1">
                    {exams.map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => {
                          onSelectExam(ex.id);
                          setShowDropdown(false);
                          sounds.playPop();
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                          ex.id === activeExam.id
                            ? 'bg-purple-600/20 text-purple-200 font-semibold border border-purple-500/30'
                            : 'text-gray-300 hover:bg-[#26262E] hover:text-white'
                        }`}
                      >
                        <span className="truncate pr-2">{ex.subject}</span>
                        {ex.id === activeExam.id && <CheckCircle className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-[#2E2E38] mt-2 pt-2">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setShowAddModal(true);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-purple-300 hover:bg-purple-500/10 flex items-center gap-1.5 font-medium transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Target Exam</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Topics tag pills */}
          {activeExam.topics && activeExam.topics.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
              <span className="text-[10px] text-gray-400 uppercase font-mono">High Yield:</span>
              {activeExam.topics.map((t, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 rounded-md bg-[#22222A] text-gray-300 border border-[#2E2E38]"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: High-Density Countdown Blocks */}
        <div className="flex items-center gap-2 sm:gap-3 self-center lg:self-auto">
          <div className="flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] py-2 px-2.5 rounded-xl bg-[#141418] border border-[#2E2E38]">
            <span className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight">
              {String(timeRemaining.days).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase font-mono text-gray-400 mt-0.5">Days</span>
          </div>

          <span className="text-gray-600 font-bold">:</span>

          <div className="flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] py-2 px-2.5 rounded-xl bg-[#141418] border border-[#2E2E38]">
            <span className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight">
              {String(timeRemaining.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase font-mono text-gray-400 mt-0.5">Hours</span>
          </div>

          <span className="text-gray-600 font-bold">:</span>

          <div className="flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] py-2 px-2.5 rounded-xl bg-[#141418] border border-[#2E2E38]">
            <span className="text-xl sm:text-2xl font-mono font-bold text-white tracking-tight">
              {String(timeRemaining.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase font-mono text-gray-400 mt-0.5">Mins</span>
          </div>

          <span className="text-gray-600 font-bold hidden sm:inline">:</span>

          <div className="hidden sm:flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] py-2 px-2.5 rounded-xl bg-[#141418] border border-[#2E2E38]">
            <span className="text-xl sm:text-2xl font-mono font-bold text-purple-400 tracking-tight">
              {String(timeRemaining.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase font-mono text-gray-400 mt-0.5">Secs</span>
          </div>
        </div>
      </div>

      {/* Add Exam Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#1A1A20] border border-[#2E2E38] rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E2E38] mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-semibold text-white">Add Target Exam / Assessment</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Course / Subject Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Networks & Protocols"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#121214] border border-[#2E2E38] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Assessment Type</label>
                  <select
                    value={newExamType}
                    onChange={(e) => setNewExamType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#121214] border border-[#2E2E38] rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Final Semester Exam">Final Semester Exam</option>
                    <option value="Midterm & Viva">Midterm & Viva</option>
                    <option value="Lab Practical">Lab Practical</option>
                    <option value="Certification Exam">Certification Exam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Days Until Exam</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={newDaysOffset}
                    onChange={(e) => setNewDaysOffset(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#121214] border border-[#2E2E38] rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Location / Platform</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Lab 4 / Hall A"
                  className="w-full px-3 py-2 text-sm bg-[#121214] border border-[#2E2E38] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 text-xs font-medium text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-glow-purple-sm transition-all"
                >
                  Set Exam Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
