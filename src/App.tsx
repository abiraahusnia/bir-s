import React, { useState, useEffect } from 'react';
import {
  Calendar,
  BookOpen,
  Layers,
  Compass,
  Wallet,
  X,
  Edit2,
  Clock,
} from 'lucide-react';
import {
  DayKey,
  ScheduleSlot,
  getDailyScheduleForDay,
  INITIAL_WEEKLY_TARGETS,
  INITIAL_MONTHLY_PLANS,
  INITIAL_ANNUAL_ROADMAP,
  INITIAL_LIFE_GOALS,
  INITIAL_BUDGET_ALLOCATIONS,
  INITIAL_EXPENSES,
  INITIAL_INCOMES,
  IncomeRecord,
  IncomeSourceType,
  WeeklyTargetItem,
  MonthlyPlanItem,
  AnnualQuarterPlan,
  LifeGoalItem,
  GoalHorizon,
  BudgetAllocationItem,
  ExpenseRecord,
  DAYS_OF_WEEK,
  DailyTilawahRecord,
  JUZ_PAGE_MAP,
} from './data/plannerData';
import { DailyMutabaahView } from './components/DailyMutabaahView';
import { Murojaah196View } from './components/Murojaah196View';
import { HorizonPlanningView } from './components/HorizonPlanningView';
import { LifeGoalsView } from './components/LifeGoalsView';
import { FinanceFlowView } from './components/FinanceFlowView';
import { EditScheduleModal } from './components/EditScheduleModal';
import { EditTargetsModal } from './components/EditTargetsModal';

type ActiveSection = 'harian' | 'murojaah' | 'planning' | 'target' | 'keuangan';

const STORAGE_KEY = 'birs_muslimah_planner_v3';

const getDefaultSchedules = (): Record<DayKey, ScheduleSlot[]> => ({
  senin: getDailyScheduleForDay('senin'),
  selasa: getDailyScheduleForDay('selasa'),
  rabu: getDailyScheduleForDay('rabu'),
  kamis: getDailyScheduleForDay('kamis'),
  jumat: getDailyScheduleForDay('jumat'),
  sabtu: getDailyScheduleForDay('sabtu'),
  minggu: getDailyScheduleForDay('minggu'),
});

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('harian');

  // Determine today's day key dynamically on initial load
  const getTodayKey = (): DayKey => {
    const jsDay = new Date().getDay();
    const map: Record<number, DayKey> = {
      0: 'minggu',
      1: 'senin',
      2: 'selasa',
      3: 'rabu',
      4: 'kamis',
      5: 'jumat',
      6: 'sabtu',
    };
    return map[jsDay] || 'senin';
  };

  const [selectedDay, setSelectedDay] = useState<DayKey>(getTodayKey);
  const [showMobileInstallGuide, setShowMobileInstallGuide] = useState(false);

  // Live real-time clock state for top bar
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        new Intl.DateTimeFormat('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(now)
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Modals for editing
  const [isEditScheduleOpen, setIsEditScheduleOpen] = useState(false);
  const [editingScheduleSlotId, setEditingScheduleSlotId] = useState<string | null>(null);
  const [isEditTargetsOpen, setIsEditTargetsOpen] = useState(false);

  // Schedules by Day state (fully editable)
  const [schedulesByDay, setSchedulesByDay] = useState<Record<DayKey, ScheduleSlot[]>>(
    getDefaultSchedules
  );

  const [completedSlots, setCompletedSlots] = useState<Record<string, boolean>>({
    'senin-1': true,
    'senin-2': true,
    'senin-3': true,
    'senin-4': true,
    'senin-5': true,
    'senin-6': true,
    'senin-nap': false,
  });

  const [mutabaahState, setMutabaahState] = useState<Record<string, boolean>>({
    'senin-tahajud': true,
    'senin-shalat_fajar': true,
    'senin-dzikir_pagi': true,
    'senin-shalat_dhuha': true,
    'senin-olahraga': true,
    'senin-infaq': true,
    'senin-mengaji_1_juz': true,
    'senin-rawatib_qabla_zuhur': true,
  });

  const [currentTilawahJuz, setCurrentTilawahJuz] = useState<number>(4);
  const [tilawahRecordsByDay, setTilawahRecordsByDay] = useState<
    Record<string, DailyTilawahRecord>
  >({
    senin: { juz: 4, startPage: 62, endPage: 82, totalPages: 21 },
  });
  const [istighfarByDay, setIstighfarByDay] = useState<Record<string, number>>({
    senin: 100,
  });
  const [muhasabahNotesByDay, setMuhasabahNotesByDay] = useState<Record<string, string>>({
    senin:
      'Alhamdulillah halaqah pagi 05:15–06:30 khidmat, sunnah nap 11:00–12:00 well kept.',
  });

  const [isHaidhModeByDay, setIsHaidhModeByDay] = useState<Record<string, boolean>>({});

  // 196-Day Murojaah State
  const [isMurojaahStarted, setIsMurojaahStarted] = useState<boolean>(true);
  const [activeMurojaahDay, setActiveMurojaahDay] = useState<number>(3);
  const [completedMurojaahDays, setCompletedMurojaahDays] = useState<Record<number, boolean>>({
    1: true,
    2: true,
  });

  // Weekly, Monthly, Annual Planning State
  const [weeklyTargets, setWeeklyTargets] = useState<WeeklyTargetItem[]>(INITIAL_WEEKLY_TARGETS);
  const [monthlyPlans, setMonthlyPlans] = useState<MonthlyPlanItem[]>(INITIAL_MONTHLY_PLANS);
  const [annualRoadmap, setAnnualRoadmap] =
    useState<AnnualQuarterPlan[]>(INITIAL_ANNUAL_ROADMAP);

  // Life Goals State
  const [lifeGoals, setLifeGoals] = useState<LifeGoalItem[]>(INITIAL_LIFE_GOALS);

  // Finance State
  const [incomes, setIncomes] = useState<IncomeRecord[]>(INITIAL_INCOMES);
  const [budgetAllocations, setBudgetAllocations] = useState<BudgetAllocationItem[]>(
    INITIAL_BUDGET_ALLOCATIONS
  );
  const [expenses, setExpenses] = useState<ExpenseRecord[]>(INITIAL_EXPENSES);

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed.schedulesByDay) setSchedulesByDay(parsed.schedulesByDay);
      if (parsed.completedSlots) setCompletedSlots(parsed.completedSlots);
      if (parsed.mutabaahState) setMutabaahState(parsed.mutabaahState);
      if (parsed.isHaidhModeByDay) setIsHaidhModeByDay(parsed.isHaidhModeByDay);
      if (typeof parsed.currentTilawahJuz === 'number')
        setCurrentTilawahJuz(parsed.currentTilawahJuz);
      if (parsed.tilawahRecordsByDay) setTilawahRecordsByDay(parsed.tilawahRecordsByDay);
      if (parsed.istighfarByDay) setIstighfarByDay(parsed.istighfarByDay);
      if (parsed.muhasabahNotesByDay) setMuhasabahNotesByDay(parsed.muhasabahNotesByDay);
      if (typeof parsed.isMurojaahStarted === 'boolean')
        setIsMurojaahStarted(parsed.isMurojaahStarted);
      if (typeof parsed.activeMurojaahDay === 'number')
        setActiveMurojaahDay(parsed.activeMurojaahDay);
      if (parsed.completedMurojaahDays) setCompletedMurojaahDays(parsed.completedMurojaahDays);
      if (parsed.weeklyTargets) setWeeklyTargets(parsed.weeklyTargets);
      if (parsed.monthlyPlans) setMonthlyPlans(parsed.monthlyPlans);
      if (parsed.annualRoadmap) setAnnualRoadmap(parsed.annualRoadmap);
      if (parsed.lifeGoals) setLifeGoals(parsed.lifeGoals);
      if (parsed.incomes) setIncomes(parsed.incomes);
      if (parsed.budgetAllocations) setBudgetAllocations(parsed.budgetAllocations);
      if (parsed.expenses) setExpenses(parsed.expenses);
    } catch {
      // Ignore malformed storage
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    try {
      const payload = {
        schedulesByDay,
        completedSlots,
        mutabaahState,
        isHaidhModeByDay,
        currentTilawahJuz,
        tilawahRecordsByDay,
        istighfarByDay,
        muhasabahNotesByDay,
        isMurojaahStarted,
        activeMurojaahDay,
        completedMurojaahDays,
        weeklyTargets,
        monthlyPlans,
        annualRoadmap,
        lifeGoals,
        incomes,
        budgetAllocations,
        expenses,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Ignore quota errors
    }
  }, [
    schedulesByDay,
    completedSlots,
    mutabaahState,
    isHaidhModeByDay,
    currentTilawahJuz,
    tilawahRecordsByDay,
    istighfarByDay,
    muhasabahNotesByDay,
    isMurojaahStarted,
    activeMurojaahDay,
    completedMurojaahDays,
    weeklyTargets,
    monthlyPlans,
    annualRoadmap,
    lifeGoals,
    incomes,
    budgetAllocations,
    expenses,
  ]);

  // Current day schedule slots
  const currentSlots = schedulesByDay[selectedDay] || getDailyScheduleForDay(selectedDay);

  // Schedule slot actions
  const handleToggleSlot = (slotId: string) => {
    setCompletedSlots((prev) => ({ ...prev, [slotId]: !prev[slotId] }));
  };

  const handleOpenEditSchedule = (slotId?: string) => {
    setEditingScheduleSlotId(slotId || null);
    setIsEditScheduleOpen(true);
  };

  const handleSaveSlot = (updatedSlot: ScheduleSlot) => {
    setSchedulesByDay((prev) => ({
      ...prev,
      [selectedDay]: (prev[selectedDay] || []).map((s) =>
        s.id === updatedSlot.id ? updatedSlot : s
      ),
    }));
  };

  const handleDeleteSlot = (slotId: string) => {
    setSchedulesByDay((prev) => ({
      ...prev,
      [selectedDay]: (prev[selectedDay] || []).filter((s) => s.id !== slotId),
    }));
  };

  const handleAddSlot = (newSlot: ScheduleSlot) => {
    setSchedulesByDay((prev) => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newSlot],
    }));
  };

  const handleResetDayToDefault = (day: DayKey) => {
    setSchedulesByDay((prev) => ({
      ...prev,
      [day]: getDailyScheduleForDay(day),
    }));
  };

  // Add custom slot directly from DailyView
  const handleAddCustomSlot = (
    day: DayKey,
    timeRange: string,
    title: string,
    subtitle: string
  ) => {
    const newSlot: ScheduleSlot = {
      id: `${day}-custom-${Date.now()}`,
      timeRange,
      title,
      subtitle,
      category: 'fleksibel',
    };
    setSchedulesByDay((prev) => ({
      ...prev,
      [day]: [...(prev[day] || []), newSlot],
    }));
  };

  const handleDeleteCustomSlot = (day: DayKey, slotId: string) => {
    setSchedulesByDay((prev) => ({
      ...prev,
      [day]: (prev[day] || []).filter((s) => s.id !== slotId),
    }));
  };

  // Mutabaah toggle
  const handleToggleMutabaah = (itemId: string) => {
    const key = `${selectedDay}-${itemId}`;
    setMutabaahState((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUpdateIstighfar = (newCount: number) => {
    setIstighfarByDay((prev) => ({ ...prev, [selectedDay]: newCount }));
  };

  const handleSaveMuhasabahNote = (note: string) => {
    setMuhasabahNotesByDay((prev) => ({ ...prev, [selectedDay]: note }));
  };

  // Murojaah actions
  const handleToggleMurojaahDay = (dayNum: number) => {
    setCompletedMurojaahDays((prev) => ({ ...prev, [dayNum]: !prev[dayNum] }));
  };

  const handleMarkMurojaahRange = (startDay: number, endDay: number, complete: boolean) => {
    setCompletedMurojaahDays((prev) => {
      const updated = { ...prev };
      for (let d = startDay; d <= endDay; d++) {
        updated[d] = complete;
      }
      return updated;
    });
  };

  // Weekly study sessions actions
  const handleUpdateWeeklySession = (id: string, delta: number) => {
    setWeeklyTargets((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              completedSessions: Math.max(
                0,
                Math.min(item.targetSessions, item.completedSessions + delta)
              ),
            }
          : item
      )
    );
  };

  const handleUpdateWeeklyNote = (id: string, note: string) => {
    setWeeklyTargets((prev) =>
      prev.map((item) => (item.id === id ? { ...item, notes: note } : item))
    );
  };

  const handleResetWeeklySessions = () => {
    setWeeklyTargets((prev) => prev.map((item) => ({ ...item, completedSessions: 0 })));
  };

  const handleUpdateWeeklyTargetItem = (updated: WeeklyTargetItem) => {
    setWeeklyTargets((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleDeleteWeeklyTargetItem = (id: string) => {
    setWeeklyTargets((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddWeeklyTargetItem = (item: WeeklyTargetItem) => {
    setWeeklyTargets((prev) => [...prev, item]);
  };

  const handleResetWeeklyTargetsToDefault = () => {
    setWeeklyTargets(INITIAL_WEEKLY_TARGETS);
  };

  // Monthly Plans actions
  const handleToggleMonthlyPlan = (id: string) => {
    setMonthlyPlans((prev) =>
      prev.map((plan) => (plan.id === id ? { ...plan, completed: !plan.completed } : plan))
    );
  };

  const handleAddMonthlyPlan = (title: string, category: string, targetMetric: string) => {
    const nextPlan: MonthlyPlanItem = {
      id: `mo-custom-${Date.now()}`,
      monthRange: 'This Month',
      title,
      category,
      targetMetric,
      completed: false,
    };
    setMonthlyPlans((prev) => [nextPlan, ...prev]);
  };

  const handleUpdateMonthlyPlanItem = (updated: MonthlyPlanItem) => {
    setMonthlyPlans((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleDeleteMonthlyPlanItem = (id: string) => {
    setMonthlyPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleAnnualItem = (quarterId: string, itemId: string) => {
    setAnnualRoadmap((prev) =>
      prev.map((q) =>
        q.id === quarterId
          ? {
              ...q,
              items: q.items.map((item) =>
                item.id === itemId ? { ...item, done: !item.done } : item
              ),
            }
          : q
      )
    );
  };

  // Life Goals actions
  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setLifeGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? {
              ...g,
              milestones: g.milestones.map((m) =>
                m.id === milestoneId ? { ...m, completed: !m.completed } : m
              ),
            }
          : g
      )
    );
  };

  const handleAddGoal = (
    horizon: GoalHorizon,
    title: string,
    domain: string,
    firstMilestone: string
  ) => {
    const mapLabel = {
      pendek: { label: 'Short-Term', time: '1 – 6 Months' },
      menengah: { label: 'Medium-Term', time: '6 Months – 2 Years' },
      panjang: { label: 'Long-Term', time: '2 – 5 Years' },
      sepuluh_tahun: { label: 'Vision 10+ Years', time: '10+ Years' },
    }[horizon];

    const newGoal: LifeGoalItem = {
      id: `goal-${Date.now()}`,
      horizon,
      horizonLabel: mapLabel.label,
      timeframe: mapLabel.time,
      title,
      domain,
      progress: 0,
      milestones: [
        {
          id: `ms-${Date.now()}`,
          label: firstMilestone,
          completed: false,
        },
      ],
    };
    setLifeGoals((prev) => [newGoal, ...prev]);
  };

  const handleAddMilestoneToGoal = (goalId: string, label: string) => {
    setLifeGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? {
              ...g,
              milestones: [
                ...g.milestones,
                { id: `ms-${Date.now()}`, label, completed: false },
              ],
            }
          : g
      )
    );
  };

  const handleUpdateLifeGoalItem = (updated: LifeGoalItem) => {
    setLifeGoals((prev) =>
      prev.map((g) => (g.id === updated.id ? updated : g))
    );
  };

  const handleDeleteLifeGoalItem = (id: string) => {
    setLifeGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Finance actions
  const handleAddIncome = (
    title: string,
    sourceType: IncomeSourceType,
    amount: number,
    dateLabel: string,
    customDescription?: string
  ) => {
    const newInc: IncomeRecord = {
      id: `inc-${Date.now()}`,
      date: dateLabel,
      title,
      sourceType,
      customDescription,
      amount,
    };
    setIncomes((prev) => [newInc, ...prev]);
  };

  const handleUpdateIncome = (updated: IncomeRecord) => {
    setIncomes((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleDeleteIncome = (id: string) => {
    setIncomes((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateTilawahRecord = (day: DayKey, record: DailyTilawahRecord) => {
    setTilawahRecordsByDay((prev) => ({
      ...prev,
      [day]: record,
    }));
    setCurrentTilawahJuz(record.juz);
    if (record.totalPages >= 20) {
      setMutabaahState((prev) => ({
        ...prev,
        [`${day}-mengaji_1_juz`]: true,
      }));
    }
  };

  const handleUpdateAllocationAmount = (id: string, newAmount: number) => {
    setBudgetAllocations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amount: newAmount } : item))
    );
  };

  const handleUpdateAllocation = (updated: BudgetAllocationItem) => {
    setBudgetAllocations((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleAddAllocation = (
    name: string,
    amount: number,
    categoryType: BudgetAllocationItem['categoryType'],
    description: string
  ) => {
    const newItem: BudgetAllocationItem = {
      id: `pos-${Date.now()}`,
      name,
      amount,
      percentage: Math.round((amount / 2000000) * 100),
      categoryType,
      description,
      isTransferredThisMonth: false,
    };
    setBudgetAllocations((prev) => [...prev, newItem]);
  };

  const handleDeleteAllocation = (id: string) => {
    setBudgetAllocations((prev) => prev.filter((item) => item.id !== id));
  };

  const handleToggleAllocationTransferred = (id: string) => {
    setBudgetAllocations((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isTransferredThisMonth: !item.isTransferredThisMonth }
          : item
      )
    );
  };

  const handleAddExpense = (
    title: string,
    category: ExpenseRecord['category'],
    amount: number,
    dateLabel: string
  ) => {
    const newExp: ExpenseRecord = {
      id: `exp-${Date.now()}`,
      date: dateLabel,
      title,
      category,
      amount,
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const handleUpdateExpense = (updated: ExpenseRecord) => {
    setExpenses((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const navItems: Array<{
    id: ActiveSection;
    label: string;
    mobileLabel: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'harian', label: 'Daily Routine', mobileLabel: 'Daily', icon: Calendar },
    { id: 'murojaah', label: 'Murojaah Roadmap', mobileLabel: 'Murojaah', icon: BookOpen },
    { id: 'planning', label: 'Roadmap & Study', mobileLabel: 'Roadmap', icon: Layers },
    { id: 'target', label: 'Life Goals', mobileLabel: 'Goals', icon: Compass },
    { id: 'keuangan', label: 'Finance Flow', mobileLabel: 'Finance', icon: Wallet },
  ];

  return (
    <div className="min-h-screen bg-[#F7F4ED] text-[#243023] pb-24 md:pb-16 font-sans">
      {/* Top Bar: Wordmark "bir's", Navigation Links, Realtime Clock & Actions */}
      <header className="sticky top-0 z-30 bg-[#F7F4ED]/95 backdrop-blur-md border-b border-[#C7D3C0]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-4 sm:px-6 h-14">
          {/* Brand Wordmark "bir's" (clean font without curl) */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#harian"
              onClick={(e) => {
                e.preventDefault();
                setActiveSection('harian');
              }}
              className="text-xl font-extrabold tracking-tight text-[#243023] lowercase whitespace-nowrap hover:text-[#3A4B37] transition-colors"
            >
              bir&apos;s
            </a>
            {currentTimeStr && (
              <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAEFE8] text-[11px] font-semibold text-[#5A6B57]">
                <Clock className="w-3 h-3" />
                {currentTimeStr}
              </span>
            )}
          </div>

          {/* Clean 5 single-line navigation links in English */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-semibold text-[#4A5A47]"
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveSection(item.id);
                  }}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 ${
                    isActive
                      ? 'text-[#243023] font-bold border-[#8FA28A]'
                      : 'border-transparent hover:text-[#243023] hover:border-[#C7D3C0]'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsEditScheduleOpen(true)}
              className="hidden sm:inline-flex min-h-[38px] px-3 py-1.5 text-xs font-semibold text-[#3A4B37] bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl hover:bg-[#EAE6DC] transition-colors whitespace-nowrap"
            >
              <Edit2 className="w-3.5 h-3.5 mr-1.5 my-auto" />
              <span>Edit Schedule</span>
            </button>
            <button
              type="button"
              onClick={() => setShowMobileInstallGuide(true)}
              className="min-h-[38px] px-3.5 py-1.5 text-xs font-semibold text-white bg-[#8FA28A] rounded-xl hover:bg-[#7A8E75] transition-colors whitespace-nowrap"
            >
              iOS &amp; Android App
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {activeSection === 'harian' && (
          <DailyMutabaahView
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            scheduleSlots={currentSlots}
            completedSlots={completedSlots}
            onToggleSlot={handleToggleSlot}
            onAddCustomSlot={handleAddCustomSlot}
            onDeleteCustomSlot={handleDeleteCustomSlot}
            onOpenEditSchedule={handleOpenEditSchedule}
            mutabaahState={mutabaahState}
            onToggleMutabaah={handleToggleMutabaah}
            currentTilawahJuz={currentTilawahJuz}
            onUpdateTilawahJuz={setCurrentTilawahJuz}
            tilawahRecord={
              tilawahRecordsByDay[selectedDay] || {
                juz: currentTilawahJuz,
                startPage: JUZ_PAGE_MAP[currentTilawahJuz]?.startPage || 62,
                endPage: JUZ_PAGE_MAP[currentTilawahJuz]?.endPage || 81,
                totalPages: JUZ_PAGE_MAP[currentTilawahJuz]?.totalPages || 20,
              }
            }
            onUpdateTilawahRecord={(rec) => handleUpdateTilawahRecord(selectedDay, rec)}
            istighfarCount={istighfarByDay[selectedDay] || 0}
            onUpdateIstighfar={handleUpdateIstighfar}
            activeMurojaahDay={activeMurojaahDay}
            completedMurojaahDays={completedMurojaahDays}
            onToggleMurojaahDay={handleToggleMurojaahDay}
            onNavigateToMurojaah={() => setActiveSection('murojaah')}
            muhasabahNote={muhasabahNotesByDay[selectedDay] || ''}
            onSaveMuhasabahNote={handleSaveMuhasabahNote}
            isHaidhMode={Boolean(isHaidhModeByDay[selectedDay])}
            onToggleHaidhMode={() =>
              setIsHaidhModeByDay((prev) => ({
                ...prev,
                [selectedDay]: !prev[selectedDay],
              }))
            }
          />
        )}

        {activeSection === 'murojaah' && (
          <Murojaah196View
            activeDay={activeMurojaahDay}
            onSetActiveDay={setActiveMurojaahDay}
            completedDays={completedMurojaahDays}
            onToggleDay={handleToggleMurojaahDay}
            onMarkRangeComplete={handleMarkMurojaahRange}
            isProgramStarted={isMurojaahStarted}
            onToggleProgramStarted={() => setIsMurojaahStarted((prev) => !prev)}
          />
        )}

        {activeSection === 'planning' && (
          <HorizonPlanningView
            weeklyTargets={weeklyTargets}
            onUpdateWeeklySession={handleUpdateWeeklySession}
            onUpdateWeeklyNote={handleUpdateWeeklyNote}
            onResetWeeklySessions={handleResetWeeklySessions}
            onOpenEditTargets={() => setIsEditTargetsOpen(true)}
            monthlyPlans={monthlyPlans}
            onToggleMonthlyPlan={handleToggleMonthlyPlan}
            onAddMonthlyPlan={handleAddMonthlyPlan}
            annualRoadmap={annualRoadmap}
            onToggleAnnualItem={handleToggleAnnualItem}
          />
        )}

        {activeSection === 'target' && (
          <LifeGoalsView
            goals={lifeGoals}
            onToggleMilestone={handleToggleMilestone}
            onAddGoal={handleAddGoal}
            onAddMilestoneToGoal={handleAddMilestoneToGoal}
            onOpenEditTargets={() => setIsEditTargetsOpen(true)}
          />
        )}

        {activeSection === 'keuangan' && (
          <FinanceFlowView
            incomes={incomes}
            onAddIncome={handleAddIncome}
            onUpdateIncome={handleUpdateIncome}
            onDeleteIncome={handleDeleteIncome}
            allocations={budgetAllocations}
            onUpdateAllocationAmount={handleUpdateAllocationAmount}
            onUpdateAllocation={handleUpdateAllocation}
            onAddAllocation={handleAddAllocation}
            onDeleteAllocation={handleDeleteAllocation}
            onToggleAllocationTransferred={handleToggleAllocationTransferred}
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onUpdateExpense={handleUpdateExpense}
            onDeleteExpense={handleDeleteExpense}
          />
        )}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (< md:) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#F7F4ED]/95 backdrop-blur-md border-t border-[#C7D3C0]"
      >
        <div className="grid grid-cols-5 items-center h-16 px-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`min-h-[48px] flex flex-col items-center justify-center rounded-xl transition-colors ${
                  isActive ? 'text-[#243023] font-bold' : 'text-[#5A6B57]'
                }`}
              >
                <span
                  className={`px-3 py-1 rounded-full transition-colors ${
                    isActive ? 'bg-[#C7D3C0] text-[#243023]' : 'text-[#5A6B57]'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                </span>
                <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap font-medium">
                  {item.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Edit Schedule Modal */}
      <EditScheduleModal
        isOpen={isEditScheduleOpen}
        onClose={() => {
          setIsEditScheduleOpen(false);
          setEditingScheduleSlotId(null);
        }}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        slots={currentSlots}
        onSaveSlot={handleSaveSlot}
        onDeleteSlot={handleDeleteSlot}
        onAddSlot={handleAddSlot}
        onResetDayToDefault={handleResetDayToDefault}
        initialEditingSlotId={editingScheduleSlotId}
      />

      {/* Edit Targets Modal */}
      <EditTargetsModal
        isOpen={isEditTargetsOpen}
        onClose={() => setIsEditTargetsOpen(false)}
        weeklyTargets={weeklyTargets}
        onUpdateWeeklyTargetItem={handleUpdateWeeklyTargetItem}
        onDeleteWeeklyTargetItem={handleDeleteWeeklyTargetItem}
        onAddWeeklyTargetItem={handleAddWeeklyTargetItem}
        onResetWeeklyTargetsToDefault={handleResetWeeklyTargetsToDefault}
        monthlyPlans={monthlyPlans}
        onUpdateMonthlyPlanItem={handleUpdateMonthlyPlanItem}
        onDeleteMonthlyPlanItem={handleDeleteMonthlyPlanItem}
        lifeGoals={lifeGoals}
        onUpdateLifeGoalItem={handleUpdateLifeGoalItem}
        onDeleteLifeGoalItem={handleDeleteLifeGoalItem}
      />

      {/* iOS & Android Installation Guide Modal */}
      {showMobileInstallGuide && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setShowMobileInstallGuide(false)}
        >
          <div
            className="w-full max-w-lg bg-[#F7F4ED] border border-[#C7D3C0] rounded-t-3xl sm:rounded-2xl p-6 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1.5 bg-[#C7D3C0] rounded-full mx-auto sm:hidden" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-[#5A6B57]">Ready for iPhone (iOS) &amp; Android</p>
                <h3 className="text-xl font-bold tracking-tight text-[#243023] mt-0.5">
                  Install bir&apos;s on Mobile Home Screen
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileInstallGuide(false)}
                className="min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center rounded-xl text-[#5A6B57] hover:text-[#243023]"
                aria-label="Close guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#3A4B37] leading-relaxed">
              <div className="p-4 rounded-xl bg-white border border-[#C7D3C0]">
                <div className="font-bold text-[#243023] mb-1">
                  1. iPhone &amp; iPad Users (iOS Safari)
                </div>
                <p>
                  Open in <strong>Safari</strong>, tap the <strong>Share</strong> icon, and select{' '}
                  <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#C7D3C0]">
                <div className="font-bold text-[#243023] mb-1">
                  2. Android Users (Google Chrome)
                </div>
                <p>
                  Open in <strong>Chrome</strong>, tap the <strong>three dots (⋮)</strong> at top right, and choose{' '}
                  <strong>&ldquo;Add to Home screen&rdquo;</strong> or <strong>&ldquo;Install App&rdquo;</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#C7D3C0]">
                <div className="font-bold text-[#243023] mb-1">
                  Offline &amp; Automatic Saving
                </div>
                <p>
                  All your schedule customizations, nap slots, murojaah milestones, and financial logs are securely stored right on your device.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowMobileInstallGuide(false)}
                className="w-full sm:w-auto min-h-[44px] px-6 rounded-xl bg-[#8FA28A] text-white text-xs font-semibold hover:bg-[#7A8E75] transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
