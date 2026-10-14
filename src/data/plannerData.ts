export type DayKey = 'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat' | 'sabtu' | 'minggu';

export interface DayInfo {
  key: DayKey;
  label: string;
  arabicLabel: string;
  short: string;
  isFlexibleMorning: boolean;
  isFlexibleEvening: boolean;
  summaryNote: string;
}

export const DAYS_OF_WEEK: DayInfo[] = [
  {
    key: 'minggu',
    label: 'Sunday',
    arabicLabel: 'الأحد',
    short: 'Sun',
    isFlexibleMorning: true,
    isFlexibleEvening: false,
    summaryNote: 'Morning flexible · Tilawah & Nap · Evening Halaqah 18:00–21:00',
  },
  {
    key: 'senin',
    label: 'Monday',
    arabicLabel: 'الإثنين',
    short: 'Mon',
    isFlexibleMorning: false,
    isFlexibleEvening: false,
    summaryNote: 'Morning Halaqah · Private Teaching 08:00–10:30 · Nap 11:00 · English Grammar #1 · Evening Halaqah',
  },
  {
    key: 'selasa',
    label: 'Tuesday',
    arabicLabel: 'الثلاثاء',
    short: 'Tue',
    isFlexibleMorning: false,
    isFlexibleEvening: false,
    summaryNote: 'Morning Halaqah · Private Teaching 08:00–10:30 · Nap 11:00 · Women’s Fiqh · Evening Halaqah',
  },
  {
    key: 'rabu',
    label: 'Wednesday',
    arabicLabel: 'الأربعاء',
    short: 'Wed',
    isFlexibleMorning: false,
    isFlexibleEvening: false,
    summaryNote: 'Morning Halaqah · Private Teaching 08:00–10:30 · Nap 11:00 · IELTS Practice #2 · Evening Halaqah',
  },
  {
    key: 'kamis',
    label: 'Thursday',
    arabicLabel: 'الخميس',
    short: 'Thu',
    isFlexibleMorning: false,
    isFlexibleEvening: false,
    summaryNote: 'Morning Halaqah · Private Teaching 08:00–10:30 · Nap 11:00 · S2 Research · Evening Halaqah',
  },
  {
    key: 'jumat',
    label: 'Friday',
    arabicLabel: 'الجمعة',
    short: 'Fri',
    isFlexibleMorning: false,
    isFlexibleEvening: false,
    summaryNote: 'Morning Halaqah · Surah Al-Kahfi · Nap 11:00 · English Prep #3 · Evening Halaqah',
  },
  {
    key: 'sabtu',
    label: 'Saturday',
    arabicLabel: 'السبت',
    short: 'Sat',
    isFlexibleMorning: false,
    isFlexibleEvening: true,
    summaryNote: 'Morning Halaqah · Weekend Study & Nap · Evening family time (No evening halaqah)',
  },
];

export interface ScheduleSlot {
  id: string;
  timeRange: string;
  title: string;
  subtitle: string;
  arabicTitle?: string;
  category: 'ibadah' | 'halaqah' | 'aktivitas' | 'belajar' | 'istirahat' | 'fleksibel';
  isFixedHalaqah?: boolean;
}

export function parseSlotTimeRange(timeRange: string): { startMins: number; endMins: number } | null {
  if (!timeRange) return null;
  const normalized = timeRange.replace(/[–—]/g, '-').trim();

  // 12-hour AM/PM format support: e.g. "08:00 AM - 10:30 AM" or "8:00am - 10:30pm"
  const ampmRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)?\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)?/i;
  const match = normalized.match(ampmRegex);
  if (!match) return null;

  const startH = parseInt(match[1], 10);
  const startM = parseInt(match[2], 10);
  let startPeriod = match[3] ? (match[3].toUpperCase() as 'AM' | 'PM') : null;

  const endH = parseInt(match[4], 10);
  const endM = parseInt(match[5], 10);
  let endPeriod = match[6] ? (match[6].toUpperCase() as 'AM' | 'PM') : null;

  if (!startPeriod && endPeriod) {
    if (endPeriod === 'PM') {
      startPeriod = (startH >= 12 || startH < endH) ? 'PM' : 'AM';
    } else {
      startPeriod = 'AM';
    }
  }

  const toMins = (h: number, m: number, period: 'AM' | 'PM' | null): number => {
    if (period === 'AM') {
      return (h === 12 ? 0 : h) * 60 + m;
    } else if (period === 'PM') {
      return (h === 12 ? 12 : h + 12) * 60 + m;
    }
    return h * 60 + m;
  };

  const startMins = toMins(startH, startM, startPeriod);
  let endMins = toMins(endH, endM, endPeriod);

  if (endMins < startMins) {
    endMins += 24 * 60;
  }
  return { startMins, endMins };
}

export function formatTimeRangeToAmPm(timeRange: string): string {
  if (!timeRange) return '';
  const parsed = parseSlotTimeRange(timeRange);
  if (!parsed) return timeRange;

  const minsToAmPm = (mins: number) => {
    const normalized = mins % (24 * 60);
    const h24 = Math.floor(normalized / 60);
    const m = normalized % 60;
    const period = h24 >= 12 ? 'PM' : 'AM';
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12;
    const hStr = h12.toString().padStart(2, '0');
    const mStr = m.toString().padStart(2, '0');
    return `${hStr}:${mStr} ${period}`;
  };

  return `${minsToAmPm(parsed.startMins)} – ${minsToAmPm(parsed.endMins)}`;
}

export function getDailyScheduleForDay(day: DayKey): ScheduleSlot[] {
  const isSabtu = day === 'sabtu';
  const isMinggu = day === 'minggu';
  const isJumat = day === 'jumat';
  const isMonToThu = ['senin', 'selasa', 'rabu', 'kamis'].includes(day);

  const slots: ScheduleSlot[] = [
    {
      id: `${day}-1`,
      timeRange: '04:15 AM – 04:30 AM',
      title: 'Wake Up & Tahajjud',
      arabicTitle: 'الاستيقاظ والتهجد',
      subtitle: 'Tahajjud prayer, Witr & pre-dawn istighfar (Wake up 04:40 AM during Haidh)',
      category: 'ibadah',
    },
    {
      id: `${day}-2`,
      timeRange: '04:30 AM – 04:55 AM',
      title: 'Fajr Prayer & Dzikr',
      arabicTitle: 'سنة الفجر وأذكار الصباح',
      subtitle: '2 rak’ahs sunnah before Fajr, on-time Fajr & authentic morning dzikr',
      category: 'ibadah',
    },
  ];

  // Morning Halaqah or Sunday Flexible
  if (isMinggu) {
    slots.push(
      {
        id: `${day}-3`,
        timeRange: '05:15 AM – 06:30 AM',
        title: 'Flexible Morning',
        arabicTitle: 'صباح مرن ومريح',
        subtitle: 'Self-paced morning reading or quiet reflection (No morning halaqah)',
        category: 'fleksibel',
      },
      {
        id: `${day}-4`,
        timeRange: '06:30 AM – 08:00 AM',
        title: 'Prep, Shower & Dhuha',
        arabicTitle: 'صلاة الضحى والفطور',
        subtitle: 'Shower, Dhuha prayer, relaxed family breakfast & weekend rest',
        category: 'ibadah',
      },
      {
        id: `${day}-5`,
        timeRange: '08:00 AM – 10:30 AM',
        title: 'Family Time & Rest',
        arabicTitle: 'وقت عائلي هادئ',
        subtitle: 'Quality time with family, quiet reading or resting at home',
        category: 'fleksibel',
      }
    );
  } else {
    // Mon - Sat morning halaqah
    slots.push(
      {
        id: `${day}-3`,
        timeRange: '04:55 AM – 05:15 AM',
        title: 'Halaqah Prep',
        arabicTitle: 'الاستعداد لحلقة القرآن',
        subtitle: 'Review student notes, recitation materials & brief murojaah',
        category: 'halaqah',
      },
      {
        id: `${day}-4`,
        timeRange: '05:15 AM – 06:30 AM',
        title: 'Teaching Quran Halaqah',
        arabicTitle: 'تعليم حلقة القرآن (الصباح)',
        subtitle: 'Morning Quran halaqah session with students (Fixed Schedule)',
        category: 'halaqah',
        isFixedHalaqah: true,
      },
      {
        id: `${day}-5`,
        timeRange: '06:30 AM – 08:00 AM',
        title: 'Prep, Shower & Dhuha',
        arabicTitle: 'الاستعداد، الاغتسال والضحى',
        subtitle: 'Arrive home, freshen up, shower, Dhuha prayer & prep for private teaching',
        category: 'ibadah',
      }
    );

    // Private Teaching: ONLY Monday - Thursday (08:00 AM – 10:30 AM)
    if (isMonToThu) {
      slots.push({
        id: `${day}-6`,
        timeRange: '08:00 AM – 10:30 AM',
        title: 'Private Teaching',
        arabicTitle: 'تعليم القرآن الخاص',
        subtitle: 'Private teaching session (12–15 min travel to location)',
        category: 'halaqah',
      });
    } else if (isJumat) {
      slots.push({
        id: `${day}-6`,
        timeRange: '08:00 AM – 10:30 AM',
        title: 'Surah Al-Kahfi & Sunnah',
        arabicTitle: 'سورة الكهف وسنن الجمعة',
        subtitle: 'Recite Surah Al-Kahfi, salawat & Friday morning reflection',
        category: 'ibadah',
      });
    } else if (isSabtu) {
      slots.push({
        id: `${day}-6`,
        timeRange: '08:00 AM – 10:30 AM',
        title: 'Weekend Study & Family',
        arabicTitle: 'دراسة مرنة ووقت الأسرة',
        subtitle: 'Flexible morning study, Islamic parenting podcast & family time',
        category: 'fleksibel',
      });
    }
  }

  // Midday Clean Up & Sunnah Nap until Dhuhr (All days)
  slots.push(
    {
      id: `${day}-nap-prep`,
      timeRange: '10:30 AM – 11:00 AM',
      title: 'Clean Up & Refresh',
      arabicTitle: 'ترتيب واسترخاء',
      subtitle: 'Tidy up, clean up and unwind after teaching session',
      category: 'istirahat',
    },
    {
      id: `${day}-nap`,
      timeRange: '11:00 AM – 12:00 PM',
      title: 'Midday Nap (Qailulah)',
      arabicTitle: 'قيلولة قبل الظهر',
      subtitle: 'Sunnah restorative nap before Dhuhr for afternoon vitality',
      category: 'istirahat',
    },
    {
      id: `${day}-7`,
      timeRange: '12:00 PM – 01:00 PM',
      title: 'Dhuhr Prayer & Lunch',
      arabicTitle: 'صلاة الظهر والغداء',
      subtitle: 'On-time Dhuhr prayer with Qabliyah & Ba’diyah rawatib, followed by lunch',
      category: 'ibadah',
    }
  );

  // Afternoon Plot (01:00 PM – 06:00 PM): Tilawah, Murojaah, Focused Study & Asr
  slots.push(
    {
      id: `${day}-8`,
      timeRange: '01:00 PM – 02:15 PM',
      title: 'Daily Tilawah & Murojaah',
      arabicTitle: 'تلاوة جزء ومراجعة القرآن',
      subtitle: 'Reciting 1 Juz daily and structured review on 196-Day Murojaah roadmap',
      category: 'ibadah',
    },
    {
      id: `${day}-9`,
      timeRange: '02:15 PM – 03:30 PM',
      title: 'Focused Study & Prep',
      arabicTitle: 'جلسة التعلم والتحضير',
      subtitle:
        day === 'senin'
          ? 'Master’s Academic English (Grammar Foundation #1)'
          : day === 'selasa'
          ? 'Women’s Fiqh Study (Fiqh An-Nisa notes)'
          : day === 'rabu'
          ? 'Master’s English Prep (IELTS Practice #2)'
          : day === 'kamis'
          ? 'Master’s (S2) & Scholarship Opportunity Research'
          : isJumat
          ? 'Academic English Review & Synthesis #3'
          : isSabtu
          ? 'Islamic Parenting & Pre-marital Family Study'
          : 'Self-Paced Learning & Book Reading',
      category: 'belajar',
    },
    {
      id: `${day}-10`,
      timeRange: '03:30 PM – 04:30 PM',
      title: 'Asr Prayer & Evening Dzikr',
      arabicTitle: 'صلاة العصر وأذكار المساء',
      subtitle: 'On-time Asr prayer & authentic evening dzikr',
      category: 'ibadah',
    },
    {
      id: `${day}-11`,
      timeRange: '04:30 PM – 06:00 PM',
      title: 'Rest & Halaqah Prep',
      arabicTitle: 'استراحة والاستعداد للمساء',
      subtitle: 'Afternoon tea/snack, reviewing student notes & halaqah readiness',
      category: 'fleksibel',
    }
  );

  // Evening Block (06:00 PM – 09:00 PM)
  if (isSabtu) {
    slots.push(
      {
        id: `${day}-12`,
        timeRange: '05:30 PM – 06:30 PM',
        title: 'Maghrib Prayer & Dzikr',
        arabicTitle: 'صلاة المغرب وأذكار المساء',
        subtitle: 'On-time Maghrib prayer with Ba’diyah rawatib',
        category: 'ibadah',
      },
      {
        id: `${day}-13`,
        timeRange: '06:30 PM – 09:00 PM',
        title: 'Family Time & Reading',
        arabicTitle: 'وقت هادئ مع الأهل',
        subtitle: 'Peaceful Saturday evening with parents & light reading (No evening halaqah)',
        category: 'fleksibel',
      }
    );
  } else {
    // Weekdays & Sunday Evening Halaqah
    slots.push({
      id: `${day}-13`,
      timeRange: '06:00 PM – 09:00 PM',
      title: 'Teaching Quran Halaqah',
      arabicTitle: 'تعليم حلقة القرآن (المساء)',
      subtitle: 'Evening halaqah session, Maghrib & Isha prayers with rawatib (Fixed Schedule)',
      category: 'halaqah',
      isFixedHalaqah: true,
    });
  }

  // Closing Night Routine (All days)
  slots.push(
    {
      id: `${day}-night-1`,
      timeRange: '09:00 PM – 10:00 PM',
      title: 'Night Muhasabah & Prep',
      arabicTitle: 'محاسبة النفس والاستعداد',
      subtitle: 'Review mutabaah checklist, closing istighfar, wudhu & sunnah sleep dzikr',
      category: 'ibadah',
    },
    {
      id: `${day}-night-2`,
      timeRange: '10:00 PM – 10:30 PM',
      title: 'Bedtime Sleep',
      arabicTitle: 'النوم المبكر',
      subtitle: 'Sleep early so you wake up refreshed at 04:15 AM (or 04:40 AM during Haidh)',
      category: 'istirahat',
    }
  );

  return slots;
}

export interface MutabaahItem {
  id: string;
  title: string;
  arabicTitle: string;
  targetText: string;
  timeHint: string;
  group: 'Prayers & Qiyam' | 'Quran' | 'Dzikr & Deeds' | 'Wellness & Habits';
  isExemptDuringHaidh?: boolean;
}

export const MUTABAAH_ITEMS: MutabaahItem[] = [
  {
    id: 'tahajud',
    title: 'Tahajjud & Witr',
    arabicTitle: 'صلاة التهجد والوتر',
    targetText: 'Wake up 04:15 – 04:30',
    timeHint: 'Last third of night',
    group: 'Prayers & Qiyam',
    isExemptDuringHaidh: true,
  },
  {
    id: 'shalat_fajar',
    title: 'Fajr Sunnah Prayer',
    arabicTitle: 'سنة الفجر (ركعتان)',
    targetText: '2 Rak’ahs before Fajr',
    timeHint: 'Before Fajr',
    group: 'Prayers & Qiyam',
    isExemptDuringHaidh: true,
  },
  {
    id: 'shalat_wajib',
    title: '5 Daily Fardh Prayers',
    arabicTitle: 'الصلوات الخمس المفروضة',
    targetText: 'On time at start of prayer window',
    timeHint: 'Throughout the day',
    group: 'Prayers & Qiyam',
    isExemptDuringHaidh: true,
  },
  {
    id: 'rawatib_qabla_zuhur',
    title: 'Rawatib Qabliyah Dhuhr',
    arabicTitle: 'سنة قبل الظهر (٢-٤ ركعات)',
    targetText: '2 – 4 Rak’ahs before Dhuhr',
    timeHint: 'Before Dhuhr',
    group: 'Prayers & Qiyam',
    isExemptDuringHaidh: true,
  },
  {
    id: 'rawatib_bada_zuhur',
    title: 'Rawatib Ba’diyah Dhuhr',
    arabicTitle: 'سنة بعد الظهر (ركعتان)',
    targetText: '2 Rak’ahs after Dhuhr',
    timeHint: 'After Dhuhr',
    group: 'Prayers & Qiyam',
    isExemptDuringHaidh: true,
  },
  {
    id: 'rawatib_bada_maghrib',
    title: 'Rawatib Ba’diyah Maghrib',
    arabicTitle: 'سنة بعد المغرب (ركعتان)',
    targetText: '2 Rak’ahs after Maghrib',
    timeHint: 'After Maghrib',
    group: 'Prayers & Qiyam',
    isExemptDuringHaidh: true,
  },
  {
    id: 'rawatib_bada_isya',
    title: 'Rawatib Ba’diyah Isha',
    arabicTitle: 'سنة بعد العشاء (ركعتان)',
    targetText: '2 Rak’ahs after Isha',
    timeHint: 'After Isha',
    group: 'Prayers & Qiyam',
    isExemptDuringHaidh: true,
  },
  {
    id: 'shalat_dhuha',
    title: 'Dhuha Prayer',
    arabicTitle: 'صلاة الضحى',
    targetText: 'At least 2 – 4 Rak’ahs',
    timeHint: '07:00 – 08:00',
    group: 'Prayers & Qiyam',
    isExemptDuringHaidh: true,
  },
  {
    id: 'mengaji_1_juz',
    title: 'Daily Tilawah (1 Juz+)',
    arabicTitle: 'تلاوة جزء من القرآن',
    targetText: 'Target min 1 Juz (>= 20 pages)',
    timeHint: '08:00 AM – 09:00 AM',
    group: 'Quran',
    isExemptDuringHaidh: true,
  },
  {
    id: 'puasa',
    title: 'Sunnah Fasting',
    arabicTitle: 'صيام التطوع',
    targetText: 'Mon & Thu / Ayyamul Bidh',
    timeHint: 'Fajr – Maghrib',
    group: 'Prayers & Qiyam',
    isExemptDuringHaidh: true,
  },
  {
    id: 'murojaah',
    title: 'Quran Murojaah',
    arabicTitle: 'مراجعة القرآن الكريم',
    targetText: 'According to 196-Day Roadmap',
    timeHint: '09:00 AM – 10:00 AM',
    group: 'Quran',
    isExemptDuringHaidh: false,
  },
  {
    id: 'dzikir_pagi',
    title: 'Morning Dzikr',
    arabicTitle: 'أذكار الصباح',
    targetText: 'After Fajr or during morning routine',
    timeHint: '04:45 AM – 05:15 AM',
    group: 'Dzikr & Deeds',
    isExemptDuringHaidh: false,
  },
  {
    id: 'dzikir_petang',
    title: 'Evening Dzikr',
    arabicTitle: 'أذكار المساء',
    targetText: 'After Asr prayer',
    timeHint: '03:30 PM – 04:00 PM',
    group: 'Dzikr & Deeds',
    isExemptDuringHaidh: false,
  },
  {
    id: 'istighfar',
    title: 'Daily Istighfar',
    arabicTitle: 'الاستغفار اليومي (١٠٠ مرة)',
    targetText: 'At least 100x a day',
    timeHint: 'Throughout the day',
    group: 'Dzikr & Deeds',
    isExemptDuringHaidh: false,
  },
  {
    id: 'infaq',
    title: 'Daily Charity & Infaq',
    arabicTitle: 'الصدقة والإنفاق',
    targetText: 'Consistent daily giving',
    timeHint: 'Morning time',
    group: 'Dzikr & Deeds',
    isExemptDuringHaidh: false,
  },
  {
    id: 'olahraga',
    title: 'Workout & Stretching',
    arabicTitle: 'الرياضة والحركة',
    targetText: '15–30 mins walk/stretching',
    timeHint: '06:50 AM – 07:20 AM',
    group: 'Wellness & Habits',
    isExemptDuringHaidh: false,
  },
  {
    id: 'muhasabah',
    title: 'Bedtime Muhasabah',
    arabicTitle: 'محاسبة النفس والشكر',
    targetText: 'Self-reflection & forgiving others',
    timeHint: '09:30 PM – 10:00 PM',
    group: 'Wellness & Habits',
    isExemptDuringHaidh: false,
  },
];

// ============================================================================
// MUROJAAH 196 DAYS - 6 PHASES MASTER CURRICULUM
// ============================================================================

export interface MurojaahBlockSpec {
  startDay: number;
  endDay: number;
  targetLabel: string;
  isCombinedReview?: boolean;
}

export interface MurojaahPhaseSpec {
  phaseNumber: number;
  title: string;
  juzFocus: string;
  dayRangeLabel: string;
  startDay: number;
  endDay: number;
  blocks: MurojaahBlockSpec[];
}

export const MUROJAAH_PHASES: MurojaahPhaseSpec[] = [
  {
    phaseNumber: 1,
    title: 'Phase 1: Juz 26 – 30',
    juzFocus: 'Juz 26 – 30',
    dayRangeLabel: 'Day 1 – 9',
    startDay: 1,
    endDay: 9,
    blocks: [
      { startDay: 1, endDay: 1, targetLabel: 'Juz 30' },
      { startDay: 2, endDay: 2, targetLabel: 'Juz 29' },
      { startDay: 3, endDay: 4, targetLabel: 'Juz 28' },
      { startDay: 5, endDay: 6, targetLabel: 'Juz 27' },
      { startDay: 7, endDay: 8, targetLabel: 'Juz 26' },
      { startDay: 9, endDay: 9, targetLabel: 'Combined Review Juz 26 – 30', isCombinedReview: true },
    ],
  },
  {
    phaseNumber: 2,
    title: 'Phase 2: Juz 1 – 5',
    juzFocus: 'Juz 1 – 5',
    dayRangeLabel: 'Day 10 – 30',
    startDay: 10,
    endDay: 30,
    blocks: [
      { startDay: 10, endDay: 10, targetLabel: 'Juz 1' },
      { startDay: 11, endDay: 14, targetLabel: 'Juz 2' },
      { startDay: 15, endDay: 18, targetLabel: 'Juz 3' },
      { startDay: 19, endDay: 23, targetLabel: 'Juz 4' },
      { startDay: 24, endDay: 28, targetLabel: 'Juz 5' },
      { startDay: 29, endDay: 29, targetLabel: 'Combined Review Juz 1 – 5', isCombinedReview: true },
      { startDay: 30, endDay: 30, targetLabel: 'Combined Review 10 Juz (Juz 26–30 & 1–5)', isCombinedReview: true },
    ],
  },
  {
    phaseNumber: 3,
    title: 'Phase 3: Juz 6 – 10',
    juzFocus: 'Juz 6 – 10',
    dayRangeLabel: 'Day 31 – 63',
    startDay: 31,
    endDay: 63,
    blocks: [
      { startDay: 31, endDay: 36, targetLabel: 'Juz 6' },
      { startDay: 37, endDay: 42, targetLabel: 'Juz 7' },
      { startDay: 43, endDay: 48, targetLabel: 'Juz 8' },
      { startDay: 49, endDay: 54, targetLabel: 'Juz 9' },
      { startDay: 55, endDay: 60, targetLabel: 'Juz 10' },
      { startDay: 61, endDay: 62, targetLabel: 'Combined Review Juz 6 – 10', isCombinedReview: true },
      { startDay: 63, endDay: 63, targetLabel: 'Combined Review Juz 26–30 & 1–5', isCombinedReview: true },
    ],
  },
  {
    phaseNumber: 4,
    title: 'Phase 4: Juz 11 – 15',
    juzFocus: 'Juz 11 – 15',
    dayRangeLabel: 'Day 64 – 99',
    startDay: 64,
    endDay: 99,
    blocks: [
      { startDay: 64, endDay: 70, targetLabel: 'Juz 11' },
      { startDay: 71, endDay: 77, targetLabel: 'Juz 12' },
      { startDay: 78, endDay: 84, targetLabel: 'Juz 13' },
      { startDay: 85, endDay: 91, targetLabel: 'Juz 14' },
      { startDay: 92, endDay: 95, targetLabel: 'Juz 15' },
      { startDay: 96, endDay: 97, targetLabel: 'Combined Review Juz 11 – 15', isCombinedReview: true },
      { startDay: 98, endDay: 98, targetLabel: 'Combined Review Juz 6 – 15', isCombinedReview: true },
      { startDay: 99, endDay: 99, targetLabel: 'Combined Review Juz 26–30 & 1–5', isCombinedReview: true },
    ],
  },
  {
    phaseNumber: 5,
    title: 'Phase 5: Juz 16 – 20',
    juzFocus: 'Juz 16 – 20',
    dayRangeLabel: 'Day 100 – 141',
    startDay: 100,
    endDay: 141,
    blocks: [
      { startDay: 100, endDay: 106, targetLabel: 'Juz 16' },
      { startDay: 107, endDay: 113, targetLabel: 'Juz 17' },
      { startDay: 114, endDay: 121, targetLabel: 'Juz 18' },
      { startDay: 122, endDay: 129, targetLabel: 'Juz 19' },
      { startDay: 130, endDay: 137, targetLabel: 'Juz 20' },
      { startDay: 138, endDay: 139, targetLabel: 'Combined Review Juz 16 – 20', isCombinedReview: true },
      { startDay: 140, endDay: 140, targetLabel: 'Combined Review Juz 6 – 15', isCombinedReview: true },
      { startDay: 141, endDay: 141, targetLabel: 'Combined Review Juz 26–30 & 1–5', isCombinedReview: true },
    ],
  },
  {
    phaseNumber: 6,
    title: 'Phase 6: Juz 21 – 25',
    juzFocus: 'Juz 21 – 25',
    dayRangeLabel: 'Day 142 – 196',
    startDay: 142,
    endDay: 196,
    blocks: [
      { startDay: 142, endDay: 151, targetLabel: 'Juz 21' },
      { startDay: 152, endDay: 161, targetLabel: 'Juz 22' },
      { startDay: 162, endDay: 171, targetLabel: 'Juz 23' },
      { startDay: 172, endDay: 181, targetLabel: 'Juz 24' },
      { startDay: 182, endDay: 191, targetLabel: 'Juz 25' },
      { startDay: 192, endDay: 193, targetLabel: 'Combined Review Juz 21 – 25', isCombinedReview: true },
      { startDay: 194, endDay: 194, targetLabel: 'Grand Review Juz 1 – 10', isCombinedReview: true },
      { startDay: 195, endDay: 195, targetLabel: 'Grand Review Juz 11 – 20', isCombinedReview: true },
      { startDay: 196, endDay: 196, targetLabel: 'Grand Review Juz 21 – 30', isCombinedReview: true },
    ],
  },
];

export interface DailyTilawahRecord {
  juz: number;
  startPage: number;
  endPage: number;
  totalPages: number;
}

export interface JuzPageSpec {
  juz: number;
  startPage: number;
  endPage: number;
  totalPages: number;
  surahSummary: string;
}

export const JUZ_PAGE_MAP: Record<number, JuzPageSpec> = {
  1: { juz: 1, startPage: 1, endPage: 21, totalPages: 21, surahSummary: 'Al-Fatihah 1 – Al-Baqarah 141' },
  2: { juz: 2, startPage: 22, endPage: 41, totalPages: 20, surahSummary: 'Al-Baqarah 142 – 252' },
  3: { juz: 3, startPage: 42, endPage: 61, totalPages: 20, surahSummary: 'Al-Baqarah 253 – Ali ‘Imran 92' },
  4: { juz: 4, startPage: 62, endPage: 81, totalPages: 20, surahSummary: 'Ali ‘Imran 93 – An-Nisa 23' },
  5: { juz: 5, startPage: 82, endPage: 101, totalPages: 20, surahSummary: 'An-Nisa 24 – 147' },
  6: { juz: 6, startPage: 102, endPage: 121, totalPages: 20, surahSummary: 'An-Nisa 148 – Al-Ma’idah 81' },
  7: { juz: 7, startPage: 122, endPage: 141, totalPages: 20, surahSummary: 'Al-Ma’idah 82 – Al-An’am 110' },
  8: { juz: 8, startPage: 142, endPage: 161, totalPages: 20, surahSummary: 'Al-An’am 111 – Al-A’raf 87' },
  9: { juz: 9, startPage: 162, endPage: 181, totalPages: 20, surahSummary: 'Al-A’raf 88 – Al-Anfal 40' },
  10: { juz: 10, startPage: 182, endPage: 201, totalPages: 20, surahSummary: 'Al-Anfal 41 – At-Tawbah 92' },
  11: { juz: 11, startPage: 202, endPage: 221, totalPages: 20, surahSummary: 'At-Tawbah 93 – Hud 5' },
  12: { juz: 12, startPage: 222, endPage: 241, totalPages: 20, surahSummary: 'Hud 6 – Yusuf 52' },
  13: { juz: 13, startPage: 242, endPage: 261, totalPages: 20, surahSummary: 'Yusuf 53 – Ibrahim 52' },
  14: { juz: 14, startPage: 262, endPage: 281, totalPages: 20, surahSummary: 'Al-Hijr 1 – An-Nahl 128' },
  15: { juz: 15, startPage: 282, endPage: 301, totalPages: 20, surahSummary: 'Al-Isra 1 – Al-Kahf 74' },
  16: { juz: 16, startPage: 302, endPage: 321, totalPages: 20, surahSummary: 'Al-Kahf 75 – Ta-Ha 135' },
  17: { juz: 17, startPage: 322, endPage: 341, totalPages: 20, surahSummary: 'Al-Anbiya 1 – Al-Hajj 78' },
  18: { juz: 18, startPage: 342, endPage: 361, totalPages: 20, surahSummary: 'Al-Mu’minun 1 – Al-Furqan 20' },
  19: { juz: 19, startPage: 362, endPage: 381, totalPages: 20, surahSummary: 'Al-Furqan 21 – An-Naml 55' },
  20: { juz: 20, startPage: 382, endPage: 401, totalPages: 20, surahSummary: 'An-Naml 56 – Al-‘Ankabut 45' },
  21: { juz: 21, startPage: 402, endPage: 421, totalPages: 20, surahSummary: 'Al-‘Ankabut 46 – Al-Ahzab 30' },
  22: { juz: 22, startPage: 422, endPage: 441, totalPages: 20, surahSummary: 'Al-Ahzab 31 – Ya-Sin 27' },
  23: { juz: 23, startPage: 442, endPage: 461, totalPages: 20, surahSummary: 'Ya-Sin 28 – Az-Zumar 31' },
  24: { juz: 24, startPage: 462, endPage: 481, totalPages: 20, surahSummary: 'Az-Zumar 32 – Fussilat 46' },
  25: { juz: 25, startPage: 482, endPage: 501, totalPages: 20, surahSummary: 'Fussilat 47 – Al-Jathiyah 37' },
  26: { juz: 26, startPage: 502, endPage: 521, totalPages: 20, surahSummary: 'Al-Ahqaf 1 – Az-Zariyat 30' },
  27: { juz: 27, startPage: 522, endPage: 541, totalPages: 20, surahSummary: 'Az-Zariyat 31 – Al-Hadid 29' },
  28: { juz: 28, startPage: 542, endPage: 561, totalPages: 20, surahSummary: 'Al-Mujadilah 1 – At-Tahrim 12' },
  29: { juz: 29, startPage: 562, endPage: 581, totalPages: 20, surahSummary: 'Al-Mulk 1 – Al-Mursalat 50' },
  30: { juz: 30, startPage: 582, endPage: 604, totalPages: 23, surahSummary: 'An-Naba 1 – An-Nas 6' },
};

export interface MurojaahDayEntry {
  day: number;
  phaseNumber: number;
  phaseTitle: string;
  targetLabel: string;
  blockRangeText: string;
  dayInBlock: number;
  totalDaysInBlock: number;
  isCombinedReview: boolean;
  juzNumber: number | null;
  startPageToday: number;
  endPageToday: number;
  pageRangeText: string;
  pagesCountToday: number;
  sheetsEstimateText: string;
  pagesList: number[];
  formulaNote: string;
}

export function buildAll196MurojaahDays(): MurojaahDayEntry[] {
  const result: MurojaahDayEntry[] = [];
  for (const phase of MUROJAAH_PHASES) {
    for (const block of phase.blocks) {
      const totalDaysInBlock = block.endDay - block.startDay + 1;
      const blockRangeText =
        block.startDay === block.endDay
          ? `Day ${block.startDay}`
          : `Day ${block.startDay} – ${block.endDay}`;

      // Check if this block targets a single Juz, e.g. "Juz 28", "Juz 4"
      const matchJuz = block.targetLabel.match(/Juz\s+(\d+)/i);
      const isSingleJuz = !block.isCombinedReview && matchJuz && matchJuz[1];
      const juzNum = isSingleJuz ? parseInt(matchJuz[1], 10) : null;
      const juzSpec = juzNum ? JUZ_PAGE_MAP[juzNum] : null;

      for (let d = block.startDay; d <= block.endDay; d++) {
        const dayInBlock = d - block.startDay + 1;
        const dayIdx = dayInBlock - 1;

        let startPageToday = 0;
        let endPageToday = 0;
        let pagesCountToday = 0;
        let pageRangeText = '';
        let sheetsEstimateText = '';
        let formulaNote = '';
        const pagesList: number[] = [];

        if (juzSpec) {
          const totalPages = juzSpec.totalPages;
          const basePagesPerDay = Math.floor(totalPages / totalDaysInBlock);
          const remainder = totalPages % totalDaysInBlock;

          // Days before remainder get +1 page to evenly distribute
          pagesCountToday = basePagesPerDay + (dayIdx < remainder ? 1 : 0);
          startPageToday =
            juzSpec.startPage +
            dayIdx * basePagesPerDay +
            Math.min(dayIdx, remainder);
          endPageToday = startPageToday + pagesCountToday - 1;

          pageRangeText =
            startPageToday === endPageToday
              ? `p. ${startPageToday}`
              : `p. ${startPageToday} – ${endPageToday}`;

          const sheets = Math.round((pagesCountToday / 2) * 10) / 10;
          sheetsEstimateText = `~${sheets} Sheets (${pagesCountToday} Pages)`;
          formulaNote =
            totalDaysInBlock > 1
              ? `Juz ${juzNum} (${totalPages} pages) divided across ${totalDaysInBlock} days = ${pagesCountToday} pages/day`
              : `Juz ${juzNum} completed in 1 day (${totalPages} pages)`;

          for (let p = startPageToday; p <= endPageToday; p++) {
            pagesList.push(p);
          }
        } else {
          // Combined review blocks
          if (block.targetLabel.includes('26 – 30') || block.targetLabel.includes('26-30')) {
            startPageToday = 502;
            endPageToday = 604;
            pageRangeText = 'p. 502 – 604 (Juz 26–30)';
            pagesCountToday = 103;
            sheetsEstimateText = '~51.5 Sheets (5 Juz Review)';
            formulaNote = 'Combined review of 5 Juz per hizb / rubu’';
          } else if (block.targetLabel.includes('1 – 5')) {
            startPageToday = 1;
            endPageToday = 101;
            pageRangeText = 'p. 1 – 101 (Juz 1–5)';
            pagesCountToday = 101;
            sheetsEstimateText = '~50.5 Sheets (5 Juz Review)';
            formulaNote = 'Combined review of Juz 1 through 5';
          } else if (block.targetLabel.includes('6 – 10')) {
            startPageToday = 102;
            endPageToday = 201;
            pageRangeText = 'p. 102 – 201 (Juz 6–10)';
            pagesCountToday = 100;
            sheetsEstimateText = '~50 Sheets (5 Juz Review)';
            formulaNote = 'Combined review of Juz 6 through 10';
          } else if (block.targetLabel.includes('11 – 15')) {
            startPageToday = 202;
            endPageToday = 301;
            pageRangeText = 'p. 202 – 301 (Juz 11–15)';
            pagesCountToday = 100;
            sheetsEstimateText = '~50 Sheets (5 Juz Review)';
            formulaNote = 'Combined review of Juz 11 through 15';
          } else if (block.targetLabel.includes('16 – 20')) {
            startPageToday = 302;
            endPageToday = 401;
            pageRangeText = 'p. 302 – 401 (Juz 16–20)';
            pagesCountToday = 100;
            sheetsEstimateText = '~50 Sheets (5 Juz Review)';
            formulaNote = 'Combined review of Juz 16 through 20';
          } else if (block.targetLabel.includes('21 – 25')) {
            startPageToday = 402;
            endPageToday = 501;
            pageRangeText = 'p. 402 – 501 (Juz 21–25)';
            pagesCountToday = 100;
            sheetsEstimateText = '~50 Sheets (5 Juz Review)';
            formulaNote = 'Combined review of Juz 21 through 25';
          } else if (block.targetLabel.includes('1 – 10')) {
            startPageToday = 1;
            endPageToday = 201;
            pageRangeText = 'p. 1 – 201 (Juz 1–10)';
            pagesCountToday = 201;
            sheetsEstimateText = '~100 Sheets (10 Juz Review)';
            formulaNote = 'Grand Review of the first 10 Juz';
          } else if (block.targetLabel.includes('11 – 20')) {
            startPageToday = 202;
            endPageToday = 401;
            pageRangeText = 'p. 202 – 401 (Juz 11–20)';
            pagesCountToday = 200;
            sheetsEstimateText = '~100 Sheets (10 Juz Review)';
            formulaNote = 'Grand Review of middle 10 Juz';
          } else if (block.targetLabel.includes('21 – 30')) {
            startPageToday = 402;
            endPageToday = 604;
            pageRangeText = 'p. 402 – 604 (Juz 21–30)';
            pagesCountToday = 203;
            sheetsEstimateText = '~101.5 Sheets (Final 10 Juz Review)';
            formulaNote = 'Grand Review of final 10 Juz (30 Juz Mutqin Completion)';
          } else {
            startPageToday = 1;
            endPageToday = 604;
            pageRangeText = 'Guided Murojaah';
            pagesCountToday = 20;
            sheetsEstimateText = '~10 Sheets';
            formulaNote = 'Combined recitation review';
          }
        }

        result.push({
          day: d,
          phaseNumber: phase.phaseNumber,
          phaseTitle: phase.title,
          targetLabel: block.targetLabel,
          blockRangeText,
          dayInBlock,
          totalDaysInBlock,
          isCombinedReview: Boolean(block.isCombinedReview),
          juzNumber: juzNum,
          startPageToday,
          endPageToday,
          pageRangeText,
          pagesCountToday,
          sheetsEstimateText,
          pagesList,
          formulaNote,
        });
      }
    }
  }
  return result;
}

export const ALL_196_MUROJAAH_DAYS = buildAll196MurojaahDays();

// ============================================================================
// WEEKLY, MONTHLY & YEARLY PLANNING CURRICULUM
// ============================================================================

export interface WeeklyTargetItem {
  id: string;
  title: string;
  category: 'Family & Marriage' | 'Shariah' | 'Master’s (S2) Prep' | 'Friday Worship';
  targetSessions: number;
  completedSessions: number;
  recommendedDay: string;
  methodSuggestion: string;
  notes: string;
}

export const INITIAL_WEEKLY_TARGETS: WeeklyTargetItem[] = [
  {
    id: 'wk-pernikahan',
    title: 'Marriage & Islamic Parenting Study',
    category: 'Family & Marriage',
    targetSessions: 1,
    completedSessions: 1,
    recommendedDay: 'Saturday Afternoon (02:15 PM – 03:30 PM)',
    methodSuggestion: 'Pre-marital podcast, family psychology lectures, or prophetic parenting books',
    notes: 'Key episode: Building harmonious sakinah communication & mindful parenting mindset.',
  },
  {
    id: 'wk-fiqh',
    title: 'Women’s Fiqh Study (Fiqh An-Nisa)',
    category: 'Shariah',
    targetSessions: 1,
    completedSessions: 1,
    recommendedDay: 'Tuesday Afternoon (02:15 PM – 03:30 PM)',
    methodSuggestion: 'Fiqhus Sunnah lin Nisa / Ustadhah lectures on Thaharah & Islamic women’s rulings',
    notes: 'Chapter on rulings of menses, istihadhah, nifas, and making up missed prayers.',
  },
  {
    id: 'wk-english',
    title: 'English Preparation for Master’s (Grammar & IELTS)',
    category: 'Master’s (S2) Prep',
    targetSessions: 3,
    completedSessions: 2,
    recommendedDay: 'Mon, Wed & Fri Afternoon (02:15 PM – 03:30 PM)',
    methodSuggestion: 'Session 1: Complex Grammar · Session 2: Academic Reading/Listening · Session 3: IELTS Writing',
    notes: 'Aiming for IELTS band 6.5–7.0. Current focus: Academic vocabulary & coherence in essays.',
  },
  {
    id: 'wk-infos2',
    title: 'Master’s (S2) Programs & Scholarship Research',
    category: 'Master’s (S2) Prep',
    targetSessions: 1,
    completedSessions: 0,
    recommendedDay: 'Thursday Afternoon (02:15 PM – 03:30 PM)',
    methodSuggestion: 'Research university requirements, unconditional LoA guidelines & scholarship timeline',
    notes: 'Comparing Islamic Education / Arabic / Islamic Studies curriculum across target universities.',
  },
  {
    id: 'wk-alkahfi',
    title: 'Surah Al-Kahfi Tilawah & Friday Sunnah',
    category: 'Friday Worship',
    targetSessions: 1,
    completedSessions: 1,
    recommendedDay: 'Thursday Night or Friday Morning (08:00 AM – 10:30 AM)',
    methodSuggestion: '110 Verses of Surah Al-Kahfi + abundant salawat & Friday afternoon du’a',
    notes: 'Read with tranquility after morning halaqah.',
  },
];

export interface MonthlyPlanItem {
  id: string;
  monthRange: string;
  title: string;
  category: string;
  targetMetric: string;
  completed: boolean;
}

export const INITIAL_MONTHLY_PLANS: MonthlyPlanItem[] = [
  {
    id: 'mo-1',
    monthRange: 'Monthly Habit',
    title: 'Khatam 30 Juz Daily Tilawah',
    category: 'Quran',
    targetMetric: '1 Juz / day × 30 days',
    completed: true,
  },
  {
    id: 'mo-2',
    monthRange: 'Monthly Habit',
    title: '12 English Master’s Study Sessions & 1 Mock IELTS Test',
    category: 'Academic S2',
    targetMetric: '3x / week + 1 monthly mock test',
    completed: false,
  },
  {
    id: 'mo-3',
    monthRange: 'Monthly Habit',
    title: 'Summarize 4 Women’s Fiqh & 4 Parenting Episodes',
    category: 'Knowledge',
    targetMetric: '8 summary notes / month',
    completed: true,
  },
  {
    id: 'mo-4',
    monthRange: 'Early Month (Day 1–5)',
    title: 'Allocate Monthly Salary: Hajj Savings, Parents & Future Fund',
    category: 'Finance',
    targetMetric: 'Secure priority savings first',
    completed: true,
  },
  {
    id: 'mo-5',
    monthRange: 'End of Month',
    title: 'Review Students’ Quran Progress in Halaqah',
    category: 'Teaching',
    targetMetric: 'Tahsin & tahfizh student progress report',
    completed: false,
  },
];

export interface AnnualQuarterPlan {
  id: string;
  quarter: string;
  period: string;
  theme: string;
  items: { id: string; text: string; done: boolean }[];
}

export const INITIAL_ANNUAL_ROADMAP: AnnualQuarterPlan[] = [
  {
    id: 'q1',
    quarter: 'Quarter 1',
    period: 'Months 1 – 3',
    theme: 'Habit Foundation, Murojaah Phases 1–3 & Grammar Mastery',
    items: [
      { id: 'q1-1', text: 'Wake up 04:15 (or 04:40 during Haidh) & sleep 22:00 with >85% consistency', done: true },
      { id: 'q1-2', text: 'Complete Murojaah Phase 1 (Juz 26–30), Phase 2 (Juz 1–5) & Phase 3 (Juz 6–10)', done: false },
      { id: 'q1-3', text: 'Finish Academic Grammar foundation modules in afternoon study slots', done: true },
      { id: 'q1-4', text: 'Consistently deposit Hajj and Future savings', done: true },
    ],
  },
  {
    id: 'q2',
    quarter: 'Quarter 2',
    period: 'Months 4 – 6',
    theme: 'Murojaah Phases 4–5, IELTS Simulations & Master’s Campus Mapping',
    items: [
      { id: 'q2-1', text: 'Finish Murojaah Phase 4 (Juz 11–15) & Phase 5 (Juz 16–20)', done: false },
      { id: 'q2-2', text: 'Achieve predicted 6.0+ band in IELTS Listening & Reading', done: false },
      { id: 'q2-3', text: 'Draft Master’s Study Plan & Motivation Letter', done: false },
      { id: 'q2-4', text: 'Continue steady monthly savings accumulation', done: false },
    ],
  },
  {
    id: 'q3',
    quarter: 'Quarter 3',
    period: 'Months 7 – 9',
    theme: 'Finish 196-Day Murojaah Cycle & Official English Exam Registration',
    items: [
      { id: 'q3-1', text: 'Complete Phase 6 (Day 196): Grand 30 Juz Khatam & start fresh review cycle', done: false },
      { id: 'q3-2', text: 'Take official IELTS test with target score', done: false },
      { id: 'q3-3', text: 'Compile 24+ comprehensive Women’s Fiqh & Parenting study journals', done: false },
      { id: 'q3-4', text: 'Grow Hajj & Future savings milestones', done: false },
    ],
  },
  {
    id: 'q4',
    quarter: 'Quarter 4',
    period: 'Months 10 – 12',
    theme: 'Master’s (S2) Application Submission & Annual Review',
    items: [
      { id: 'q4-1', text: 'Submit Master’s and scholarship application documents', done: false },
      { id: 'q4-2', text: 'Complete 12 khatams in 1 year (1 Juz / day)', done: false },
      { id: 'q4-3', text: 'Evaluate 1-year savings milestones and set next goals', done: false },
    ],
  },
];

// ============================================================================
// SHORT, MEDIUM & LONG-TERM TARGETS
// ============================================================================

export type GoalHorizon = 'pendek' | 'menengah' | 'panjang' | 'sepuluh_tahun';

export interface LifeGoalItem {
  id: string;
  horizon: GoalHorizon;
  horizonLabel: string;
  timeframe: string;
  title: string;
  domain: string;
  progress: number;
  milestones: { id: string; label: string; completed: boolean }[];
}

export const INITIAL_LIFE_GOALS: LifeGoalItem[] = [
  {
    id: 'goal-short-1',
    horizon: 'pendek',
    horizonLabel: 'Short-Term',
    timeframe: '1 – 6 Months',
    title: 'Discipline in Daily Mutabaah & Balanced Halaqah Teaching Energy',
    domain: 'Worship & Routine',
    progress: 80,
    milestones: [
      { id: 'gs1-1', label: 'Wake up 04:15–04:30 for Tahajjud & Fajr (or 04:40 during Haidh)', completed: true },
      { id: 'gs1-2', label: 'Arrive punctually for halaqah (05:15 & 18:00) & private teaching (08:00–10:30 Mon–Thu)', completed: true },
      { id: 'gs1-3', label: 'Consistent 1 Juz daily tilawah and midday rest (11:00–12:00)', completed: true },
      { id: 'gs1-4', label: 'Healthy sleep by 22:00–22:30 after evening reflection', completed: false },
    ],
  },
  {
    id: 'goal-short-2',
    horizon: 'pendek',
    horizonLabel: 'Short-Term',
    timeframe: '1 – 6 Months',
    title: 'Complete 196-Day Murojaah Curriculum (Phase 1 to 6)',
    domain: 'Quran Tahfizh',
    progress: 35,
    milestones: [
      { id: 'gs2-1', label: 'Pass Phase 1 (Juz 26–30) & Phase 2 (Juz 1–5) on Day 30', completed: true },
      { id: 'gs2-2', label: 'Pass Phase 3 (Juz 6–10) & Phase 4 (Juz 11–15) on Day 99', completed: false },
      { id: 'gs2-3', label: 'Pass Phase 5 (Juz 16–20) & Phase 6 (Juz 21–25) on Day 196', completed: false },
    ],
  },
  {
    id: 'goal-short-3',
    horizon: 'pendek',
    horizonLabel: 'Short-Term',
    timeframe: '1 – 6 Months',
    title: 'Grammar & Academic English Foundation for Master’s (S2)',
    domain: 'Master’s Prep',
    progress: 50,
    milestones: [
      { id: 'gs3-1', label: 'Study English 3x weekly in afternoon slot (14:15–15:30)', completed: true },
      { id: 'gs3-2', label: 'Shortlist 3 target universities & scholarship prerequisites', completed: true },
      { id: 'gs3-3', label: 'Complete 10 IELTS Task 2 academic essay practices', completed: false },
    ],
  },
  {
    id: 'goal-mid-1',
    horizon: 'menengah',
    horizonLabel: 'Medium-Term',
    timeframe: '6 Months – 2 Years',
    title: 'Achieve Target IELTS Score & Win Master’s (S2) Admission',
    domain: 'Education & Career',
    progress: 30,
    milestones: [
      { id: 'gm1-1', label: 'Obtain official IELTS certificate meeting university requirements', completed: false },
      { id: 'gm1-2', label: 'Secure Unconditional Letter of Acceptance (LoA) & scholarship', completed: false },
      { id: 'gm1-3', label: 'Harmonize Master’s studies with Quran teaching amanah', completed: false },
    ],
  },
  {
    id: 'goal-mid-2',
    horizon: 'menengah',
    horizonLabel: 'Medium-Term',
    timeframe: '6 Months – 2 Years',
    title: 'Deep Understanding of Women’s Fiqh, Marriage & Islamic Parenting',
    domain: 'Family & Life',
    progress: 45,
    milestones: [
      { id: 'gm2-1', label: 'Finish essential chapters of Women’s Fiqh (Thaharah, Worship, Family)', completed: true },
      { id: 'gm2-2', label: 'Listen to 50+ curated lectures on marriage & prophetic parenting', completed: false },
      { id: 'gm2-3', label: 'Accumulate Future Savings fund steadily', completed: false },
    ],
  },
  {
    id: 'goal-long-1',
    horizon: 'panjang',
    horizonLabel: 'Long-Term',
    timeframe: '2 – 5 Years',
    title: 'Lifelong 30 Juz Mutqin Hafizhah, Register for Hajj & Qur’anic Family',
    domain: 'Life Vision & Akhirah',
    progress: 25,
    milestones: [
      { id: 'gl1-1', label: 'Maintain lifelong murojaah routine & nurture generations of Quran students', completed: true },
      { id: 'gl1-2', label: 'Reach initial Hajj quota registration savings target', completed: false },
      { id: 'gl1-3', label: 'Graduate Master’s with distinction & benefit the ummah with knowledge', completed: false },
      { id: 'gl1-4', label: 'Build a loving, sakinah family and continually honor parents', completed: false },
    ],
  },
  {
    id: 'goal-10yr-rumah',
    horizon: 'sepuluh_tahun',
    horizonLabel: 'Vision 10+ Years',
    timeframe: '10+ Years',
    title: 'Memiliki Rumah Sendiri yang Berkah, Nyaman & Bebas Riba (Own Family Residence)',
    domain: 'Home & Property (Baitii Jannatii)',
    progress: 15,
    milestones: [
      { id: 'g10-h1', label: 'Menyisihkan tabungan DP & dana darurat properti syariah secara konsisten tiap bulan', completed: true },
      { id: 'g10-h2', label: 'Riset & menentukan lokasi hunian strategis dekat masjid dan lingkungan thalabul ilmi', completed: false },
      { id: 'g10-h3', label: 'Mewujudkan rumah tinggal pribadi bebas riba dengan mushalla/ruang tahfizh Al-Qur’an keluarga', completed: false },
      { id: 'g10-h4', label: 'Menjadikan rumah sebagai pusat kebaikan, majelis ilmu keluarga & silaturahim sanak kerabat', completed: false },
    ],
  },
  {
    id: 'goal-10yr-karier',
    horizon: 'sepuluh_tahun',
    horizonLabel: 'Vision 10+ Years',
    timeframe: '10+ Years',
    title: 'Pekerjaan Mapan, Tetap & Barakah (Dosen / Akademisi / Praktisi Pendidikan Al-Qur’an)',
    domain: 'Career & Steady Livelihood',
    progress: 25,
    milestones: [
      { id: 'g10-k1', label: 'Menyelesaikan studi Magister (S2) dengan predikat mumtaz & karya ilmiah bermanfaat', completed: false },
      { id: 'g10-k2', label: 'Meraih posisi dosen / pengajar tetap di institusi pendidikan Islam / universitas terkemuka', completed: false },
      { id: 'g10-k3', label: 'Membangun ekosistem penghasilan halal mandiri, stabil, dan berkesinambungan', completed: false },
      { id: 'g10-k4', label: 'Menjadi konsultan kurikulum tahfizh Al-Qur’an anak & rujukan pendidikan akhlak muslimah', completed: false },
    ],
  },
  {
    id: 'goal-10yr-keluarga',
    horizon: 'sepuluh_tahun',
    horizonLabel: 'Vision 10+ Years',
    timeframe: '10+ Years',
    title: 'Membina Keluarga Bahagia, Sakinah Mawaddah Warahmah & Mendidik Generasi Ahlul Quran',
    domain: 'Family & Sakinah Household',
    progress: 20,
    milestones: [
      { id: 'g10-f1', label: 'Membangun rumah tangga sakinah yang saling menyayangi, mendukung dakwah dan thalabul ilmi', completed: false },
      { id: 'g10-f2', label: 'Membimbing dan mengantarkan anak-anak menjadi hafizh/hafizhah 30 juz mutqin berakhlak karimah', completed: false },
      { id: 'g10-f3', label: 'Senantiasa berbakti (birrul walidain) dan mendampingi kedua orang tua tercinta di masa tua', completed: true },
      { id: 'g10-f4', label: 'Melaksanakan ibadah Haji dan Umrah bersama pasangan, anak-anak, dan orang tua tersayang', completed: false },
    ],
  },
  {
    id: 'goal-10yr-1',
    horizon: 'sepuluh_tahun',
    horizonLabel: 'Vision 10+ Years',
    timeframe: '10+ Years',
    title: 'Establish a Girls’ Tahfizh Academy, Earn PhD (S3) & Build a Quranic Generation',
    domain: 'Legacy & Community',
    progress: 15,
    milestones: [
      { id: 'g10-1', label: 'Complete Doctoral degree (S3 / Ph.D) in Islamic Studies / Education', completed: false },
      { id: 'g10-2', label: 'Found an established Girls’ Tahfizh academy graduating mutqin hafizhahs', completed: false },
      { id: 'g10-3', label: 'Perform Hajj pilgrimage with parents and family', completed: false },
      { id: 'g10-4', label: 'Raise children who memorize and love the Holy Quran', completed: false },
      { id: 'g10-5', label: 'Establish productive waqf & ongoing sadaqah jariyah for the ummah', completed: false },
    ],
  },
  {
    id: 'goal-10yr-2',
    horizon: 'sepuluh_tahun',
    horizonLabel: 'Vision 10+ Years',
    timeframe: '10+ Years',
    title: 'Lifelong 30 Juz Sanad & Becoming a Trusted Mentor in Women’s Fiqh',
    domain: 'Quranic Scholarship',
    progress: 20,
    milestones: [
      { id: 'g10-6', label: 'Receive authentic Quranic Sanad connecting back to Rasulullah ﷺ', completed: false },
      { id: 'g10-7', label: 'Review 1–2 Juz daily without fail throughout lifelong routine', completed: true },
      { id: 'g10-8', label: 'Author a practical guidebook on Islamic Women’s Fiqh & Parenting', completed: false },
    ],
  },
  {
    id: 'goal-10yr-3',
    horizon: 'sepuluh_tahun',
    horizonLabel: 'Vision 10+ Years',
    timeframe: '10+ Years',
    title: 'Complete Hajj Mabrur & Family Umrah Pilgrimage with Parents',
    domain: 'Sacred Pilgrimage',
    progress: 10,
    milestones: [
      { id: 'g10-9', label: 'Complete Hajj savings payment & confirm official departure quota', completed: false },
      { id: 'g10-10', label: 'Undertake pre-departure Manasik Hajj preparation thoroughly', completed: false },
      { id: 'g10-11', label: 'Execute Hajj mabrur alongside beloved parents and family in Makkah & Madinah', completed: false },
    ],
  },
  {
    id: 'goal-10yr-4',
    horizon: 'sepuluh_tahun',
    horizonLabel: 'Vision 10+ Years',
    timeframe: '10+ Years',
    title: 'Found a Sustainable Baitul Maal & Productive Waqf for Quran Teachers',
    domain: 'Sadaqah Jariyah',
    progress: 5,
    milestones: [
      { id: 'g10-12', label: 'Establish educational waqf asset providing stipends for halaqah teachers', completed: false },
      { id: 'g10-13', label: 'Provide free Islamic books and scholarships for underprivileged santriwati', completed: false },
    ],
  },
];

// ============================================================================
// FINANCIAL FLOW (MONTHLY SALARY 2,000,000 IDR)
// ============================================================================

export type IncomeSourceType = 'Salary' | 'Other';

export interface IncomeRecord {
  id: string;
  date: string;
  title: string;
  sourceType: IncomeSourceType;
  customDescription?: string;
  amount: number;
}

export const INITIAL_INCOMES: IncomeRecord[] = [
  {
    id: 'inc-1',
    date: 'Early Month',
    title: 'Monthly Salary',
    sourceType: 'Salary',
    customDescription: 'Main monthly salary for halaqah teaching',
    amount: 2000000,
  },
];

export interface BudgetAllocationItem {
  id: string;
  name: string;
  categoryType: 'tabungan' | 'bakti' | 'operasional';
  amount: number;
  percentage: number;
  rangeHint?: string;
  minRange?: number;
  maxRange?: number;
  description: string;
  isTransferredThisMonth: boolean;
}

export const MONTHLY_SALARY = 2000000;

export const INITIAL_BUDGET_ALLOCATIONS: BudgetAllocationItem[] = [
  {
    id: 'pos-masadepan',
    name: 'Future Savings (Master’s & Life)',
    categoryType: 'tabungan',
    amount: 350000,
    percentage: 17.5,
    rangeHint: 'Range 300k – 500k (Flexible)',
    minRange: 300000,
    maxRange: 500000,
    description: 'Reserved for Master’s tests, applications & future milestones. Flexible between Rp 300k–500k.',
    isTransferredThisMonth: true,
  },
  {
    id: 'pos-haji',
    name: 'Hajj Savings',
    categoryType: 'tabungan',
    amount: 250000,
    percentage: 12.5,
    rangeHint: 'Range 200k – 300k (Flexible)',
    minRange: 200000,
    maxRange: 300000,
    description: 'Dedicated savings towards Hajj quota registration. Flexible between Rp 200k–300k.',
    isTransferredThisMonth: true,
  },
  {
    id: 'pos-ortu',
    name: 'Gift & Support for Parents',
    categoryType: 'bakti',
    amount: 250000,
    percentage: 12.5,
    rangeHint: '250k / month',
    description: 'Monthly token of love and honor for parents (living at home = food & housing are safe, Alhamdulillah!).',
    isTransferredThisMonth: true,
  },
  {
    id: 'pos-keluarga',
    name: 'Family Support & Needs',
    categoryType: 'bakti',
    amount: 200000,
    percentage: 10,
    rangeHint: '200k / month',
    description: 'Monthly support for family needs, home supplies, siblings, and family warmth.',
    isTransferredThisMonth: true,
  },
  {
    id: 'pos-makan',
    name: 'Daily Food & Meals',
    categoryType: 'operasional',
    amount: 300000,
    percentage: 15,
    description: 'Wholesome daily meals, nutritious food, fruits, and snacks throughout the month.',
    isTransferredThisMonth: true,
  },
  {
    id: 'pos-bensin',
    name: 'Fuel & Transportation',
    categoryType: 'operasional',
    amount: 200000,
    percentage: 10,
    description: 'Fuel & motorcycle maintenance for teaching halaqah sessions and daily mobility.',
    isTransferredThisMonth: true,
  },
  {
    id: 'pos-infaq',
    name: 'Daily Infaq & Morning Charity',
    categoryType: 'operasional',
    amount: 100000,
    percentage: 5,
    description: 'Daily morning charity, Friday sadaqah, and consistent voluntary giving.',
    isTransferredThisMonth: true,
  },
  {
    id: 'pos-internet',
    name: 'Internet & Study Mobile Data',
    categoryType: 'operasional',
    amount: 100000,
    percentage: 5,
    description: 'High-speed internet quota for Islamic lectures, podcasts, academic research & IELTS prep.',
    isTransferredThisMonth: true,
  },
  {
    id: 'pos-nongkrong',
    name: 'Friends & Weekend Hangouts',
    categoryType: 'operasional',
    amount: 125000,
    percentage: 6.25,
    description: 'Relaxed coffee or outings during flexible weekends (Saturday afternoon / Sunday morning).',
    isTransferredThisMonth: false,
  },
  {
    id: 'pos-belanja',
    name: 'Personal Needs, Books & Shopping',
    categoryType: 'operasional',
    amount: 125000,
    percentage: 6.25,
    description: 'Skincare, books, personal supplies, or unexpected needs.',
    isTransferredThisMonth: false,
  },
];

export type ExpenseCategory =
  | 'Fuel & Transport'
  | 'Food & Meals'
  | 'Infaq & Charity'
  | 'Internet & Data'
  | 'Family Support'
  | 'Friends & Hangout'
  | 'Personal & Shopping'
  | 'Unexpected';

export interface ExpenseRecord {
  id: string;
  date: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
}

export const INITIAL_EXPENSES: ExpenseRecord[] = [
  {
    id: 'exp-1',
    date: 'Week 1',
    title: 'Full Tank Fuel & Transportation',
    category: 'Fuel & Transport',
    amount: 60000,
  },
  {
    id: 'exp-2',
    date: 'Week 1',
    title: 'Monthly Internet Package for Podcasts & IELTS',
    category: 'Internet & Data',
    amount: 75000,
  },
  {
    id: 'exp-3',
    date: 'Week 1',
    title: 'Morning Infaq & Friday Sadaqah',
    category: 'Infaq & Charity',
    amount: 25000,
  },
  {
    id: 'exp-4',
    date: 'Week 2',
    title: 'Wholesome Lunch & Nutritious Groceries',
    category: 'Food & Meals',
    amount: 45000,
  },
  {
    id: 'exp-5',
    date: 'Week 2',
    title: 'Fresh Fruit Basket for Family Home',
    category: 'Family Support',
    amount: 50000,
  },
  {
    id: 'exp-6',
    date: 'Saturday',
    title: 'Coffee & Snacks with Best Friends on Flexible Saturday',
    category: 'Friends & Hangout',
    amount: 45000,
  },
  {
    id: 'exp-7',
    date: 'Week 2',
    title: 'English Grammar Practice Book & Notes',
    category: 'Personal & Shopping',
    amount: 85000,
  },
];

export function formatRupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value);
}
