import React, { useState } from 'react';
import { Check, ChevronRight, RotateCcw, Calendar, BookOpen, HelpCircle } from 'lucide-react';
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
  const [showPageGuide, setShowPageGuide] = useState(false);
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
              onClick={onToggleProgramStarted}
              className={`min-h-[44px] px-4 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
                isProgramStarted
                  ? 'bg-[#F7F4ED] text-[#2F3E2C] border-[#C7D3C0] hover:bg-[#EAE6DC]'
                  : 'bg-[#8FA28A] text-white border-[#8FA28A] hover:bg-[#7A8E75]'
              }`}
            >
              {isProgramStarted ? 'Mode: In Progress' : 'Start Day 1'}
            </button>

            <div className="flex items-center gap-1.5 bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl px-3 min-h-[44px]">
              <label htmlFor="murojaah-day-select" className="text-xs text-[#5A6B57]">
                Active Day:
              </label>
              <select
                id="murojaah-day-select"
                value={activeDay}
                onChange={(e) => onSetActiveDay(Number(e.target.value))}
                className="bg-transparent text-xs font-mono font-semibold text-[#243023] focus:outline-none py-1"
              >
                {ALL_196_MUROJAAH_DAYS.map((entry) => (
                  <option key={entry.day} value={entry.day}>
                    Day {entry.day} — {entry.targetLabel} ({entry.pageRangeText})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* EXPLANATION ACCORDION: HOW TO CALCULATE TARGET PAGES & SHEETS */}
        {showPageGuide && (
          <div className="mt-5 p-4 rounded-xl bg-white border border-[#C7D3C0] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#8FA28A]" />
                <h4 className="text-xs font-bold text-[#243023]">
                  How to Calculate Daily Pages &amp; Sheets in 1 Juz:
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowPageGuide(false)}
                className="text-[11px] text-[#6E7D6B] hover:text-[#243023]"
              >
                Close Guide
              </button>
            </div>
            <p className="text-xs text-[#5A6B57] leading-relaxed">
              The standard <strong>Madinah Mushaf (15 lines per page)</strong> contains exactly <strong>20 pages per Juz (10 double-sided sheets)</strong>, except Juz 30 (23 pages) and Juz 1 (21 pages).
              The system automatically calculates your daily milestones:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-[11px]">
              <div className="p-3 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/70 space-y-1">
                <div className="font-bold text-[#243023]">Juz 28 (2-Day Allocation)</div>
                <div className="text-[#3A4B37]">20 pages ÷ 2 = <strong>10 pages/day (~5 sheets)</strong></div>
                <div className="text-[10px] text-[#6E7D6B]">Day 3: p. 542–551 · Day 4: p. 552–561</div>
              </div>
              <div className="p-3 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/70 space-y-1">
                <div className="font-bold text-[#243023]">Juz 2 (4-Day Allocation)</div>
                <div className="text-[#3A4B37]">20 pages ÷ 4 = <strong>5 pages/day (~2.5 sheets)</strong></div>
                <div className="text-[10px] text-[#6E7D6B]">Pace yourself with 5 calm pages daily</div>
              </div>
              <div className="p-3 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/70 space-y-1">
                <div className="font-bold text-[#243023]">Juz 21 (10-Day Allocation)</div>
                <div className="text-[#3A4B37]">20 pages ÷ 10 = <strong>2 pages/day (1 sheet)</strong></div>
                <div className="text-[10px] text-[#6E7D6B]">Lightweight, 1 double-sided sheet per day</div>
              </div>
            </div>
          </div>
        )}

        {/* Active Day Spotlight Strip with EXACT PAGES CALCULATED */}
        <div className="mt-6 pt-5 border-t border-[#C7D3C0]/60 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-7 flex flex-col justify-between gap-3 p-4 rounded-xl bg-[#F7F4ED] border border-[#C7D3C0]">
            <div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-[#5A6B57] font-mono tabular-nums">
                  Target Day {currentDaySpec.day} of 196 · {currentDaySpec.phaseTitle}
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-[#EAEFE8] text-[#334630]">
                  {currentDaySpec.sheetsEstimateText}
                </span>
              </div>
              <div className="text-lg font-bold text-[#243023] mt-0.5">
                {currentDaySpec.targetLabel}
              </div>
              <div className="text-xs text-[#5A6B57] mt-0.5">
                Block Range: {currentDaySpec.blockRangeText} (Day {currentDaySpec.dayInBlock} of{' '}
                {currentDaySpec.totalDaysInBlock})
              </div>
            </div>

            {/* Target Halaman Box */}
            <div className="p-3 rounded-xl bg-white border border-[#C7D3C0] space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                <span className="font-bold text-[#243023]">
                  Madinah Mushaf Pages:
                </span>
                <span className="font-mono font-bold text-[#3A4B37] text-sm">
                  {currentDaySpec.pageRangeText}
                </span>
              </div>
              <div className="text-[11px] text-[#5A6B57]">
                {currentDaySpec.formulaNote}
              </div>

              {currentDaySpec.pagesList && currentDaySpec.pagesList.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-1">
                  <span className="text-[10px] font-semibold text-[#6E7D6B] mr-1">
                    Page List:
                  </span>
                  {currentDaySpec.pagesList.map((pageNum) => (
                    <span
                      key={pageNum}
                      className="px-2 py-0.5 rounded-md bg-[#F7F4ED] border border-[#C7D3C0] text-[10px] font-mono font-semibold text-[#243023]"
                    >
                      p.{pageNum}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 pt-1">
              <button
                type="button"
                onClick={() => onToggleDay(currentDaySpec.day)}
                className={`flex-1 min-h-[44px] px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors whitespace-nowrap ${
                  completedDays[currentDaySpec.day]
                    ? 'bg-[#8FA28A] text-white'
                    : 'bg-white text-[#243023] border border-[#C7D3C0] hover:bg-[#E8EFE5]'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>
                  {completedDays[currentDaySpec.day]
                    ? `Day ${currentDaySpec.day} Completed`
                    : `Mark Day ${currentDaySpec.day} Done`}
                </span>
              </button>

              {activeDay < 196 && (
                <button
                  type="button"
                  onClick={() => onSetActiveDay(activeDay + 1)}
                  className="min-h-[44px] min-w-[44px] rounded-xl bg-white border border-[#C7D3C0] text-[#243023] flex items-center justify-center hover:bg-[#E8EFE5] transition-colors"
                  title="Next day"
                  aria-label="Next day"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Progress Summary */}
          <div className="md:col-span-5 p-4 rounded-xl bg-[#F7F4ED] border border-[#C7D3C0] flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#3A4B37]">Overall Progress (196 Days)</span>
              <span className="font-mono font-bold text-[#243023] tabular-nums">
                {totalCompleted} / 196 Days ({overallPercent}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-white rounded-full overflow-hidden my-2.5 border border-[#C7D3C0]/60">
              <div
                className="h-full bg-[#8FA28A] transition-all duration-200"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#5A6B57] tabular-nums">
              <span>{196 - totalCompleted} days remaining</span>
              <span>Est. ~6.5 months</span>
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

      {/* 6 Phases Grid - Clean cards with page breakdown per block */}
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
                {/* Phase Header */}
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

                {/* Blocks inside Phase */}
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

                    // Sample day entry to get page estimate for this block
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

                        {/* Clickable Day Numbers Strip */}
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

      {/* Mushaf Page Guide & 30 Juz Modal */}
      <MushafPageGuideModal
        isOpen={showPageGuideModal}
        onClose={() => setShowPageGuideModal(false)}
        activeDay={activeDay}
        onSelectDay={onSetActiveDay}
      />
    </div>
  );
};
