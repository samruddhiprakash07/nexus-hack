import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  X, 
  RotateCcw, 
  Zap, 
  Clock, 
  Flame, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export default function ChatAssistant({
  isOpen,
  onClose,
  tasks,
  activeExam,
  energyLevel,
  onTriggerRecovery,
  onFocusTask
}) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello Alex! I'm your **FocusMate AI Mentor**. I'm tracking your upcoming **${activeExam?.subject || 'Exams'}** and current **${energyLevel} Energy** state.\n\nHow can I help you sharpen your study trajectory today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const QUICK_PROMPTS = [
    { label: '📊 Analyze workload', text: 'Analyze my workload and tell me where my bottleneck is.' },
    { label: '⚡ 30m recovery plan', text: 'Give me a 30-minute recovery study plan based on my current energy.' },
    { label: '🎯 No-fluff advice', text: 'Encourage me without fluff or toxic positivity.' },
    { label: '🧩 Deconstruct hardest task', text: 'Break down my hardest pending task into 3 bite-sized micro-steps.' },
  ];

  const generateAIResponse = (userQuery) => {
    const q = userQuery.toLowerCase();
    const pending = tasks.filter(t => !t.completed);
    const examCritical = pending.filter(t => t.examCritical);
    const completed = tasks.filter(t => t.completed);
    const topTask = pending[0] || { title: 'Revision and active recall', category: 'Academics', duration: 30 };

    let reply = '';
    let actionItem = null;

    if (q.includes('analyze') || q.includes('workload') || q.includes('bottleneck')) {
      reply = `### 📊 Real-Time Workload Analysis\n\n` +
        `• **Active Exam**: **${activeExam?.subject || 'Upcoming Exam'}** (Countdown active)\n` +
        `• **Progress**: ${completed.length} completed / ${pending.length} pending tasks (~${pending.reduce((a, b) => a + (b.duration || 30), 0)} mins remaining)\n` +
        `• **Exam-Critical Items**: ${examCritical.length} urgent tasks flagged.\n` +
        `• **Current Energy**: **${energyLevel} Energy** mode.\n\n` +
        `**Mentor Diagnosis**: Your primary friction point is context switching between *Academics* and *Personal Goals*. Since you are in **${energyLevel} Energy**, tackle **"${topTask.title}"** for one uninterrupted block, then trigger a 5-minute cognitive reset.`;
      
      actionItem = {
        label: `Start Focus: "${topTask.title.slice(0, 30)}..."`,
        type: 'focus',
        task: topTask
      };
    } else if (q.includes('30-minute') || q.includes('30m') || q.includes('recovery study plan') || q.includes('recovery plan')) {
      reply = `### ⚡ 30-Minute Recovery Protocol (${energyLevel} Energy)\n\n` +
        `1. **Minutes 0 - 5**: Open your notes for **"${topTask.title}"**. Scan only headings, diagrams, and theorem formulas.\n` +
        `2. **Minutes 5 - 22 (17m Deep Recall)**: Close the book. Write down 3 core principles from memory on scrap paper without checking solutions.\n` +
        `3. **Minutes 22 - 27 (5m Error Check)**: Cross-reference where your memory had gaps. Update your review checklist.\n` +
        `4. **Minutes 27 - 30**: Stand up, hydrate, and breathe. Zero screen interaction during the pause.\n\n` +
        `This protects your active recall without inducing cognitive fatigue.`;
      
      actionItem = {
        label: 'Launch 25m Pomodoro with Rain Ambience',
        type: 'focus',
        task: topTask
      };
    } else if (q.includes('fluff') || q.includes('encourage') || q.includes('positivity')) {
      reply = `### 🎯 Grounded Real-Talk\n\n` +
        `You don't need a motivational quote right now — you need momentum.\n\n` +
        `You have **${pending.length} tasks** pending. That looks intimidating on a screen, but you can only execute one cognitive step at any given millisecond.\n\n` +
        `Pick **"${topTask.title}"**. Don't worry about finishing the whole syllabus today. Just work on this single item for 15 minutes. Action creates motivation, not the other way around.`;
      
      actionItem = {
        label: 'Tackle Top Priority Task',
        type: 'focus',
        task: topTask
      };
    } else if (q.includes('break down') || q.includes('micro') || q.includes('hardest task')) {
      reply = `### 🧩 Micro-Step Deconstruction\n\n` +
        `Target Task: **"${topTask.title}"** (${topTask.duration}m)\n\n` +
        `Here is how to slice it so low friction lets you start immediately:\n\n` +
        `• **Step 1 (3 mins - Environment Setup)**: Open only the required IDE file or lecture slide. Close all other tabs.\n` +
        `• **Step 2 (12 mins - Skeleton Draft)**: Write the function signature or diagram the concept on paper. Don't worry about perfection.\n` +
        `• **Step 3 (15 mins - Execution & Test)**: Run one test case or solve one numerical question. Once verified, celebrate that win.`;

      actionItem = {
        label: 'Start Step 1 Now',
        type: 'focus',
        task: topTask
      };
    } else {
      reply = `Understood. Looking at your live workspace, you have **${pending.length} pending items** and **${examCritical.length} exam-critical tasks** for **${activeExam?.subject || 'your semester'}**.\n\n` +
        `With your current **${energyLevel} Energy**, I recommend focusing on bite-sized milestones. Would you like me to run an **Adaptive Recovery** recalibration, or suggest a specific study sprint?`;

      actionItem = {
        label: 'Trigger Adaptive Recovery Engine',
        type: 'recovery'
      };
    }

    return { reply, actionItem };
  };

  const handleSend = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    sounds.playPop();
    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking and typing response
    setTimeout(() => {
      const { reply, actionItem } = generateAIResponse(textToSend);
      sounds.playSuccess();
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: reply,
        actionItem,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 650);
  };

  const handleActionClick = (action) => {
    sounds.playPop();
    if (action.type === 'focus' && action.task) {
      onFocusTask(action.task);
      onClose();
    } else if (action.type === 'recovery') {
      onClose();
      onTriggerRecovery();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-[#141418] border-l border-[#2E2E38] shadow-2xl flex flex-col animate-slide-left backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-[#2E2E38] bg-[#1A1A22] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-glow-purple-sm">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">FocusMate AI Mentor</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            </div>
            <p className="text-[11px] text-gray-400">Contextual study intelligence • 100% offline</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-[#26262E] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                isUser
                  ? 'bg-purple-600 text-white rounded-tr-sm shadow-md'
                  : 'bg-[#1C1C24] border border-[#2E2E38] text-gray-200 rounded-tl-sm'
              }`}>
                {/* Text formatting with basic markdown simulation */}
                <div className="space-y-2 whitespace-pre-wrap">
                  {msg.text.split('\n\n').map((paragraph, pIdx) => {
                    if (paragraph.startsWith('### ')) {
                      return (
                        <div key={pIdx} className="font-bold text-sm text-purple-300 pb-1 border-b border-[#2E2E38]/50">
                          {paragraph.replace('### ', '')}
                        </div>
                      );
                    }
                    return (
                      <p key={pIdx} className="text-gray-300">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>

                {/* Optional interactive action button embedded inside message */}
                {msg.actionItem && (
                  <div className="mt-3 pt-2.5 border-t border-[#2E2E38]">
                    <button
                      onClick={() => handleActionClick(msg.actionItem)}
                      className="w-full text-left px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs font-semibold flex items-center justify-between transition-colors shadow-sm"
                    >
                      <span>{msg.actionItem.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-purple-300" />
                    </button>
                  </div>
                )}

                <div className="mt-1.5 text-[9px] text-gray-500 text-right font-mono">
                  {msg.timestamp}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 items-center text-gray-400 text-xs">
            <div className="w-7 h-7 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-[#1C1C24] border border-[#2E2E38] rounded-2xl px-4 py-2.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      <div className="p-3 border-t border-[#26262E] bg-[#17171C] overflow-x-auto">
        <div className="text-[10px] uppercase font-mono tracking-wider text-gray-400 mb-1.5">
          Mentor Shortcuts
        </div>
        <div className="flex gap-1.5 pb-1">
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp.text)}
              className="px-2.5 py-1 text-[11px] rounded-lg bg-[#202028] hover:bg-purple-600/20 hover:text-purple-200 border border-[#2E2E38] text-gray-300 whitespace-nowrap transition-colors"
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-[#1A1A22] border-t border-[#2E2E38] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask FocusMate about tasks, exams, or strategy..."
          className="flex-1 px-3.5 py-2 text-xs bg-[#121214] border border-[#2E2E38] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white shadow-glow-purple-sm transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
