import React, { useState } from 'react';
import {
  Check,
  Plus,
  Trash2,
  Edit2,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  RotateCcw,
  Sliders,
  Calendar,
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
  onToggleAllocationTransferred,
  expenses,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}) => {
  const [projectionYears, setProjectionYears] = useState<number>(2);

  // Real-time month or selectable month
  const currentMonthName = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthName);

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

  // Totals & Balance
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const currentBalance = totalIncome - totalExpense;

  const hajiAlloc = allocations.find((a) => a.id === 'pos-haji')?.amount || 250000;
  const masaDepanAlloc = allocations.find((a) => a.id === 'pos-masadepan')?.amount || 400000;
  const ortuAlloc = allocations.find((a) => a.id === 'pos-ortu')?.amount || 300000;

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
    setIncAmount('');
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
      customDescription: editIncSourceType === 'Other' ? editIncCustomDesc.trim() : undefined,
      amount: num,
    });
    setEditingIncomeId(null);
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(expAmount.replace(/[^0-9]/g, ''));
    if (!expTitle.trim() || !num || num <= 0) return;
    onAddExpense(expTitle.trim(), expCategory, num, expDate.trim() || 'Today');
    setExpTitle('');
    setExpAmount('');
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

  const monthsCount = projectionYears * 12;
  const projectedHaji = hajiAlloc * monthsCount;
  const projectedMasaDepan = masaDepanAlloc * monthsCount;

  return (
    <div className="space-y-8">
      {/* 1. HERO CARD: MONTH DISPLAYED ABOVE THE LARGEST UPDATED BALANCE */}
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
                · Living with parents (food &amp; housing safe, Alhamdulillah!)
              </span>
            </div>

            <div className="text-xs font-semibold text-[#5A6B57] uppercase tracking-wide">
              Current Available Balance
            </div>

            {/* THE LARGEST TEXT ON TOP: SALDO UPDATE */}
            <div
              className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold font-mono tracking-tight tabular-nums ${
                currentBalance < 0 ? 'text-red-700' : 'text-[#243023]'
              }`}
            >
              {formatRupiah(currentBalance)}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-[#5A6B57] pt-1">
              <span>
                Total Income:{' '}
                <strong className="font-mono text-[#3A4B37] font-semibold">
                  {formatRupiah(totalIncome)}
                </strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>
                Total Spent:{' '}
                <strong className="font-mono text-[#6E7D6B] font-semibold">
                  {formatRupiah(totalExpense)}
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
              <h3 className="text-sm font-semibold text-[#243023]">Add Income</h3>
              <button
                type="button"
                onClick={() => setShowIncomeForm(false)}
                className="text-xs text-[#6E7D6B] hover:text-[#243023]"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Income Type: ONLY Salary & Other */}
              <div>
                <label className="block text-xs font-medium text-[#5A6B57] mb-1">
                  Income Category
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
                  {incSourceType === 'Salary' ? 'Title' : 'Source / Description'}
                </label>
                <input
                  type="text"
                  value={incTitle}
                  onChange={(e) => setIncTitle(e.target.value)}
                  placeholder={
                    incSourceType === 'Salary'
                      ? 'e.g., Monthly Salary'
                      : 'e.g., Honorarium, Teaching bonus, Family gift'
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
                  Date / Note
                </label>
                <input
                  type="text"
                  value={incDate}
                  onChange={(e) => setIncDate(e.target.value)}
                  placeholder="e.g., Early Month"
                  className="w-full bg-white border border-[#C7D3C0] rounded-xl px-3 min-h-[40px] text-xs text-[#243023] focus:outline-none focus:border-[#8FA28A]"
                />
              </div>
            </div>

            {/* Manual details if 'Other' */}
            {incSourceType === 'Other' && (
              <div>
                <label className="block text-xs font-medium text-[#5A6B57] mb-1">
                  Manual Note / What is this for?
                </label>
                <input
                  type="text"
                  value={incCustomDesc}
                  onChange={(e) => setIncCustomDesc(e.target.value)}
                  placeholder="e.g., Extra halaqah substitution, side project, gift from aunt"
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
              <h3 className="text-sm font-semibold text-[#243023]">Record New Expense</h3>
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
                  <option value="Fuel & Commute">Fuel &amp; Commute</option>
                  <option value="Infaq & Internet">Infaq &amp; Internet</option>
                  <option value="Friends & Hangout">Friends &amp; Hangouts</option>
                  <option value="Personal & Shopping">Personal &amp; Shopping</option>
                  <option value="Unexpected">Unexpected / Lain-lain</option>
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
                  placeholder="e.g., Refuel bike tank, coffee with friends"
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
                  Date / When
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

      {/* 2. SAVINGS & ALLOCATIONS WITH FLEXIBLE RANGES */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-[#243023]">
              Monthly Budget Allocations &amp; Savings
            </h2>
            <p className="text-xs text-[#5A6B57]">
              Priority savings have flexible ranges: Future savings (300k–500k) &amp; Hajj savings (200k–300k).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Future Savings Card with Range Slider */}
          <div className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EAEFE8] text-[#334630]">
                Range 300k – 500k
              </span>
              <button
                type="button"
                onClick={() => onToggleAllocationTransferred('pos-masadepan')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  allocations.find((a) => a.id === 'pos-masadepan')?.isTransferredThisMonth
                    ? 'bg-[#8FA28A] text-white'
                    : 'bg-[#F7F4ED] text-[#5A6B57] border border-[#C7D3C0]'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {allocations.find((a) => a.id === 'pos-masadepan')?.isTransferredThisMonth
                    ? 'Saved'
                    : 'Mark Saved'}
                </span>
              </button>
            </div>

            <div>
              <div className="text-xs font-medium text-[#5A6B57]">Future Savings (Master’s &amp; Life)</div>
              <div className="text-2xl font-bold font-mono text-[#243023] mt-0.5">
                {formatRupiah(masaDepanAlloc)}
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] text-[#6E7D6B]">
                <span>Min: 300k</span>
                <span className="font-semibold text-[#243023]">Selected: {formatRupiah(masaDepanAlloc)}</span>
                <span>Max: 500k</span>
              </div>
              <input
                type="range"
                min="300000"
                max="500000"
                step="25000"
                value={masaDepanAlloc}
                onChange={(e) => onUpdateAllocationAmount('pos-masadepan', Number(e.target.value))}
                className="w-full accent-[#8FA28A] cursor-pointer"
              />
            </div>

            <p className="text-[11px] text-[#6E7D6B] leading-relaxed">
              Flexible range for tests, IELTS &amp; study applications.
            </p>
          </div>

          {/* Hajj Savings Card with Range Slider */}
          <div className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EAEFE8] text-[#334630]">
                Range 200k – 300k
              </span>
              <button
                type="button"
                onClick={() => onToggleAllocationTransferred('pos-haji')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  allocations.find((a) => a.id === 'pos-haji')?.isTransferredThisMonth
                    ? 'bg-[#8FA28A] text-white'
                    : 'bg-[#F7F4ED] text-[#5A6B57] border border-[#C7D3C0]'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {allocations.find((a) => a.id === 'pos-haji')?.isTransferredThisMonth
                    ? 'Saved'
                    : 'Mark Saved'}
                </span>
              </button>
            </div>

            <div>
              <div className="text-xs font-medium text-[#5A6B57]">Hajj Savings</div>
              <div className="text-2xl font-bold font-mono text-[#243023] mt-0.5">
                {formatRupiah(hajiAlloc)}
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-[11px] text-[#6E7D6B]">
                <span>Min: 200k</span>
                <span className="font-semibold text-[#243023]">Selected: {formatRupiah(hajiAlloc)}</span>
                <span>Max: 300k</span>
              </div>
              <input
                type="range"
                min="200000"
                max="300000"
                step="25000"
                value={hajiAlloc}
                onChange={(e) => onUpdateAllocationAmount('pos-haji', Number(e.target.value))}
                className="w-full accent-[#8FA28A] cursor-pointer"
              />
            </div>

            <p className="text-[11px] text-[#6E7D6B] leading-relaxed">
              Steady monthly steps towards securing the Hajj quota.
            </p>
          </div>

          {/* Parents Gift Card */}
          <div className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#EAEFE8] text-[#334630]">
                Fixed 300k / mo
              </span>
              <button
                type="button"
                onClick={() => onToggleAllocationTransferred('pos-ortu')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  allocations.find((a) => a.id === 'pos-ortu')?.isTransferredThisMonth
                    ? 'bg-[#8FA28A] text-white'
                    : 'bg-[#F7F4ED] text-[#5A6B57] border border-[#C7D3C0]'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {allocations.find((a) => a.id === 'pos-ortu')?.isTransferredThisMonth
                    ? 'Given'
                    : 'Mark Given'}
                </span>
              </button>
            </div>

            <div>
              <div className="text-xs font-medium text-[#5A6B57]">Gift for Parents (Bakti Ortu)</div>
              <div className="text-2xl font-bold font-mono text-[#243023] mt-0.5">
                {formatRupiah(ortuAlloc)}
              </div>
            </div>

            <p className="text-[11px] text-[#6E7D6B] leading-relaxed pt-3">
              Token of gratitude &amp; love for mom and dad.
            </p>
          </div>
        </div>

        {/* Operational Categories Breakdown */}
        <div className="bg-white/90 border border-[#C7D3C0] rounded-2xl p-5">
          <div className="text-xs font-bold text-[#243023] uppercase tracking-wide mb-3">
            Operational &amp; Daily Living Budget
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {allocations
              .filter((a) => a.categoryType === 'operasional')
              .map((item) => (
                <div key={item.id} className="p-3 rounded-xl bg-[#F7F4ED] border border-[#C7D3C0]/60">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#243023]">{item.name}</span>
                    <button
                      type="button"
                      onClick={() => onToggleAllocationTransferred(item.id)}
                      className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                        item.isTransferredThisMonth ? 'bg-[#8FA28A] text-white' : 'border border-[#C7D3C0] bg-white'
                      }`}
                    >
                      {item.isTransferredThisMonth && <Check className="w-3 h-3" />}
                    </button>
                  </div>
                  <div className="text-base font-bold font-mono text-[#3A4B37] mt-1">
                    {formatRupiah(item.amount)}
                  </div>
                  <div className="text-[11px] text-[#6E7D6B] mt-0.5">{item.description}</div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 3. INCOME & EXPENSE RECORDS (EDITABLE) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income List */}
        <div className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDownLeft className="w-4 h-4 text-[#8FA28A]" />
              <h3 className="text-base font-bold text-[#243023]">Incomes (Salary &amp; Other)</h3>
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
                          placeholder="Manual note / source explanation"
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
                            {item.sourceType}
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
        <div className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-[#8FA28A]" />
              <h3 className="text-base font-bold text-[#243023]">Recorded Expenses</h3>
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
                          <option value="Fuel & Commute">Fuel &amp; Commute</option>
                          <option value="Infaq & Internet">Infaq &amp; Internet</option>
                          <option value="Friends & Hangout">Friends &amp; Hangouts</option>
                          <option value="Personal & Shopping">Personal &amp; Shopping</option>
                          <option value="Unexpected">Unexpected / Lain-lain</option>
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

      {/* 4. LONG-TERM ACCUMULATION PROJECTION */}
      <section className="bg-white/95 border border-[#C7D3C0] rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#5A6B57]">
              <TrendingUp className="w-4 h-4 text-[#8FA28A]" />
              <span>Savings Growth Simulation</span>
            </div>
            <h3 className="text-lg font-bold text-[#243023] mt-0.5">
              Accumulation in {projectionYears} Year{projectionYears > 1 ? 's' : ''} ({monthsCount} Months)
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-[#F7F4ED] border border-[#C7D3C0] rounded-xl p-1">
            {[1, 2, 3, 5].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setProjectionYears(yr)}
                className={`min-h-[36px] px-3 rounded-lg text-xs font-semibold transition-colors ${
                  projectionYears === yr
                    ? 'bg-[#8FA28A] text-white'
                    : 'text-[#4A5D46] hover:text-[#243023]'
                }`}
              >
                {yr} Year{yr > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#F7F4ED] border border-[#C7D3C0]/60 space-y-1">
            <div className="text-xs text-[#5A6B57]">
              Projected Hajj Savings ({formatRupiah(hajiAlloc)}/mo)
            </div>
            <div className="text-2xl font-bold font-mono text-[#243023]">
              {formatRupiah(projectedHaji)}
            </div>
            <p className="text-[11px] text-[#6E7D6B]">
              Takes you closer to the initial official Hajj quota deposit.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F4ED] border border-[#C7D3C0]/60 space-y-1">
            <div className="text-xs text-[#5A6B57]">
              Projected Future Savings ({formatRupiah(masaDepanAlloc)}/mo)
            </div>
            <div className="text-2xl font-bold font-mono text-[#243023]">
              {formatRupiah(projectedMasaDepan)}
            </div>
            <p className="text-[11px] text-[#6E7D6B]">
              Ready for IELTS tests, Master’s applications &amp; life milestones.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
