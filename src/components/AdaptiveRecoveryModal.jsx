import React, { useState } from 'react';
import { 
  LifeBuoy, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Coffee, 
  Heart,
  Zap,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export default function AdaptiveRecoveryModal({
  isOpen,
  onClose,
  tasks,
  currentEnergy,
  onApplyPlan
}) {
  const [availableHours, setAvailableHours] = useState(2.5);
  const [selectedEnergy, setSelectedEnergy] = useState(currentEnergy || 'Medium');

  if (!isOpen) return null;

  // Uncompleted tasks
  const pendingTasks = tasks.filter(t => !t.completed);
  const totalPendingMinutes = pendingTasks.reduce((acc, t) => acc + (t.duration || 30), 0);
  const totalPendingHours = (totalPendingMinutes / 60).toFixed(1);

  // Available minutes
  const availableMinutes = Math.round(availableHours * 60);

  // Recovery Engine Algorithm
  // 1. Separate into Exam Critical / High Academic vs Non-urgent / Personal
  const examCriticalList = [];
  const standardAcademicList = [];
  const deferredList = [];

  pendingTasks.forEach(task => {
    if (task.examCritical) {
      examCriticalList.push(task);
    } else if (task.category === 'Academics' || task.category === 'Core Coding (Java/DSA)') {
      if (task.priority === 'High') {
        standardAcademicList.push(task);
      } else {
        deferredList.push(task);
      }
    } else {
      // Personal Goals and low priority courses are deferred to reduce mental load
      deferredList.push(task);
    }
  });

  // Calculate what fits into availableMinutes
  let remainingBudget = availableMinutes;
  const scheduledTasks = [];
  const finalDeferred = [...deferredList];

  // First pass: protect exam critical
  examCriticalList.forEach(task => {
    if (remainingBudget >= task.duration) {
      scheduledTasks.push({ ...task, scheduledSlot: `${task.duration}m Deep Block`, protected: true });
      remainingBudget -= task.duration;
    } else if (remainingBudget >= 20) {
      // Trim task duration for a quick review sprint
      scheduledTasks.push({ 
        ...task, 
        duration: remainingBudget, 
        scheduledSlot: `${remainingBudget}m High-Yield Sprint`, 
        protected: true 
      });
      remainingBudget = 0;
    } else {
      finalDeferred.push(task);
    }
  });

  // Second pass: fill remaining time with high academic tasks
  if (remainingBudget >= 20) {
    standardAcademicList.forEach(task => {
      if (remainingBudget >= task.duration) {
        scheduledTasks.push({ ...task, scheduledSlot: `${task.duration}m Focus Sprint`, protected: false });
        remainingBudget -= task.duration;
      } else if (remainingBudget >= 20 && scheduledTasks.length < 3) {
        scheduledTasks.push({ 
          ...task, 
          duration: remainingBudget, 
          scheduledSlot: `${remainingBudget}m Power Sprint`, 
          protected: false 
        });
        remainingBudget = 0;
      } else {
        finalDeferred.push(task);
      }
    });
  }

  const handleApply = () => {
    sounds.playSuccess();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#A855F7', '#10B981', '#38BDF8', '#E9D5FF']
    });

    onApplyPlan({
      scheduledTasks,
      deferredTasks: finalDeferred,
      availableHours,
      energy: selectedEnergy
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#1A1A22] border border-purple-500/40 rounded-2xl shadow-2xl p-6 relative my-8">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-40 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2E2E38] relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-glow-purple-sm">
              <LifeBuoy className="w-5 h-5 text-purple-400 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">Adaptive Recovery Engine</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  No-Guilt Rescheduler
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Feeling overwhelmed? Recalibrate your schedule into realistic, high-impact blocks.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs: Hours & Energy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {/* Remaining Hours Slider */}
          <div className="p-3.5 rounded-xl bg-[#141418] border border-[#2E2E38]">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-gray-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-purple-400" />
                <span>Available Study Time Today</span>
              </span>
              <span className="font-mono font-bold text-purple-300 text-sm">{availableHours} hrs</span>
            </div>

            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.5"
              value={availableHours}
              onChange={(e) => setAvailableHours(parseFloat(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-gray-500 font-mono mt-1">
              <span>30 mins</span>
              <span>2.5 hrs</span>
              <span>6 hrs</span>
            </div>
          </div>

          {/* Energy Selector */}
          <div className="p-3.5 rounded-xl bg-[#141418] border border-[#2E2E38]">
            <div className="text-xs font-medium text-gray-300 mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Current Energy State</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'High', label: 'High ⚡', desc: 'Deep Work' },
                { id: 'Medium', label: 'Medium 🔋', desc: 'Standard' },
                { id: 'Low', label: 'Low 🪫', desc: 'Survival' },
              ].map(lvl => (
                <button
                  key={lvl.id}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedEnergy(lvl.id);
                  }}
                  className={`p-2 rounded-lg text-center border transition-all ${
                    selectedEnergy === lvl.id
                      ? 'bg-purple-600/30 border-purple-500 text-purple-200 font-semibold'
                      : 'bg-[#1A1A20] border-[#2E2E38] text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs">{lvl.label}</div>
                  <div className="text-[10px] text-gray-500 mt-0.5">{lvl.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Diagnosis & Algorithmic Summary Card */}
        <div className="mt-5 p-4 rounded-xl bg-purple-950/20 border border-purple-500/30">
          <div className="flex items-center gap-2 mb-2">
            <Heart className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-semibold text-purple-200">
              No-Guilt Diagnostic Breakdown
            </span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            You currently have <strong className="text-white">{totalPendingHours} hours</strong> of pending tasks, but only <strong className="text-purple-300">{availableHours} hours</strong> remaining. Attempting all of it risks cognitive burnout.
          </p>
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <div className="p-2 rounded-lg bg-[#141418] border border-[#2E2E38]">
              <div className="text-base font-bold text-purple-300">{scheduledTasks.length}</div>
              <div className="text-[10px] uppercase font-mono text-gray-400">Protected Today</div>
            </div>
            <div className="p-2 rounded-lg bg-[#141418] border border-[#2E2E38]">
              <div className="text-base font-bold text-amber-300">{finalDeferred.length}</div>
              <div className="text-[10px] uppercase font-mono text-gray-400">Guilt-Free Deferred</div>
            </div>
            <div className="p-2 rounded-lg bg-[#141418] border border-[#2E2E38]">
              <div className="text-base font-bold text-emerald-300">
                {Math.round(scheduledTasks.reduce((acc, t) => acc + t.duration, 0))}m
              </div>
              <div className="text-[10px] uppercase font-mono text-gray-400">Target Deep Work</div>
            </div>
          </div>
        </div>

        {/* Proposed Schedule Preview */}
        <div className="mt-5">
          <div className="text-xs font-semibold text-white mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Prioritized Today (Protected Focus)</span>
            </span>
            <span className="text-[11px] font-mono text-purple-400">
              {scheduledTasks.length} High-Yield items
            </span>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {scheduledTasks.map((task, idx) => (
              <div
                key={task.id}
                className="p-2.5 rounded-xl bg-[#141418] border border-[#2E2E38] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-gray-200 font-medium truncate">{task.title}</span>
                  {task.examCritical && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex-shrink-0">
                      Exam Critical
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 font-mono text-[11px] text-purple-300">
                  <span>{task.duration}m</span>
                </div>
              </div>
            ))}
          </div>

          {/* Deferred tasks notice */}
          {finalDeferred.length > 0 && (
            <div className="mt-3 p-2.5 rounded-xl bg-[#141418]/60 border border-[#2E2E38] text-[11px] text-gray-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Coffee className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  <strong>{finalDeferred.length} tasks</strong> (personal goals, low-priority items) moved to tomorrow.
                </span>
              </span>
              <span className="text-gray-500 font-mono text-[10px]">Zero Guilt</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-[#2E2E38]">
          <div className="text-[11px] text-gray-400 italic">
            "Prioritize what matters. Let the rest wait."
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-glow-purple-sm transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply Adaptive Plan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
