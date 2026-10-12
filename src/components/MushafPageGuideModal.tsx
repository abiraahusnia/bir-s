import React, { useState } from 'react';
import { X, BookOpen, Search, Check, Layers, Clock, HelpCircle } from 'lucide-react';
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
  onSelectDay,
}) => {
  const [activeTab, setActiveTab] = useState<'rumus' | 'tabel' | 'hariIni'>('rumus');
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
      `hal ${j.startPage}`.includes(query) ||
      `hal ${j.endPage}`.includes(query)
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
                Panduan Target Halaman &amp; Lembar Murojaah
              </h3>
            </div>
            <p className="text-xs text-[#5A6B57] mt-1">
              Standar Mushaf Madinah (15 baris), hitungan halaman per hari, dan tabel 30 Juz.
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
            onClick={() => setActiveTab('rumus')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'rumus'
                ? 'border-[#8FA28A] text-[#243023]'
                : 'border-transparent text-[#6E7D6B] hover:text-[#243023]'
            }`}
          >
            Cara Hitung &amp; Formula
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hariIni')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'hariIni'
                ? 'border-[#8FA28A] text-[#243023]'
                : 'border-transparent text-[#6E7D6B] hover:text-[#243023]'
            }`}
          >
            Target Hari Ini (Day {activeDay})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tabel')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'tabel'
                ? 'border-[#8FA28A] text-[#243023]'
                : 'border-transparent text-[#6E7D6B] hover:text-[#243023]'
            }`}
          >
            Tabel 30 Juz Mushaf
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* TAB 1: FORMULA & HOW TO CALCULATE */}
          {activeTab === 'rumus' && (
            <div className="space-y-4 text-xs">
              {/* Highlight Card */}
              <div className="p-4 rounded-xl bg-white border border-[#C7D3C0] space-y-2">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#8FA28A]" />
                  <h4 className="font-bold text-[#243023] text-sm">
                    Berapa Halaman dalam 1 Juz Al-Qur’an?
                  </h4>
                </div>
                <p className="text-[#5A6B57] leading-relaxed">
                  Pada <strong>Mushaf Madinah standar (Rasm Utsmani, 15 baris per halaman)</strong>, Al-Qur’an terdiri dari total <strong>604 Halaman</strong>. Setiap 1 Juz rata-rata berisi tepat <strong>20 Halaman (10 Lembar bolak-balik)</strong>.
                </p>
                <div className="p-3 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/70 space-y-1 text-[11px] text-[#4A5D46]">
                  <div>• <strong>Juz 2 sampai Juz 29:</strong> Tepat 20 Halaman per Juz (10 lembar bolak-balik).</div>
                  <div>• <strong>Juz 1:</strong> 21 Halaman (Hal. 1 s/d 21, karena Surah Al-Fatihah di halaman 1).</div>
                  <div>• <strong>Juz 30:</strong> 23 Halaman (Hal. 582 s/d 604, surah-surah pendek juz amma).</div>
                </div>
              </div>

              {/* How Daily Target is Calculated */}
              <div className="p-4 rounded-xl bg-white border border-[#C7D3C0] space-y-3">
                <h4 className="font-bold text-[#243023] text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#8FA28A]" />
                  <span>Bagaimana Target Halaman Murojaah Harian Dihitung?</span>
                </h4>
                <p className="text-[#5A6B57] leading-relaxed">
                  Pada peta murojaah Anda, 1 Juz dialokasikan selama beberapa hari agar hafalan mutqin dan tidak memberatkan. Rumusnya sangat sederhana:
                </p>
                <div className="p-3 rounded-lg bg-[#EAEFE8] border border-[#C7D3C0] text-center font-mono font-bold text-[#243023] text-xs">
                  Target Halaman per Hari = 20 Halaman ÷ Jumlah Hari Alokasi
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/70 space-y-1">
                    <span className="font-bold text-[#243023]">Alokasi 2 Hari (Juz 28, 27, 26)</span>
                    <div className="text-[#3A4B37]">20 hal ÷ 2 = <strong>10 hal/hari (~5 lembar)</strong></div>
                    <div className="text-[10px] text-[#6E7D6B]">Contoh: Hari 3 (Hal. 542–551), Hari 4 (Hal. 552–561).</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/70 space-y-1">
                    <span className="font-bold text-[#243023]">Alokasi 4 Hari (Juz 2, 3)</span>
                    <div className="text-[#3A4B37]">20 hal ÷ 4 = <strong>5 hal/hari (~2.5 lembar)</strong></div>
                    <div className="text-[10px] text-[#6E7D6B]">Sangat santai: cukup 5 halaman per hari.</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/70 space-y-1">
                    <span className="font-bold text-[#243023]">Alokasi 5 Hari (Juz 4, 5)</span>
                    <div className="text-[#3A4B37]">20 hal ÷ 5 = <strong>4 hal/hari (~2 lembar)</strong></div>
                    <div className="text-[10px] text-[#6E7D6B]">Cukup 2 lembar bolak-balik per hari.</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/70 space-y-1">
                    <span className="font-bold text-[#243023]">Alokasi 6–7 Hari (Juz 6–17)</span>
                    <div className="text-[#3A4B37]">20 hal ÷ 6/7 = <strong>~3 hal/hari (~1.5 lembar)</strong></div>
                    <div className="text-[10px] text-[#6E7D6B]">Pengulangan teliti dan mutqin.</div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/70 space-y-1 sm:col-span-2">
                    <span className="font-bold text-[#243023]">Alokasi 10 Hari (Juz 21–25)</span>
                    <div className="text-[#3A4B37]">20 hal ÷ 10 = <strong>2 hal/hari (tepat 1 lembar bolak-balik)</strong></div>
                    <div className="text-[10px] text-[#6E7D6B]">Hanya 1 lembar per hari, hafalan melekat kuat dan mutqin.</div>
                  </div>
                </div>
              </div>

              {/* Prayer Times Strategy */}
              <div className="p-4 rounded-xl bg-white border border-[#C7D3C0] space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#8FA28A]" />
                  <h4 className="font-bold text-[#243023] text-sm">
                    Tips Pembagian di 5 Waktu Shalat
                  </h4>
                </div>
                <p className="text-[#5A6B57] leading-relaxed">
                  Agar target halaman terasa sangat ringan di sela-sela mengajar halaqah:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="p-2.5 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/60">
                    <div className="font-bold text-[#243023]">Jika Target 10 Halaman:</div>
                    <div className="text-[#5A6B57] mt-0.5">2 hal ba’da Subuh, 2 hal ba’da Dzuhur, 2 hal ba’da Ashar, 2 hal ba’da Maghrib, 2 hal ba’da Isya.</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/60">
                    <div className="font-bold text-[#243023]">Jika Target 5 Halaman:</div>
                    <div className="text-[#5A6B57] mt-0.5">Cukup 1 halaman ba’da setiap shalat fardhu. Selesai tanpa beban!</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F7F4ED] border border-[#C7D3C0]/60">
                    <div className="font-bold text-[#243023]">Jika Target 2 Halaman:</div>
                    <div className="text-[#5A6B57] mt-0.5">1 lembar bolak-balik ba’da Subuh atau ba’da Maghrib. Selesai dalam 15 menit.</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE DAY BREAKDOWN */}
          {activeTab === 'hariIni' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-white border border-[#C7D3C0] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#5A6B57] font-mono">
                      Target Day {currentDaySpec.day} dari 196
                    </span>
                    <h4 className="text-base font-bold text-[#243023] mt-0.5">
                      {currentDaySpec.targetLabel}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#EAEFE8] text-[#243023] font-semibold text-xs">
                    {currentDaySpec.sheetsEstimateText}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F7F4ED] border border-[#C7D3C0] space-y-1.5">
                  <div className="text-[11px] text-[#5A6B57]">Halaman Mushaf Madinah:</div>
                  <div className="text-xl font-extrabold font-mono text-[#243023]">
                    {currentDaySpec.pageRangeText}
                  </div>
                  <div className="text-[11px] text-[#5A6B57] leading-relaxed">
                    {currentDaySpec.formulaNote}
                  </div>
                </div>

                {currentDaySpec.pagesList && currentDaySpec.pagesList.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold text-[#243023]">
                      Daftar Halaman untuk Dibuka Hari Ini:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentDaySpec.pagesList.map((pageNum) => (
                        <span
                          key={pageNum}
                          className="px-2.5 py-1 rounded-md bg-[#F7F4ED] border border-[#C7D3C0] font-mono font-semibold text-[#243023]"
                        >
                          Hal. {pageNum}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: TABLE 30 JUZ MUSHAF MADINAH */}
          {activeTab === 'tabel' && (
            <div className="space-y-3 text-xs">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#6E7D6B]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nomor Juz atau nama Surah..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#C7D3C0] rounded-xl text-xs text-[#243023] placeholder-[#8A9B85] focus:outline-none"
                />
              </div>

              <div className="bg-white rounded-xl border border-[#C7D3C0] overflow-hidden">
                <div className="grid grid-cols-12 bg-[#F7F4ED] px-3 py-2 font-bold text-[11px] text-[#3A4B37] border-b border-[#C7D3C0]">
                  <div className="col-span-2">Juz</div>
                  <div className="col-span-5">Cakupan Surah</div>
                  <div className="col-span-3">Halaman</div>
                  <div className="col-span-2 text-right">Lembar</div>
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
                        {j.startPage} – {j.endPage}
                      </div>
                      <div className="col-span-2 text-right text-[#5A6B57] text-[11px]">
                        {Math.round((j.totalPages / 2) * 10) / 10} lbr
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
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
