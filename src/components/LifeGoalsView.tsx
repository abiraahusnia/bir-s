import React, { useState } from 'react';
import { Check, Plus, Edit2, Compass } from 'lucide-react';
import { LifeGoalItem, GoalHorizon } from '../data/plannerData';

interface LifeGoalsViewProps {
  goals: LifeGoalItem[];
  onToggleMilestone: (goalId: string, milestoneId: string) => void;
  onAddGoal: (
    horizon: GoalHorizon,
    title: string,
    domain: string,
    firstMilestone: string
  ) => void;
  onAddMilestoneToGoal: (goalId: string, label: string) => void;
  onOpenEditTargets?: () => void;
}

export const LifeGoalsView: React.FC<LifeGoalsViewProps> = ({
  goals,
  onToggleMilestone,
  onAddGoal,
  onAddMilestoneToGoal,
  onOpenEditTargets,
}) => {
  const [horizonFilter, setHorizonFilter] = useState<'all' | GoalHorizon>('all');
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [newHorizon, setNewHorizon] = useState<GoalHorizon>('pendek');
  const [newTitle, setNewTitle] = useState('');
  const [newDomain, setNewDomain] = useState("Quran & Knowledge");
  const [newMilestone, setNewMilestone] = useState('');
  const [milestoneInputs, setMilestoneInputs] = useState<Record<string, string>>({});

  const visibleGoals =
    horizonFilter === 'all' ? goals : goals.filter((g) => g.horizon === horizonFilter);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddGoal(
      newHorizon,
      newTitle.trim(),
      newDomain.trim() || 'Personal Target',
      newMilestone.trim() || 'Initial step towards milestone'
    );
    setNewTitle('');
    setNewMilestone('');
    setShowAddGoalModal(false);
  };

  const handleAddMilestone = (goalId: string) => {
    const text = milestoneInputs[goalId]?.trim();
    if (!text) return;
    onAddMilestoneToGoal(goalId, text);
    setMilestoneInputs({ ...milestoneInputs, [goalId]: '' });
  };

  return (
    <div className="space-y-8">
      {/* Header & Horizon Filter */}
      <section className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#5A6B57]">
              <span>Vision &amp; Life Milestones</span>
              <span aria-hidden="true">·</span>
              <span className="font-arabic text-sm text-[#3A4B37]">الهمة العالية</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#243023] mt-0.5">
              Life Goals &amp; Aspirations
            </h2>
            <p className="text-xs sm:text-sm text-[#5A6B57] mt-1">
              Structured across Short-term (1–6 mo), Medium-term (6 mo – 2 yrs), Long-term (2–5 yrs), and Vision (10+ yrs).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenEditTargets && (
              <button
                type="button"
                onClick={onOpenEditTargets}
                className="min-h-[44px] px-4 rounded-xl bg-white border border-[#C7D3C0] text-[#243023] text-xs font-semibold hover:bg-[#F7F4ED] transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#8FA28A]" />
                <span>Manage Goals</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowAddGoalModal(!showAddGoalModal)}
              className="min-h-[44px] px-4 rounded-xl bg-[#8FA28A] text-white text-xs font-semibold hover:bg-[#7A8E75] transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Goal</span>
            </button>
          </div>
        </div>

        {/* Filter Bar Including 10+ Years */}
        <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-[#C7D3C0]/60">
          <button
            type="button"
            onClick={() => setHorizonFilter('all')}
            className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold transition-colors ${
              horizonFilter === 'all'
                ? 'bg-[#8FA28A] text-white'
                : 'bg-[#F7F4ED] text-[#4A5D46] hover:bg-[#EAE6DC]'
            }`}
          >
            All Horizons ({goals.length})
          </button>
          <button
            type="button"
            onClick={() => setHorizonFilter('pendek')}
            className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold transition-colors ${
              horizonFilter === 'pendek'
                ? 'bg-[#8FA28A] text-white'
                : 'bg-[#F7F4ED] text-[#4A5D46] hover:bg-[#EAE6DC]'
            }`}
          >
            Short-Term (1–6 Mos)
          </button>
          <button
            type="button"
            onClick={() => setHorizonFilter('menengah')}
            className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold transition-colors ${
              horizonFilter === 'menengah'
                ? 'bg-[#8FA28A] text-white'
                : 'bg-[#F7F4ED] text-[#4A5D46] hover:bg-[#EAE6DC]'
            }`}
          >
            Medium-Term (6 Mos – 2 Yrs)
          </button>
          <button
            type="button"
            onClick={() => setHorizonFilter('panjang')}
            className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold transition-colors ${
              horizonFilter === 'panjang'
                ? 'bg-[#8FA28A] text-white'
                : 'bg-[#F7F4ED] text-[#4A5D46] hover:bg-[#EAE6DC]'
            }`}
          >
            Long-Term (2–5 Yrs)
          </button>
          <button
            type="button"
            onClick={() => setHorizonFilter('sepuluh_tahun')}
            className={`min-h-[38px] px-3.5 rounded-xl text-xs font-semibold transition-colors ${
              horizonFilter === 'sepuluh_tahun'
                ? 'bg-[#8FA28A] text-white shadow-xs'
                : 'bg-[#F7F4ED] text-[#4A5D46] hover:bg-[#EAE6DC]'
            }`}
          >
            Vision 10+ Years (10 Tahun+) ({goals.filter((g) => g.horizon === 'sepuluh_tahun').length})
          </button>
        </div>
      </section>

      {/* Add New Goal Modal */}
      {showAddGoalModal && (
        <form
          onSubmit={handleCreateGoal}
          className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#243023]">Create New Life Goal</h3>
            <button
              type="button"
              onClick={() => setShowAddGoalModal(false)}
              className="text-xs text-[#6E7D6B] hover:text-[#243023]"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#5A6B57] mb-1">Time Horizon</label>
              <select
                value={newHorizon}
                onChange={(e) =>
                  setNewHorizon(e.target.value as GoalHorizon)
                }
                className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl px-3 min-h-[40px] text-xs"
              >
                <option value="pendek">Short-Term (1 – 6 Months)</option>
                <option value="menengah">Medium-Term (6 Months – 2 Years)</option>
                <option value="panjang">Long-Term (2 – 5 Years)</option>
                <option value="sepuluh_tahun">Vision (10+ Years / 10+ Tahun)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#5A6B57] mb-1">Domain</label>
              <input
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="e.g. Master’s Study, Tahfizh Community, Family"
                className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl px-3 min-h-[40px] text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#5A6B57] mb-1">Goal Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Found a girls' tahfizh academy and complete PhD"
              required
              className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl px-3 min-h-[40px] text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#5A6B57] mb-1">First Milestone</label>
            <input
              type="text"
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              placeholder="e.g. Outline long-term syllabus and community roadmap"
              className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl px-3 min-h-[40px] text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-4 min-h-[40px] bg-[#8FA28A] text-white text-xs font-semibold rounded-xl hover:bg-[#7A8E75]"
            >
              Save Goal
            </button>
          </div>
        </form>
      )}

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {visibleGoals.map((goal) => {
          const completedMilestones = goal.milestones.filter((m) => m.completed).length;
          const percent = goal.milestones.length
            ? Math.round((completedMilestones / goal.milestones.length) * 100)
            : 0;

          return (
            <article
              key={goal.id}
              className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#EAEFE8] text-[#334630]">
                    {goal.horizonLabel} · {goal.timeframe}
                  </span>
                  <span className="text-xs font-mono font-bold text-[#3A4B37]">
                    {percent}% Completed
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-medium text-[#8FA28A] uppercase tracking-wider">
                    {goal.domain}
                  </span>
                  <h3 className="text-base font-bold text-[#243023] mt-0.5 leading-snug">
                    {goal.title}
                  </h3>
                </div>

                {/* Milestones Checklist */}
                <div className="space-y-2 pt-2">
                  {goal.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => onToggleMilestone(goal.id, m.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors flex items-start gap-2.5 select-none ${
                        m.completed
                          ? 'bg-[#F0F5EE] border-[#8FA28A] text-[#2E4729]'
                          : 'bg-[#F7F4ED] border-[#C7D3C0]/60 text-[#243023] hover:bg-[#EAEFE8]'
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-4 h-4 rounded-md flex items-center justify-center shrink-0 ${
                          m.completed ? 'bg-[#8FA28A] text-white' : 'border border-[#8FA28A] bg-white'
                        }`}
                      >
                        {m.completed && <Check className="w-3 h-3" />}
                      </div>
                      <span className={m.completed ? 'line-through text-[#6E7D6B]' : ''}>
                        {m.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Milestone Form Inline */}
              <div className="pt-3 border-t border-[#C7D3C0]/60 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="+ Add new milestone"
                  value={milestoneInputs[goal.id] || ''}
                  onChange={(e) =>
                    setMilestoneInputs({ ...milestoneInputs, [goal.id]: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddMilestone(goal.id);
                    }
                  }}
                  className="flex-1 bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl px-3 min-h-[36px] text-xs text-[#243023] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddMilestone(goal.id)}
                  className="px-3 min-h-[36px] bg-[#8FA28A] text-white text-xs font-semibold rounded-xl hover:bg-[#7A8E75]"
                >
                  Add
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
