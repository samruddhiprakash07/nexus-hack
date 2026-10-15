import React, { useState } from 'react';
import { 
  BrainCircuit, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  PlusCircle, 
  Award, 
  Lightbulb, 
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SYLLABUS_QUIZZES } from '../data/initialData';
import { sounds } from '../utils/soundEffects';

export default function SyllabusQuizModal({
  isOpen,
  onClose,
  onAddWeakTopicsToTasks
}) {
  const [selectedSubjectKey, setSelectedSubjectKey] = useState('dsa');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: selectedOptionIndex }
  const [quizFinished, setQuizFinished] = useState(false);

  if (!isOpen) return null;

  const currentSubject = SYLLABUS_QUIZZES[selectedSubjectKey];
  const questions = currentSubject.questions;
  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (qId, optionIdx) => {
    if (userAnswers[qId] !== undefined) return; // already answered

    sounds.playPop();
    const isCorrect = optionIdx === currentQuestion.correctIndex;
    if (isCorrect) {
      sounds.playSuccess();
    }

    setUserAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleNext = () => {
    sounds.playPop();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
      const score = calculateScore();
      if (score.percent >= 70) {
        sounds.playSuccess();
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#A855F7', '#10B981', '#E9D5FF']
        });
      }
    }
  };

  const handleRestart = () => {
    sounds.playPop();
    setUserAnswers({});
    setCurrentIndex(0);
    setQuizFinished(false);
  };

  const handleSubjectChange = (key) => {
    sounds.playPop();
    setSelectedSubjectKey(key);
    setUserAnswers({});
    setCurrentIndex(0);
    setQuizFinished(false);
  };

  const calculateScore = () => {
    let correctCount = 0;
    const weakQuestions = [];

    questions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected === q.correctIndex) {
        correctCount += 1;
      } else {
        weakQuestions.push(q);
      }
    });

    const percent = Math.round((correctCount / questions.length) * 100);
    return { correctCount, total: questions.length, percent, weakQuestions };
  };

  const { correctCount, total, percent, weakQuestions } = calculateScore();

  const handleConvertWeakTopics = () => {
    if (weakQuestions.length === 0) return;

    sounds.playSuccess();
    const tasksToInsert = weakQuestions.map(wq => ({
      id: `quiz-task-${Date.now()}-${wq.id}`,
      title: `Active Recall: ${wq.weakTopicTask}`,
      category: selectedSubjectKey === 'dsa' ? 'Core Coding (Java/DSA)' : 'Academics',
      priority: 'High',
      duration: 35,
      completed: false,
      examCritical: true,
      energyNeeded: 'High',
      notes: `Identified from Syllabus Quiz (${currentSubject.title}). Explanation: ${wq.explanation.slice(0, 100)}...`,
      createdAt: new Date().toISOString()
    }));

    onAddWeakTopicsToTasks(tasksToInsert);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#1A1A22] border border-[#2E2E38] rounded-2xl shadow-2xl p-5 sm:p-6 relative my-8">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-32 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2E2E38]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-glow-purple-sm">
              <BrainCircuit className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Syllabus Quiz & Active Recall Generator
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Concept Mastery
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Test high-yield university concepts and automatically convert weak points into study tasks.
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

        {/* Subject Tabs */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
          {Object.entries(SYLLABUS_QUIZZES).map(([key, data]) => (
            <button
              key={key}
              onClick={() => handleSubjectChange(key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                selectedSubjectKey === key
                  ? 'bg-purple-600/20 border border-purple-500/50 text-purple-200 shadow-sm'
                  : 'bg-[#141418] text-gray-400 hover:text-white border border-[#2E2E38]'
              }`}
            >
              <span>{data.title}</span>
            </button>
          ))}
        </div>

        {/* Quiz Body */}
        {!quizFinished ? (
          <div className="mt-5">
            {/* Progress Bar & Header */}
            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
              <span className="font-mono">
                Question <strong className="text-white">{currentIndex + 1}</strong> of {questions.length}
              </span>
              <span className="text-purple-400 font-medium">{currentQuestion.topic}</span>
            </div>

            {/* Linear Progress */}
            <div className="w-full h-1.5 bg-[#141418] rounded-full overflow-hidden border border-[#2E2E38] mb-4">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="p-4 rounded-xl bg-[#141418] border border-[#2E2E38] mb-4">
              <h4 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                {currentQuestion.question}
              </h4>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = userAnswers[currentQuestion.id] === idx;
                const isAnswered = userAnswers[currentQuestion.id] !== undefined;
                const isCorrect = idx === currentQuestion.correctIndex;

                let cardStyle = 'bg-[#16161C] border-[#2E2E38] text-gray-300 hover:bg-[#1C1C24] hover:border-gray-500';

                if (isAnswered) {
                  if (isCorrect) {
                    cardStyle = 'bg-emerald-950/30 border-emerald-500/60 text-emerald-200 font-medium';
                  } else if (isSelected) {
                    cardStyle = 'bg-rose-950/30 border-rose-500/60 text-rose-200 font-medium';
                  } else {
                    cardStyle = 'bg-[#141418] border-[#222228] text-gray-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(currentQuestion.id, idx)}
                    className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-all ${cardStyle}`}
                  >
                    <span className="w-5 h-5 rounded-lg bg-[#22222A] flex items-center justify-center font-mono text-xs text-gray-400 flex-shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-snug">{option}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Card (shows immediately after answering) */}
            {userAnswers[currentQuestion.id] !== undefined && (
              <div className="mt-4 p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 animate-fade-in text-xs leading-relaxed">
                <div className="flex items-center gap-1.5 font-semibold text-purple-300 mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Concept Explanation & Memory Anchor:</span>
                </div>
                <p className="text-gray-300">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="mt-5 pt-3 border-t border-[#26262E] flex items-center justify-between">
              <span className="text-[11px] text-gray-500 font-mono">
                {userAnswers[currentQuestion.id] !== undefined ? 'Answer Recorded' : 'Select an answer to reveal explanation'}
              </span>

              {userAnswers[currentQuestion.id] !== undefined && (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-glow-purple-sm transition-all flex items-center gap-1.5"
                >
                  <span>{currentIndex === questions.length - 1 ? 'View Results' : 'Next Question'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Results & Weak Topics Converter */
          <div className="mt-5 space-y-4 animate-fade-in">
            <div className="p-5 rounded-2xl bg-[#141418] border border-[#2E2E38] text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-300 flex items-center justify-center mx-auto mb-3 shadow-glow-purple-sm">
                <Award className="w-6 h-6 text-purple-400" />
              </div>

              <h4 className="text-lg font-bold text-white">Quiz Evaluation Completed</h4>
              <p className="text-xs text-gray-400 mt-1">
                Course: <strong className="text-purple-300">{currentSubject.title}</strong>
              </p>

              <div className="text-3xl font-mono font-bold text-white mt-3">
                {percent}% <span className="text-sm font-normal text-gray-400">({correctCount}/{total})</span>
              </div>
            </div>

            {/* Weak Topics Section */}
            {weakQuestions.length > 0 ? (
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>Identified Weak Topics ({weakQuestions.length})</span>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">Targeted Revision</span>
                </div>

                <div className="space-y-1.5">
                  {weakQuestions.map((wq, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-[#141418] border border-[#2E2E38] text-xs flex items-center justify-between gap-2"
                    >
                      <span className="text-gray-200">{wq.weakTopicTask}</span>
                      <span className="text-[10px] text-purple-400 font-mono px-2 py-0.5 rounded bg-purple-500/10">
                        {wq.topic}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleConvertWeakTopics}
                  className="w-full mt-2 py-2.5 px-4 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-glow-purple-sm transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add Weak Topics to Task Inbox</span>
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-1.5" />
                <h5 className="text-xs font-semibold text-emerald-300">Flawless Concept Mastery!</h5>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  You scored 100% on this topic set. No weak areas detected.
                </p>
              </div>
            )}

            {/* Footer reset button */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={handleRestart}
                className="px-4 py-2 text-xs font-medium rounded-xl bg-[#141418] border border-[#2E2E38] text-gray-300 hover:text-white flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Quiz</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
