import React, { useState } from 'react';
import { 
  Zap, 
  Battery, 
  BatteryLow, 
  Sparkles, 
  Camera, 
  BrainCircuit, 
  MessageSquare, 
  LifeBuoy, 
  Flame,
  Clock,
  User,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function Header({
  userProfile,
  tasks,
  energyLevel,
  onEnergyChange,
  onOpenRecovery,
  onOpenScanner,
  onOpenQuiz,
  onOpenChat,
  onOpenOnboarding,
  onResetData,
  chatUnread = false
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { text: 'Good morning', sub: 'Prime focus window ahead. Let\'s tackle the hardest concept first.' };
    } else if (hour >= 12 && hour < 17) {
      return { text: 'Good afternoon', sub: 'Keep up the momentum. Stay hydrated and focused.' };
    } else if (hour >= 17 && hour < 22) {
      return { text: 'Good evening', sub: 'Review key exam concepts and clear priority bottlenecks.' };
    }
    return { text: 'Late night session', sub: 'Protect your cognitive energy. Prioritize critical recall only.' };
  };

  const { text: greeting, sub: greetingSub } = getGreeting();
  const userName = userProfile?.name || 'Student';

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
    <header className="relative w-full border-b border-[#2E2E38] bg-[#121214]/90 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        
        {/* Left: Branding & Dynamic User Greeting */}
        <div className="flex items-center justify-between md:justify-start gap-3.5">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-glow-purple-sm transition-transform duration-200 group-hover:scale-105">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#121214]" title="System Active & Ready" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5 sm:gap-2">
                  <span>FocusMate AI</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Adaptive Mentor
                  </span>
                </h1>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span className="text-purple-300 font-semibold">{greeting}, {userName}</span>
                <span className="text-[#3F3F4E] hidden sm:inline">•</span>
                <span className="hidden sm:inline text-gray-400 truncate max-w-[280px]">
                  {userProfile?.studyGoal || greetingSub}
                </span>
              </p>
            </div>
          </div>

          {/* Mobile Profile Trigger (Visible on small screens) */}
          <div className="md:hidden flex items-center gap-1">
            <button
              onClick={() => {
                sounds.playPop();
                onOpenOnboarding();
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-purple-600/20 text-purple-200 border border-purple-500/40 flex items-center gap-1"
              title="Edit Profile"
            >
              <User className="w-3.5 h-3.5 text-purple-300" />
              <span className="max-w-[70px] truncate">{userName}</span>
            </button>
          </div>
        </div>

        {/* Center: Energy Level Selector */}
        <div className="flex items-center justify-between sm:justify-start gap-2 bg-[#1A1A1E] border border-[#2E2E38] rounded-xl p-1 self-stretch sm:self-start md:self-auto">
          <span className="text-[11px] font-medium text-gray-400 px-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
            Energy:
          </span>
          <div className="flex items-center gap-1 flex-1 sm:flex-initial justify-end">
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
        </div>

        {/* Right: Actions, Modals & Profile Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Document / Photo OCR Scanner (always handy) */}
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

          {/* Desktop-only action triggers (Mobile uses Instagram Bottom Bar to eliminate header clutter) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Overwhelmed / Adaptive Recovery Trigger */}
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

            {/* Syllabus Quiz Modal */}
            <button
              onClick={() => {
                sounds.playPop();
                onOpenQuiz();
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-[#1A1A1E] border border-[#2E2E38] text-gray-300 hover:text-white hover:border-purple-500/40 hover:bg-[#26262E] transition-all duration-200 flex items-center gap-1.5"
              title="Active Recall Quiz on syllabus concepts"
            >
              <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
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

          {/* Profile Menu Trigger (Desktop & Tablet) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => {
                sounds.playPop();
                setShowProfileMenu(!showProfileMenu);
              }}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-200 hover:text-white hover:bg-purple-600/30 transition-all flex items-center gap-1.5"
              title="Edit Profile, Targets or Reset Data"
            >
              <User className="w-3.5 h-3.5 text-purple-300" />
              <span className="font-semibold max-w-[100px] truncate">{userName}</span>
              <ChevronDown className={`w-3 h-3 text-purple-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {showProfileMenu && (
              <div 
                className="absolute right-0 mt-2 w-52 bg-[#1A1A1E] border border-[#2E2E38] rounded-2xl shadow-2xl p-1.5 z-50 animate-fadeIn"
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <div className="px-3 py-2 border-b border-[#26262E]">
                  <p className="text-xs font-bold text-white truncate">{userName}</p>
                  <p className="text-[10px] text-gray-400 truncate">{userProfile?.studyGoal || 'Student Profile'}</p>
                </div>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onOpenOnboarding();
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-gray-300 hover:text-white hover:bg-[#26262E] rounded-xl flex items-center gap-2 transition-colors mt-1"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
                  <span>Edit Profile & Subjects</span>
                </button>

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (window.confirm('Reset all tasks, exams, and user data to start fresh?')) {
                      onResetData();
                    }
                  }}
                  className="w-full px-3 py-2 text-left text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                  <span>Reset All Data</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="max-w-7xl mx-auto mt-2.5 pt-2.5 border-t border-[#1F1F26] grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="flex items-center gap-2.5 bg-[#17171B] px-3 py-1.5 sm:py-2 rounded-lg border border-[#26262E]">
          <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-semibold text-xs">
            {completionRate}%
          </div>
          <div>
            <div className="text-gray-400 text-[10px] uppercase font-mono">Completion</div>
            <div className="text-white font-semibold">{completedTasks} / {totalTasks} Tasks</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-[#17171B] px-3 py-1.5 sm:py-2 rounded-lg border border-[#26262E]">
          <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-semibold text-xs">
            <Flame className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-gray-400 text-[10px] uppercase font-mono">Exam Critical</div>
            <div className="text-rose-300 font-semibold">{examCriticalPending} Unresolved</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-[#17171B] px-3 py-1.5 sm:py-2 rounded-lg border border-[#26262E]">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 font-semibold text-xs">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-gray-400 text-[10px] uppercase font-mono">Pending Tasks</div>
            <div className="text-white font-semibold">{pendingTasks} Action Items</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 bg-[#17171B] px-3 py-1.5 sm:py-2 rounded-lg border border-[#26262E]">
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
