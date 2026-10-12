import React, { useState, useEffect } from 'react';
import {
  Check,
  Plus,
  RotateCcw,
  Clock,
  BookOpen,
  Trash2,
  Edit2,
  Settings,
  Calendar,
  Heart,
  Moon,
  ShieldAlert,
} from 'lucide-react';
import {
  DAYS_OF_WEEK,
  DayKey,
  MUTABAAH_ITEMS,
  ScheduleSlot,
  ALL_196_MUROJAAH_DAYS,
  DailyTilawahRecord,
  JUZ_PAGE_MAP,
} from '../data/plannerData';
import { MushafPageGuideModal } from './MushafPageGuideModal';

interface DailyMutabaahViewProps {
  selectedDay: DayKey;
  onSelectDay: (day: DayKey) => void;
  scheduleSlots: ScheduleSlot[];
  completedSlots: Record<string, boolean>;
  onToggleSlot: (slotId: string) => void;
  onAddCustomSlot: (day: DayKey, timeRange: string, title: string, subtitle: string) => void;
  onDeleteCustomSlot: (day: DayKey, slotId: string) => void;
  onOpenEditSchedule: (slotId?: string) => void;
  mutabaahState: Record<string, boolean>;
  onToggleMutabaah: (itemId: string) => void;
  currentTilawahJuz: number;
  onUpdateTilawahJuz: (juz: number) => void;
  tilawahRecord?: DailyTilawahRecord;
  onUpdateTilawahRecord?: (record: DailyTilawahRecord) => void;
  istighfarCount: number;
  onUpdateIstighfar: (newCount: number) => void;
  activeMurojaahDay: number;
  completedMurojaahDays: Record<number, boolean>;
  onToggleMurojaahDay: (dayNum: number) => void;
  onNavigateToMurojaah: () => void;
  muhasabahNote: string;
  onSaveMuhasabahNote: (note: string) => void;
  isHaidhMode: boolean;
  onToggleHaidhMode: () => void;
}

export const DailyMutabaahView: React.FC<DailyMutabaahViewProps> = ({
  selectedDay,
  onSelectDay,
  scheduleSlots,
  completedSlots,
  onToggleSlot,
  onAddCustomSlot,
  onDeleteCustomSlot,
  onOpenEditSchedule,
  mutabaahState,
  onToggleMutabaah,
  currentTilawahJuz,
  onUpdateTilawahJuz,
  tilawahRecord,
  onUpdateTilawahRecord,
  istighfarCount,
  onUpdateIstighfar,
  activeMurojaahDay,
  completedMurojaahDays,
  onToggleMurojaahDay,
  onNavigateToMurojaah,
  muhasabahNote,
  onSaveMuhasabahNote,
  isHaidhMode,
  onToggleHaidhMode,
}) => {
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'halaqah' | 'ibadah' | 'fleksibel'>('all');
  const [showPageGuideModal, setShowPageGuideModal] = useState(false);

  // Tilawah state (Start page, End page, Total pages, Juz)
  const defaultJuzSpec = JUZ_PAGE_MAP[currentTilawahJuz] || JUZ_PAGE_MAP[4];
  const [tilawahStartPage, setTilawahStartPage] = useState<number>(
    tilawahRecord?.startPage ?? defaultJuzSpec.startPage
  );
  const [tilawahEndPage, setTilawahEndPage] = useState<number>(
    tilawahRecord?.endPage ?? defaultJuzSpec.endPage
  );
  const [tilawahJuz, setTilawahJuz] = useState<number>(
    tilawahRecord?.juz ?? currentTilawahJuz
  );

  useEffect(() => {
    if (tilawahRecord) {
      setTilawahStartPage(tilawahRecord.startPage);
      setTilawahEndPage(tilawahRecord.endPage);
      setTilawahJuz(tilawahRecord.juz);
    } else {
      const spec = JUZ_PAGE_MAP[currentTilawahJuz] || JUZ_PAGE_MAP[4];
      setTilawahStartPage(spec.startPage);
      setTilawahEndPage(spec.endPage);
      setTilawahJuz(currentTilawahJuz);
    }
  }, [tilawahRecord, currentTilawahJuz, selectedDay]);

  const tilawahTotalPages = Math.max(0, tilawahEndPage - tilawahStartPage + 1);
  const isTilawahTargetReached = tilawahTotalPages >= 20;

  const handleUpdateStartPage = (newStart: number) => {
    const val = Math.max(1, Math.min(604, newStart));
    setTilawahStartPage(val);
    const end = Math.max(val, tilawahEndPage);
    setTilawahEndPage(end);
    const total = end - val + 1;
    if (onUpdateTilawahRecord) {
      onUpdateTilawahRecord({
        juz: tilawahJuz,
        startPage: val,
        endPage: end,
        totalPages: total,
      });
    }
  };

  const handleUpdateEndPage = (newEnd: number) => {
    const val = Math.max(tilawahStartPage, Math.min(604, newEnd));
    setTilawahEndPage(val);
    const total = val - tilawahStartPage + 1;
    if (onUpdateTilawahRecord) {
      onUpdateTilawahRecord({
        juz: tilawahJuz,
        startPage: tilawahStartPage,
        endPage: val,
        totalPages: total,
      });
    }
  };

  const handleAddTilawahPages = (delta: number) => {
    const nextEnd = Math.min(604, tilawahEndPage + delta);
    setTilawahEndPage(nextEnd);
    const total = nextEnd - tilawahStartPage + 1;
    if (onUpdateTilawahRecord) {
      onUpdateTilawahRecord({
        juz: tilawahJuz,
        startPage: tilawahStartPage,
        endPage: nextEnd,
        totalPages: total,
      });
    }
  };

  const handleNextTilawahJuz = () => {
    const nextJuzNum = tilawahJuz >= 30 ? 1 : tilawahJuz + 1;
    const spec = JUZ_PAGE_MAP[nextJuzNum];
    if (spec) {
      setTilawahJuz(nextJuzNum);
      setTilawahStartPage(spec.startPage);
      setTilawahEndPage(spec.endPage);
      onUpdateTilawahJuz(nextJuzNum);
      if (onUpdateTilawahRecord) {
        onUpdateTilawahRecord({
          juz: nextJuzNum,
          startPage: spec.startPage,
          endPage: spec.endPage,
          totalPages: spec.totalPages,
        });
      }
    }
  };

  const handlePrevTilawahJuz = () => {
    const prevJuzNum = tilawahJuz <= 1 ? 30 : tilawahJuz - 1;
    const spec = JUZ_PAGE_MAP[prevJuzNum];
    if (spec) {
      setTilawahJuz(prevJuzNum);
      setTilawahStartPage(spec.startPage);
      setTilawahEndPage(spec.endPage);
      onUpdateTilawahJuz(prevJuzNum);
      if (onUpdateTilawahRecord) {
        onUpdateTilawahRecord({
          juz: prevJuzNum,
          startPage: spec.startPage,
          endPage: spec.endPage,
          totalPages: spec.totalPages,
        });
      }
    }
  };

  // Live real-time date clock
  const [realtimeNow, setRealtimeNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setRealtimeNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(realtimeNow);

  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(realtimeNow);

  // Map JS Day of Week to DayKey
  const jsDay = realtimeNow.getDay();
  const dayKeyMap: Record<number, DayKey> = {
    0: 'minggu',
    1: 'senin',
    2: 'selasa',
    3: 'rabu',
    4: 'kamis',
    5: 'jumat',
    6: 'sabtu',
  };
  const todayKey = dayKeyMap[jsDay];

  const currentDayInfo = DAYS_OF_WEEK.find((d) => d.key === selectedDay) || DAYS_OF_WEEK[0];
  const todayMurojaahSpec =
    ALL_196_MUROJAAH_DAYS.find((d) => d.day === activeMurojaahDay) || ALL_196_MUROJAAH_DAYS[0];
  const isTodayMurojaahDone = Boolean(completedMurojaahDays[activeMurojaahDay]);

  // If Haidh mode is active, only count items that are NOT exempt during Haidh
  const activeMutabaahItems = MUTABAAH_ITEMS.filter(
    (item) => !isHaidhMode || !item.isExemptDuringHaidh
  );
  const completedMutabaahCount = activeMutabaahItems.filter(
    (item) => mutabaahState[`${selectedDay}-${item.id}`]
  ).length;
  const mutabaahPercentage = Math.round(
    (completedMutabaahCount / activeMutabaahItems.length) * 100
  );

  const completedScheduleCount = scheduleSlots.filter((s) => completedSlots[s.id]).length;

  const filteredSlots = scheduleSlots.filter((slot) => {
    if (scheduleFilter === 'all') return true;
    if (scheduleFilter === 'halaqah') return slot.category === 'halaqah';
    if (scheduleFilter === 'ibadah') return slot.category === 'ibadah';
    return slot.category === 'belajar' || slot.category === 'fleksibel' || slot.category === 'istirahat';
  });

  return (
    <div className="space-y-8">
      {/* 1. REAL-TIME DATE & DAY SELECTOR HEADER */}
      <section className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#C7D3C0]/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFE8] text-[#334630] text-xs font-semibold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-[#5A6B57]" />
                {formattedDate}
              </span>
              <span className="font-mono text-xs text-[#5A6B57] font-semibold">
                {formattedTime}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#243023] mt-2 flex items-center gap-2">
              <span>Daily Routine &amp; Mutabaah</span>
              <span className="font-arabic text-lg text-[#5A6B57]">المتابعة اليومية</span>
            </h2>
            <p className="text-xs text-[#5A6B57] mt-0.5">
              {currentDayInfo.summaryNote}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* Quick Haidh Mode Toggle Button */}
            <button
              type="button"
              onClick={onToggleHaidhMode}
              className={`min-h-[40px] px-3.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                isHaidhMode
                  ? 'bg-[#8FA28A] text-white border-[#8FA28A] shadow-xs'
                  : 'bg-white text-[#5A6B57] border-[#C7D3C0] hover:bg-[#F7F4ED]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{isHaidhMode ? 'Halangan (Haidh) Aktif' : 'Mode Haidh'}</span>
            </button>

            {todayKey && selectedDay !== todayKey && (
              <button
                type="button"
                onClick={() => onSelectDay(todayKey)}
                className="min-h-[40px] px-3.5 rounded-xl bg-[#EAEFE8] text-[#243023] text-xs font-semibold hover:bg-[#DCE5D8] transition-colors flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-[#5A6B57]" />
                <span>Today ({DAYS_OF_WEEK.find((d) => d.key === todayKey)?.short})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onOpenEditSchedule()}
              className="min-h-[40px] px-4 rounded-xl bg-[#8FA28A] text-white text-xs font-semibold hover:bg-[#7A8E75] transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Edit Schedule</span>
            </button>
          </div>
        </div>

        {/* Day Selector Buttons (Mon - Sun) */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-4">
          {DAYS_OF_WEEK.map((day) => {
            const isSelected = selectedDay === day.key;
            const isToday = todayKey === day.key;

            return (
              <button
                key={day.key}
                type="button"
                onClick={() => onSelectDay(day.key)}
                className={`min-h-[58px] sm:min-h-[64px] rounded-xl flex flex-col items-center justify-center p-1.5 transition-all text-center relative ${
                  isSelected
                    ? 'bg-[#8FA28A] text-white shadow-xs'
                    : 'bg-[#F7F4ED] text-[#243023] hover:bg-[#EAE6DC]'
                }`}
              >
                {isToday && (
                  <span
                    className={`absolute -top-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                      isSelected ? 'bg-[#243023] text-white' : 'bg-[#8FA28A] text-white'
                    }`}
                  >
                    Today
                  </span>
                )}
                <span className="text-[11px] sm:text-xs font-bold leading-tight">
                  {day.short}
                </span>
                <span
                  className={`text-[10px] font-arabic mt-0.5 ${
                    isSelected ? 'text-white/90' : 'text-[#6E7D6B]'
                  }`}
                >
                  {day.arabicLabel}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. QUICK HABIT CARDS: 1 JUZ TILAWAH, MUROJAAH ROADMAP & ISTIGHFAR */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Daily Tilawah Card (Min 1 Juz, Supports > 1 Juz, Start/End Page, >= 20 Pages Target) */}
        <div className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5A6B57] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#8FA28A]" />
                <span>Daily Tilawah</span>
              </span>
              <div className="flex items-center gap-2">
                {isHaidhMode && (
                  <span className="px-2 py-0.5 rounded-md bg-[#E4D7CF] text-[#63483C] text-[10px] font-semibold">
                    Exempt (معذورة)
                  </span>
                )}
                <span className="font-arabic text-sm text-[#3A4B37]">تلاوة القرآن</span>
              </div>
            </div>

            {/* Target & Result Overview */}
            <div className="mt-2.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#243023]">
                  {isTilawahTargetReached ? 'Target 1 Juz Reached!' : 'Target: Min 1 Juz (20 Pages)'}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isTilawahTargetReached
                      ? 'bg-[#EAEFE8] text-[#2E4729]'
                      : 'bg-[#F7F4ED] text-[#6E7D6B] border border-[#C7D3C0]'
                  }`}
                >
                  {isTilawahTargetReached ? '≥ 20 Pages (Completed)' : `${tilawahTotalPages} / 20 Pages`}
                </span>
              </div>

              {/* Result Card: Juz, Start Page, End Page, Total Pages */}
              <div className="p-2.5 rounded-xl bg-[#F7F4ED] border border-[#C7D3C0]/70 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5A6B57]">Juz &amp; Pages:</span>
                  <span className="font-bold text-[#243023] font-mono">
                    Juz {tilawahJuz} (p. {tilawahStartPage} – {tilawahEndPage})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5A6B57]">Pages Read:</span>
                  <span className="font-extrabold text-[#2E4729] font-mono text-sm">
                    {tilawahTotalPages} Pages
                    {tilawahTotalPages > 20 && (
                      <span className="text-[10px] text-[#5A6B57] font-sans font-normal ml-1">
                        (+{tilawahTotalPages - 20} pages beyond 1 juz)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Page inputs and fast increment buttons */}
          <div className="space-y-2 pt-1 border-t border-[#C7D3C0]/40">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-[#5A6B57] mb-0.5 font-medium">
                  Start Page
                </label>
                <input
                  type="number"
                  min="1"
                  max="604"
                  value={tilawahStartPage}
                  onChange={(e) => handleUpdateStartPage(Number(e.target.value))}
                  className="w-full bg-white border border-[#C7D3C0] rounded-lg px-2.5 py-1 text-xs font-mono font-semibold text-[#243023]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#5A6B57] mb-0.5 font-medium">
                  End Page
                </label>
                <input
                  type="number"
                  min="1"
                  max="604"
                  value={tilawahEndPage}
                  onChange={(e) => handleUpdateEndPage(Number(e.target.value))}
                  className="w-full bg-white border border-[#C7D3C0] rounded-lg px-2.5 py-1 text-xs font-mono font-semibold text-[#243023]"
                />
              </div>
            </div>

            {/* Quick actions: +1 Page, +5 Pages, +1 Juz */}
            <div className="flex items-center gap-1.5 pt-0.5">
              <button
                type="button"
                onClick={() => handleAddTilawahPages(1)}
                className="flex-1 py-1 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0] text-[11px] font-semibold text-[#243023] hover:bg-[#EAE6DC]"
                title="Add 1 Page"
              >
                +1 Page
              </button>
              <button
                type="button"
                onClick={() => handleAddTilawahPages(5)}
                className="flex-1 py-1 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0] text-[11px] font-semibold text-[#243023] hover:bg-[#EAE6DC]"
                title="Add 5 Pages"
              >
                +5 Pages
              </button>
              <button
                type="button"
                onClick={handleNextTilawahJuz}
                className="flex-1 py-1 rounded-lg bg-[#8FA28A] text-white text-[11px] font-semibold hover:bg-[#7A8E75]"
                title="Advance to Next Juz (20 Pages)"
              >
                +1 Juz
              </button>
            </div>

            {/* Juz Switchers */}
            <div className="flex items-center justify-between text-[11px] text-[#5A6B57] pt-0.5">
              <button
                type="button"
                onClick={handlePrevTilawahJuz}
                className="hover:text-[#243023] font-semibold"
              >
                &larr; Prev Juz
              </button>
              <span className="font-mono font-bold text-[#3A4B37]">Juz {tilawahJuz} of 30</span>
              <button
                type="button"
                onClick={handleNextTilawahJuz}
                className="hover:text-[#243023] font-semibold"
              >
                Next Juz &rarr;
              </button>
            </div>
          </div>
        </div>

        {/* 196-Day Murojaah Quick Tracker with EXACT PAGE TARGET */}
        <div className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 space-y-2.5 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5A6B57] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#8FA28A]" />
                <span>Murojaah Today</span>
              </span>
              <span className="font-arabic text-sm text-[#3A4B37]">مراجعة متقنة</span>
            </div>

            <div className="mt-2">
              <div className="text-xs text-[#5A6B57]">
                Day {todayMurojaahSpec.day} · {todayMurojaahSpec.phaseTitle}
              </div>
              <div className="text-lg font-bold text-[#243023] truncate mt-0.5">
                {todayMurojaahSpec.targetLabel}
              </div>
              <div className="text-xs font-bold text-[#3A4B37] mt-0.5">
                Target: {todayMurojaahSpec.pageRangeText} ({todayMurojaahSpec.sheetsEstimateText})
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onToggleMurojaahDay(activeMurojaahDay)}
              className={`flex-1 min-h-[38px] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                isTodayMurojaahDone
                  ? 'bg-[#8FA28A] text-white'
                  : 'bg-[#F7F4ED] border border-[#C7D3C0] text-[#243023] hover:bg-[#EAE6DC]'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isTodayMurojaahDone ? 'Completed' : 'Mark Done'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowPageGuideModal(true)}
              className="px-2.5 min-h-[38px] rounded-lg bg-[#EAEFE8] text-xs font-semibold text-[#243023] hover:bg-[#DCE5D8] transition-colors"
              title="Mushaf Madinah 30 Juz page guide and table"
            >
              Page Guide
            </button>
            <button
              type="button"
              onClick={onNavigateToMurojaah}
              className="px-2.5 min-h-[38px] rounded-lg bg-white border border-[#C7D3C0] text-xs font-semibold text-[#5A6B57] hover:bg-[#F7F4ED]"
            >
              Roadmap
            </button>
          </div>
        </div>

        {/* Istighfar Counter Card - Incrementable Persatuan (+1 tap-by-tap) */}
        <div className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 space-y-3 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#5A6B57] flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-[#8FA28A]" />
                <span>Daily Istighfar</span>
              </span>
              <span className="font-arabic text-sm text-[#3A4B37]">استغفار</span>
            </div>

            <div className="flex items-baseline justify-between mt-2">
              <div className="text-3xl font-extrabold font-mono text-[#243023]">
                {istighfarCount}x
              </div>
              <div className="text-xs text-[#5A6B57]">Target: 100x / day</div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {/* Primary Tap Button - Persatuan (+1 tap) */}
            <button
              type="button"
              onClick={() => onUpdateIstighfar(istighfarCount + 1)}
              className="w-full min-h-[42px] py-2 px-3 rounded-xl bg-[#8FA28A] text-white text-xs font-bold hover:bg-[#7A8E75] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xs"
              title="Tap +1 Istighfar"
            >
              <span className="text-sm font-extrabold">+1</span>
              <span>Tap Istighfar</span>
              <span className="font-arabic text-[11px] opacity-90">أَسْتَغْفِرُ اللَّهَ</span>
            </button>

            {/* Supporting controls: -1, +10, +33, Reset */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => onUpdateIstighfar(Math.max(0, istighfarCount - 1))}
                className="py-1 px-2 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0] text-[#5A6B57] hover:text-[#243023] hover:bg-[#EAE6DC] font-mono font-bold"
                title="Decrease by 1"
              >
                -1
              </button>
              <button
                type="button"
                onClick={() => onUpdateIstighfar(istighfarCount + 10)}
                className="flex-1 py-1 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0] text-[#5A6B57] hover:text-[#243023] hover:bg-[#EAE6DC] font-mono font-semibold"
                title="+10 Quick Add"
              >
                +10
              </button>
              <button
                type="button"
                onClick={() => onUpdateIstighfar(istighfarCount + 33)}
                className="flex-1 py-1 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0] text-[#5A6B57] hover:text-[#243023] hover:bg-[#EAE6DC] font-mono font-semibold"
                title="+33 Quick Add"
              >
                +33
              </button>
              <button
                type="button"
                onClick={() => onUpdateIstighfar(0)}
                className="p-1.5 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0] text-[#6E7D6B] hover:text-red-700 hover:bg-[#FBEBE8]"
                title="Reset Istighfar to 0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DAILY SCHEDULE TIMELINE (INCLUDES 11:00-12:00 MIDDAY NAP) */}
      <section className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 sm:p-7 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#C7D3C0]/60">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8FA28A]" />
              <h3 className="text-lg font-bold text-[#243023]">
                Daily Schedule Timeline ({currentDayInfo.label})
              </h3>
            </div>
            <p className="text-xs text-[#5A6B57] mt-0.5">
              Halaqah: 05:15–06:30 &amp; 18:00–21:00 · Midday nap 11:00–12:00.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs font-mono font-semibold text-[#3A4B37] bg-[#F7F4ED] px-3 py-1.5 rounded-xl border border-[#C7D3C0]">
              {completedScheduleCount} / {scheduleSlots.length} Slots Done
            </div>
            <button
              type="button"
              onClick={() => onOpenEditSchedule()}
              className="p-2 rounded-xl bg-[#F7F4ED] border border-[#C7D3C0] text-[#5A6B57] hover:text-[#243023]"
              title="Edit schedule slots"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-3">
          {filteredSlots.map((slot) => {
            const isDone = Boolean(completedSlots[slot.id]);
            const isNap = slot.id.includes('nap') || slot.title.toLowerCase().includes('nap');
            const isPrayerSlot = slot.category === 'ibadah';

            return (
              <div
                key={slot.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDone
                    ? 'bg-[#F7F4ED]/60 border-[#C7D3C0] opacity-80'
                    : isNap
                    ? 'bg-[#F3EFE6] border-[#D8CEBA]'
                    : slot.isFixedHalaqah
                    ? 'bg-[#F0F5EE] border-[#B8CEB5]'
                    : isHaidhMode && isPrayerSlot
                    ? 'bg-[#F4EFEB]/80 border-[#D9C8BE]'
                    : 'bg-white border-[#C7D3C0]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => onToggleSlot(slot.id)}
                    className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isDone
                        ? 'bg-[#8FA28A] text-white'
                        : 'border-2 border-[#8FA28A] bg-white hover:bg-[#EAEFE8]'
                    }`}
                  >
                    {isDone && <Check className="w-4 h-4" />}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#3A4B37] tabular-nums">
                        {slot.timeRange}
                      </span>
                      {slot.arabicTitle && (
                        <span className="font-arabic text-xs text-[#5A6B57]">
                          {slot.arabicTitle}
                        </span>
                      )}
                      {slot.isFixedHalaqah && (
                        <span className="px-2 py-0.5 rounded-md bg-[#8FA28A] text-white text-[10px] font-semibold">
                          Fixed Halaqah
                        </span>
                      )}
                      {isNap && (
                        <span className="px-2 py-0.5 rounded-md bg-[#C7B299]/30 text-[#5F4B32] text-[10px] font-semibold">
                          Sunnah Qailulah
                        </span>
                      )}
                      {isHaidhMode && isPrayerSlot && (
                        <span className="px-2 py-0.5 rounded-md bg-[#E4D7CF] text-[#63483C] text-[10px] font-semibold">
                          Period Exemption · Time for Dzikr
                        </span>
                      )}
                    </div>
                    <h4
                      className={`text-sm font-bold mt-1 ${
                        isDone ? 'line-through text-[#6E7D6B]' : 'text-[#243023]'
                      }`}
                    >
                      {slot.title}
                    </h4>
                    <p className="text-xs text-[#5A6B57] mt-0.5 leading-relaxed">
                      {isHaidhMode && isPrayerSlot
                        ? 'Period exemption: Utilize this peaceful time for istighfar, dzikr lisan, or listening to Quran recitation.'
                        : slot.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => onOpenEditSchedule(slot.id)}
                    className="p-1.5 rounded-lg text-[#6E7D6B] hover:text-[#243023] hover:bg-[#F7F4ED]"
                    title="Edit this slot"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteCustomSlot(selectedDay, slot.id)}
                    className="p-1.5 rounded-lg text-[#6E7D6B] hover:text-red-700 hover:bg-[#F7F4ED]"
                    title="Delete slot"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. MUTABAAH YAUMIYAH CHECKLIST WITH PERIOD / HAIDH MODE */}
      <section className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 sm:p-7 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#C7D3C0]/60">
          <div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#8FA28A]" />
              <h3 className="text-lg font-bold text-[#243023]">
                Mutabaah Yaumiyah Checklist
              </h3>
            </div>
            <p className="text-xs text-[#5A6B57] mt-0.5">
              Specific Rawatib: Qabliyah Dhuhr, Ba’diyah Dhuhr, Ba’diyah Maghrib &amp; Ba’diyah Isha.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[#3A4B37] bg-[#F7F4ED] px-3 py-1.5 rounded-xl border border-[#C7D3C0]">
            <span>{completedMutabaahCount} / {activeMutabaahItems.length} Deeds</span>
            <span>({mutabaahPercentage}%)</span>
            {isHaidhMode && (
              <span className="text-[#8B5A4B] font-sans text-[11px]">· 9 Exempted</span>
            )}
          </div>
        </div>

        {/* PERIOD / HAIDH MODE TOGGLE BANNER */}
        <div
          className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isHaidhMode
              ? 'bg-[#F4EFEB] border-[#D9C8BE]'
              : 'bg-[#F7F4ED] border-[#C7D3C0]/70'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-white border border-[#C7D3C0] flex items-center justify-center text-[#8FA28A] shrink-0">
              <Moon className="w-4 h-4 text-[#8FA28A]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#243023]">
                  Period Exemption Mode
                </span>
                <span className="font-arabic text-xs text-[#5A6B57]">عذر شرعي</span>
                {isHaidhMode && (
                  <span className="px-2 py-0.5 rounded-md bg-[#8FA28A] text-white text-[10px] font-semibold">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#5A6B57] mt-0.5 leading-relaxed">
                {isHaidhMode
                  ? 'Prayers & fasting are religiously excused. Earn abundant rewards through dzikr, istighfar, charity, muhasabah, and study.'
                  : 'Enable during menstruation so prayers & fasting are automatically exempted without lowering your mutabaah score.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleHaidhMode}
            className={`min-h-[40px] px-4 rounded-xl text-xs font-semibold border transition-colors shrink-0 ${
              isHaidhMode
                ? 'bg-[#8FA28A] text-white border-[#8FA28A]'
                : 'bg-white text-[#243023] border-[#C7D3C0] hover:bg-[#EAEFE8]'
            }`}
          >
            {isHaidhMode ? 'Period Mode (Active)' : 'Enable Period Mode'}
          </button>
        </div>

        {/* Mutabaah Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MUTABAAH_ITEMS.map((item) => {
            const isChecked = Boolean(mutabaahState[`${selectedDay}-${item.id}`]);
            const isExempt = Boolean(isHaidhMode && item.isExemptDuringHaidh);

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isExempt) return; // Prevent checking during Haidh
                  onToggleMutabaah(item.id);
                }}
                className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 select-none ${
                  isExempt
                    ? 'bg-[#EFEBE6]/70 border-[#D5CDC3] opacity-65 cursor-not-allowed'
                    : isChecked
                    ? 'bg-[#F0F5EE] border-[#8FA28A] cursor-pointer'
                    : 'bg-[#F7F4ED] border-[#C7D3C0]/70 hover:bg-[#EAEFE8] cursor-pointer'
                }`}
              >
                <div
                  className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                    isExempt
                      ? 'bg-[#DCD4CA] text-[#6E5D52]'
                      : isChecked
                      ? 'bg-[#8FA28A] text-white'
                      : 'border-2 border-[#8FA28A] bg-white'
                  }`}
                >
                  {isExempt ? (
                    <span className="text-[10px] font-bold">—</span>
                  ) : (
                    isChecked && <Check className="w-3.5 h-3.5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-bold truncate ${
                        isExempt
                          ? 'text-[#6E5D52] line-through'
                          : isChecked
                          ? 'text-[#2E4729]'
                          : 'text-[#243023]'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="font-arabic text-[11px] text-[#5A6B57] shrink-0">
                      {item.arabicTitle}
                    </span>
                  </div>

                  {isExempt ? (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#E4D7CF] text-[#63483C]">
                        Exempt (معذورة)
                      </span>
                      <span className="text-[10px] text-[#7A6B60]">Excused by Sharia</span>
                    </div>
                  ) : (
                    <>
                      <div className="text-[11px] text-[#5A6B57] mt-0.5">{item.targetText}</div>
                      <div className="text-[10px] text-[#6E7D6B] mt-0.5">{item.timeHint}</div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. NIGHT MUHASABAH & GRATITUDE JOURNAL */}
      <section className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 sm:p-7 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#243023]">
              Night Muhasabah &amp; Reflection Journal
            </h3>
            <span className="font-arabic text-sm text-[#5A6B57]">محاسبة النفس والشكر</span>
          </div>
          <span className="text-xs text-[#5A6B57]">Before sleep 22:00</span>
        </div>

        <textarea
          rows={3}
          value={muhasabahNote}
          onChange={(e) => onSaveMuhasabahNote(e.target.value)}
          placeholder="Reflect on today’s blessings, halaqah students, study progress, and heartfelt istighfar before sleeping..."
          className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl p-3.5 text-xs text-[#243023] leading-relaxed focus:outline-none focus:border-[#8FA28A] resize-none"
        />
      </section>

      {/* Mushaf Page Guide Modal */}
      <MushafPageGuideModal
        isOpen={showPageGuideModal}
        onClose={() => setShowPageGuideModal(false)}
        activeDay={activeMurojaahDay}
      />
    </div>
  );
};
