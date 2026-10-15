import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Target, 
  Sparkles, 
  CloudRain, 
  Radio, 
  Waves 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export default function PomodoroTimer({ activeTask, onCompleteActiveTask, onClearActiveTask }) {
  const [mode, setMode] = useState('focus'); // 'focus' | 'shortBreak' | 'longBreak'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState('none'); // 'none' | 'rain' | 'alpha' | 'white'
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  const timerRef = useRef(null);

  const MODES = {
    focus: { name: 'Deep Focus', duration: 25 * 60, color: 'text-purple-400 border-purple-500/40 bg-purple-500/10' },
    shortBreak: { name: 'Short Rest', duration: 5 * 60, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
    longBreak: { name: 'Long Rest', duration: 15 * 60, color: 'text-sky-400 border-sky-500/40 bg-sky-500/10' },
  };

  // Switch mode
  const switchMode = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode].duration);
    sounds.playPop();
  };

  // Timer Tick
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            sounds.playChime();
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.8 },
              colors: ['#A855F7', '#E9D5FF', '#10B981']
            });

            if (mode === 'focus') {
              setSessionsCompleted(c => c + 1);
              if (activeTask && !activeTask.completed) {
                // Task done prompt or mark completed
              }
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, activeTask]);

  // Ambient sound handler
  const handleAmbientChange = (type) => {
    sounds.playPop();
    if (type === ambientSound) {
      sounds.stopAmbient();
      setAmbientSound('none');
    } else {
      sounds.startAmbient(type);
      setAmbientSound(type);
    }
  };

  // Clean up ambient sound on unmount
  useEffect(() => {
    return () => {
      sounds.stopAmbient();
    };
  }, []);

  const totalTime = MODES[mode].duration;
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="rounded-2xl border border-[#2E2E38] bg-[#1A1A1E] p-4 sm:p-5 relative overflow-hidden">
      {/* Background radial glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${
        isRunning ? 'bg-purple-600/15 opacity-100' : 'opacity-0'
      }`} />

      {/* Header & Modes */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-1.5">
          <Target className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-white tracking-wide uppercase font-mono">
            Focus Engine
          </span>
        </div>

        {/* Mode Pills */}
        <div className="flex items-center gap-1 bg-[#121214] border border-[#2E2E38] rounded-xl p-1">
          <button
            onClick={() => switchMode('focus')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
              mode === 'focus' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            25m Focus
          </button>
          <button
            onClick={() => switchMode('shortBreak')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
              mode === 'shortBreak' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            5m Rest
          </button>
          <button
            onClick={() => switchMode('longBreak')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all ${
              mode === 'longBreak' ? 'bg-sky-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            15m Rest
          </button>
        </div>
      </div>

      {/* Main Timer Display */}
      <div className="flex flex-col items-center justify-center my-3">
        <div className="relative w-44 h-44 flex items-center justify-center">
          {/* Circular SVG Ring */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-[#26262E]"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={mode === 'focus' ? 'text-purple-500' : (mode === 'shortBreak' ? 'text-emerald-500' : 'text-sky-500')}
              strokeWidth="6"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - progressPercent / 100)}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>

          {/* Time text centered */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mt-1 flex items-center gap-1">
              {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
              {MODES[mode].name}
            </span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={() => {
              sounds.playPop();
              setTimeLeft(MODES[mode].duration);
              setIsRunning(false);
            }}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#26262E] rounded-xl border border-[#2E2E38] transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setIsRunning(!isRunning);
            }}
            className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition-all shadow-lg ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30 shadow-glow-purple-sm'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              switchMode(mode === 'focus' ? 'shortBreak' : 'focus');
            }}
            className="p-2 text-gray-400 hover:text-white hover:bg-[#26262E] rounded-xl border border-[#2E2E38] transition-colors"
            title="Skip to next session"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Binding Card */}
      <div className="mt-4 pt-3 border-t border-[#26262E]">
        <div className="text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5 flex items-center justify-between">
          <span>Active Focus Goal</span>
          {activeTask && (
            <button
              onClick={onClearActiveTask}
              className="text-gray-500 hover:text-gray-300 text-[10px]"
            >
              Detach
            </button>
          )}
        </div>

        {activeTask ? (
          <div className="p-2.5 rounded-xl bg-[#141418] border border-purple-500/30 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-purple-200 truncate">
                {activeTask.title}
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                <span className="text-purple-400">{activeTask.category}</span>
                <span>•</span>
                <span>{activeTask.duration} min target</span>
              </div>
            </div>

            <button
              onClick={() => onCompleteActiveTask(activeTask.id)}
              className="px-2 py-1 text-[10px] font-medium rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/30 flex items-center gap-1 transition-colors flex-shrink-0"
              title="Mark task completed"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Done</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-2 px-3 rounded-xl bg-[#141418] border border-dashed border-[#2E2E38] text-xs text-gray-500">
            Click "Focus" on any task below to bind it to this timer.
          </div>
        )}
      </div>

      {/* Built-in Ambient Sound Synthesizer */}
      <div className="mt-3 pt-3 border-t border-[#26262E] flex items-center justify-between text-xs">
        <span className="text-[10px] uppercase font-mono text-gray-400 flex items-center gap-1">
          <Waves className="w-3.5 h-3.5 text-purple-400" />
          <span>Ambient Audio:</span>
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => handleAmbientChange('rain')}
            className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition-colors ${
              ambientSound === 'rain'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                : 'text-gray-400 hover:text-white bg-[#141418] border border-[#2E2E38]'
            }`}
            title="Rain Generator (Synthesized Pink Noise)"
          >
            <CloudRain className="w-3 h-3" />
            <span>Rain</span>
          </button>

          <button
            onClick={() => handleAmbientChange('alpha')}
            className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition-colors ${
              ambientSound === 'alpha'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-gray-400 hover:text-white bg-[#141418] border border-[#2E2E38]'
            }`}
            title="Alpha 40Hz Waves (Cognitive Focus Modulation)"
          >
            <Sparkles className="w-3 h-3" />
            <span>40Hz</span>
          </button>

          <button
            onClick={() => handleAmbientChange('white')}
            className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 transition-colors ${
              ambientSound === 'white'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-gray-400 hover:text-white bg-[#141418] border border-[#2E2E38]'
            }`}
            title="White Noise Generator"
          >
            <Radio className="w-3 h-3" />
            <span>White</span>
          </button>

          {ambientSound !== 'none' && (
            <button
              onClick={() => handleAmbientChange('none')}
              className="p-1 text-gray-400 hover:text-rose-400"
              title="Mute Ambient Audio"
            >
              <VolumeX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
