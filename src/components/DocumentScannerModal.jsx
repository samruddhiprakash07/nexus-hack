import React, { useState } from 'react';
import { 
  Camera, 
  UploadCloud, 
  Check, 
  Sparkles, 
  FileText, 
  Scan, 
  PlusCircle, 
  CheckSquare, 
  Square, 
  Flame, 
  X,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { OCR_SAMPLE_PRESETS } from '../data/initialData';
import { sounds } from '../utils/soundEffects';

export default function DocumentScannerModal({
  isOpen,
  onClose,
  onAddExtractedTasks
}) {
  const [selectedPreset, setSelectedPreset] = useState(OCR_SAMPLE_PRESETS[0]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0); // 0: ready, 1: scanning, 2: completed
  const [selectedTaskIndices, setSelectedTaskIndices] = useState(
    OCR_SAMPLE_PRESETS[0].tasks.map((_, i) => i)
  );

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    sounds.playPop();
    setSelectedPreset(preset);
    setUploadedImage(null);
    setScanStep(0);
    setSelectedTaskIndices(preset.tasks.map((_, i) => i));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      sounds.playPop();
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setScanStep(0);
        // Custom extracted items for custom upload
        const customTasks = [
          {
            title: `Read & Summarize uploaded document: ${file.name.slice(0, 24)}`,
            category: 'Academics',
            duration: 40,
            priority: 'High',
            examCritical: true,
          },
          {
            title: 'Extract key formulas and terms into active recall deck',
            category: 'Academics',
            duration: 30,
            priority: 'Medium',
            examCritical: false,
          },
          {
            title: 'Verify deadline and submission requirements on LMS',
            category: 'Personal Goals',
            duration: 15,
            priority: 'Low',
            examCritical: false,
          }
        ];
        setSelectedPreset({
          id: 'custom-upload',
          title: file.name,
          subtitle: 'User Uploaded Document / Screenshot',
          category: 'Academics',
          dateDetected: 'Detected Due Date: In 4 Days',
          documentType: 'Uploaded Photo / Timetable',
          previewVisual: {
            header: `OCR EXTRACTED FROM: ${file.name.toUpperCase()}`,
            snippet: '• Chapter 3 & 4 Exercise problem sets\n• Submission checklist: Code archive & documentation\n• Grading rubric: Functionality (60%), Clean Code (40%)',
            confidence: '95.8% OCR Confidence'
          },
          tasks: customTasks
        });
        setSelectedTaskIndices(customTasks.map((_, i) => i));
      };
      reader.readAsDataURL(file);
    }
  };

  const startScan = () => {
    sounds.playPop();
    setIsScanning(true);
    setScanStep(1);

    setTimeout(() => {
      setIsScanning(false);
      setScanStep(2);
      sounds.playSuccess();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#A855F7', '#E9D5FF', '#10B981']
      });
    }, 2100);
  };

  const toggleTaskSelection = (index) => {
    sounds.playPop();
    setSelectedTaskIndices(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleBulkAdd = () => {
    const tasksToAdd = selectedPreset.tasks
      .filter((_, idx) => selectedTaskIndices.includes(idx))
      .map(t => ({
        ...t,
        id: `ocr-task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        completed: false,
        energyNeeded: t.priority === 'High' ? 'High' : 'Medium',
        notes: `Imported via Mock OCR Scanner from "${selectedPreset.title}"`,
        createdAt: new Date().toISOString()
      }));

    if (tasksToAdd.length > 0) {
      sounds.playSuccess();
      onAddExtractedTasks(tasksToAdd);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#1A1A22] border border-[#2E2E38] rounded-2xl shadow-2xl p-5 sm:p-6 relative my-8">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[#2E2E38]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-glow-purple-sm">
              <Camera className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Photo & Document Scanner (Mock OCR)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  AI Task Extractor
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Drop assignment sheets, syllabus notes, or timetable photos to auto-generate tasks.
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

        {/* Presets & Upload Picker */}
        <div className="mt-4">
          <div className="text-[11px] font-semibold text-gray-300 uppercase font-mono tracking-wider mb-2 flex items-center justify-between">
            <span>Select Sample Document or Upload Photo</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            {OCR_SAMPLE_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id && !uploadedImage;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'bg-purple-600/20 border-purple-500 text-purple-200 shadow-sm'
                      : 'bg-[#141418] border-[#2E2E38] text-gray-400 hover:text-gray-200 hover:border-gray-600'
                  }`}
                >
                  <div className="text-xs font-semibold truncate text-white">{preset.title.split(':')[0]}</div>
                  <div className="text-[10px] text-gray-400 truncate mt-0.5">{preset.category}</div>
                </button>
              );
            })}

            {/* Custom file upload card */}
            <label className="p-2.5 rounded-xl border border-dashed border-purple-500/40 bg-purple-950/10 hover:bg-purple-950/20 text-purple-300 flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs font-medium">
              <UploadCloud className="w-4 h-4 text-purple-400" />
              <span>Upload Photo...</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Dual Pane: Document Preview with Laser Scan + Extracted Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
          {/* Left: Document View with Laser Overlay */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>Document View</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                {selectedPreset.previewVisual.confidence}
              </span>
            </div>

            {/* Simulated Document Paper Container */}
            <div className="relative rounded-xl border border-[#2E2E38] bg-[#121214] p-4 flex-1 min-h-[260px] overflow-hidden flex flex-col justify-between shadow-inner">
              {/* Laser Animation Bar when scanning */}
              {isScanning && (
                <div className="scanner-laser z-20" />
              )}

              {/* Scanning status banner */}
              {isScanning && (
                <div className="absolute inset-0 z-10 bg-purple-950/50 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                  <div className="w-10 h-10 rounded-full border-2 border-purple-400 border-t-transparent animate-spin mb-3" />
                  <span className="text-sm font-semibold text-white">Running Neural OCR Engine...</span>
                  <span className="text-xs text-purple-300 mt-1">Extracting action items, deadlines & category tags</span>
                </div>
              )}

              {uploadedImage ? (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-lg">
                  <img
                    src={uploadedImage}
                    alt="Uploaded notes"
                    className="max-h-[240px] w-auto object-contain rounded border border-[#2E2E38]"
                  />
                </div>
              ) : (
                <div className="space-y-3 font-mono text-xs text-gray-300">
                  {/* Simulated high-density paper header */}
                  <div className="p-2.5 rounded-lg bg-[#1A1A22] border border-[#2E2E38]">
                    <div className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                      {selectedPreset.previewVisual.header}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {selectedPreset.subtitle}
                    </div>
                  </div>

                  {/* Document snippet with highlighted OCR bounding boxes */}
                  <div className="p-3 rounded-lg bg-[#18181E] border border-[#2E2E38]/80 space-y-2 text-[11px] leading-relaxed">
                    <div className="text-emerald-400 font-semibold">{selectedPreset.dateDetected}</div>
                    <div className="whitespace-pre-line text-gray-300">
                      {selectedPreset.previewVisual.snippet}
                    </div>
                  </div>

                  {/* Detected tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Auto-Classified: {selectedPreset.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      OCR Engine: Verified
                    </span>
                  </div>
                </div>
              )}

              {/* Scan Trigger Button */}
              <div className="pt-3 border-t border-[#26262E] mt-3 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-mono">
                  {scanStep === 2 ? 'Analysis Finished' : 'Ready to Parse'}
                </span>

                <button
                  onClick={startScan}
                  disabled={isScanning}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white shadow-glow-purple-sm transition-all flex items-center gap-1.5"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>{scanStep === 2 ? 'Re-Scan Document' : 'Run OCR Scan'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Extracted Tasks Generator */}
          <div className="lg:col-span-6 flex flex-col">
            <div className="text-xs font-semibold text-gray-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Extracted Action Generator</span>
              </span>
              <span className="text-[10px] font-mono text-purple-400">
                {selectedTaskIndices.length} of {selectedPreset.tasks.length} Selected
              </span>
            </div>

            <div className="flex-1 rounded-xl border border-[#2E2E38] bg-[#141418] p-3 flex flex-col justify-between">
              <div className="space-y-2 overflow-y-auto max-h-[250px] pr-1">
                {selectedPreset.tasks.map((task, idx) => {
                  const isChecked = selectedTaskIndices.includes(idx);

                  return (
                    <div
                      key={idx}
                      onClick={() => toggleTaskSelection(idx)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                        isChecked
                          ? 'bg-[#1C1C24] border-purple-500/40 shadow-sm'
                          : 'bg-[#16161A] border-[#26262E] opacity-60'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-purple-400 flex-shrink-0"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 fill-purple-400/20" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-500" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-gray-100 leading-snug">
                          {task.title}
                        </div>

                        <div className="flex items-center gap-2 mt-1.5 flex-wrap text-[10px]">
                          <span className="px-2 py-0.5 rounded bg-[#22222A] text-purple-300 border border-[#2E2E38]">
                            {task.category}
                          </span>
                          <span className="text-gray-400 font-mono">
                            {task.duration} mins
                          </span>
                          {task.examCritical && (
                            <span className="flex items-center gap-0.5 text-rose-400 font-medium">
                              <Flame className="w-3 h-3" />
                              <span>Exam Critical</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bulk add button */}
              <div className="pt-3 border-t border-[#26262E] mt-3">
                <button
                  onClick={handleBulkAdd}
                  disabled={selectedTaskIndices.length === 0}
                  className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white shadow-glow-purple-sm transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>
                    Add Selected ({selectedTaskIndices.length}) to Task Inbox
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
