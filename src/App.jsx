import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ExamCountdown from './components/ExamCountdown';
import PomodoroTimer from './components/PomodoroTimer';
import TaskInbox from './components/TaskInbox';
import AdaptiveRecoveryModal from './components/AdaptiveRecoveryModal';
import ChatAssistant from './components/ChatAssistant';
import DocumentScannerModal from './components/DocumentScannerModal';
import SyllabusQuizModal from './components/SyllabusQuizModal';
import OnboardingModal from './components/OnboardingModal';
import Toast from './components/Toast';

import { INITIAL_TASKS, INITIAL_EXAMS } from './data/initialData';
import { getStoredItem, setStoredItem, clearAllStorage, STORAGE_KEYS } from './utils/storage';
import { sounds } from './utils/soundEffects';
import { CheckSquare, Zap, Timer, BookOpen, MessageSquare } from 'lucide-react';

export default function App() {
  // User Profile (Triggers Onboarding if empty)
  const [userProfile, setUserProfile] = useState(() => getStoredItem(STORAGE_KEYS.USER_PROFILE, null));
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !getStoredItem(STORAGE_KEYS.USER_PROFILE, null));
  const [isEditProfileMode, setIsEditProfileMode] = useState(false);

  // App core state with LocalStorage persistence
  const [activeTab, setActiveTab] = useState('inbox');
  const [tasks, setTasks] = useState(() => {
    // If userProfile exists, read stored tasks, otherwise empty array for new users
    const stored = getStoredItem(STORAGE_KEYS.TASKS, null);
    if (stored !== null) return stored;
    return getStoredItem(STORAGE_KEYS.USER_PROFILE, null) ? [] : INITIAL_TASKS;
  });

  const [exams, setExams] = useState(() => {
    const stored = getStoredItem(STORAGE_KEYS.EXAMS, null);
    if (stored !== null) return stored;
    return getStoredItem(STORAGE_KEYS.USER_PROFILE, null) ? [] : INITIAL_EXAMS;
  });

  const [activeExamId, setActiveExamId] = useState(() => getStoredItem(STORAGE_KEYS.ACTIVE_EXAM, exams[0]?.id || 'exam-1'));
  const [energyLevel, setEnergyLevel] = useState(() => getStoredItem(STORAGE_KEYS.ENERGY, 'High'));
  const [activeTaskId, setActiveTaskId] = useState(() => getStoredItem(STORAGE_KEYS.ACTIVE_TASK_ID, tasks[0]?.id || null));

  // Modals & Panels
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Sync state to LocalStorage
  useEffect(() => {
    if (userProfile) {
      setStoredItem(STORAGE_KEYS.USER_PROFILE, userProfile);
    }
  }, [userProfile]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.TASKS, tasks);
  }, [tasks]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.EXAMS, exams);
  }, [exams]);

  useEffect(() => {
    if (activeExamId) {
      setStoredItem(STORAGE_KEYS.ACTIVE_EXAM, activeExamId);
    }
  }, [activeExamId]);

  useEffect(() => {
    setStoredItem(STORAGE_KEYS.ENERGY, energyLevel);
  }, [energyLevel]);

  useEffect(() => {
    if (activeTaskId) {
      setStoredItem(STORAGE_KEYS.ACTIVE_TASK_ID, activeTaskId);
    }
  }, [activeTaskId]);

  const addToast = (title, message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Onboarding completion handler
  const handleCompleteOnboarding = ({ userProfile: newProfile, exams: newExams, tasks: newTasks }) => {
    setUserProfile(newProfile);
    setExams(newExams);
    setTasks(newTasks);
    if (newExams.length > 0) setActiveExamId(newExams[0].id);
    if (newTasks.length > 0) setActiveTaskId(newTasks[0].id);
    setIsOnboardingOpen(false);
    setIsEditProfileMode(false);
    addToast(
      `Welcome, ${newProfile.name}! ✨`,
      `Configured ${newExams.length} target exams and synchronized ${newTasks.length} adaptive study tasks.`,
      'success'
    );
  };

  // Reset all data & launch fresh onboarding
  const handleResetAllData = () => {
    sounds.playPop?.();
    clearAllStorage();
    setUserProfile(null);
    setTasks([]);
    setExams([]);
    setActiveExamId(null);
    setActiveTaskId(null);
    setIsEditProfileMode(false);
    setIsOnboardingOpen(true);
    addToast('Dashboard Reset', 'Cleared study profile. Launching fresh setup wizard.', 'info');
  };

  // Task actions
  const handleToggleTask = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const handleAddTask = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
    addToast('Task Created', `Added "${newTask.title.slice(0, 32)}..." to ${newTask.category}`);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (activeTaskId === taskId) {
      setActiveTaskId(null);
    }
    addToast('Task Removed', 'Task removed from your inbox', 'info');
  };

  const handleSetActiveTask = (task) => {
    setActiveTaskId(task.id);
    addToast('Focus Target Bound', `Timer locked to "${task.title.slice(0, 30)}..."`, 'info');
  };

  const handleCompleteActiveTask = (taskId) => {
    sounds.playSuccess?.();
    handleToggleTask(taskId);
    setActiveTaskId(null);
    addToast('Focus Session Finished', 'Active task marked complete!', 'success');
  };

  const handleClearActiveTask = () => {
    setActiveTaskId(null);
  };

  const handleResetSampleTasks = () => {
    sounds.playPop?.();
    setTasks(INITIAL_TASKS);
    if (!userProfile) {
      setUserProfile({
        name: 'Alex',
        studyGoal: 'Computer Science & Placement Prep',
        subjects: [
          { id: 'subj-1', name: 'Data Structures & Algorithms', priority: 'Critical' },
          { id: 'subj-2', name: 'Operating Systems & Concurrency', priority: 'High' }
        ],
        onboarded: true
      });
    }
    if (exams.length === 0) {
      setExams(INITIAL_EXAMS);
      setActiveExamId(INITIAL_EXAMS[0].id);
    }
    setActiveTaskId('task-1');
    addToast('Sample Data Loaded', 'Restored realistic engineering task dataset', 'info');
  };

  // Recovery Engine Handler
  const handleApplyRecoveryPlan = ({ scheduledTasks, deferredTasks, availableHours, energy }) => {
    setEnergyLevel(energy);

    // Mark tasks with deferred tag
    const scheduledIds = new Set(scheduledTasks.map(t => t.id));
    const deferredIds = new Set(deferredTasks.map(t => t.id));

    setTasks(prev => prev.map(t => {
      if (scheduledIds.has(t.id)) {
        return { ...t, deferred: false };
      }
      if (deferredIds.has(t.id)) {
        return { ...t, deferred: true };
      }
      return t;
    }));

    if (scheduledTasks.length > 0) {
      setActiveTaskId(scheduledTasks[0].id);
    }

    addToast(
      'Adaptive Plan Applied ✨',
      `Protected ${scheduledTasks.length} exam-critical tasks into ${availableHours}h. Deferred ${deferredTasks.length} non-urgent items without guilt.`
    );
  };

  // OCR Extracted tasks handler
  const handleAddExtractedTasks = (newTasks) => {
    setTasks(prev => [...newTasks, ...prev]);
    addToast('OCR Extraction Successful', `Imported ${newTasks.length} tasks from scanned document into inbox!`, 'success');
  };

  // Quiz weak topics handler
  const handleAddWeakTopicsToTasks = (weakTasks) => {
    setTasks(prev => [...weakTasks, ...prev]);
    addToast('Active Recall Tasks Added', `Converted ${weakTasks.length} weak topics into priority revision tasks!`, 'success');
  };

  const activeExam = exams.find(e => e.id === activeExamId) || exams[0] || null;
  const activeFocusTask = tasks.find(t => t.id === activeTaskId) || null;

  return (
    <div className="min-h-screen bg-[#121214] text-[#E9D5FF] flex flex-col selection:bg-purple-500/30 selection:text-white">
      {/* Dynamic Header */}
      <Header
        userProfile={userProfile}
        tasks={tasks}
        energyLevel={energyLevel}
        onEnergyChange={(lvl) => setEnergyLevel(lvl)}
        onOpenRecovery={() => setIsRecoveryOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenOnboarding={() => {
          setIsEditProfileMode(true);
          setIsOnboardingOpen(true);
        }}
        onResetData={handleResetAllData}
      />

      {/* Main Content Layout with safe bottom padding for Instagram nav bar */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-8">
        {/* Exam Countdown Banner (Renders if exams configured) */}
        {exams.length > 0 && (
          <ExamCountdown
            exams={exams}
            activeExamId={activeExamId}
            onSelectExam={(id) => setActiveExamId(id)}
            onAddExam={(newExam) => {
              setExams(prev => [newExam, ...prev]);
              setActiveExamId(newExam.id);
              addToast('Target Exam Added', `Set countdown for ${newExam.subject}`);
            }}
          />
        )}

        {/* Two-Column Grid: Pomodoro Focus Engine on Left, Multi-Track Task Inbox on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Pomodoro Focus Timer & Ambient Generator */}
          <div id="pomodoro-section" className="lg:col-span-4 space-y-6">
            <PomodoroTimer
              activeTask={activeFocusTask}
              onCompleteActiveTask={handleCompleteActiveTask}
              onClearActiveTask={handleClearActiveTask}
            />

            {/* Quick Strategy Card */}
            <div className="rounded-2xl border border-[#2E2E38] bg-[#1A1A1E] p-4 text-xs space-y-2.5">
              <div className="text-[10px] uppercase font-mono tracking-wider text-purple-400 font-semibold flex items-center justify-between">
                <span>Adaptive Protocol</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <h4 className="text-sm font-semibold text-white">
                Linear Depth Over Scatter
              </h4>
              <p className="text-gray-400 leading-relaxed">
                Exam performance is determined by deep recall retention, not task volume. Protect your top 2 academic blocks first before touching elective routines.
              </p>
              <div className="pt-2 border-t border-[#26262E] flex items-center justify-between text-[11px] text-gray-500">
                <span>Active Target: {activeExam?.subject ? activeExam.subject.slice(0, 22) + '...' : 'Configured'}</span>
                <button
                  onClick={() => setIsRecoveryOpen(true)}
                  className="text-purple-400 hover:text-purple-300 font-medium underline"
                >
                  Reschedule?
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Track Tagged Task Inbox */}
          <div id="task-inbox-section" className="lg:col-span-8">
            <TaskInbox
              tasks={tasks}
              userProfile={userProfile}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onSetActiveTask={handleSetActiveTask}
              activeTaskId={activeTaskId}
              onResetSampleTasks={handleResetSampleTasks}
            />
          </div>
        </div>
      </main>

      {/* Onboarding & Profile Customization Wizard */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleCompleteOnboarding}
        initialData={{ userProfile, exams, tasks }}
        isEditMode={isEditProfileMode}
      />

      {/* Modals & Slide-overs */}
      <AdaptiveRecoveryModal
        isOpen={isRecoveryOpen}
        onClose={() => setIsRecoveryOpen(false)}
        tasks={tasks}
        currentEnergy={energyLevel}
        onApplyPlan={handleApplyRecoveryPlan}
        activeExam={activeExam}
      />

      <DocumentScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onAddExtractedTasks={handleAddExtractedTasks}
      />

      <SyllabusQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onAddWeakTopicsToTasks={handleAddWeakTopicsToTasks}
      />

      <ChatAssistant
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        tasks={tasks}
        activeExam={activeExam}
        energyLevel={energyLevel}
        userName={userProfile?.name || 'Student'}
        onTriggerRecovery={() => setIsRecoveryOpen(true)}
        onFocusTask={(task) => {
          setActiveTaskId(task.id);
          addToast('Focus Mode Engaged', `Timer locked to "${task.title.slice(0, 30)}..."`, 'info');
        }}
      />

      {/* Floating Chat Trigger Button (bottom-right on desktop when drawer closed) */}
      {!isChatOpen && (
        <button
          onClick={() => {
            sounds.playPop?.();
            setIsChatOpen(true);
          }}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple border border-purple-400/30 transition-all hover:scale-105 group hidden md:flex items-center"
          title="Open FocusMate AI Study Mentor"
        >
          <div className="relative">
            <span className="text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>AI Study Mentor</span>
            </span>
          </div>
        </button>
      )}

      {/* Toast Notification Container */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />

      {/* 📱 INSTAGRAM-STYLE MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1E]/95 backdrop-blur-md border-t border-purple-900/30 px-3 py-2 md:hidden shadow-2xl shadow-purple-950/80 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* 1. Inbox: CheckSquare */}
          <button
            onClick={() => {
              setActiveTab('inbox');
              sounds.playPop?.();
              const el = document.getElementById('task-inbox-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
              activeTab === 'inbox' ? 'text-purple-400 font-semibold scale-105' : 'text-gray-400 hover:text-purple-300'
            }`}
            aria-label="Task Inbox"
          >
            <CheckSquare className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Inbox</span>
            {activeTab === 'inbox' && <span className="w-1 h-1 bg-purple-400 rounded-full mt-0.5"></span>}
          </button>

          {/* 2. Focus: Timer */}
          <button
            onClick={() => {
              setActiveTab('focus');
              sounds.playPop?.();
              const el = document.getElementById('pomodoro-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
              activeTab === 'focus' ? 'text-purple-400 font-semibold scale-105' : 'text-gray-400 hover:text-purple-300'
            }`}
            aria-label="Focus Timer"
          >
            <Timer className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Focus</span>
            {activeTab === 'focus' && <span className="w-1 h-1 bg-purple-400 rounded-full mt-0.5"></span>}
          </button>

          {/* 3. Overwhelmed / Recover: Prominent, elevated central gradient circular button with Zap icon */}
          <button
            onClick={() => {
              sounds.playPop?.();
              setIsRecoveryOpen(true);
            }}
            className="flex flex-col items-center justify-center -mt-6 group focus:outline-none"
            aria-label="Adaptive Recovery Plan"
          >
            <div className="w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-tr from-purple-600 via-indigo-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-600/50 border-4 border-[#121214] group-active:scale-95 group-hover:scale-105 transition-all duration-200">
              <Zap className="w-6 h-6 text-white fill-white drop-shadow" />
            </div>
            <span className="text-[10px] text-purple-300 font-semibold tracking-wide mt-1">Recover</span>
          </button>

          {/* 4. Quiz: BookOpen */}
          <button
            onClick={() => {
              sounds.playPop?.();
              setIsQuizOpen(true);
            }}
            className="flex flex-col items-center justify-center w-14 py-1 rounded-xl text-gray-400 hover:text-purple-300 active:scale-95 transition-all"
            aria-label="Syllabus Quiz"
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight font-medium">Quiz</span>
          </button>

          {/* 5. Chat AI: MessageSquare */}
          <button
            onClick={() => {
              sounds.playPop?.();
              setIsChatOpen(true);
            }}
            className="flex flex-col items-center justify-center w-14 py-1 rounded-xl text-gray-400 hover:text-purple-300 active:scale-95 transition-all"
            aria-label="AI Study Mentor"
          >
            <MessageSquare className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight font-medium">Chat AI</span>
          </button>
        </div>
      </nav>
    </div>
  );
}