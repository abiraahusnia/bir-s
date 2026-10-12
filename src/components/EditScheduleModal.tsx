import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit2, RotateCcw, Check, Clock } from 'lucide-react';
import { DAYS_OF_WEEK, DayKey, ScheduleSlot } from '../data/plannerData';

interface EditScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDay: DayKey;
  onSelectDay: (day: DayKey) => void;
  slots: ScheduleSlot[];
  onSaveSlot: (slot: ScheduleSlot) => void;
  onDeleteSlot: (slotId: string) => void;
  onAddSlot: (slot: ScheduleSlot) => void;
  onResetDayToDefault: (day: DayKey) => void;
  initialEditingSlotId?: string | null;
}

export const EditScheduleModal: React.FC<EditScheduleModalProps> = ({
  isOpen,
  onClose,
  selectedDay,
  onSelectDay,
  slots,
  onSaveSlot,
  onDeleteSlot,
  onAddSlot,
  onResetDayToDefault,
  initialEditingSlotId,
}) => {
  const [editingId, setEditingId] = useState<string | null>(initialEditingSlotId || null);
  const [editTime, setEditTime] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editCategory, setEditCategory] = useState<ScheduleSlot['category']>('fleksibel');

  // Form for adding new slot
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTime, setNewTime] = useState('11:00 – 12:00');
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<ScheduleSlot['category']>('istirahat');

  useEffect(() => {
    if (initialEditingSlotId) {
      const target = slots.find((s) => s.id === initialEditingSlotId);
      if (target) {
        startEditing(target);
      }
    }
  }, [initialEditingSlotId, slots]);

  if (!isOpen) return null;

  const startEditing = (slot: ScheduleSlot) => {
    setEditingId(slot.id);
    setEditTime(slot.timeRange);
    setEditTitle(slot.title);
    setEditSubtitle(slot.subtitle);
    setEditCategory(slot.category);
    setIsAddingNew(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editTitle.trim()) return;
    const existing = slots.find((s) => s.id === editingId);
    if (!existing) return;
    onSaveSlot({
      ...existing,
      timeRange: editTime.trim() || existing.timeRange,
      title: editTitle.trim(),
      subtitle: editSubtitle.trim(),
      category: editCategory,
    });
    setEditingId(null);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newSlot: ScheduleSlot = {
      id: `${selectedDay}-${Date.now()}`,
      timeRange: newTime.trim() || '11:00 – 12:00',
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Daily activity',
      category: newCategory,
    };
    onAddSlot(newSlot);
    setNewTitle('');
    setNewSubtitle('');
    setIsAddingNew(false);
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
              Manage &amp; Edit Daily Schedule
            </h3>
            <p className="text-xs text-[#5A6B57] mt-0.5">
              Customize halaqah hours, midday nap 11:00–12:00, murojaah, or add new activities.
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

        {/* Day Selector Bar */}
        <div className="p-3 sm:px-5 border-b border-[#C7D3C0]/60 bg-[#F7F4ED] flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1">
            {DAYS_OF_WEEK.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => {
                  onSelectDay(d.key);
                  setEditingId(null);
                  setIsAddingNew(false);
                }}
                className={`min-h-[36px] px-2.5 sm:px-3 rounded-lg text-xs font-semibold transition-colors ${
                  selectedDay === d.key
                    ? 'bg-[#8FA28A] text-white'
                    : 'bg-white text-[#4A5D46] border border-[#C7D3C0]/70 hover:bg-[#EAE6DC]'
                }`}
              >
                {d.short}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onResetDayToDefault(selectedDay)}
              className="min-h-[36px] px-2.5 rounded-lg text-xs font-medium text-[#5A6B57] hover:text-[#243023] hover:bg-white flex items-center gap-1"
              title="Reset day to default schedule"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Day</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAddingNew(!isAddingNew);
                setEditingId(null);
              }}
              className="min-h-[36px] px-3 rounded-lg bg-[#8FA28A] text-white text-xs font-semibold hover:bg-[#7A8E75] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Activity</span>
            </button>
          </div>
        </div>

        {/* Scrollable Slots List and Inline Forms */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {/* Add New Slot Form */}
          {isAddingNew && (
            <form
              onSubmit={handleCreateNew}
              className="p-4 rounded-xl bg-white border-2 border-[#8FA28A] space-y-3 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#243023]">
                  New Activity for {DAYS_OF_WEEK.find((d) => d.key === selectedDay)?.label}
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-[#6E7D6B] hover:text-[#243023]"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#5A6B57] mb-1">Time Range</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 11:00 – 12:00"
                    required
                    className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl px-3 min-h-[38px] text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#5A6B57] mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) =>
                      setNewCategory(e.target.value as ScheduleSlot['category'])
                    }
                    className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl px-3 min-h-[38px] text-xs"
                  >
                    <option value="istirahat">Rest / Nap (Qailulah)</option>
                    <option value="ibadah">Worship (Tahajjud, Subuh, Rawatib)</option>
                    <option value="halaqah">Teaching Halaqah</option>
                    <option value="belajar">Study (English, Fiqh, S2)</option>
                    <option value="fleksibel">Flexible / Family</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A6B57] mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Midday Nap before Dhuhr"
                  required
                  className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl px-3 min-h-[38px] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A6B57] mb-1">Description / Notes</label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="e.g. Sunnah Qailulah for 30–60 minutes"
                  className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl px-3 min-h-[38px] text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="submit"
                  className="min-h-[36px] px-4 rounded-xl bg-[#8FA28A] text-white text-xs font-semibold hover:bg-[#7A8E75]"
                >
                  Save Activity
                </button>
              </div>
            </form>
          )}

          {/* List of current slots */}
          {slots.map((slot) => {
            const isEditing = editingId === slot.id;

            return (
              <div
                key={slot.id}
                className="p-3.5 rounded-xl bg-white border border-[#C7D3C0] space-y-2"
              >
                {isEditing ? (
                  <form onSubmit={handleSaveEdit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#5A6B57] mb-1">
                          Time Range
                        </label>
                        <input
                          type="text"
                          value={editTime}
                          onChange={(e) => setEditTime(e.target.value)}
                          className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-lg px-2.5 py-1.5 text-xs font-mono font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#5A6B57] mb-1">
                          Category
                        </label>
                        <select
                          value={editCategory}
                          onChange={(e) =>
                            setEditCategory(e.target.value as ScheduleSlot['category'])
                          }
                          className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-lg px-2.5 py-1.5 text-xs"
                        >
                          <option value="istirahat">Rest / Nap</option>
                          <option value="ibadah">Worship</option>
                          <option value="halaqah">Teaching Halaqah</option>
                          <option value="belajar">Study</option>
                          <option value="fleksibel">Flexible</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#5A6B57] mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-lg px-2.5 py-1.5 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#5A6B57] mb-1">
                        Subtitle / Details
                      </label>
                      <input
                        type="text"
                        value={editSubtitle}
                        onChange={(e) => setEditSubtitle(e.target.value)}
                        className="w-full bg-[#F7F4ED] border border-[#C7D3C0] rounded-lg px-2.5 py-1.5 text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 text-xs text-[#6E7D6B] hover:text-[#243023]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 bg-[#8FA28A] text-white text-xs font-semibold rounded-lg hover:bg-[#7A8E75]"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#3A4B37] tabular-nums">
                          {slot.timeRange}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#F7F4ED] border border-[#C7D3C0] text-[#5A6B57]">
                          {slot.category}
                        </span>
                        {slot.isFixedHalaqah && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#8FA28A] text-white">
                            Fixed
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-[#243023] mt-1">{slot.title}</h4>
                      <p className="text-xs text-[#5A6B57] mt-0.5 leading-relaxed">
                        {slot.subtitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => startEditing(slot)}
                        className="p-1.5 rounded-lg text-[#5A6B57] hover:text-[#243023] hover:bg-[#F7F4ED]"
                        title="Edit slot"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSlot(slot.id)}
                        className="p-1.5 rounded-lg text-[#5A6B57] hover:text-red-700 hover:bg-[#F7F4ED]"
                        title="Delete slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
