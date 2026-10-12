import React, { useState } from 'react';
import {
  Check,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  SlidersHorizontal,
  X,
  ArrowDownLeft,
  ArrowUpRight,
} from 'lucide-react';
import {
  BudgetAllocationItem,
  ExpenseRecord,
  IncomeRecord,
  IncomeSourceType,
  formatRupiah,
} from '../data/plannerData';

interface FinanceFlowViewProps {
  incomes: IncomeRecord[];
  onAddIncome: (
    title: string,
    sourceType: IncomeSourceType,
    amount: number,
    dateLabel: string,
    customDescription?: string
  ) => void;
  onUpdateIncome: (updated: IncomeRecord) => void;
  onDeleteIncome: (id: string) => void;
  allocations: BudgetAllocationItem[];
  onUpdateAllocationAmount: (id: string, newAmount: number) => void;
  onUpdateAllocation?: (updated: BudgetAllocationItem) => void;
  onAddAllocation?: (
    name: string,
    amount: number,
    categoryType: BudgetAllocationItem['categoryType'],
    description: string
  ) => void;
  onDeleteAllocation?: (id: string) => void;
  onToggleAllocationTransferred: (id: string) => void;
  expenses: ExpenseRecord[];
  onAddExpense: (
    title: string,
    category: ExpenseRecord['category'],
    amount: number,
    dateLabel: string
  ) => void;
  onUpdateExpense: (updated: ExpenseRecord) => void;
  onDeleteExpense: (id: string) => void;
}

export const FinanceFlowView: React.FC<FinanceFlowViewProps> = ({
  incomes,
  onAddIncome,
  onUpdateIncome,
  onDeleteIncome,
  allocations,
  onUpdateAllocationAmount,
  onUpdateAllocation,
  onAddAllocation,
  onDeleteAllocation,
  onToggleAllocationTransferred,
  expenses,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}) => {
  // Real-time month display
  const currentMonthName = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const [selectedMonth] = useState<string>(currentMonthName);

  // Income form state
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [incTitle, setIncTitle] = useState('Monthly Salary');
  const [incSourceType, setIncSourceType] = useState<IncomeSourceType>('Salary');
  const [incCustomDesc, setIncCustomDesc] = useState('');
  const [incAmount, setIncAmount] = useState('2000000');
  const [incDate, setIncDate] = useState('This Month');

  // Expense form state
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expTitle, setExpTitle] = useState('');
  const [expCategory, setExpCategory] = useState<ExpenseRecord['category']>('Fuel & Commute');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState('Today');

  // Edit income modal/inline
  const [editingIncomeId, setEditingIncomeId] = useState<string | null>(null);
  const [editIncTitle, setEditIncTitle] = useState('');
  const [editIncSourceType, setEditIncSourceType] = useState<IncomeSourceType>('Salary');
  const [editIncCustomDesc, setEditIncCustomDesc] = useState('');
  const [editIncAmount, setEditIncAmount] = useState('');

  // Edit expense inline
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editExpTitle, setEditExpTitle] = useState('');
  const [editExpCategory, setEditExpCategory] = useState<ExpenseRecord['category']>('Fuel & Commute');
  const [editExpAmount, setEditExpAmount] = useState('');

  // Allocation filter & editing state
  const [allocationCategoryFilter, setAllocationCategoryFilter] = useState<'all' | 'tabungan' | 'bakti' | 'operasional'>('all');
  const [editingAllocationId, setEditingAllocationId] = useState<string | null>(null);
  const [editAllocName, setEditAllocName] = useState('');
  const [editAllocAmount, setEditAllocAmount] = useState('');
  const [editAllocCategory, setEditAllocCategory] = useState<BudgetAllocationItem['categoryType']>('tabungan');
  const [editAllocDesc, setEditAllocDesc] = useState('');

  // Add new allocation form state
  const [showAddAllocForm, setShowAddAllocForm] = useState(false);
  const [newAllocName, setNewAllocName] = useState('');
  const [newAllocAmount, setNewAllocAmount] = useState('');
  const [newAllocCategory, setNewAllocCategory] = useState<BudgetAllocationItem['categoryType']>('tabungan');
  const [newAllocDesc, setNewAllocDesc] = useState('');

  // Financial aggregates
  const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);
  const totalAllocated = allocations.reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Dynamic Available Balance
  const currentBalance = totalIncome - totalAllocated - totalExpense;

  // Income Handlers
  const handleCreateIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(incAmount.replace(/[^0-9]/g, ''));
    if (!incTitle.trim() || !num || num <= 0) return;
    onAddIncome(
      incTitle.trim(),
      incSourceType,
      num,
      incDate.trim() || 'This Month',
      incSourceType === 'Other' ? incCustomDesc.trim() : undefined
    );
    setIncTitle('Monthly Salary');
    setIncSourceType('Salary');
    setIncCustomDesc('');
    setIncAmount('2000000');
    setIncDate('This Month');
    setShowIncomeForm(false);
  };

  const handleStartEditIncome = (item: IncomeRecord) => {
    setEditingIncomeId(item.id);
    setEditIncTitle(item.title);
    setEditIncSourceType(item.sourceType);
    setEditIncCustomDesc(item.customDescription || '');
    setEditIncAmount(item.amount.toString());
  };

  const handleSaveEditIncome = (id: string) => {
    const num = Number(editIncAmount.replace(/[^0-9]/g, ''));
    if (!editIncTitle.trim() || !num || num <= 0) return;
    onUpdateIncome({
      id,
      date: 'Updated',
      title: editIncTitle.trim(),
      sourceType: editIncSourceType,
      amount: num,
      customDescription: editIncSourceType === 'Other' ? editIncCustomDesc.trim() : undefined,
    });
    setEditingIncomeId(null);
  };

  // Expense Handlers
  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(expAmount.replace(/[^0-9]/g, ''));
    if (!expTitle.trim() || !num || num <= 0) return;
    onAddExpense(expTitle.trim(), expCategory, num, expDate.trim() || 'Today');
    setExpTitle('');
    setExpAmount('');
    setExpDate('Today');
    setShowExpenseForm(false);
  };

  const handleStartEditExpense = (item: ExpenseRecord) => {
    setEditingExpenseId(item.id);
    setEditExpTitle(item.title);
    setEditExpCategory(item.category);
    setEditExpAmount(item.amount.toString());
  };

  const handleSaveEditExpense = (id: string) => {
    const num = Number(editExpAmount.replace(/[^0-9]/g, ''));
    if (!editExpTitle.trim() || !num || num <= 0) return;
    onUpdateExpense({
      id,
      date: 'Updated',
      title: editExpTitle.trim(),
      category: editExpCategory,
      amount: num,
    });
    setEditingExpenseId(null);
  };

  // Allocation Editing Handlers
  const handleStartEditAllocation = (item: BudgetAllocationItem) => {
    setEditingAllocationId(item.id);
    setEditAllocName(item.name);
    setEditAllocAmount(item.amount.toString());
    setEditAllocCategory(item.categoryType);
    setEditAllocDesc(item.description);
  };

  const handleSaveEditAllocation = (id: string) => {
    const num = Number(editAllocAmount.replace(/[^0-9]/g, ''));
    if (!editAllocName.trim() || isNaN(num) || num < 0) return;
    if (onUpdateAllocation) {
      const existing = allocations.find((a) => a.id === id);
      if (existing) {
        onUpdateAllocation({
          ...existing,
          name: editAllocName.trim(),
          amount: num,
          categoryType: editAllocCategory,
          description: editAllocDesc.trim(),
          percentage: totalIncome > 0 ? Math.round((num / totalIncome) * 100) : 0,
        });
      }
    } else {
      onUpdateAllocationAmount(id, num);
    }
    setEditingAllocationId(null);
  };

  const handleCreateNewAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(newAllocAmount.replace(/[^0-9]/g, ''));
    if (!newAllocName.trim() || isNaN(num) || num < 0) return;
    if (onAddAllocation) {
      onAddAllocation(newAllocName.trim(), num, newAllocCategory, newAllocDesc.trim());
    }
    setNewAllocName('');
    setNewAllocAmount('');
    setNewAllocDesc('');
    setShowAddAllocForm(false);
  };

  const filteredAllocations = allocations.filter((item) => {
    if (allocationCategoryFilter === 'all') return true;
    return item.categoryType === allocationCategoryFilter;
  });

  return (
    <div className="space-y-8">
      {/* 1. HERO CARD: MONTH DISPLAYED DIRECTLY ABOVE SALDO */}
      <section className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            {/* MONTH HEADER DISPLAYED RIGHT ABOVE SALDO */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFE8] text-[#334630] text-xs font-semibold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-[#5A6B57]" />
                {selectedMonth}
              </span>
              <span className="text-xs text-[#5A6B57]">
                · Living with parents (food &amp; housing covered, Alhamdulillah!)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#5A6B57] uppercase tracking-wide">
                Available Net Balance
              </span>
              <span className="font-arabic text-xs text-[#5A6B57]">الرصيد المتاح</span>
            </div>

            {/* LARGEST TEXT ON TOP: SALDO UPDATE */}
            <div
              className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold font-mono tracking-tight tabular-nums ${
                currentBalance < 0 ? 'text-red-700' : 'text-[#243023]'
              }`}
            >
              {formatRupiah(currentBalance)}
            </div>

            {/* Real-time Dynamic Financial Breakdown */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#5A6B57] pt-1">
              <span>
                Income:{' '}
                <strong className="font-mono text-[#2E4729] font-semibold">
                  +{formatRupiah(totalIncome)}
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Allocated &amp; Savings:{' '}
                <strong className="font-mono text-[#3A4B37] font-semibold">
                  -{formatRupiah(totalAllocated)}
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Actual Expenses:{' '}
                <strong className="font-mono text-[#6E7D6B] font-semibold">
                  -{formatRupiah(totalExpense)}
                </strong>
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setShowIncomeForm(true);
                setShowExpenseForm(false);
              }}
              className="min-h-[44px] px-4 rounded-xl bg-[#8FA28A] text-white text-xs font-semibold hover:bg-[#7A8E75] transition-colors flex items-center gap-2"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>+ Add Income</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowExpenseForm(true);
                setShowIncomeForm(false);
              }}
              className="min-h-[44px] px-4 rounded-xl bg-white border border-[#C7D3C0] text-[#243023] text-xs font-semibold hover:bg-[#F7F4ED] transition-colors flex items-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4 text-[#8FA28A]" />
              <span>+ Record Expense</span>
            </button>
          </div>
        </div>

        {/* Form: Add Income (Options: Salary & Other with manual description) */}
        {showIncomeForm && (
          <form
            onSubmit={handleCreateIncome}
            className="mt-6 pt-6 border-t border-[#C7D3C0]/60 p-4 rounded-xl bg-[#F7F4ED] space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#243023]">Add New Income (الدخل)</h3>
              <button
                type="button"
                onClick={() => setShowIncomeForm(false)}
                className="text-xs text-[#6E7D6B] hover:text-[#243023]"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Category: Salary vs Other */}
              <div>
                <label className="block text-xs font-medium text-[#5A6B57] mb-1">
                  Source Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIncSourceType('Salary');
                      setIncTitle('Monthly Salary');
                    }}
                    className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      incSourceType === 'Salary'
                        ? 'bg-[#8FA28A] text-white border-[#8FA28A]'
                        : 'bg-white text-[#243023] border-[#C7D3C0]'
                    }`}
                  >
                    Salary
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIncSourceType('Other');
                      setIncTitle('');
                    }}
                    className={`min-h-[40px] px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      incSourceType === 'Other'
                        ? 'bg-[#8FA28A] text-white border-[#8FA28A]'
                        : 'bg-white text-[#243023] border-[#C7D3C0]'
                    }`}
                  >
                    Other
                  </button>
                </div>
              </div>

              {/* Title / Description */}
              <div>
                <label className="block text-xs font-medium text-[#5A6B57] mb-1">
                  {incSourceType === 'Salary' ? 'Title' : 'Source Description (Custom)'}
                </label>
                <input
                  type="text"
                  value={incTitle}
                  onChange={(e) => setIncTitle(e.target.value)}
                  placeholder={
                    incSourceType === 'Salary'
                      ? 'e.g., Monthly Quran Teaching Salary'
                      : 'e.g., Honorarium, Guest Session, Gift, Bonus'
                  }
                  required
                  className="w-full bg-white border border-[#C7D3C0] rounded-xl px-3 min-h-[40px] text-xs text-[#243023] focus:outline-none focus:border-[#8FA28A]"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-medium text-[#5A6B57] mb-1">
                  Amount (IDR)
                </label>
                <input
                  type="number"
                  value={incAmount}
                  onChange={(e) => setIncAmount(e.target.value)}
                  placeholder="2000000"
                  required
                  className="w-full bg-white border border-[#C7D3C0] rounded-xl px-3 min-h-[40px] text-xs font-mono font-semibold text-[#243023] focus:outline-none focus:border-[#8FA28A]"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-medium text-[#5A6B57] mb-1">
                  Date / Period
                </label>
                <input
                  type="text"
                  value={incDate}
                  onChange={(e) => setIncDate(e.target.value)}
                  placeholder="e.g., Start of Month"
                  className="w-full bg-white border border-[#C7D3C0] rounded-xl px-3 min-h-[40px] text-xs text-[#243023] focus:outline-none focus:border-[#8FA28A]"
                />
              </div>
            </div>

            {/* Manual details if 'Other' */}
            {incSourceType === 'Other' && (
              <div>
                <label className="block text-xs font-medium text-[#5A6B57] mb-1">
                  Custom Notes Regarding this Source
                </label>
                <input
                  type="text"
                  value={incCustomDesc}
                  onChange={(e) => setIncCustomDesc(e.target.value)}
                  placeholder="e.g., Replacement halaqah 2 sessions, gift from relatives, etc."
                  className="w-full bg-white border border-[#C7D3C0] rounded-xl px-3 min-h-[40px] text-xs text-[#243023] focus:outline-none focus:border-[#8FA28A]"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="min-h-[40px] px-4 rounded-xl bg-[#8FA28A] text-white text-xs font-semibold hover:bg-[#7A8E75]"
              >
                Save Income
              </button>
            </div>
          </form>
        )}

        {/* Form: Add Expense */}
        {showExpenseForm && (
          <form
            onSubmit={handleCreateExpense}
            className="mt-6 pt-6 border-t border-[#C7D3C0]/60 p-4 rounded-xl bg-[#F7F4ED] space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#243023]">Record New Expense (المصروفات)</h3>
              <button
                type="button"
                onClick={() => setShowExpenseForm(false)}
                className="text-xs text-[#6E7D6B] hover:text-[#243023]"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#5A6B57] mb-1">Category</label>
                <select
                  value={expCategory}
                  onChange={(e) =>
                    setExpCategory(e.target.value as ExpenseRecord['category'])
                  }
                  className="w-full bg-white border border-[#C7D3C0] rounded-xl px-3 min-h-[40px] text-xs text-[#243023] focus:outline-none focus:border-[#8FA28A]"
                >
                  <option value="Fuel & Commute">Fuel &amp; Transportation</option>
                  <option value="Infaq & Internet">Infaq &amp; Internet</option>
                  <option value="Friends & Hangout">Friends &amp; Hangouts</option>
                  <option value="Personal & Shopping">Personal &amp; Shopping</option>
                  <option value="Unexpected">Unexpected / Miscellaneous</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A6B57] mb-1">
                  Expense Title
                </label>
                <input
                  type="text"
                  value={expTitle}
                  onChange={(e) => setExpTitle(e.target.value)}
                  placeholder="e.g., Full tank fuel, books, coffee"
                  required
                  className="w-full bg-white border border-[#C7D3C0] rounded-xl px-3 min-h-[40px] text-xs text-[#243023] focus:outline-none focus:border-[#8FA28A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A6B57] mb-1">
                  Amount (IDR)
                </label>
                <input
                  type="number"
                  value={expAmount}
                  onChange={(e) => setExpAmount(e.target.value)}
                  placeholder="50000"
                  required
                  className="w-full bg-white border border-[#C7D3C0] rounded-xl px-3 min-h-[40px] text-xs font-mono font-semibold text-[#243023] focus:outline-none focus:border-[#8FA28A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5A6B57] mb-1">
                  Date / Period
                </label>
                <input
                  type="text"
                  value={expDate}
                  onChange={(e) => setExpDate(e.target.value)}
                  placeholder="e.g., Today / Week 1"
                  className="w-full bg-white border border-[#C7D3C0] rounded-xl px-3 min-h-[40px] text-xs text-[#243023] focus:outline-none focus:border-[#8FA28A]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="min-h-[40px] px-4 rounded-xl bg-[#8FA28A] text-white text-xs font-semibold hover:bg-[#7A8E75]"
              >
                Save Expense
              </button>
            </div>
          </form>
        )}
      </section>

      {/* 2. UNIFIED MONTHLY BUDGET ALLOCATIONS & SAVINGS (FULLY EDITABLE, NO FIXED MIN/MAX, AUTO UPDATES BALANCE) */}
      <section className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#8FA28A]" />
              <h2 className="text-xl font-bold text-[#243023]">
                Monthly Budget Allocations &amp; Savings
              </h2>
              <span className="font-arabic text-sm text-[#3A4B37]">الميزانية والادخار</span>
            </div>
            <p className="text-xs text-[#5A6B57] mt-0.5">
              All allocation components and savings are freely customizable without fixed min/max caps. Your balance updates automatically.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setAllocationCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  allocationCategoryFilter === 'all'
                    ? 'bg-[#8FA28A] text-white shadow-xs'
                    : 'text-[#5A6B57] hover:text-[#243023]'
                }`}
              >
                All ({allocations.length})
              </button>
              <button
                type="button"
                onClick={() => setAllocationCategoryFilter('tabungan')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  allocationCategoryFilter === 'tabungan'
                    ? 'bg-[#8FA28A] text-white shadow-xs'
                    : 'text-[#5A6B57] hover:text-[#243023]'
                }`}
              >
                Savings
              </button>
              <button
                type="button"
                onClick={() => setAllocationCategoryFilter('bakti')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  allocationCategoryFilter === 'bakti'
                    ? 'bg-[#8FA28A] text-white shadow-xs'
                    : 'text-[#5A6B57] hover:text-[#243023]'
                }`}
              >
                Parents Honor
              </button>
              <button
                type="button"
                onClick={() => setAllocationCategoryFilter('operasional')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                  allocationCategoryFilter === 'operasional'
                    ? 'bg-[#8FA28A] text-white shadow-xs'
                    : 'text-[#5A6B57] hover:text-[#243023]'
                }`}
              >
                Operations
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAddAllocForm((prev) => !prev)}
              className="min-h-[38px] px-3.5 rounded-xl bg-[#8FA28A] text-white text-xs font-semibold hover:bg-[#7A8E75] transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Component</span>
            </button>
          </div>
        </div>

        {/* Form: Add New Allocation Component */}
        {showAddAllocForm && (
          <form
            onSubmit={handleCreateNewAllocation}
            className="p-4 rounded-xl bg-[#F7F4ED] border border-[#C7D3C0] space-y-3"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#243023] uppercase tracking-wider">
                Add New Budget Component
              </h3>
              <button
                type="button"
                onClick={() => setShowAddAllocForm(false)}
                className="text-xs text-[#6E7D6B] hover:text-[#243023]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#5A6B57] mb-1">
                  Component Name
                </label>
                <input
                  type="text"
                  value={newAllocName}
                  onChange={(e) => setNewAllocName(e.target.value)}
                  placeholder="e.g., Emergency Fund, English Test Savings"
                  required
                  className="w-full bg-white border border-[#C7D3C0] rounded-xl px-3 min-h-[38px] text-xs text-[#243023] focus:outline-none focus:border-[#8FA28A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5A6B57] mb-1">
                  Allocated Amount (IDR)
                </label>
                <input
                  type="number"
                  value={newAllocAmount}
                  onChange={(e) => setNewAllocAmount(e.target.value)}
                  placeholder="300000"
                  required
                  className="w-full bg-white border border-[#C7D3C0] rounded-xl px-3 min-h-[38px] text-xs font-mono font-semibold text-[#243023] focus:outline-none focus:border-[#8FA28A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5A6B57] mb-1">
                  Category
                </label>
                <select
                  value={newAllocCategory}
                  onChange={(e) =>
                    setNewAllocCategory(e.target.value as BudgetAllocationItem['categoryType'])
                  }
                  className="w-full bg-white border border-[#C7D3C0] rounded-xl px-3 min-h-[38px] text-xs text-[#243023] focus:outline-none focus:border-[#8FA28A]"
                >
                  <option value="tabungan">Savings &amp; Future Goals</option>
                  <option value="bakti">Parents Honor (Bakti Ortu)</option>
                  <option value="operasional">Daily Operations</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#5A6B57] mb-1">
                  Description / Goal Notes
                </label>
                <input
                  type="text"
                  value={newAllocDesc}
                  onChange={(e) => setNewAllocDesc(e.target.value)}
                  placeholder="e.g., Target savings for IELTS test"
                  className="w-full bg-white border border-[#C7D3C0] rounded-xl px-3 min-h-[38px] text-xs text-[#243023] focus:outline-none focus:border-[#8FA28A]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#8FA28A] text-white text-xs font-semibold hover:bg-[#7A8E75]"
              >
                Save Budget Component
              </button>
            </div>
          </form>
        )}

        {/* Allocation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAllocations.map((item) => {
            const isEditing = editingAllocationId === item.id;

            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#F7F4ED] border border-[#C7D3C0] flex flex-col justify-between space-y-3 transition-shadow hover:shadow-xs"
              >
                {isEditing ? (
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-[#243023]">Edit Component</div>
                    <div>
                      <label className="block text-[10px] text-[#5A6B57] mb-0.5">Component Name</label>
                      <input
                        type="text"
                        value={editAllocName}
                        onChange={(e) => setEditAllocName(e.target.value)}
                        className="w-full bg-white border border-[#C7D3C0] rounded-lg px-2.5 py-1.5 text-xs text-[#243023]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#5A6B57] mb-0.5">Amount (IDR)</label>
                      <input
                        type="number"
                        value={editAllocAmount}
                        onChange={(e) => setEditAllocAmount(e.target.value)}
                        className="w-full bg-white border border-[#C7D3C0] rounded-lg px-2.5 py-1.5 text-xs font-mono font-semibold text-[#243023]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#5A6B57] mb-0.5">Category</label>
                      <select
                        value={editAllocCategory}
                        onChange={(e) =>
                          setEditAllocCategory(e.target.value as BudgetAllocationItem['categoryType'])
                        }
                        className="w-full bg-white border border-[#C7D3C0] rounded-lg px-2.5 py-1.5 text-xs text-[#243023]"
                      >
                        <option value="tabungan">Savings &amp; Future Goals</option>
                        <option value="bakti">Parents Honor (Bakti Ortu)</option>
                        <option value="operasional">Daily Operations</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#5A6B57] mb-0.5">Description / Purpose</label>
                      <input
                        type="text"
                        value={editAllocDesc}
                        onChange={(e) => setEditAllocDesc(e.target.value)}
                        className="w-full bg-white border border-[#C7D3C0] rounded-lg px-2.5 py-1.5 text-xs text-[#243023]"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingAllocationId(null)}
                        className="px-2.5 py-1 text-xs text-[#6E7D6B] hover:text-[#243023]"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEditAllocation(item.id)}
                        className="px-3 py-1 bg-[#8FA28A] text-white text-xs font-semibold rounded-lg hover:bg-[#7A8E75]"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-[#C7D3C0] text-[#5A6B57] uppercase tracking-wide">
                          {item.categoryType === 'tabungan'
                            ? 'Savings'
                            : item.categoryType === 'bakti'
                            ? 'Parents Honor'
                            : 'Operations'}
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => onToggleAllocationTransferred(item.id)}
                            className={`px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                              item.isTransferredThisMonth
                                ? 'bg-[#8FA28A] text-white'
                                : 'bg-white border border-[#C7D3C0] text-[#5A6B57] hover:bg-[#EAEFE8]'
                            }`}
                            title="Mark as transferred / saved"
                          >
                            <Check className="w-3 h-3" />
                            <span>{item.isTransferredThisMonth ? 'Saved' : 'Save'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleStartEditAllocation(item)}
                            className="p-1 text-[#5A6B57] hover:text-[#243023] rounded-md hover:bg-white"
                            title="Edit this component"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {onDeleteAllocation && allocations.length > 1 && (
                            <button
                              type="button"
                              onClick={() => onDeleteAllocation(item.id)}
                              className="p-1 text-red-600 hover:text-red-800 rounded-md hover:bg-white"
                              title="Delete this component"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-[#243023] leading-tight">
                          {item.name}
                        </h3>
                        <div className="text-xl font-bold font-mono text-[#243023] mt-1">
                          {formatRupiah(item.amount)}
                        </div>
                      </div>

                      <p className="text-[11px] text-[#6E7D6B] leading-relaxed">
                        {item.description || 'Monthly budgeted allocation.'}
                      </p>
                    </div>

                    {/* Quick amount adjuster or direct edit trigger */}
                    <div className="pt-2 border-t border-[#C7D3C0]/50 flex items-center justify-between text-[11px] text-[#5A6B57]">
                      <span>Fixed Amount</span>
                      <button
                        type="button"
                        onClick={() => handleStartEditAllocation(item)}
                        className="font-semibold text-[#3A4B37] hover:underline"
                      >
                        Adjust Amount
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. INCOME & EXPENSE RECORDS (STREAMLINED & CLEAR) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income List */}
        <div className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-[#8FA28A]" />
              <h3 className="text-base font-bold text-[#243023]">Income Records (Salary &amp; Extra)</h3>
              <span className="font-arabic text-sm text-[#3A4B37]">سجل الدخل</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowIncomeForm(true);
                setShowExpenseForm(false);
              }}
              className="text-xs font-semibold text-[#3A4B37] hover:underline"
            >
              + Add
            </button>
          </div>

          <div className="space-y-2">
            {incomes.map((item) => {
              const isEditing = editingIncomeId === item.id;
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#F7F4ED] border border-[#C7D3C0]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {isEditing ? (
                    <div className="w-full space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={editIncSourceType}
                          onChange={(e) =>
                            setEditIncSourceType(e.target.value as IncomeSourceType)
                          }
                          className="bg-white border border-[#C7D3C0] rounded-lg p-1.5 text-xs text-[#243023]"
                        >
                          <option value="Salary">Salary</option>
                          <option value="Other">Other</option>
                        </select>
                        <input
                          type="number"
                          value={editIncAmount}
                          onChange={(e) => setEditIncAmount(e.target.value)}
                          className="bg-white border border-[#C7D3C0] rounded-lg p-1.5 text-xs font-mono font-semibold"
                        />
                      </div>
                      <input
                        type="text"
                        value={editIncTitle}
                        onChange={(e) => setEditIncTitle(e.target.value)}
                        placeholder="Title / Source"
                        className="w-full bg-white border border-[#C7D3C0] rounded-lg p-1.5 text-xs"
                      />
                      {editIncSourceType === 'Other' && (
                        <input
                          type="text"
                          value={editIncCustomDesc}
                          onChange={(e) => setEditIncCustomDesc(e.target.value)}
                          placeholder="Custom notes regarding this source"
                          className="w-full bg-white border border-[#C7D3C0] rounded-lg p-1.5 text-xs"
                        />
                      )}
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingIncomeId(null)}
                          className="px-2.5 py-1 text-xs text-[#6E7D6B]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEditIncome(item.id)}
                          className="px-3 py-1 bg-[#8FA28A] text-white text-xs font-semibold rounded-lg"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#243023]">{item.title}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#EAEFE8] text-[#334630]">
                            {item.sourceType === 'Salary' ? 'Salary' : 'Other'}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#5A6B57] mt-0.5">
                          {item.customDescription || item.date}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                        <span className="text-sm font-bold font-mono text-[#2E4729]">
                          +{formatRupiah(item.amount)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEditIncome(item)}
                            className="p-1.5 text-[#5A6B57] hover:text-[#243023] rounded-md hover:bg-white"
                            title="Edit income"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteIncome(item.id)}
                            className="p-1.5 text-red-600 hover:text-red-800 rounded-md hover:bg-white"
                            title="Delete income"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Expense List */}
        <div className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-[#8FA28A]" />
              <h3 className="text-base font-bold text-[#243023]">Actual Expense Records</h3>
              <span className="font-arabic text-sm text-[#3A4B37]">سجل المصروفات</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowExpenseForm(true);
                setShowIncomeForm(false);
              }}
              className="text-xs font-semibold text-[#3A4B37] hover:underline"
            >
              + Record
            </button>
          </div>

          <div className="space-y-2">
            {expenses.map((item) => {
              const isEditing = editingExpenseId === item.id;
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#F7F4ED] border border-[#C7D3C0]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  {isEditing ? (
                    <div className="w-full space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={editExpCategory}
                          onChange={(e) =>
                            setEditExpCategory(e.target.value as ExpenseRecord['category'])
                          }
                          className="bg-white border border-[#C7D3C0] rounded-lg p-1.5 text-xs text-[#243023]"
                        >
                          <option value="Fuel & Commute">Fuel &amp; Transportation</option>
                          <option value="Infaq & Internet">Infaq &amp; Internet</option>
                          <option value="Friends & Hangout">Friends &amp; Hangouts</option>
                          <option value="Personal & Shopping">Personal &amp; Shopping</option>
                          <option value="Unexpected">Unexpected / Misc</option>
                        </select>
                        <input
                          type="number"
                          value={editExpAmount}
                          onChange={(e) => setEditExpAmount(e.target.value)}
                          className="bg-white border border-[#C7D3C0] rounded-lg p-1.5 text-xs font-mono font-semibold"
                        />
                      </div>
                      <input
                        type="text"
                        value={editExpTitle}
                        onChange={(e) => setEditExpTitle(e.target.value)}
                        placeholder="Expense title"
                        className="w-full bg-white border border-[#C7D3C0] rounded-lg p-1.5 text-xs"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingExpenseId(null)}
                          className="px-2.5 py-1 text-xs text-[#6E7D6B]"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEditExpense(item.id)}
                          className="px-3 py-1 bg-[#8FA28A] text-white text-xs font-semibold rounded-lg"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#243023]">{item.title}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-[#C7D3C0] text-[#5A6B57]">
                            {item.category}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#5A6B57] mt-0.5">{item.date}</div>
                      </div>
                      <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                        <span className="text-sm font-bold font-mono text-[#6E7D6B]">
                          -{formatRupiah(item.amount)}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEditExpense(item)}
                            className="p-1.5 text-[#5A6B57] hover:text-[#243023] rounded-md hover:bg-white"
                            title="Edit expense"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteExpense(item.id)}
                            className="p-1.5 text-red-600 hover:text-red-800 rounded-md hover:bg-white"
                            title="Delete expense"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
