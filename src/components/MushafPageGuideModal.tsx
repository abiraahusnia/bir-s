import React, { useState } from 'react';
import { X, BookOpen, Search, Layers, Clock, HelpCircle } from 'lucide-react';
import { JUZ_PAGE_MAP, ALL_196_MUROJAAH_DAYS, MurojaahDayEntry } from '../data/plannerData';

interface MushafPageGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDay: number;
  onSelectDay?: (day: number) => void;
}

export const MushafPageGuideModal: React.FC<MushafPageGuideModalProps> = ({
  isOpen,
  onClose,
  activeDay,
}) => {
  const [activeTab, setActiveTab] = useState<'formula' | 'today' | 'table'>('formula');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const currentDaySpec: MurojaahDayEntry =
    ALL_196_MUROJAAH_DAYS.find((d) => d.day === activeDay) || ALL_196_MUROJAAH_DAYS[0];

  const juzList = Object.values(JUZ_PAGE_MAP);
  const filteredJuzList = juzList.filter((j) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      `juz ${j.juz}`.includes(query) ||
      j.surahSummary.toLowerCase().includes(query) ||
      `page ${j.startPage}`.includes(query) ||
      `page ${j.endPage}`.includes(query)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-[#FAF8F5] border border-[#C7D3C0] rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#C7D3C0] flex items-start justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#EAEFE8] text-[#3A4B37]">
                <BookOpen className="w-4 h-4 text-[#8FA28A]" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-[#243023]">
                Murojaah Page &amp; Sheet Guide
              </h3>
              <span className="font-arabic text-sm text-[#3A4B37]">دليل صفحات المصحف</span>
            </div>
            <p className="text-xs text-[#5A6B57] mt-1">
              Standard Madinah Mushaf (15 lines), daily page formulas, and complete 30 Juz reference table.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6E7D6B] hover:text-[#243023] hover:bg-[#F7F4ED] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#C7D3C0] bg-white/70 px-4 pt-2 gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('formula')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'formula'
                ? 'border-[#8FA28A] text-[#243023]'
                : 'border-transparent text-[#6E7D6B] hover:text-[#243023]'
            }`}
          >
            Calculation &amp; Formula
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'today'
                ? 'border-[#8FA28A] text-[#243023]'
                : 'border-transparent text-[#6E7D6B] hover:text-[#243023]'
            }`}
          >
            Today&apos;s Target (Day {activeDay})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'table'
                ? 'border-[#8FA28A] text-[#243023]'
                : 'border-transparent text-[#6E7D6B] hover:text-[#243023]'
            }`}
          >
            30 Juz Mushaf Table
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: FORMULA & HOW TO CALCULATE */}
          {activeTab === 'formula' && (
            <div className="space-y-4 text-xs">
              {/* Highlight Card */}
              <div className="p-4 rounded-xl bg-white border border-[#C7D3C0] space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#8FA28A]" />
                  <h4 className="font-bold text-[#243023] text-sm">
                    How Many Pages in 1 Juz of the Holy Quran?
                  </h4>
                </div>
                <p className="text-[#5A6B57] leading-relaxed">
                  In the standard <strong>Madinah Mushaf (Uthmani Script, 15 lines per page)</strong>, the Holy Quran contains <strong>604 Pages</strong> in total. Each Juz contains exactly <strong>20 Pages (10 double-sided sheets)</strong> on average.
                </p>
                <div className="p-3 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/70 space-y-1 text-[11px] text-[#4A5D46]">
                  <div>• <strong>Juz 2 through Juz 29:</strong> Exactly 20 Pages per Juz (10 double-sided sheets).</div>
                  <div>• <strong>Juz 1:</strong> 21 Pages (p. 1 to 21, starting with Surah Al-Fatihah on page 1).</div>
                  <div>• <strong>Juz 30:</strong> 23 Pages (p. 582 to 604, short surahs of Juz Amma).</div>
                </div>
              </div>

              {/* How Daily Target is Calculated */}
              <div className="p-4 rounded-xl bg-white border border-[#C7D3C0] space-y-3">
                <h4 className="font-bold text-[#243023] text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#8FA28A]" />
                  <span>How is Daily Murojaah Page Target Calculated?</span>
                </h4>
                <p className="text-[#5A6B57] leading-relaxed">
                  In your murojaah roadmap, each Juz is allocated across multiple days so retention stays solid and never burdens your teaching schedule. The formula is simple:
                </p>
                <div className="p-3 rounded-lg bg-[#EAEFE8] border border-[#C7D3C0] text-center font-mono font-bold text-[#243023] text-xs">
                  Daily Target Pages = 20 Pages ÷ Allocated Days
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/70 space-y-1">
                    <span className="font-bold text-[#243023]">2-Day Allocation (Juz 28, 27, 26)</span>
                    <div className="text-[#3A4B37]">20 pages ÷ 2 = <strong>10 pages/day (~5 sheets)</strong></div>
                    <div className="text-[10px] text-[#6E7D6B]">Example: Day 3 (p. 542–551), Day 4 (p. 552–561).</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/70 space-y-1">
                    <span className="font-bold text-[#243023]">4-Day Allocation (Juz 2, 3)</span>
                    <div className="text-[#3A4B37]">20 pages ÷ 4 = <strong>5 pages/day (~2.5 sheets)</strong></div>
                    <div className="text-[10px] text-[#6E7D6B]">Calm &amp; steady: 5 pages per day.</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/70 space-y-1">
                    <span className="font-bold text-[#243023]">5-Day Allocation (Juz 4, 5)</span>
                    <div className="text-[#3A4B37]">20 pages ÷ 5 = <strong>4 pages/day (~2 sheets)</strong></div>
                    <div className="text-[10px] text-[#6E7D6B]">Exactly 2 double-sided sheets per day.</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/70 space-y-1">
                    <span className="font-bold text-[#243023]">6–7 Day Allocation (Juz 6–17)</span>
                    <div className="text-[#3A4B37]">20 pages ÷ 6/7 = <strong>~3 pages/day (~1.5 sheets)</strong></div>
                    <div className="text-[10px] text-[#6E7D6B]">Deep repetition for solid mutqin retention.</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/70 space-y-1 sm:col-span-2">
                    <span className="font-bold text-[#243023]">10-Day Allocation (Juz 21–25)</span>
                    <div className="text-[#3A4B37]">20 pages ÷ 10 = <strong>2 pages/day (1 double-sided sheet)</strong></div>
                    <div className="text-[10px] text-[#6E7D6B]">Very light, 1 sheet per day locks in long-term mastery.</div>
                  </div>
                </div>
              </div>

              {/* Prayer Times Strategy */}
              <div className="p-4 rounded-xl bg-white border border-[#C7D3C0] space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8FA28A]" />
                  <h4 className="font-bold text-[#243023] text-sm">
                    Distribution Across the 5 Daily Prayers
                  </h4>
                </div>
                <p className="text-[#5A6B57] leading-relaxed">
                  Make your page targets effortless between teaching halaqah sessions:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/60">
                    <div className="font-bold text-[#243023]">Target 10 Pages:</div>
                    <div className="text-[#5A6B57] mt-0.5">2 pages after Fajr, Dhuhr, Asr, Maghrib, and Isha.</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/60">
                    <div className="font-bold text-[#243023]">Target 5 Pages:</div>
                    <div className="text-[#5A6B57] mt-0.5">1 page after each obligatory prayer. Seamless and stress-free!</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/60">
                    <div className="font-bold text-[#243023]">Target 2 Pages:</div>
                    <div className="text-[#5A6B57] mt-0.5">1 sheet after Fajr or Maghrib. Completed in 15 minutes.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE DAY BREAKDOWN */}
          {activeTab === 'today' && (
            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-[#C7D3C0] space-y-2.5">
                
                {/* Header Info */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#5A6B57] font-medium tracking-wide uppercase">
                      Target Day {currentDaySpec.day} of 196 • {currentDaySpec.targetLabel.split(':')[0]}
                    </span>
                    <h4 className="text-lg font-bold text-[#243023] leading-tight">
                      {currentDaySpec.targetLabel.includes(':') ? currentDaySpec.targetLabel.split(':')[1] : currentDaySpec.targetLabel}
                    </h4>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-[#EAEFE8] text-[#3A4B37] font-semibold text-[10px] shrink-0 text-right">
                    {currentDaySpec.sheetsEstimateText}
                  </span>
                </div>

                {/* Main Block Range */}
                <div className="px-3 py-2 rounded-lg bg-[#F7F4ED] border border-[#EAEFE8] flex items-center justify-between">
                  <span className="text-[#3A4B37] font-medium">Madinah Mushaf Pages:</span>
                  <span className="font-mono font-bold text-sm text-[#243023]">{currentDaySpec.pageRangeText}</span>
                </div>

                {/* Detail Text */}
                {currentDaySpec.formulaNote && (
                  <div className="text-[10px] text-[#5A6B57] leading-snug px-1">
                    {currentDaySpec.formulaNote}
                  </div>
                )}

                {/* Pages Checklist */}
                {currentDaySpec.pagesList && currentDaySpec.pagesList.length > 0 && (
                  <div className="pt-1.5">
                    <div className="text-[10px] font-bold text-[#243023] mb-1.5 px-1">Page List:</div>
                    <div className="flex flex-wrap gap-1">
                      {currentDaySpec.pagesList.map((pageNum) => (
                        <span
                          key={pageNum}
                          className="w-10 py-0.5 text-center rounded bg-white border border-[#C7D3C0] font-mono text-[10px] font-medium text-[#3A4B37]"
                        >
                          p.{pageNum}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TABLE 30 JUZ MUSHAF MADINAH */}
          {activeTab === 'table' && (
            <div className="space-y-3 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#6E7D6B]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Juz number or Surah name..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#C7D3C0] rounded-xl text-xs text-[#243023] placeholder-[#8A9B85] focus:outline-none"
                />
              </div>

              <div className="bg-white rounded-xl border border-[#C7D3C0] overflow-hidden">
                <div className="grid grid-cols-12 bg-[#F7F4ED] px-3 py-2 font-bold text-[11px] text-[#3A4B37] border-b border-[#C7D3C0]">
                  <div className="col-span-2">Juz</div>
                  <div className="col-span-5">Surah Coverage</div>
                  <div className="col-span-3">Pages</div>
                  <div className="col-span-2 text-right">Sheets</div>
                </div>

                <div className="divide-y divide-[#C7D3C0]/40 max-h-[380px] overflow-y-auto">
                  {filteredJuzList.map((j) => (
                    <div
                      key={j.juz}
                      className="grid grid-cols-12 px-3 py-2.5 items-center hover:bg-[#F7F4ED]/50 transition-colors"
                    >
                      <div className="col-span-2 font-bold font-mono text-[#243023]">
                        Juz {j.juz}
                      </div>
                      <div className="col-span-5 text-[#5A6B57] truncate text-[11px]">
                        {j.surahSummary}
                      </div>
                      <div className="col-span-3 font-mono font-semibold text-[#3A4B37] text-[11px]">
                        p. {j.startPage} – {j.endPage}
                      </div>
                      <div className="col-span-2 text-right text-[#5A6B57] text-[11px]">
                        {Math.round((j.totalPages / 2) * 10) / 10} sheets
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#C7D3C0] flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="min-h-[38px] px-5 rounded-xl bg-[#8FA28A] text-white text-xs font-semibold hover:bg-[#7A8E75] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
