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
    if (scheduleFilter === 'halaqah') return slot.category === 'halaqah' || slot.category === 'perjalanan';
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
        {/* Tilawah 1 Juz Card */}
        <div className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5A6B57] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#8FA28A]" />
              <span>Daily Tilawah</span>
            </span>
            <span className="font-arabic text-sm text-[#3A4B37]">تلاوة ١ جزء</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold font-mono text-[#243023]">
              Juz {currentTilawahJuz}
            </div>
            <div className="text-xs text-[#5A6B57]">Target: 1 Juz / day</div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onUpdateTilawahJuz(Math.max(1, currentTilawahJuz - 1))}
              className="flex-1 min-h-[36px] rounded-lg bg-[#F7F4ED] border border-[#C7D3C0] text-xs font-semibold text-[#243023] hover:bg-[#EAE6DC]"
            >
              - Prev
            </button>
            <button
              type="button"
              onClick={() => onUpdateTilawahJuz(Math.min(30, currentTilawahJuz + 1))}
              className="flex-1 min-h-[36px] rounded-lg bg-[#8FA28A] text-white text-xs font-semibold hover:bg-[#7A8E75]"
            >
              + Next Juz
            </button>
          </div>
        </div>

        {/* 196-Day Murojaah Quick Tracker with EXACT PAGE TARGET */}
        <div className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5A6B57] flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#8FA28A]" />
              <span>Murojaah Today</span>
            </span>
            <span className="font-arabic text-sm text-[#3A4B37]">مراجعة متقنة</span>
          </div>

          <div>
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

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onToggleMurojaahDay(activeMurojaahDay)}
              className={`flex-1 min-h-[36px] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
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
              className="px-2.5 min-h-[36px] rounded-lg bg-[#EAEFE8] text-xs font-semibold text-[#243023] hover:bg-[#DCE5D8] transition-colors"
              title="Penjelasan target halaman & tabel 30 Juz"
            >
              Panduan Halaman
            </button>
            <button
              type="button"
              onClick={onNavigateToMurojaah}
              className="px-2.5 min-h-[36px] rounded-lg bg-white border border-[#C7D3C0] text-xs font-semibold text-[#5A6B57] hover:bg-[#F7F4ED]"
            >
              Peta
            </button>
          </div>
        </div>

        {/* Istighfar Counter Card */}
        <div className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5A6B57]">Daily Istighfar</span>
            <span className="font-arabic text-sm text-[#3A4B37]">استغفار</span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-extrabold font-mono text-[#243023]">
              {istighfarCount}x
            </div>
            <div className="text-xs text-[#5A6B57]">Goal: 100x / day</div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => onUpdateIstighfar(istighfarCount + 10)}
              className="flex-1 min-h-[36px] rounded-lg bg-[#8FA28A] text-white text-xs font-semibold hover:bg-[#7A8E75]"
            >
              +10
            </button>
            <button
              type="button"
              onClick={() => onUpdateIstighfar(istighfarCount + 33)}
              className="flex-1 min-h-[36px] rounded-lg bg-[#EAEFE8] text-[#243023] text-xs font-semibold hover:bg-[#DCE5D8]"
            >
              +33
            </button>
            <button
              type="button"
              onClick={() => onUpdateIstighfar(0)}
              className="p-2 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0] text-[#6E7D6B] hover:text-[#243023]"
              title="Reset Istighfar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
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
              Halaqah: 05:15–06:30 &amp; 18:00–21:00 (15–20 min commute) · Midday nap 11:00–12:00.
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
                          Udhur Syar&apos;i (Waktu Dzikir)
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
                        ? 'Sedang halangan: Manfaatkan waktu ini untuk istighfar, dzikir, atau mendengar murottal.'
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
                  Mode Halangan / Haidh (Period Exemption)
                </span>
                <span className="font-arabic text-xs text-[#5A6B57]">عذر شرعي</span>
                {isHaidhMode && (
                  <span className="px-2 py-0.5 rounded-md bg-[#8FA28A] text-white text-[10px] font-semibold">
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#5A6B57] mt-0.5 leading-relaxed">
                {isHaidhMode
                  ? 'Shalat & puasa otomatis dimaafkan (udhur syar’i). Tetap berlimpah pahala dengan dzikir, istighfar, infaq, muhasabah, dan belajar.'
                  : 'Aktifkan jika sedang berhalangan/haidh agar amalan shalat & puasa otomatis dinonaktifkan tanpa mengurangi persentase mutabaah.'}
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
            {isHaidhMode ? 'Mode Haidh (Aktif)' : 'Aktifkan Mode Haidh'}
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
                        Udhur Syar&apos;i (معذورة)
                      </span>
                      <span className="text-[10px] text-[#7A6B60]">Dimaafkan syariat</span>
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
