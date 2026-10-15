import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ExamCountdown from './components/ExamCountdown';
import PomodoroTimer from './components/PomodoroTimer';
import TaskInbox from './components/TaskInbox';
import AdaptiveRecoveryModal from './components/AdaptiveRecoveryModal';
import ChatAssistant from './components/ChatAssistant';
import DocumentScannerModal from './components/DocumentScannerModal';
import SyllabusQuizModal from './components/SyllabusQuizModal';
import Toast from './components/Toast';

import { INITIAL_TASKS, INITIAL_EXAMS } from './data/initialData';
import { getStoredItem, setStoredItem } from './utils/storage';
import { sounds } from './utils/soundEffects';

export default function App() {
  // State initialization with LocalStorage persistence
  const [tasks, setTasks] = useState(() => getStoredItem('focusmate_tasks', INITIAL_TASKS));
  const [exams, setExams] = useState(() => getStoredItem('focusmate_exams', INITIAL_EXAMS));
  const [activeExamId, setActiveExamId] = useState(() => getStoredItem('focusmate_active_exam', 'exam-1'));
  const [energyLevel, setEnergyLevel] = useState(() => getStoredItem('focusmate_energy', 'High'));
  const [activeTaskId, setActiveTaskId] = useState(() => getStoredItem('focusmate_active_task_id', 'task-1'));

  // Modals & Panels
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Sync state to LocalStorage
  useEffect(() => {
    setStoredItem('focusmate_tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    setStoredItem('focusmate_exams', exams);
  }, [exams]);

  useEffect(() => {
    setStoredItem('focusmate_active_exam', activeExamId);
  }, [activeExamId]);

  useEffect(() => {
    setStoredItem('focusmate_energy', energyLevel);
  }, [energyLevel]);

  useEffect(() => {
    setStoredItem('focusmate_active_task_id', activeTaskId);
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

  // Task actions
  const handleToggleTask = (taskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const nextCompleted = !t.completed;
        return { ...t, completed: nextCompleted };
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
    sounds.playSuccess();
    handleToggleTask(taskId);
    setActiveTaskId(null);
    addToast('Focus Session Finished', 'Active task marked complete!', 'success');
  };

  const handleClearActiveTask = () => {
    setActiveTaskId(null);
  };

  const handleResetSampleTasks = () => {
    sounds.playPop();
    setTasks(INITIAL_TASKS);
    setActiveTaskId('task-1');
    addToast('Reset Complete', 'Restored realistic engineering task dataset', 'info');
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

  const activeExam = exams.find(e => e.id === activeExamId) || exams[0];
  const activeFocusTask = tasks.find(t => t.id === activeTaskId) || null;

  return (
    <div className="min-h-screen bg-[#121214] text-[#E9D5FF] flex flex-col selection:bg-purple-500/30 selection:text-white">
      {/* Header */}
      <Header
        tasks={tasks}
        energyLevel={energyLevel}
        onEnergyChange={(lvl) => setEnergyLevel(lvl)}
        onOpenRecovery={() => setIsRecoveryOpen(true)}
        onOpenScanner={() => setIsScannerOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Exam Countdown Banner */}
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

        {/* Two-Column Grid: Pomodoro Focus Engine on Left, Multi-Track Task Inbox on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Pomodoro Focus Timer & Ambient Generator */}
          <div className="lg:col-span-4 space-y-6">
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
                <span>Active Exam In: &lt; 4 Days</span>
                <button
                  onClick={() => setIsRecoveryOpen(true)}
                  className="text-purple-400 hover:text-purple-300 font-medium underline"
                >
                  Need Rescheduling?
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Track Tagged Task Inbox */}
          <div className="lg:col-span-8">
            <TaskInbox
              tasks={tasks}
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
        onTriggerRecovery={() => setIsRecoveryOpen(true)}
        onFocusTask={(task) => {
          setActiveTaskId(task.id);
          addToast('Focus Mode Engaged', `Timer locked to "${task.title.slice(0, 30)}..."`, 'info');
        }}
      />

      {/* Floating Chat Trigger Button (bottom-right when drawer closed) */}
      {!isChatOpen && (
        <button
          onClick={() => {
            sounds.playPop();
            setIsChatOpen(true);
          }}
          className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-glow-purple border border-purple-400/30 transition-all hover:scale-105 group"
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
    </div>
  );
}
