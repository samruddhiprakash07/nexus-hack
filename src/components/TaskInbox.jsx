import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flame, 
  Plus, 
  Trash2, 
  Play, 
  Search, 
  Zap,
  Tag,
  BookOpen,
  Code,
  GraduationCap,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/soundEffects';

export default function TaskInbox({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onSetActiveTask,
  activeTaskId,
  onResetSampleTasks,
  userProfile = null
}) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [filterExamCritical, setFilterExamCritical] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('urgency'); // 'urgency' | 'duration' | 'alphabetical'
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Academics');
  const [newPriority, setNewPriority] = useState('High');
  const [newDuration, setNewDuration] = useState('45');
  const [newExamCritical, setNewExamCritical] = useState(false);
  const [newEnergy, setNewEnergy] = useState('Medium');
  const [newNotes, setNewNotes] = useState('');

  const CATEGORIES = [
    { id: 'All', label: 'All Tracks', icon: Tag },
    { id: 'Academics', label: 'Academics', icon: BookOpen, color: 'text-purple-400' },
    { id: 'Core Coding (Java/DSA)', label: 'Coding & DSA', icon: Code, color: 'text-cyan-400' },
    { id: 'Courses & Certifications', label: 'Courses & Certs', icon: GraduationCap, color: 'text-amber-400' },
    { id: 'Personal Goals', label: 'Personal Goals', icon: HeartHandshake, color: 'text-emerald-400' },
  ];

  const handleToggle = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      sounds.playSuccess();
      confetti({
        particleCount: 40,
        spread: 45,
        origin: { y: 0.8 },
        colors: ['#A855F7', '#10B981', '#38BDF8']
      });
    } else {
      sounds.playPop();
    }
    onToggleTask(taskId);
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask = {
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      priority: newPriority,
      duration: parseInt(newDuration, 10) || 30,
      completed: false,
      examCritical: newExamCritical,
      energyNeeded: newEnergy,
      notes: newNotes.trim(),
      createdAt: new Date().toISOString()
    };

    onAddTask(newTask);
    sounds.playPop();
    setNewTitle('');
    setNewNotes('');
    setShowAddModal(false);
  };

  // Filter tasks
  let filtered = tasks.filter(task => {
    if (activeCategory !== 'All' && task.category !== activeCategory) {
      return false;
    }
    if (filterExamCritical && !task.examCritical) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.category.toLowerCase().includes(q) ||
        (task.notes && task.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Sort tasks
  filtered.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // Uncompleted first
    }
    if (sortBy === 'urgency') {
      // Exam critical first, then high priority
      if (a.examCritical !== b.examCritical) return a.examCritical ? -1 : 1;
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      return (priorityOrder[a.priority] ?? 2) - (priorityOrder[b.priority] ?? 2);
    }
    if (sortBy === 'duration') {
      return a.duration - b.duration;
    }
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="rounded-2xl border border-[#2E2E38] bg-[#1A1A1E] p-4 sm:p-6 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[#2E2E38]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Multi-Track Task Inbox
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#26262E] text-gray-400 border border-[#363642]">
              {filtered.length} tasks
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            Organized across academics, coding routines, certifications, and recovery goals.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            onClick={() => {
              sounds.playPop();
              setFilterExamCritical(!filterExamCritical);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-xl border flex items-center gap-1.5 transition-all ${
              filterExamCritical
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                : 'bg-[#121214] text-gray-400 border-[#2E2E38] hover:text-white hover:border-gray-500'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Exam Critical</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setShowAddModal(true);
            }}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-glow-purple-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
        {/* Category Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            const Icon = cat.icon;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  sounds.playPop();
                  setActiveCategory(cat.id);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-purple-600/20 text-purple-200 border border-purple-500/40 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#26262E] border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${cat.color || 'text-gray-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#121214] border border-[#2E2E38] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                sounds.playPop();
                setSortBy(e.target.value);
              }}
              className="px-2.5 py-1.5 text-xs bg-[#121214] border border-[#2E2E38] rounded-xl text-gray-300 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="urgency">Urgency First</option>
              <option value="duration">Shortest First</option>
              <option value="alphabetical">A-Z Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="mt-4 space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-[#2E2E38] bg-[#141418]">
            <CheckCircle2 className="w-8 h-8 text-purple-400/60 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-white">No tasks in this track</h4>
            <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
              Everything in this view is cleared, or matches no current filter.
            </p>
            <button
              onClick={onResetSampleTasks}
              className="mt-3 text-xs text-purple-400 hover:text-purple-300 underline font-medium"
            >
              Restore realistic sample tasks
            </button>
          </div>
        ) : (
          filtered.map((task) => {
            const isBound = activeTaskId === task.id;

            return (
              <div
                key={task.id}
                className={`group flex items-start sm:items-center justify-between gap-3 p-3 sm:px-4 sm:py-3 rounded-xl border transition-all duration-200 ${
                  task.completed
                    ? 'bg-[#141418]/60 border-[#222228] opacity-60'
                    : isBound
                    ? 'bg-purple-950/20 border-purple-500/50 shadow-glow-purple-sm'
                    : 'bg-[#17171B] border-[#26262E] hover:border-[#3D3D4E] hover:bg-[#1E1E24]'
                }`}
              >
                {/* Checkbox & Details */}
                <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => handleToggle(task.id)}
                    className="mt-0.5 sm:mt-0 text-gray-400 hover:text-purple-400 transition-colors flex-shrink-0"
                    aria-label={task.completed ? 'Mark uncompleted' : 'Mark completed'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-purple-400 fill-purple-400/20" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-500 group-hover:text-purple-400" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs sm:text-sm font-medium tracking-tight ${
                          task.completed ? 'line-through text-gray-500' : 'text-gray-100'
                        }`}
                      >
                        {task.title}
                      </span>

                      {task.examCritical && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                          <Flame className="w-3 h-3 text-rose-400" />
                          <span>Exam Critical</span>
                        </span>
                      )}

                      {task.deferred && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          Deferred by Recovery
                        </span>
                      )}
                    </div>

                    {/* Metadata tags */}
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[11px] text-gray-400">
                      <span className="px-2 py-0.5 rounded-md bg-[#22222A] text-gray-300 border border-[#2E2E38]">
                        {task.category}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span>{task.duration}m</span>
                      </span>

                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-400/70" />
                        <span>{task.energyNeeded || 'Medium'} Energy</span>
                      </span>

                      {task.notes && (
                        <span className="hidden md:inline text-gray-500 italic truncate max-w-xs">
                          {task.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Actions: Focus & Delete */}
                <div className="flex items-center gap-1.5 flex-shrink-0 self-center">
                  {!task.completed && (
                    <button
                      onClick={() => {
                        sounds.playPop();
                        onSetActiveTask(task);
                      }}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg flex items-center gap-1 transition-all ${
                        isBound
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-[#22222A] text-gray-300 hover:text-white hover:bg-purple-600/30 border border-[#2E2E38]'
                      }`}
                      title="Set active in Pomodoro Focus Timer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span className="hidden sm:inline">{isBound ? 'Active' : 'Focus'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      sounds.playPop();
                      onDeleteTask(task.id);
                    }}
                    className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-[#26262E] rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#1A1A20] border border-[#2E2E38] rounded-2xl shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-3 border-b border-[#2E2E38] mb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-semibold text-white">Add New Study Task</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve 3 LeetCode Graph problems"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#121214] border border-[#2E2E38] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Track / Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#121214] border border-[#2E2E38] rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Academics">Academics</option>
                    <option value="Core Coding (Java/DSA)">Core Coding & Labs</option>
                    <option value="Courses & Certifications">Courses & Certifications</option>
                    <option value="Personal Goals">Personal Goals</option>
                    {userProfile?.subjects?.map((s) => (
                      <option key={s.id || s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Estimated Duration (mins)</label>
                  <input
                    type="number"
                    min="5"
                    max="240"
                    step="5"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#121214] border border-[#2E2E38] rounded-xl text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#121214] border border-[#2E2E38] rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Energy Required</label>
                  <select
                    value={newEnergy}
                    onChange={(e) => setNewEnergy(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-[#121214] border border-[#2E2E38] rounded-xl text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="High">High Focus ⚡</option>
                    <option value="Medium">Medium Steady 🔋</option>
                    <option value="Low">Low / Gentle 🪫</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Study Notes / Acceptance Criteria</label>
                <input
                  type="text"
                  placeholder="e.g. Verify test cases on LeetCode with O(V + E) runtime"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-[#121214] border border-[#2E2E38] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="examCriticalCheck"
                  checked={newExamCritical}
                  onChange={(e) => setNewExamCritical(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-[#2E2E38] bg-[#121214]"
                />
                <label htmlFor="examCriticalCheck" className="text-xs text-gray-300 flex items-center gap-1 cursor-pointer">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Mark as <strong>Exam Critical</strong> (Protected by Adaptive Recovery Engine)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2E2E38]">
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
                  Add Task to Inbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
