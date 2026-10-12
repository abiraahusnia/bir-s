import React, { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import {
  MUROJAAH_PHASES,
  ALL_196_MUROJAAH_DAYS,
  MurojaahPhaseSpec,
} from '../data/plannerData';
import { MushafPageGuideModal } from './MushafPageGuideModal';

interface Murojaah196ViewProps {
  activeDay: number;
  onSetActiveDay: (day: number) => void;
  completedDays: Record<number, boolean>;
  onToggleDay: (day: number) => void;
  onMarkRangeComplete: (startDay: number, endDay: number, complete: boolean) => void;
  isProgramStarted: boolean;
  onToggleProgramStarted: () => void;
}

export const Murojaah196View: React.FC<Murojaah196ViewProps> = ({
  activeDay,
  onSetActiveDay,
  completedDays,
  onToggleDay,
  onMarkRangeComplete,
  isProgramStarted,
  onToggleProgramStarted,
}) => {
  const [selectedPhaseFilter, setSelectedPhaseFilter] = useState<number | 'all'>('all');
  const [showPageGuideModal, setShowPageGuideModal] = useState(false);

  const totalCompleted = Object.values(completedDays).filter(Boolean).length;
  const overallPercent = Math.round((totalCompleted / 196) * 100);

  const currentDaySpec =
    ALL_196_MUROJAAH_DAYS.find((d) => d.day === activeDay) || ALL_196_MUROJAAH_DAYS[0];

  const visiblePhases: MurojaahPhaseSpec[] =
    selectedPhaseFilter === 'all'
      ? MUROJAAH_PHASES
      : MUROJAAH_PHASES.filter((p) => p.phaseNumber === selectedPhaseFilter);

  return (
    <div className="space-y-8">
      {/* Top Hero Overview & Active Day Controller */}
      <section className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A6B57]">
              <span className="font-arabic font-medium text-sm text-[#3A4B37]">خريطة المراجعة</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">6 Phases · 196 Days Structured</span>
              <span aria-hidden="true">·</span>
              <span>
                Status: {isProgramStarted ? `Active on Day ${activeDay}` : 'Ready to Begin'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#243023]">
                Murojaah Roadmap
              </h2>
              <span className="font-arabic text-lg text-[#3A4B37] font-medium">خريطة المراجعة</span>
            </div>
            <p className="text-xs text-[#5A6B57]">
              196-Day structured retention program across 6 phases with precise Madinah Mushaf page milestones.
            </p>
          </div>

          {/* Program Status, Page Guide & Quick Jump */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowPageGuideModal(true)}
              className="min-h-[44px] px-3.5 rounded-xl text-xs font-semibold bg-[#EAEFE8] text-[#243023] hover:bg-[#DCE5D8] transition-colors flex items-center gap-1.5"
              title="Madinah Mushaf page guide & 30 Juz table"
            >
              <BookOpen className="w-4 h-4 text-[#8FA28A]" />
              <span>Mushaf Page Guide &amp; 30 Juz Table</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSetActiveDay(1);
                if (!isProgramStarted) onToggleProgramStarted();
              }}
              className="min-h-[44px] px-3.5 rounded-xl text-xs font-semibold bg-[#8FA28A] text-white hover:bg-[#7A8E75] transition-colors flex items-center gap-1.5 shadow-xs"
              title="Start or reset curriculum to Day 1"
            >
              <span>Start from Day 1</span>
            </button>

            <div className="flex items-center gap-1.5 bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl px-3 min-h-[44px]">
              <label htmlFor="murojaah-day-select" className="text-xs text-[#5A6B57]">
                Active Day:
              </label>
              <select
                id="murojaah-day-select"
                value={activeDay}
                onChange={(e) => onSetActiveDay(Number(e.target.value))}
                className="bg-transparent text-xs font-mono font-semibold text-[#243023] focus:outline-none py-1 w-[120px] sm:w-auto"
              >
                {ALL_196_MUROJAAH_DAYS.map((entry) => (
                  <option key={entry.day} value={entry.day}>
                    Day {entry.day} — {entry.targetLabel.substring(0, 20)}...
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* COMPACT: Active Day Spotlight Strip */}
        <div className="mt-6 pt-5 border-t border-[#C7D3C0]/60 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-7 flex flex-col gap-2 p-3.5 rounded-xl bg-white border border-[#C7D3C0] shadow-sm">
            
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold tracking-wide uppercase text-[#5A6B57]">
                  Target Day {currentDaySpec.day} of 196 • {currentDaySpec.phaseTitle.split(':')[0]}
                </span>
                <h3 className="text-xl font-black text-[#243023] mt-0.5 leading-tight">
                  {currentDaySpec.targetLabel.includes(':') 
                    ? currentDaySpec.targetLabel.split(':')[1].trim() 
                    : currentDaySpec.targetLabel}
                </h3>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-[#EAEFE8] text-[#3A4B37] font-bold text-[10px] text-center whitespace-nowrap border border-[#C7D3C0]/50 shrink-0">
                {currentDaySpec.sheetsEstimateText.split('(')[0].trim()}<br/>
                <span className="font-normal opacity-80">({currentDaySpec.sheetsEstimateText.split('(')[1] || ''}</span>
              </div>
            </div>

            <div className="px-3 py-2 rounded-lg bg-[#F7F4ED] border border-[#EAEFE8] flex items-center justify-between">
              <span className="text-xs font-bold text-[#3A4B37]">Madinah Mushaf Pages:</span>
              <span className="font-mono font-bold text-sm text-[#243023]">{currentDaySpec.pageRangeText}</span>
            </div>

            {currentDaySpec.pagesList && currentDaySpec.pagesList.length > 0 && (
              <div className="pt-1">
                <div className="text-[10px] font-bold text-[#3A4B37] mb-1.5 px-1 uppercase tracking-wider">Page List:</div>
                <div className="flex flex-wrap gap-1">
                  {currentDaySpec.pagesList.map((pageNum) => (
                    <span
                      key={pageNum}
                      className="w-9 py-0.5 text-center rounded-md bg-[#F7F4ED] border border-[#C7D3C0]/50 font-mono text-[10px] font-bold text-[#243023]"
                    >
                      p.{pageNum}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-1.5 mt-1 border-t border-[#C7D3C0]/30">
              <button
                type="button"
                onClick={() => onToggleDay(currentDaySpec.day)}
                className={`flex-1 min-h-[38px] px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
                  completedDays[currentDaySpec.day]
                    ? 'bg-[#8FA28A] text-white border-none'
                    : 'bg-[#F7F4ED] text-[#243023] border border-[#C7D3C0] hover:bg-[#EAEFE8]'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>
                  {completedDays[currentDaySpec.day]
                    ? `Completed`
                    : `Mark Day ${currentDaySpec.day} Done`}
                </span>
              </button>

              {activeDay > 1 && (
                <button
                  type="button"
                  onClick={() => onSetActiveDay(activeDay - 1)}
                  className="w-10 min-h-[38px] rounded-xl bg-[#F7F4ED] border border-[#C7D3C0] text-[#243023] flex items-center justify-center hover:bg-[#EAEFE8]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              {activeDay < 196 && (
                <button
                  type="button"
                  onClick={() => onSetActiveDay(activeDay + 1)}
                  className="w-10 min-h-[38px] rounded-xl bg-[#F7F4ED] border border-[#C7D3C0] text-[#243023] flex items-center justify-center hover:bg-[#EAEFE8]"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Progress Summary */}
          <div className="md:col-span-5 p-4 rounded-xl bg-[#F7F4ED] border border-[#C7D3C0] flex flex-col justify-between h-full">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#3A4B37]">Overall Progress (196 Days)</span>
              <span className="font-mono font-bold text-[#243023] tabular-nums">
                {totalCompleted} / 196 ({overallPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-white rounded-full overflow-hidden my-3 border border-[#C7D3C0]/60">
              <div
                className="h-full bg-[#8FA28A] transition-all duration-200"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#5A6B57] tabular-nums">
              <span>{196 - totalCompleted} days remaining</span>
              <span>Est. ~{(196 - totalCompleted) / 30 > 0 ? ((196 - totalCompleted) / 30).toFixed(1) : 0} months</span>
            </div>
          </div>
        </div>
      </section>

      {/* Phase Filter Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white/90 border border-[#C7D3C0] rounded-xl">
        <button
          type="button"
          onClick={() => setSelectedPhaseFilter('all')}
          className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
            selectedPhaseFilter === 'all'
              ? 'bg-[#8FA28A] text-white'
              : 'text-[#4A5A47] hover:text-[#243023]'
          }`}
        >
          All 6 Phases (196 Days)
        </button>
        {MUROJAAH_PHASES.map((phase) => {
          const phaseDaysCount = phase.endDay - phase.startDay + 1;
          let doneInPhase = 0;
          for (let d = phase.startDay; d <= phase.endDay; d++) {
            if (completedDays[d]) doneInPhase++;
          }
          return (
            <button
              key={phase.phaseNumber}
              type="button"
              onClick={() => setSelectedPhaseFilter(phase.phaseNumber)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap font-mono tabular-nums ${
                selectedPhaseFilter === phase.phaseNumber
                  ? 'bg-[#8FA28A] text-white'
                  : 'text-[#4A5A47] hover:text-[#243023]'
              }`}
            >
              Phase {phase.phaseNumber}: {phase.juzFocus} ({doneInPhase}/{phaseDaysCount})
            </button>
          );
        })}
      </div>

      {/* 6 Phases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {visiblePhases.map((phase) => {
          const totalPhaseDays = phase.endDay - phase.startDay + 1;
          let completedPhaseDays = 0;
          for (let d = phase.startDay; d <= phase.endDay; d++) {
            if (completedDays[d]) completedPhaseDays++;
          }
          const phasePercent = Math.round((completedPhaseDays / totalPhaseDays) * 100);

          return (
            <article
              key={phase.phaseNumber}
              className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#C7D3C0]/60">
                  <div>
                    <div className="text-xs text-[#5A6B57] font-mono tabular-nums">
                      {phase.dayRangeLabel} · {totalPhaseDays} Days Total
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#243023] mt-0.5">
                      {phase.title} ({phase.dayRangeLabel})
                    </h3>
                  </div>
                  <div className="text-right font-mono tabular-nums shrink-0">
                    <div className="text-sm font-bold text-[#3A4B37]">
                      {completedPhaseDays}/{totalPhaseDays} Days
                    </div>
                    <div className="text-[11px] text-[#5A6B57]">{phasePercent}% Done</div>
                  </div>
                </div>

                <div className="mt-4 divide-y divide-[#C7D3C0]/50 border border-[#C7D3C0]/70 rounded-xl bg-[#F7F4ED]/60">
                  {phase.blocks.map((block) => {
                    const dayNumbers: number[] = [];
                    for (let d = block.startDay; d <= block.endDay; d++) {
                      dayNumbers.push(d);
                    }
                    const allBlockDone = dayNumbers.every((d) => completedDays[d]);
                    const rangeLabel =
                      block.startDay === block.endDay
                        ? `Day ${block.startDay}`
                        : `Day ${block.startDay} - ${block.endDay}`;

                    const sampleDay = ALL_196_MUROJAAH_DAYS.find((d) => d.day === block.startDay);

                    return (
                      <div key={`${phase.phaseNumber}-${block.startDay}`} className="p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-xs font-mono font-semibold text-[#3A4B37] tabular-nums">
                              {rangeLabel}:
                            </span>{' '}
                            <span
                              className={`text-xs sm:text-sm font-semibold ${
                                allBlockDone ? 'line-through text-[#6E7D6B]' : 'text-[#243023]'
                              }`}
                            >
                              {block.targetLabel}
                            </span>
                            {sampleDay && !block.isCombinedReview && (
                              <span className="text-[11px] text-[#5A6B57] ml-1.5 font-mono">
                                ({sampleDay.sheetsEstimateText})
                              </span>
                            )}
                            {block.isCombinedReview && (
                              <span className="text-[11px] text-[#5A6B57] ml-1.5">
                                · Combined Review
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              onMarkRangeComplete(block.startDay, block.endDay, !allBlockDone)
                            }
                            className={`min-h-[32px] px-2.5 rounded-lg text-xs font-medium border transition-colors shrink-0 ${
                              allBlockDone
                                ? 'bg-[#8FA28A] text-white border-[#8FA28A]'
                                : 'bg-white text-[#4A5D46] border-[#C7D3C0] hover:bg-[#EAEFE8]'
                            }`}
                          >
                            {allBlockDone ? 'Done' : 'Check Block'}
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {dayNumbers.map((d) => {
                            const isDComplete = Boolean(completedDays[d]);
                            const isDActive = activeDay === d;
                            const dSpec = ALL_196_MUROJAAH_DAYS.find((entry) => entry.day === d);

                            return (
                              <button
                                key={d}
                                type="button"
                                onClick={() => {
                                  onSetActiveDay(d);
                                  onToggleDay(d);
                                }}
                                className={`min-h-[32px] min-w-[32px] px-2 rounded-lg text-xs font-mono font-semibold flex items-center justify-center transition-colors ${
                                  isDComplete
                                    ? 'bg-[#8FA28A] text-white'
                                    : isDActive
                                    ? 'bg-[#243023] text-white ring-2 ring-[#8FA28A]'
                                    : 'bg-white text-[#3A4B37] border border-[#C7D3C0] hover:bg-[#EAEFE8]'
                                }`}
                                title={`Day ${d}: ${dSpec?.pageRangeText || ''} (${isDComplete ? 'Done' : 'Click to toggle'})`}
                              >
                                {d}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <MushafPageGuideModal
        isOpen={showPageGuideModal}
        onClose={() => setShowPageGuideModal(false)}
        activeDay={activeDay}
        onSelectDay={(day) => {
          onSetActiveDay(day);
          setShowPageGuideModal(false);
        }}
      />
    </div>
  );
};
