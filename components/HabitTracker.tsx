
import React, { useState, useMemo } from 'react';
import { Habit } from '../types';
import { 
  Plus, Check, Flame, Trash2, X, 
  Sparkles, GripVertical, Ban, Palette, ChevronRight, ChevronLeft, Calendar, 
  Library, Activity, ArrowUp, ArrowDown, Info
} from 'lucide-react';

interface HabitTrackerProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  addPoints: (amount: number) => void;
  resetToDefaults: () => void;
}

const CHAKRAS = [
  { name: 'ریشه', color: 'bg-rose-600', hex: '#e11d48' },
  { name: 'خاجی', color: 'bg-orange-600', hex: '#ea580c' },
  { name: 'خورشیدی', color: 'bg-amber-500', hex: '#d97706' },
  { name: 'قلب', color: 'bg-emerald-600', hex: '#059669' },
  { name: 'گلو', color: 'bg-sky-600', hex: '#0284c7' },
  { name: 'چشم‌سوم', color: 'bg-indigo-700', hex: '#4338ca' },
  { name: 'تاج', color: 'bg-purple-700', hex: '#7e22ce' }
];

const COLORS = [
  { name: 'قرمز', class: 'bg-rose-600', hex: '#e11d48' },
  { name: 'نارنجی', class: 'bg-orange-600', hex: '#ea580c' },
  { name: 'زرد', class: 'bg-amber-500', hex: '#d97706' },
  { name: 'سبز', class: 'bg-emerald-600', hex: '#059669' },
  { name: 'آبی', class: 'bg-sky-600', hex: '#0284c7' },
  { name: 'نیلی', class: 'bg-indigo-700', hex: '#4338ca' },
  { name: 'بنفش', class: 'bg-purple-700', hex: '#7e22ce' }
];

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, setHabits, addPoints }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showCalendarView, setShowCalendarView] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const solarDateFormatter = new Intl.DateTimeFormat('fa-IR', { day: 'numeric' });
  const solarFullDateFormatter = new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' });
  const solarMonthFormatter = new Intl.DateTimeFormat('fa-IR', { month: 'long' });

  const startOfWeek = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - (weekOffset * 7));
    const day = d.getDay(); 
    const diffToSat = (day + 1) % 7; 
    const start = new Date(d);
    start.setDate(d.getDate() - diffToSat);
    start.setHours(0, 0, 0, 0);
    return start;
  }, [weekOffset]);

  const currentWeekDaysInfo = useMemo(() => {
    return ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'].map((label, idx) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + idx);
      return { label, solarDate: solarDateFormatter.format(d), fullDate: d, isToday: d.getTime() === today.getTime() };
    });
  }, [startOfWeek, today.getTime()]);

  const activeHabits = habits.filter(h => h.active);

  const toggleHabitDay = (habitId: string, dateObj: Date) => {
    const dateStr = dateObj.toISOString().split('T')[0];
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const isDone = h.completions.includes(dateStr);
        const newCompletions = isDone ? h.completions.filter(d => d !== dateStr) : [...h.completions, dateStr];
        addPoints(isDone ? -1 : 1);
        return { ...h, completions: newCompletions, streak: newCompletions.length };
      }
      return h;
    }));
  };

  const moveHabit = (id: string, direction: 'up' | 'down') => {
    const index = habits.findIndex(h => h.id === id);
    if (index === -1) return;
    const newHabits = [...habits];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < habits.length) {
      [newHabits[index], newHabits[targetIndex]] = [newHabits[targetIndex], newHabits[index]];
      setHabits(newHabits);
    }
  };

  // Monthly Data Calculation
  const calendarDays = useMemo(() => {
    const days = [];
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    for (let d = new Date(startOfMonth); d <= endOfMonth; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  }, [today.getMonth()]);

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start relative z-10 text-right">
          <div>
            <div className="flex items-center gap-2 mb-1 justify-end">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{solarMonthFormatter.format(today)}</span>
              <span className="w-2 h-2 rounded-full bg-brand-main animate-pulse"></span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">امروز، {solarFullDateFormatter.format(today)}</h2>
          </div>
          <button onClick={() => setShowCalendarView(true)} className="bg-brand-main text-white p-3 rounded-2xl active:scale-95 transition-all shadow-lg hover:shadow-brand-main/40">
            <Calendar className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-slate-800 sticky top-2 z-40 shadow-lg">
        <div className="flex items-center gap-1">
          <button onClick={() => setWeekOffset(prev => prev + 1)} className="p-2 text-slate-400 hover:text-brand-main transition-colors"><ChevronRight className="w-5 h-5" /></button>
          <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 px-2 min-w-[90px] text-center">
            {weekOffset === 0 ? 'این هفته' : `هفته پیش (${weekOffset})`}
          </span>
          <button onClick={() => setWeekOffset(prev => Math.max(0, prev - 1))} disabled={weekOffset === 0} className="p-2 text-slate-400 disabled:opacity-20"><ChevronLeft className="w-5 h-5" /></button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowLibrary(true)} className="p-2.5 text-brand-main bg-brand-main/10 rounded-2xl flex items-center gap-2 shadow-sm border border-brand-main/20">
            <Library className="w-5 h-5" />
            <span className="text-[10px] font-black ml-1">بایگانی</span>
          </button>
          <button onClick={() => setShowAdd(true)} className="p-2.5 bg-brand-main text-on-brand rounded-2xl active:scale-95 transition-all shadow-md"><Plus className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Habits List */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-xl">
        {activeHabits.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <Activity className="w-12 h-12 text-slate-200 mx-auto" />
            <p className="text-sm font-bold text-slate-400">سفر جدیدت رو با فعال کردن یک عادت شروع کن!</p>
          </div>
        ) : (
          activeHabits.map((habit, hIdx) => (
            <div key={habit.id} className="p-6 transition-all group relative">
              <div className="flex items-start justify-between mb-5">
                <div className="flex-1 text-right">
                  <div className="flex items-center gap-3 mb-2 justify-end">
                    <div className="flex gap-1 mr-auto">
                       <button onClick={() => moveHabit(habit.id, 'up')} className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-brand-main"><ArrowUp className="w-3 h-3" /></button>
                       <button onClick={() => moveHabit(habit.id, 'down')} className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 hover:text-brand-main"><ArrowDown className="w-3 h-3" /></button>
                    </div>
                    <div className="flex items-center gap-1 text-orange-600 bg-orange-50 dark:bg-orange-950/50 px-2 py-1 rounded-lg border border-orange-100">
                      <Flame className="w-3 h-3" />
                      <span className="text-[10px] font-black">{habit.completions.length} تیک</span>
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${habit.color} text-white shadow-sm`}>{habit.category}</span>
                  </div>
                  <h4 className="font-black text-slate-900 dark:text-white text-[16px] leading-tight break-words pr-2">{habit.name}</h4>
                </div>
                <div className="p-2 text-slate-300">
                  <GripVertical className="w-6 h-6" />
                </div>
              </div>

              <div className="flex justify-between gap-1.5 px-0.5">
                {currentWeekDaysInfo.map((day, dIdx) => {
                  const dateStr = day.fullDate.toISOString().split('T')[0];
                  const isDone = habit.completions.includes(dateStr);
                  return (
                    <div key={dIdx} className="flex-1 flex flex-col items-center gap-2">
                      <button 
                        onClick={() => toggleHabitDay(habit.id, day.fullDate)}
                        className={`w-full aspect-square max-w-[42px] rounded-2xl flex items-center justify-center transition-all border-2 text-xs font-black relative overflow-hidden
                          ${isDone ? `${habit.color} border-white/50 text-white shadow-lg animate-gloss-periodic saturate-150` : 
                            day.isToday ? 'border-brand-main text-brand-main bg-brand-main/10' :
                            'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500'}
                        `}
                      >
                        {isDone ? <Check className="w-5 h-5 stroke-[4] drop-shadow-md" /> : day.solarDate}
                      </button>
                      <span className={`text-[9px] font-black ${day.isToday ? 'text-brand-main' : 'text-slate-400'}`}>{day.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Monthly Statistics View */}
      {showCalendarView && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in">
           <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] p-8 shadow-2xl border-4 border-white/20 flex flex-col gap-6 max-h-[90vh]">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-brand-main" />
                    <h3 className="font-black text-xl text-slate-900 dark:text-white">نقشه انرژی ماهانه</h3>
                 </div>
                 <button onClick={() => setShowCalendarView(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-2xl"><X className="w-5 h-5 text-slate-500" /></button>
              </div>

              <div className="overflow-y-auto pr-1 space-y-8 no-scrollbar">
                 {activeHabits.map(habit => {
                   const completionCount = habit.completions.filter(c => {
                     const d = new Date(c);
                     return d.getMonth() === today.getMonth();
                   }).length;
                   const percentage = Math.round((completionCount / calendarDays.length) * 100);

                   return (
                     <div key={habit.id} className="space-y-4">
                        <div className="flex justify-between items-end">
                           <div className="text-right">
                              <h4 className="text-sm font-black text-slate-800 dark:text-white">{habit.name}</h4>
                              <span className="text-[10px] font-bold text-slate-400">تداوم: {percentage}%</span>
                           </div>
                           <div className={`w-8 h-8 rounded-lg ${habit.color} flex items-center justify-center text-white shadow-lg`}>
                              <Activity className="w-4 h-4" />
                           </div>
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                           {calendarDays.map((date, idx) => {
                             const dateStr = date.toISOString().split('T')[0];
                             const isDone = habit.completions.includes(dateStr);
                             return (
                               <div 
                                 key={idx} 
                                 className={`aspect-square rounded-md border transition-all ${isDone ? `${habit.color} border-white/20 shadow-sm animate-pulse` : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}
                                 title={solarDateFormatter.format(date)}
                               ></div>
                             );
                           })}
                        </div>
                     </div>
                   )
                 })}
              </div>

              <div className="bg-brand-main/10 p-4 rounded-2xl flex items-center gap-4 border border-brand-main/20">
                 <Info className="w-6 h-6 text-brand-main shrink-0" />
                 <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed">این تقویم تمام تیک‌های ماه جاری را نشان می‌دهد. هر خانه پررنگ نشان‌دهنده یک روز پیروزی بر خود است.</p>
              </div>
           </div>
        </div>
      )}

      {/* Other modals (Library, etc.) would follow same pattern */}
      {showLibrary && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
           <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border-4 border-slate-100 dark:border-slate-800 space-y-6 w-full max-w-sm animate-in zoom-in duration-300 shadow-2xl">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Library className="w-6 h-6 text-brand-main" />
                  <h3 className="font-black text-xl text-slate-900 dark:text-white">بایگانی ارتعاشات</h3>
                </div>
                <button onClick={() => setShowLibrary(false)} className="p-2"><X className="w-6 h-6 text-slate-400" /></button>
             </div>
             <div className="max-h-[55vh] overflow-y-auto no-scrollbar space-y-3">
                {/* Simplified Archive for display */}
                <p className="text-center text-xs text-slate-400 py-4">در حال حاضر بایگانی خالی است.</p>
             </div>
             <button onClick={() => setShowLibrary(false)} className="w-full py-5 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-black text-sm">بازگشت</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;
