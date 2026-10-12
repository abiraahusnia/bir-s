import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, RotateCcw, Check } from 'lucide-react';
import {
  WeeklyTargetItem,
  MonthlyPlanItem,
  LifeGoalItem,
  INITIAL_WEEKLY_TARGETS,
} from '../data/plannerData';

interface EditTargetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  weeklyTargets: WeeklyTargetItem[];
  onUpdateWeeklyTargetItem: (updated: WeeklyTargetItem) => void;
  onDeleteWeeklyTargetItem: (id: string) => void;
  onAddWeeklyTargetItem: (item: WeeklyTargetItem) => void;
  onResetWeeklyTargetsToDefault: () => void;
  monthlyPlans: MonthlyPlanItem[];
  onUpdateMonthlyPlanItem: (updated: MonthlyPlanItem) => void;
  onDeleteMonthlyPlanItem: (id: string) => void;
  lifeGoals: LifeGoalItem[];
  onUpdateLifeGoalItem: (updated: LifeGoalItem) => void;
  onDeleteLifeGoalItem: (id: string) => void;
}

export const EditTargetsModal: React.FC<EditTargetsModalProps> = ({
  isOpen,
  onClose,
  weeklyTargets,
  onUpdateWeeklyTargetItem,
  onDeleteWeeklyTargetItem,
  onAddWeeklyTargetItem,
  onResetWeeklyTargetsToDefault,
  monthlyPlans,
  onUpdateMonthlyPlanItem,
  onDeleteMonthlyPlanItem,
  lifeGoals,
  onUpdateLifeGoalItem,
  onDeleteLifeGoalItem,
}) => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'life'>('weekly');

  // Editing state for weekly target
  const [editingWeeklyId, setEditingWeeklyId] = useState<string | null>(null);
  const [editWeeklyTitle, setEditWeeklyTitle] = useState('');
  const [editWeeklyCategory, setEditWeeklyCategory] = useState<WeeklyTargetItem['category']>('Master’s (S2) Prep');
  const [editWeeklySessions, setEditWeeklySessions] = useState(1);
  const [editWeeklyDay, setEditWeeklyDay] = useState('');
  const [editWeeklyMethod, setEditWeeklyMethod] = useState('');

  // Add new weekly target form
  const [isAddingWeekly, setIsAddingWeekly] = useState(false);
  const [newWeeklyTitle, setNewWeeklyTitle] = useState('');
  const [newWeeklyCategory, setNewWeeklyCategory] = useState<WeeklyTargetItem['category']>('Master’s (S2) Prep');
  const [newWeeklySessions, setNewWeeklySessions] = useState(1);
  const [newWeeklyDay, setNewWeeklyDay] = useState('Saturday');
  const [newWeeklyMethod, setNewWeeklyMethod] = useState('');

  // Editing monthly plan
  const [editingMonthlyId, setEditingMonthlyId] = useState<string | null>(null);
  const [editMonthlyTitle, setEditMonthlyTitle] = useState('');
  const [editMonthlyCategory, setEditMonthlyCategory] = useState('');
  const [editMonthlyMetric, setEditMonthlyMetric] = useState('');

  // Editing life goal
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editGoalTitle, setEditGoalTitle] = useState('');
  const [editGoalDomain, setEditGoalDomain] = useState('');

  if (!isOpen) return null;

  const startEditWeekly = (item: WeeklyTargetItem) => {
    setEditingWeeklyId(item.id);
    setEditWeeklyTitle(item.title);
    setEditWeeklyCategory(item.category);
    setEditWeeklySessions(item.targetSessions);
    setEditWeeklyDay(item.recommendedDay);
    setEditWeeklyMethod(item.methodSuggestion);
    setIsAddingWeekly(false);
  };

  const handleSaveWeekly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWeeklyId || !editWeeklyTitle.trim()) return;
    const existing = weeklyTargets.find((w) => w.id === editingWeeklyId);
    if (!existing) return;
    onUpdateWeeklyTargetItem({
      ...existing,
      title: editWeeklyTitle.trim(),
      category: editWeeklyCategory,
      targetSessions: editWeeklySessions,
      recommendedDay: editWeeklyDay.trim() || existing.recommendedDay,
      methodSuggestion: editWeeklyMethod.trim() || existing.methodSuggestion,
    });
    setEditingWeeklyId(null);
  };

  const handleCreateWeekly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeeklyTitle.trim()) return;
    const newItem: WeeklyTargetItem = {
      id: `wk-custom-${Date.now()}`,
      title: newWeeklyTitle.trim(),
      category: newWeeklyCategory,
      targetSessions: newWeeklySessions,
      completedSessions: 0,
      recommendedDay: newWeeklyDay.trim() || 'Flexible',
      methodSuggestion: newWeeklyMethod.trim() || 'Podcast, book or self-study',
      notes: '',
    };
    onAddWeeklyTargetItem(newItem);
    setNewWeeklyTitle('');
    setNewWeeklyMethod('');
    setIsAddingWeekly(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#F7F4ED] border border-[#C7D3C0] rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#C7D3C0] flex items-center justify-between gap-4 bg-white/70">
          <div>
            <h3 className="text-lg font-bold text-[#243023]">
              Edit Curriculum Targets &amp; Goals
            </h3>
            <p className="text-xs text-[#5A6B57] mt-0.5">
              Customize weekly study frequency, monthly plans, and long-term milestones.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-xl text-[#5A6B57] hover:text-[#243023] hover:bg-[#EAE6DC]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-3 sm:px-5 border-b border-[#C7D3C0]/60 bg-[#F7F4ED] flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('weekly')}
              className={`min-h-[36px] px-3 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'weekly'
                  ? 'bg-[#8FA28A] text-white'
                  : 'bg-white text-[#4A5D46] border border-[#C7D3C0]/70 hover:bg-[#EAE6DC]'
              }`}
            >
              Weekly Targets ({weeklyTargets.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('monthly')}
              className={`min-h-[36px] px-3 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'monthly'
                  ? 'bg-[#8FA28A] text-white'
                  : 'bg-white text-[#4A5D46] border border-[#C7D3C0]/70 hover:bg-[#EAE6DC]'
              }`}
            >
              Monthly Plans ({monthlyPlans.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('life')}
              className={`min-h-[36px] px-3 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'life'
                  ? 'bg-[#8FA28A] text-white'
                  : 'bg-white text-[#4A5D46] border border-[#C7D3C0]/70 hover:bg-[#EAE6DC]'
              }`}
            >
              Life Goals ({lifeGoals.length})
            </button>
          </div>

          {activeTab === 'weekly' && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onResetWeeklyTargetsToDefault}
                className="min-h-[36px] px-2.5 rounded-lg text-xs font-medium text-[#5A6B57] hover:text-[#243023] hover:bg-white flex items-center gap-1"
                title="Reset to default targets"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingWeekly(!isAddingWeekly);
                  setEditingWeeklyId(null);
                }}
                className="min-h-[36px] px-3 rounded-lg bg-[#8FA28A] text-white text-xs font-semibold hover:bg-[#7A8E75] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add</span>
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {/* 1. WEEKLY TARGETS TAB */}
          {activeTab === 'weekly' && (
            <>
              {isAddingWeekly && (
                <form
                  onSubmit={handleCreateWeekly}
                  className="p-4 rounded-xl bg-white border-2 border-[#8FA28A] space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#243023]">Add New Weekly Target</span>
                    <button
                      type="button"
                      onClick={() => setIsAddingWeekly(false)}
                      className="text-xs text-[#6E7D6B] hover:text-[#243023]"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#5A6B57] mb-1">Target Title</label>
                      <input
                        type="text"
                        value={newWeeklyTitle}
                        onChange={(e) => setNewWeeklyTitle(e.target.value)}
                        placeholder="e.g. Arabic vocabulary memorization"
                        required
                        className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl px-3 min-h-[38px] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5A6B57] mb-1">Category</label>
                      <select
                        value={newWeeklyCategory}
                        onChange={(e) =>
                          setNewWeeklyCategory(e.target.value as WeeklyTargetItem['category'])
                        }
                        className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl px-3 min-h-[38px] text-xs"
                      >
                        <option value="Master’s (S2) Prep">Master’s (S2) Prep</option>
                        <option value="Family & Marriage">Family &amp; Marriage</option>
                        <option value="Shariah">Shariah &amp; Fiqh</option>
                        <option value="Friday Worship">Friday Worship</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#5A6B57] mb-1">Sessions / Week</label>
                      <input
                        type="number"
                        min="1"
                        max="7"
                        value={newWeeklySessions}
                        onChange={(e) => setNewWeeklySessions(Number(e.target.value))}
                        className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl px-3 min-h-[38px] text-xs font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#5A6B57] mb-1">Recommended Day</label>
                      <input
                        type="text"
                        value={newWeeklyDay}
                        onChange={(e) => setNewWeeklyDay(e.target.value)}
                        placeholder="e.g. Saturday afternoon"
                        className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl px-3 min-h-[38px] text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="submit"
                      className="min-h-[36px] px-4 rounded-xl bg-[#8FA28A] text-white text-xs font-semibold hover:bg-[#7A8E75]"
                    >
                      Save Target
                    </button>
                  </div>
                </form>
              )}

              {weeklyTargets.map((item) => {
                const isEditing = editingWeeklyId === item.id;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-white border border-[#C7D3C0] space-y-2"
                  >
                    {isEditing ? (
                      <form onSubmit={handleSaveWeekly} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-[#5A6B57] mb-1">Title</label>
                            <input
                              type="text"
                              value={editWeeklyTitle}
                              onChange={(e) => setEditWeeklyTitle(e.target.value)}
                              className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-lg px-2.5 py-1.5 text-xs"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-[#5A6B57] mb-1">Sessions / Week</label>
                            <input
                              type="number"
                              min="1"
                              max="7"
                              value={editWeeklySessions}
                              onChange={(e) => setEditWeeklySessions(Number(e.target.value))}
                              className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-lg px-2.5 py-1.5 text-xs font-mono font-semibold"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingWeeklyId(null)}
                            className="px-3 py-1.5 text-xs text-[#6E7D6B]"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-3.5 py-1.5 bg-[#8FA28A] text-white text-xs font-semibold rounded-lg hover:bg-[#7A8E75]"
                          >
                            Save
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[#243023]">{item.title}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F7F4ED] text-[#5A6B57]">
                              {item.targetSessions}x / week
                            </span>
                          </div>
                          <div className="text-[11px] text-[#5A6B57] mt-0.5">
                            {item.recommendedDay} · {item.category}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => startEditWeekly(item)}
                            className="p-1.5 rounded-lg text-[#5A6B57] hover:text-[#243023] hover:bg-[#F7F4ED]"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteWeeklyTargetItem(item.id)}
                            className="p-1.5 rounded-lg text-[#5A6B57] hover:text-red-700 hover:bg-[#F7F4ED]"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* 2. MONTHLY PLANS TAB */}
          {activeTab === 'monthly' && (
            <>
              {monthlyPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-3.5 rounded-xl bg-white border border-[#C7D3C0] flex items-center justify-between gap-3"
                >
                  <div>
                    <h4 className="text-xs font-bold text-[#243023]">{plan.title}</h4>
                    <div className="text-[11px] text-[#5A6B57] mt-0.5">
                      {plan.category} · {plan.targetMetric}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteMonthlyPlanItem(plan.id)}
                    className="p-1.5 rounded-lg text-[#5A6B57] hover:text-red-700 hover:bg-[#F7F4ED]"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </>
          )}

          {/* 3. LIFE GOALS TAB */}
          {activeTab === 'life' && (
            <>
              {lifeGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="p-3.5 rounded-xl bg-white border border-[#C7D3C0] flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#243023]">{goal.title}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F7F4ED] text-[#5A6B57]">
                        {goal.horizonLabel}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#5A6B57] mt-0.5">
                      {goal.domain} · {goal.milestones.length} milestones
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteLifeGoalItem(goal.id)}
                    className="p-1.5 rounded-lg text-[#5A6B57] hover:text-red-700 hover:bg-[#F7F4ED]"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#C7D3C0] bg-white/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] px-5 rounded-xl bg-[#8FA28A] text-white text-xs font-semibold hover:bg-[#7A8E75]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
