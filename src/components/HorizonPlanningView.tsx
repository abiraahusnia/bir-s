import React, { useState } from 'react';
import { Check, Plus, RotateCcw, BookOpen, Calendar, Edit2 } from 'lucide-react';
import {
  WeeklyTargetItem,
  MonthlyPlanItem,
  AnnualQuarterPlan,
} from '../data/plannerData';

interface HorizonPlanningViewProps {
  weeklyTargets: WeeklyTargetItem[];
  onUpdateWeeklySession: (id: string, delta: number) => void;
  onUpdateWeeklyNote: (id: string, note: string) => void;
  onResetWeeklySessions: () => void;
  onOpenEditTargets: () => void;
  monthlyPlans: MonthlyPlanItem[];
  onToggleMonthlyPlan: (id: string) => void;
  onAddMonthlyPlan: (title: string, category: string, targetMetric: string) => void;
  annualRoadmap: AnnualQuarterPlan[];
  onToggleAnnualItem: (quarterId: string, itemId: string) => void;
}

export const HorizonPlanningView: React.FC<HorizonPlanningViewProps> = ({
  weeklyTargets,
  onUpdateWeeklySession,
  onUpdateWeeklyNote,
  onResetWeeklySessions,
  onOpenEditTargets,
  monthlyPlans,
  onToggleMonthlyPlan,
  onAddMonthlyPlan,
  annualRoadmap,
  onToggleAnnualItem,
}) => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'annual'>('weekly');
  const [newMonthlyTitle, setNewMonthlyTitle] = useState('');
  const [newMonthlyCategory, setNewMonthlyCategory] = useState('Personal Growth');
  const [newMonthlyMetric, setNewMonthlyMetric] = useState('Monthly Target');
  const [showAddMonthly, setShowAddMonthly] = useState(false);

  const totalWeeklySessionsTarget = weeklyTargets.reduce((acc, item) => acc + item.targetSessions, 0);
  const totalWeeklySessionsDone = weeklyTargets.reduce(
    (acc, item) => acc + Math.min(item.completedSessions, item.targetSessions),
    0
  );
  const weeklyPercent = Math.round((totalWeeklySessionsDone / totalWeeklySessionsTarget) * 100);

  const handleCreateMonthly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMonthlyTitle.trim()) return;
    onAddMonthlyPlan(
      newMonthlyTitle.trim(),
      newMonthlyCategory.trim() || 'Monthly Target',
      newMonthlyMetric.trim() || '1x / month'
    );
    setNewMonthlyTitle('');
    setShowAddMonthly(false);
  };

  return (
    <div className="space-y-8">
      {/* Header & Horizon Switcher */}
      <section className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#5A6B57]">
              <span>Curriculum &amp; Milestones</span>
              <span aria-hidden="true">·</span>
              <span className="font-arabic text-sm text-[#3A4B37]">طلب العلم والهمة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#243023] mt-0.5">
              Weekly, Monthly &amp; Annual Planning
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6B57] mt-1">
              Harmonizing Quran halaqah with English Master’s prep, Women’s Fiqh, and Marriage &amp; Parenting podcasts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenEditTargets}
              className="min-h-[44px] px-4 rounded-xl bg-white border border-[#C7D3C0] text-[#243023] text-xs font-semibold hover:bg-[#F7F4ED] transition-colors flex items-center gap-1.5"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#8FA28A]" />
              <span>Edit Targets</span>
            </button>

            <button
              type="button"
              onClick={onResetWeeklySessions}
              className="min-h-[44px] px-3.5 rounded-xl bg-[#F7F4ED] border border-[#C7D3C0] text-[#5A6B57] text-xs font-semibold hover:text-[#243023] hover:bg-[#EAE6DC] transition-colors flex items-center gap-1.5"
              title="Reset weekly study sessions"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Week</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-[#C7D3C0]/60">
          <button
            type="button"
            onClick={() => setActiveTab('weekly')}
            className={`min-h-[40px] px-4 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'weekly'
                ? 'bg-[#8FA28A] text-white shadow-xs'
                : 'bg-[#F7F4ED] text-[#4A5D46] hover:bg-[#EAE6DC]'
            }`}
          >
            Weekly Study Targets ({totalWeeklySessionsDone}/{totalWeeklySessionsTarget})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('monthly')}
            className={`min-h-[40px] px-4 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'monthly'
                ? 'bg-[#8FA28A] text-white shadow-xs'
                : 'bg-[#F7F4ED] text-[#4A5D46] hover:bg-[#EAE6DC]'
            }`}
          >
            Monthly Goals
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('annual')}
            className={`min-h-[40px] px-4 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'annual'
                ? 'bg-[#8FA28A] text-white shadow-xs'
                : 'bg-[#F7F4ED] text-[#4A5D46] hover:bg-[#EAE6DC]'
            }`}
          >
            Annual 4-Quarter Roadmap
          </button>
        </div>
      </section>

      {/* WEEKLY TARGETS TAB */}
      {activeTab === 'weekly' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#5A6B57]">
            <span>Weekly Study Completion: {weeklyPercent}%</span>
            <span>Target: 7 sessions / week</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weeklyTargets.map((item) => {
              const isFinished = item.completedSessions >= item.targetSessions;

              return (
                <div
                  key={item.id}
                  className={`bg-white/95 border rounded-2xl p-5 space-y-3 transition-all ${
                    isFinished ? 'border-[#8FA28A] bg-[#F0F5EE]/40' : 'border-[#C7D3C0]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#EAEFE8] text-[#334630]">
                        {item.category}
                      </span>
                      <h3 className="text-base font-bold text-[#243023] mt-1">
                        {item.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateWeeklySession(item.id, -1)}
                        className="w-8 h-8 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0] text-xs font-bold text-[#243023] hover:bg-[#EAE6DC]"
                      >
                        -
                      </button>
                      <span className="font-mono text-sm font-bold text-[#243023] px-1">
                        {item.completedSessions}/{item.targetSessions}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateWeeklySession(item.id, 1)}
                        className="w-8 h-8 rounded-lg bg-[#8FA28A] text-white text-xs font-bold hover:bg-[#7A8E75]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-[#5A6B57]">
                    <strong>Recommended day:</strong> {item.recommendedDay}
                  </div>
                  <div className="text-xs text-[#6E7D6B] leading-relaxed">
                    {item.methodSuggestion}
                  </div>

                  {item.notes && (
                    <div className="p-2.5 rounded-xl bg-[#F7F4ED] border border-[#C7D3C0]/60 text-[11px] text-[#4A5D46] italic">
                      "{item.notes}"
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* MONTHLY GOALS TAB */}
      {activeTab === 'monthly' && (
        <section className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 sm:p-7 space-y-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#C7D3C0]/60">
            <div>
              <h3 className="text-lg font-bold text-[#243023]">Monthly Habits &amp; Milestones</h3>
              <p className="text-xs text-[#5A6B57]">Recurring monthly targets across Quran, Master’s study &amp; finance.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddMonthly(!showAddMonthly)}
              className="text-xs font-semibold text-[#3A4B37] hover:underline"
            >
              {showAddMonthly ? 'Cancel' : '+ Add Monthly Target'}
            </button>
          </div>

          {showAddMonthly && (
            <form onSubmit={handleCreateMonthly} className="p-4 rounded-xl bg-[#F7F4ED] space-y-3">
              <input
                type="text"
                value={newMonthlyTitle}
                onChange={(e) => setNewMonthlyTitle(e.target.value)}
                placeholder="Target title (e.g., Read 1 English novel for IELTS, attend webinar)"
                required
                className="w-full bg-white border border-[#C7D3C0] rounded-xl px-3 min-h-[40px] text-xs"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-4 min-h-[36px] bg-[#8FA28A] text-white text-xs font-semibold rounded-xl"
                >
                  Save Target
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {monthlyPlans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => onToggleMonthlyPlan(plan.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 select-none ${
                  plan.completed
                    ? 'bg-[#F0F5EE] border-[#8FA28A]'
                    : 'bg-[#F7F4ED] border-[#C7D3C0]/70 hover:bg-[#EAEFE8]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                      plan.completed ? 'bg-[#8FA28A] text-white' : 'border-2 border-[#8FA28A] bg-white'
                    }`}
                  >
                    {plan.completed && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <h4
                      className={`text-sm font-bold ${
                        plan.completed ? 'line-through text-[#6E7D6B]' : 'text-[#243023]'
                      }`}
                    >
                      {plan.title}
                    </h4>
                    <span className="text-xs text-[#5A6B57]">{plan.targetMetric}</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-[#C7D3C0] text-[#5A6B57]">
                  {plan.category}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ANNUAL 4-QUARTER ROADMAP TAB */}
      {activeTab === 'annual' && (
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {annualRoadmap.map((quarter) => (
              <div
                key={quarter.id}
                className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#C7D3C0]/60">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#8FA28A]">
                      {quarter.quarter} · {quarter.period}
                    </span>
                    <h4 className="text-sm font-bold text-[#243023] mt-0.5">{quarter.theme}</h4>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  {quarter.items.map((it) => (
                    <div
                      key={it.id}
                      onClick={() => onToggleAnnualItem(quarter.id, it.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors flex items-start gap-2.5 ${
                        it.done
                          ? 'bg-[#F0F5EE] border-[#8FA28A]/80 text-[#2E4729]'
                          : 'bg-[#F7F4ED] border-[#C7D3C0]/60 text-[#243023] hover:bg-[#EAEFE8]'
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
                          it.done ? 'bg-[#8FA28A] text-white' : 'border border-[#8FA28A] bg-white'
                        }`}
                      >
                        {it.done && <Check className="w-3 h-3" />}
                      </div>
                      <span className={it.done ? 'line-through text-[#6E7D6B]' : ''}>
                        {it.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
