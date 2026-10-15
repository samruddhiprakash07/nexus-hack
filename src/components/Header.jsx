import React from 'react';
import { 
  Zap, 
  Battery, 
  BatteryLow, 
  Sparkles, 
  Camera, 
  BrainCircuit, 
  MessageSquare, 
  LifeBuoy, 
  CheckCircle,
  Flame,
  Clock
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function Header({
  tasks,
  energyLevel,
  onEnergyChange,
  onOpenRecovery,
  onOpenScanner,
  onOpenQuiz,
  onOpenChat,
  chatUnread = false
}) {
  const now = new Date();
  const hour = now.getHours();

  let greeting = 'Good evening';
  let greetingSub = 'Ready to wrap up high-impact items?';
  if (hour >= 5 && hour < 12) {
    greeting = 'Good morning';
    greetingSub = 'Prime focus window ahead. Let\'s tackle the hardest problem first.';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good afternoon';
    greetingSub = 'Keep up the momentum. Stay hydrated and focused.';
  } else if (hour >= 17 && hour < 22) {
    greeting = 'Good evening';
    greetingSub = 'Review key exam concepts and clear priority bottlenecks.';
  } else {
    greeting = 'Late night session';
    greetingSub = 'Protect your cognitive energy. Prioritize critical recall only.';
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const examCriticalPending = tasks.filter(t => !t.completed && t.examCritical).length;

  const energyConfigs = {
    High: {
      label: 'High Energy',
      icon: Zap,
      color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
      activeBg: 'bg-amber-500 text-black shadow-lg shadow-amber-500/20',
      velocity: 'Max Velocity: 50m Deep Blocks',
      advice: 'Ideal for complex algorithms & lab coding.'
    },
    Medium: {
      label: 'Medium Energy',
      icon: Battery,
      color: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
      activeBg: 'bg-purple-600 text-white shadow-lg shadow-purple-500/20',
      velocity: 'Steady Velocity: 25m Pomodoros',
      advice: 'Great for active recall & lecture notes.'
    },
    Low: {
      label: 'Low Energy',
      icon: BatteryLow,
      color: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
      activeBg: 'bg-rose-500 text-white shadow-lg shadow-rose-500/20',
      velocity: 'Gentle Velocity: 15m Micro-Sprints',
      advice: 'Focus on flashcards or trigger Adaptive Recovery.'
    }
  };

  const currentEnergyConfig = energyConfigs[energyLevel] || energyConfigs.Medium;

  return (
    <header className="relative w-full border-b border-[#2E2E38] bg-[#121214]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Branding & Greeting */}
        <div className="flex items-center gap-3.5">
          <div className="relative group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-glow-purple-sm transition-transform duration-200 group-hover:scale-105">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#121214]" title="System Active & Ready" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>FocusMate AI</span>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Student Mentor
                </span>
              </h1>
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
              <span className="text-purple-300 font-medium">{greeting}, Alex</span>
              <span className="text-[#3F3F4E]">•</span>
              <span className="hidden sm:inline text-gray-400">{greetingSub}</span>
            </p>
          </div>
        </div>

        {/* Center: Energy Level Selector */}
        <div className="flex items-center gap-2 bg-[#1A1A1E] border border-[#2E2E38] rounded-xl p-1 self-start md:self-auto">
          <span className="text-[11px] font-medium text-gray-400 px-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            Energy:
          </span>
          {(['High', 'Medium', 'Low']).map((lvl) => {
            const config = energyConfigs[lvl];
            const Icon = config.icon;
            const isSelected = energyLevel === lvl;

            return (
              <button
                key={lvl}
                onClick={() => {
                  sounds.playPop();
                  onEnergyChange(lvl);
                }}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all duration-200 ${
                  isSelected
                    ? config.activeBg
                    : 'text-gray-400 hover:text-white hover:bg-[#26262E]'
                }`}
                title={`${lvl} Energy Mode - ${config.advice}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lvl}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Quick Action Modals Trigger */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Panic / Adaptive Recovery Trigger */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenRecovery();
            }}
            className="group relative px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-purple-700/80 to-purple-900 border border-purple-500/40 text-purple-200 hover:text-white hover:border-purple-400 hover:shadow-glow-purple-sm transition-all duration-200 flex items-center gap-1.5"
            title="Overwhelmed? Let the Adaptive Recovery Engine reorganize your day with zero guilt."
          >
            <LifeBuoy className="w-3.5 h-3.5 text-purple-300 group-hover:rotate-45 transition-transform duration-300" />
            <span>Overwhelmed?</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>
          </button>

          {/* Document / Photo OCR Scanner */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenScanner();
            }}
            className="px-3 py-1.5 text-xs font-medium rounded-xl bg-[#1A1A1E] border border-[#2E2E38] text-gray-300 hover:text-white hover:border-purple-500/40 hover:bg-[#26262E] transition-all duration-200 flex items-center gap-1.5"
            title="Upload assignment photo or syllabus notes to auto-extract tasks"
          >
            <Camera className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">OCR</span>
            <span>Scan</span>
          </button>

          {/* Syllabus Quiz Modal */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenQuiz();
            }}
            className="px-3 py-1.5 text-xs font-medium rounded-xl bg-[#1A1A1E] border border-[#2E2E38] text-gray-300 hover:text-white hover:border-purple-500/40 hover:bg-[#26262E] transition-all duration-200 flex items-center gap-1.5"
            title="Active Recall Quiz on DSA, OS, and ML concepts"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Active</span>
            <span>Quiz</span>
          </button>

          {/* AI Mentorship Chat Button */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenChat();
            }}
            className="relative px-3 py-1.5 text-xs font-medium rounded-xl bg-[#1A1A1E] border border-[#2E2E38] text-gray-300 hover:text-white hover:border-purple-500/40 hover:bg-[#26262E] transition-all duration-200 flex items-center gap-1.5"
            title="Open FocusMate AI Study Mentor Chat"
          >
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>Chat</span>
            {chatUnread && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full ring-2 ring-[#121214] animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-[#1F1F26] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2.5 bg-[#17171B] px-3 py-2 rounded-lg border border-[#26262E]">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-semibold text-xs">
            {completionRate}%
          </div>
          <div>
            <div className="text-gray-400 text-[10px] uppercase font-mono">Completion</div>
            <div className="text-white font-semibold">{completedTasks} / {totalTasks} Tasks</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-[#17171B] px-3 py-2 rounded-lg border border-[#26262E]">
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-semibold text-xs">
            <Flame className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-gray-400 text-[10px] uppercase font-mono">Exam Critical</div>
            <div className="text-rose-300 font-semibold">{examCriticalPending} Unresolved</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-[#17171B] px-3 py-2 rounded-lg border border-[#26262E]">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-semibold text-xs">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-gray-400 text-[10px] uppercase font-mono">Pending Tasks</div>
            <div className="text-white font-semibold">{pendingTasks} Action Items</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-[#17171B] px-3 py-2 rounded-lg border border-[#26262E]">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${currentEnergyConfig.color}`}>
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-gray-400 text-[10px] uppercase font-mono">Study Velocity</div>
            <div className="text-purple-300 font-medium truncate max-w-[140px]">{currentEnergyConfig.velocity.split(':')[1] || 'Optimal'}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
