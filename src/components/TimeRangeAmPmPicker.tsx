import React, { useMemo } from 'react';
import { Clock } from 'lucide-react';

interface TimeRangeAmPmPickerProps {
  value: string;
  onChange: (formattedRange: string) => void;
  label?: string;
  error?: string;
}

const HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
const PERIODS = ['AM', 'PM'] as const;

export function parseAmPmFromRange(timeRange: string): {
  startHour: string;
  startMinute: string;
  startPeriod: 'AM' | 'PM';
  endHour: string;
  endMinute: string;
  endPeriod: 'AM' | 'PM';
} {
  const defaults = {
    startHour: '08',
    startMinute: '00',
    startPeriod: 'AM' as const,
    endHour: '10',
    endMinute: '30',
    endPeriod: 'AM' as const,
  };

  if (!timeRange) return defaults;

  const normalized = timeRange.replace(/[–—]/g, '-').trim();

  // Try matching 12-hour AM/PM: e.g. "08:00 AM - 10:30 AM" or "8:00 AM - 10:30 AM"
  const match12 = normalized.match(
    /(\d{1,2}):(\d{2})\s*(AM|PM)?\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/i
  );

  if (match12) {
    let sh = parseInt(match12[1], 10);
    const sm = match12[2];
    let sp = match12[3] ? (match12[3].toUpperCase() as 'AM' | 'PM') : null;

    let eh = parseInt(match12[4], 10);
    const em = match12[5];
    let ep = match12[6] ? (match12[6].toUpperCase() as 'AM' | 'PM') : null;

    // Handle 24-hour conversion if no AM/PM
    if (!sp && !ep) {
      sp = sh >= 12 ? 'PM' : 'AM';
      ep = eh >= 12 ? 'PM' : 'AM';
      if (sh > 12) sh -= 12;
      if (sh === 0) sh = 12;
      if (eh > 12) eh -= 12;
      if (eh === 0) eh = 12;
    } else if (!sp && ep) {
      sp = ep;
      if (sh > 12) {
        sh -= 12;
        sp = 'PM';
      }
    } else if (sp && !ep) {
      ep = sp;
    }

    // Snap minutes to nearest 5 or keep padded
    const padMin = (m: string) => {
      const num = parseInt(m, 10);
      if (isNaN(num)) return '00';
      return Math.min(59, Math.max(0, num)).toString().padStart(2, '0');
    };

    return {
      startHour: sh.toString().padStart(2, '0'),
      startMinute: padMin(sm),
      startPeriod: sp || 'AM',
      endHour: eh.toString().padStart(2, '0'),
      endMinute: padMin(em),
      endPeriod: ep || 'AM',
    };
  }

  return defaults;
}

export const TimeRangeAmPmPicker: React.FC<TimeRangeAmPmPickerProps> = ({
  value,
  onChange,
  label = 'Time Range (AM / PM)',
}) => {
  const parsed = useMemo(() => parseAmPmFromRange(value), [value]);

  const updateRange = (partial: Partial<ReturnType<typeof parseAmPmFromRange>>) => {
    const current = { ...parsed, ...partial };
    const formatted = `${current.startHour}:${current.startMinute} ${current.startPeriod} – ${current.endHour}:${current.endMinute} ${current.endPeriod}`;
    onChange(formatted);
  };

  const quickPresets = [
    { label: '04:15 – 04:30 AM', range: '04:15 AM – 04:30 AM' },
    { label: '04:40 – 05:15 AM (Haidh)', range: '04:40 AM – 05:15 AM' },
    { label: '05:15 – 06:30 AM', range: '05:15 AM – 06:30 AM' },
    { label: '06:30 – 08:00 AM', range: '06:30 AM – 08:00 AM' },
    { label: '08:00 – 10:30 AM (Private)', range: '08:00 AM – 10:30 AM' },
    { label: '10:30 – 11:00 AM', range: '10:30 AM – 11:00 AM' },
    { label: '11:00 AM – 12:00 PM (Nap)', range: '11:00 AM – 12:00 PM' },
    { label: '12:00 – 01:00 PM', range: '12:00 PM – 01:00 PM' },
    { label: '01:00 – 02:15 PM', range: '01:00 PM – 02:15 PM' },
    { label: '02:15 – 03:30 PM (Study)', range: '02:15 PM – 03:30 PM' },
    { label: '03:30 – 04:30 PM', range: '03:30 PM – 04:30 PM' },
    { label: '04:30 – 06:00 PM', range: '04:30 PM – 06:00 PM' },
    { label: '06:00 – 09:00 PM (Halaqah)', range: '06:00 PM – 09:00 PM' },
    { label: '09:00 – 10:00 PM', range: '09:00 PM – 10:00 PM' },
    { label: '10:00 – 10:30 PM (Sleep)', range: '10:00 PM – 10:30 PM' },
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-[#3A4B37] flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#528747]" />
          {label}
        </label>
        <span className="text-[11px] font-mono font-bold text-[#243023] bg-[#EAF5E6] border border-[#C7D3C0] px-2 py-0.5 rounded-md">
          {parsed.startHour}:{parsed.startMinute} {parsed.startPeriod} – {parsed.endHour}:{parsed.endMinute} {parsed.endPeriod}
        </span>
      </div>

      {/* Structured Selectors (No free-form text typing to prevent typing letters) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-xl bg-[#F7F4ED] border border-[#C7D3C0]">
        {/* Start Time Controls */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B57]">
            Start Time
          </span>
          <div className="flex items-center gap-1.5">
            {/* Hour */}
            <select
              value={parsed.startHour}
              onChange={(e) => updateRange({ startHour: e.target.value })}
              className="flex-1 bg-white border border-[#C7D3C0] rounded-lg px-2 py-1.5 text-xs font-mono font-semibold text-[#243023] focus:outline-none focus:border-[#528747]"
              aria-label="Start Hour"
            >
              {HOURS.map((h) => (
                <option key={`sh-${h}`} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <span className="font-bold text-[#5A6B57]">:</span>
            {/* Minute */}
            <select
              value={parsed.startMinute}
              onChange={(e) => updateRange({ startMinute: e.target.value })}
              className="flex-1 bg-white border border-[#C7D3C0] rounded-lg px-2 py-1.5 text-xs font-mono font-semibold text-[#243023] focus:outline-none focus:border-[#528747]"
              aria-label="Start Minute"
            >
              {MINUTES.map((m) => (
                <option key={`sm-${m}`} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {/* AM / PM */}
            <select
              value={parsed.startPeriod}
              onChange={(e) => updateRange({ startPeriod: e.target.value as 'AM' | 'PM' })}
              className="bg-[#EAEFE8] border border-[#C7D3C0] rounded-lg px-2 py-1.5 text-xs font-bold text-[#243023] focus:outline-none focus:border-[#528747]"
              aria-label="Start AM or PM"
            >
              {PERIODS.map((p) => (
                <option key={`sp-${p}`} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* End Time Controls */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A6B57]">
            End Time
          </span>
          <div className="flex items-center gap-1.5">
            {/* Hour */}
            <select
              value={parsed.endHour}
              onChange={(e) => updateRange({ endHour: e.target.value })}
              className="flex-1 bg-white border border-[#C7D3C0] rounded-lg px-2 py-1.5 text-xs font-mono font-semibold text-[#243023] focus:outline-none focus:border-[#528747]"
              aria-label="End Hour"
            >
              {HOURS.map((h) => (
                <option key={`eh-${h}`} value={h}>
                  {h}
                </option>
              ))}
            </select>
            <span className="font-bold text-[#5A6B57]">:</span>
            {/* Minute */}
            <select
              value={parsed.endMinute}
              onChange={(e) => updateRange({ endMinute: e.target.value })}
              className="flex-1 bg-white border border-[#C7D3C0] rounded-lg px-2 py-1.5 text-xs font-mono font-semibold text-[#243023] focus:outline-none focus:border-[#528747]"
              aria-label="End Minute"
            >
              {MINUTES.map((m) => (
                <option key={`em-${m}`} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {/* AM / PM */}
            <select
              value={parsed.endPeriod}
              onChange={(e) => updateRange({ endPeriod: e.target.value as 'AM' | 'PM' })}
              className="bg-[#EAEFE8] border border-[#C7D3C0] rounded-lg px-2 py-1.5 text-xs font-bold text-[#243023] focus:outline-none focus:border-[#528747]"
              aria-label="End AM or PM"
            >
              {PERIODS.map((p) => (
                <option key={`ep-${p}`} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Quick Presets for convenience */}
      <div className="pt-1">
        <span className="text-[10px] text-[#5A6B57] block mb-1">Quick Presets:</span>
        <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1">
          {quickPresets.map((preset) => (
            <button
              key={preset.range}
              type="button"
              onClick={() => onChange(preset.range)}
              className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-[#C7D3C0] text-[#3A4B37] hover:bg-[#EAF5E6] hover:border-[#8FA28A] transition-colors whitespace-nowrap"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
