import React, { useState } from 'react';
import { 
  Sparkles, 
  User, 
  Calendar, 
  BookOpen, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Flame, 
  MapPin, 
  GraduationCap, 
  Zap, 
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export default function OnboardingModal({
  isOpen,
  onClose,
  onComplete,
  initialData = null,
  isEditMode = false
}) {
  const [step, setStep] = useState(1);

  // Step 1: User Profile
  const [name, setName] = useState(initialData?.userProfile?.name || '');
  const [studyGoal, setStudyGoal] = useState(initialData?.userProfile?.studyGoal || 'Semester Finals & Placements');

  // Step 2: Target Exams (list)
  const defaultExams = initialData?.exams && initialData.exams.length > 0 
    ? initialData.exams 
    : [
        {
          id: 'exam-1',
          subject: 'Data Structures & Algorithms',
          examType: 'Final Semester Exam',
          date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          location: 'Hall B - Engineering Block 3',
          weight: '40% of Final Grade',
          topics: ['Dynamic Programming', 'Graph Theory', 'Trees']
        }
      ];
  const [examsList, setExamsList] = useState(defaultExams);

  // Step 3: Subjects / Modules with priorities
  const defaultSubjects = initialData?.userProfile?.subjects && initialData.userProfile.subjects.length > 0
    ? initialData.userProfile.subjects
    : [
        { id: 'subj-1', name: 'Data Structures & Algorithms', priority: 'Critical', category: 'Academics' },
        { id: 'subj-2', name: 'Operating Systems & Concurrency', priority: 'High', category: 'Academics' },
        { id: 'subj-3', name: 'Core System Design / Coding', priority: 'Medium', category: 'Core Coding' }
      ];
  const [subjectsList, setSubjectsList] = useState(defaultSubjects);

  // New subject draft
  const [newSubjName, setNewSubjName] = useState('');
  const [newSubjPriority, setNewSubjPriority] = useState('High');

  // New exam draft
  const [newExamSubject, setNewExamSubject] = useState('');
  const [newExamType, setNewExamType] = useState('Final Semester Exam');
  const [newExamDate, setNewExamDate] = useState(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [newExamLocation, setNewExamLocation] = useState('Examination Hall A');

  if (!isOpen) return null;

  // Quick fill with engineering demo
  const handleLoadDemo = () => {
    sounds.playSuccess?.();
    setName('Alex');
    setStudyGoal('Computer Science & Placement Prep');
    setExamsList([
      {
        id: 'exam-1',
        subject: 'Data Structures & Algorithms (CS301)',
        examType: 'Final Semester Exam',
        date: new Date(Date.now() + 3.5 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Hall B - Engineering Block 3',
        weight: '40% of Final Grade',
        topics: ['AVL Trees', 'Graph Shortest Paths', 'Dynamic Programming']
      },
      {
        id: 'exam-2',
        subject: 'Operating Systems & Concurrency (CS304)',
        examType: 'Midterm & Viva',
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'CS Lab 2',
        weight: '25% of Final Grade',
        topics: ['Virtual Memory', 'Deadlocks', 'Semaphores']
      }
    ]);
    setSubjectsList([
      { id: 'subj-1', name: 'Data Structures & Algorithms', priority: 'Critical', category: 'Academics' },
      { id: 'subj-2', name: 'Operating Systems & Concurrency', priority: 'High', category: 'Academics' },
      { id: 'subj-3', name: 'Core Java & System Design', priority: 'Medium', category: 'Core Coding' }
    ]);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#A855F7', '#38BDF8', '#10B981']
    });
  };

  // Add exam to list
  const handleAddExam = () => {
    if (!newExamSubject.trim()) return;
    const newExam = {
      id: `exam-${Date.now()}`,
      subject: newExamSubject.trim(),
      examType: newExamType,
      date: new Date(newExamDate).toISOString(),
      location: newExamLocation.trim() || 'Main Examination Block',
      weight: '30% of Grade',
      topics: [newExamSubject.trim()]
    };
    setExamsList(prev => [...prev, newExam]);
    setNewExamSubject('');
    sounds.playPop?.();
  };

  const handleRemoveExam = (id) => {
    if (examsList.length <= 1) return;
    setExamsList(prev => prev.filter(e => e.id !== id));
    sounds.playPop?.();
  };

  // Add subject to list
  const handleAddSubject = () => {
    if (!newSubjName.trim()) return;
    const newSubj = {
      id: `subj-${Date.now()}`,
      name: newSubjName.trim(),
      priority: newSubjPriority,
      category: 'Academics'
    };
    setSubjectsList(prev => [...prev, newSubj]);
    setNewSubjName('');
    sounds.playPop?.();
  };

  const handleRemoveSubject = (id) => {
    if (subjectsList.length <= 1) return;
    setSubjectsList(prev => prev.filter(s => s.id !== id));
    sounds.playPop?.();
  };

  // Generate dynamic tasks based on subjects & exams
  const generatePersonalizedTasks = () => {
    const tasks = [];
    let count = 1;

    // Generate high-yield tasks for each subject
    subjectsList.forEach((subj) => {
      const isCritical = subj.priority === 'Critical';
      const duration = isCritical ? 60 : subj.priority === 'High' ? 45 : 30;

      tasks.push({
        id: `task-${Date.now()}-${count++}`,
        title: `Deep Review: Core concepts & theorem derivations in ${subj.name}`,
        category: subj.category || 'Academics',
        priority: subj.priority === 'Critical' ? 'High' : subj.priority,
        duration: duration,
        completed: false,
        examCritical: isCritical || subj.priority === 'High',
        energyNeeded: isCritical ? 'High' : 'Medium',
        notes: `High-yield syllabus item targeted for upcoming milestones.`,
        createdAt: new Date().toISOString()
      });

      tasks.push({
        id: `task-${Date.now()}-${count++}`,
        title: `Active Recall Practice: Solve 5 challenging problem sets for ${subj.name}`,
        category: subj.category || 'Academics',
        priority: subj.priority === 'Critical' ? 'High' : 'Medium',
        duration: Math.max(30, duration - 15),
        completed: false,
        examCritical: isCritical,
        energyNeeded: 'High',
        notes: `Verify edge cases and time complexity under timed conditions.`,
        createdAt: new Date().toISOString()
      });
    });

    // Add cognitive restoration task
    tasks.push({
      id: `task-${Date.now()}-${count++}`,
      title: '30-minute cognitive decompression, hydration & posture stretching',
      category: 'Personal Goals',
      priority: 'Low',
      duration: 30,
      completed: false,
      examCritical: false,
      energyNeeded: 'Low',
      notes: 'Essential to reset attention span between deep study blocks.',
      createdAt: new Date().toISOString()
    });

    return tasks;
  };

  const handleFinish = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setStep(1);
      return;
    }

    const finalProfile = {
      name: name.trim(),
      studyGoal: studyGoal.trim(),
      subjects: subjectsList,
      onboarded: true,
      updatedAt: new Date().toISOString()
    };

    // If edit mode and already had tasks, keep them or append, otherwise generate
    const generatedTasks = isEditMode && initialData?.tasks?.length > 0 
      ? initialData.tasks 
      : generatePersonalizedTasks();

    sounds.playSuccess?.();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#A855F7', '#EC4899', '#38BDF8', '#10B981']
    });

    onComplete({
      userProfile: finalProfile,
      exams: examsList,
      tasks: generatedTasks
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#16161A]/95 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Glow Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500" />

        {/* Modal Header */}
        <div className="px-6 pt-5 pb-3 border-b border-[#2A2A34] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <span>{isEditMode ? 'Edit Study Profile' : 'Welcome to FocusMate AI'}</span>
                {!isEditMode && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                    Setup Wizard
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-400">
                {isEditMode 
                  ? 'Update your targets, exams, and priority subjects' 
                  : 'Tailor your adaptive study schedule and dashboard in 3 quick steps'}
              </p>
            </div>
          </div>

          {isEditMode && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-[#26262E] transition-all"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Multi-Step Wizard Progress Bar */}
        <div className="px-6 py-3 bg-[#131316] border-b border-[#22222A] flex items-center justify-between text-xs">
          {[
            { num: 1, label: 'Identity & Goal', icon: User },
            { num: 2, label: 'Target Exams', icon: Calendar },
            { num: 3, label: 'Subjects & Tracks', icon: BookOpen },
          ].map((s) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isDone = step > s.num;

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm'
                    : isDone
                    ? 'text-emerald-400 hover:text-emerald-300'
                    : 'text-gray-500 hover:text-gray-400'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive 
                    ? 'bg-purple-600 text-white' 
                    : isDone 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-[#26262E] text-gray-400'
                }`}>
                  {isDone ? '✓' : s.num}
                </div>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-300' : isDone ? 'text-emerald-400' : 'text-gray-500'}`} />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body / Steps */}
        <div className="px-6 py-5 overflow-y-auto flex-1 space-y-5">
          {/* STEP 1: Name & Goal */}
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1.5">
                  What is your name?
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samriddhi, Alex, Rahul..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#121214] border border-[#2E2E38] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  FocusMate AI personalizes your greetings, study mentor tips, and recovery schedule around you.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1.5">
                  Your Primary Study Focus or Academic Stream
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. Computer Science Engineering, GATE 2026, UPSC Civil Services..."
                    value={studyGoal}
                    onChange={(e) => setStudyGoal(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#121214] border border-[#2E2E38] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>

              {/* Quick Fill / Demo Option */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/20 via-indigo-900/10 to-transparent border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-semibold text-white">Want to explore with 1-click sample data?</h4>
                    <p className="text-[11px] text-gray-400">Prefills realistic engineering exam countdowns, DSA tracks, and labs.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLoadDemo}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 transition-all whitespace-nowrap self-start sm:self-auto"
                >
                  ✨ Fill Demo Data
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Target Exams */}
          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Your Upcoming Target Exams</h3>
                  <p className="text-xs text-gray-400">These drive the real-time Countdown Banner and Adaptive Recovery deadlines.</p>
                </div>
                <span className="text-xs font-mono text-purple-400 px-2 py-0.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  {examsList.length} scheduled
                </span>
              </div>

              {/* Existing Exams Cards */}
              <div className="space-y-2.5">
                {examsList.map((exam, idx) => (
                  <div key={exam.id || idx} className="p-3 rounded-xl bg-[#121214] border border-[#2A2A34] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Flame className="w-4 h-4 text-rose-400" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white flex items-center gap-2">
                          <span>{exam.subject}</span>
                          <span className="text-[10px] text-gray-400 font-normal">({exam.examType})</span>
                        </div>
                        <div className="text-[11px] text-gray-400 flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-purple-400" />
                            {new Date(exam.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-sky-400" />
                            {exam.location}
                          </span>
                        </div>
                      </div>
                    </div>

                    {examsList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveExam(exam.id)}
                        className="p-1.5 text-gray-500 hover:text-rose-400 transition-colors"
                        title="Remove exam"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Another Exam Form */}
              <div className="p-3.5 rounded-xl border border-dashed border-[#2E2E38] bg-[#141418] space-y-3">
                <div className="text-xs font-medium text-gray-300 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-purple-400" />
                  <span>Add Another Milestone / Exam</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <input
                    type="text"
                    placeholder="Subject Name (e.g. Operating Systems)"
                    value={newExamSubject}
                    onChange={(e) => setNewExamSubject(e.target.value)}
                    className="px-3 py-2 bg-[#121214] border border-[#2E2E38] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                  <select
                    value={newExamType}
                    onChange={(e) => setNewExamType(e.target.value)}
                    className="px-3 py-2 bg-[#121214] border border-[#2E2E38] rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Final Semester Exam">Final Semester Exam</option>
                    <option value="Midterm & Viva">Midterm & Viva</option>
                    <option value="Competitive Exam">Competitive Exam</option>
                    <option value="Quiz & Presentation">Quiz & Presentation</option>
                  </select>
                  <input
                    type="date"
                    value={newExamDate}
                    onChange={(e) => setNewExamDate(e.target.value)}
                    className="px-3 py-2 bg-[#121214] border border-[#2E2E38] rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Hall / Center (e.g. Hall B, Block 3)"
                    value={newExamLocation}
                    onChange={(e) => setNewExamLocation(e.target.value)}
                    className="px-3 py-2 bg-[#121214] border border-[#2E2E38] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddExam}
                    disabled={!newExamSubject.trim()}
                    className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-medium transition-all"
                  >
                    + Add to Exam List
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Subjects & Priority Setup */}
          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">Your Subjects & Active Modules</h3>
                  <p className="text-xs text-gray-400">Assign priority tags so the Adaptive Recovery Engine protects what matters most.</p>
                </div>
                <span className="text-xs font-mono text-purple-400 px-2 py-0.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  {subjectsList.length} subjects
                </span>
              </div>

              {/* List of Subjects */}
              <div className="space-y-2">
                {subjectsList.map((subj, idx) => (
                  <div key={subj.id || idx} className="p-3 rounded-xl bg-[#121214] border border-[#2A2A34] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-medium text-white">{subj.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        subj.priority === 'Critical' 
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                          : subj.priority === 'High' 
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' 
                          : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      }`}>
                        {subj.priority} Priority
                      </span>

                      {subjectsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(subj.id)}
                          className="p-1 text-gray-500 hover:text-rose-400 transition-colors"
                          title="Remove subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Subject Inline Form */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Add another subject (e.g. Computer Networks)..."
                  value={newSubjName}
                  onChange={(e) => setNewSubjName(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-[#121214] border border-[#2E2E38] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <select
                  value={newSubjPriority}
                  onChange={(e) => setNewSubjPriority(e.target.value)}
                  className="px-2.5 py-2 text-xs bg-[#121214] border border-[#2E2E38] rounded-xl text-gray-300 focus:outline-none focus:border-purple-500"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddSubject}
                  disabled={!newSubjName.trim()}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white transition-all whitespace-nowrap"
                >
                  + Add
                </button>
              </div>

              <div className="p-3 rounded-xl bg-purple-900/10 border border-purple-500/20 text-[11px] text-gray-300 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Finishing setup will generate a clean, personalized task inbox based on your subjects with full Pomodoro timer integration.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 bg-[#121214] border-t border-[#2A2A34] flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-3.5 py-2 text-xs font-medium text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !name.trim()) return;
                  setStep(step + 1);
                  sounds.playPop?.();
                }}
                disabled={step === 1 && !name.trim()}
                className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white shadow-glow-purple-sm transition-all flex items-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isEditMode ? 'Save & Apply Changes' : 'Launch My Dashboard'}</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
