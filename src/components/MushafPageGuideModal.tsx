import React, { useState } from 'react';
import { BookOpen, Check, ChevronRight, Play, CheckCircle2 } from 'lucide-react';
import { ALL_196_MUROJAAH_DAYS } from '../data/plannerData';
import { MushafPageGuideModal } from './MushafPageGuideModal';

interface Murojaah196ViewProps {
  activeDay: number;
  onSetActiveDay: (day: number) => void;
  completedDays: Record<number, boolean>;
  onToggleDay: (day: number) => void;
  onMarkRangeComplete: (start: number, end: number, complete: boolean) => void;
  isProgramStarted: boolean;
  onToggleProgramStarted: () => void;
}

export const Murojaah196View: React.FC<Murojaah196ViewProps> = ({
  activeDay,
  onSetActiveDay,
  completedDays,
  onToggleDay,
  onMarkRangeComplete, // kept for potential future use
  isProgramStarted,
  onToggleProgramStarted,
}) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const currentDaySpec =
    ALL_196_MUROJAAH_DAYS.find((d) => d.day === activeDay) || ALL_196_MUROJAAH_DAYS[0];

  const isCompleted = !!completedDays[activeDay];

  const completedCount = Object.values(completedDays).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 196) * 100);
  const remainingDays = 196 - completedCount;
  const remainingMonths = (remainingDays / 30).toFixed(1);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500 pb-8">
      {/* Header Area */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-[#C7D3C0] space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#5A6B57] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8FA28A]" />
            <span>خريطة المراجعة</span>
          </div>
          <div className="text-[11px] text-[#6E7D6B] flex items-center gap-2">
            <span>6 Phases</span>
            <span>•</span>
            <span>196 Days Structured</span>
            <span>•</span>
            <span>Status: {isProgramStarted ? `Active on Day ${activeDay}` : 'Not Started'}</span>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#243023] tracking-tight">
              Murojaah<br />Roadmap
            </h1>
          </div>
          <div className="text-right">
            <div className="font-arabic text-2xl sm:text-3xl text-[#3A4B37] font-bold leading-tight">
              خريطة<br />المراجعة
            </div>
          </div>
        </div>

        <p className="text-sm text-[#5A6B57] leading-relaxed max-w-md">
          196-Day structured retention program across 6 phases with precise Madinah Mushaf page milestones.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EAEFE8] text-[#3A4B37] text-xs font-bold hover:bg-[#D5E0D2] transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Mushaf Page Guide &amp; 30 Juz Table
          </button>
        </div>
        
        {!isProgramStarted && (
          <div className="pt-2">
            <button
              type="button"
              onClick={onToggleProgramStarted}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#8FA28A] text-white text-sm font-bold hover:bg-[#7A8E75] transition-colors shadow-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              Start from Day 1
            </button>
          </div>
        )}

        {isProgramStarted && (
          <div className="pt-4 border-t border-[#EAEFE8]">
            <div className="flex items-center gap-3 bg-[#F7F4ED] p-2 rounded-2xl border border-[#C7D3C0]">
              <div className="pl-3 py-1">
                <span className="text-[10px] text-[#5A6B57] uppercase tracking-wide font-semibold block mb-0.5">Active Day:</span>
              </div>
              <select
                value={activeDay}
                onChange={(e) => onSetActiveDay(Number(e.target.value))}
                className="flex-1 bg-transparent text-sm font-bold text-[#243023] focus:outline-none appearance-none py-2 cursor-pointer"
              >
                {ALL_196_MUROJAAH_DAYS.map((d) => (
                  <option key={d.day} value={d.day}>
                    Day {d.day} — {d.targetLabel.replace('Juz', 'Jz').substring(0, 30)}{d.targetLabel.length > 30 ? '...' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* ACTIVE DAY BREAKDOWN - REVISED COMPACT VERSION */}
      {isProgramStarted && (
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#C7D3C0]">
          <div className="p-4 rounded-2xl bg-[#F7F4ED] border border-[#C7D3C0] shadow-sm">
            
            {/* Header Section */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <span className="text-[10px] font-bold tracking-wide uppercase text-[#5A6B57]">
                  Target Day {currentDaySpec.day} of 196 • {currentDaySpec.phase}
                </span>
                <h3 className="text-xl font-black text-[#243023] mt-0.5 leading-tight">
                  {currentDaySpec.targetLabel.includes(':') 
                    ? currentDaySpec.targetLabel.split(':')[1].trim() 
                    : currentDaySpec.targetLabel}
                </h3>
                <p className="text-[11px] text-[#5A6B57] mt-0.5 font-medium">{currentDaySpec.blockRange}</p>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-[#EAEFE8] text-[#3A4B37] font-bold text-[10px] text-center whitespace-nowrap border border-[#C7D3C0]/50 shrink-0">
                {currentDaySpec.sheetsEstimateText.split('(')[0].trim()}<br/>
                <span className="font-normal opacity-80">({currentDaySpec.sheetsEstimateText.split('(')[1] || ''}</span>
              </div>
            </div>

            {/* Page Range Info */}
            <div className="px-3.5 py-2.5 rounded-xl bg-white border border-[#C7D3C0] flex items-center justify-between shadow-sm mb-2.5">
              <span className="text-xs font-bold text-[#3A4B37]">Madinah Mushaf Pages:</span>
              <span className="font-mono font-bold text-sm text-[#243023]">{currentDaySpec.pageRangeText}</span>
            </div>

            {currentDaySpec.formulaNote && (
              <p className="text-[10px] text-[#5A6B57] px-1 mb-3 leading-relaxed">
                {currentDaySpec.formulaNote}
              </p>
            )}

            {/* Grid List Pages - Compact */}
            {currentDaySpec.pagesList && currentDaySpec.pagesList.length > 0 && (
              <div className="mb-4">
                <div className="text-[10px] font-bold text-[#3A4B37] mb-1.5 px-1 uppercase tracking-wider">Page List:</div>
                <div className="flex flex-wrap gap-1">
                  {currentDaySpec.pagesList.map((pageNum) => (
                    <span
                      key={pageNum}
                      className="w-10 py-1 text-center rounded-md bg-white border border-[#C7D3C0] font-mono text-[10px] font-bold text-[#243023] shadow-sm"
                    >
                      p.{pageNum}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onToggleDay(activeDay)}
                className={`flex-1 min-h-[44px] rounded-xl flex items-center justify-center gap-2 font-bold transition-all shadow-sm ${
                  isCompleted
                    ? 'bg-[#8FA28A] text-white border-none'
                    : 'bg-white border border-[#C7D3C0] text-[#243023] hover:bg-[#EAEFE8]'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Mark Day {activeDay} Done</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activeDay < 196) onSetActiveDay(activeDay + 1);
                }}
                disabled={activeDay >= 196}
                className="w-12 flex items-center justify-center rounded-xl bg-white border border-[#C7D3C0] text-[#243023] disabled:opacity-50 hover:bg-[#EAEFE8] shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overall Progress */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#C7D3C0]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-[#243023]">
            Overall Progress (196 Days)
          </h4>
          <span className="text-xs font-mono font-bold text-[#5A6B57]">
            {completedCount} / 196 Days ({progressPercent}%)
          </span>
        </div>
        <div className="h-2.5 w-full bg-[#F7F4ED] rounded-full overflow-hidden mb-3 border border-[#EAEFE8]">
          <div
            className="h-full bg-[#8FA28A] transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-[#6E7D6B] font-medium">
          <span>{remainingDays} days remaining</span>
          <span>Est. ~{remainingMonths} months</span>
        </div>
      </div>

      <MushafPageGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        activeDay={activeDay}
        onSelectDay={(day) => {
          onSetActiveDay(day);
          setIsGuideOpen(false);
        }}
      />
    </div>
  );
};
