
import React, { useState, useEffect, useMemo } from 'react';
import { Task, Habit, UserStats, ViewType } from '../types';
import { 
  Sparkles, Orbit, AlertTriangle, CheckCircle2, 
  ArrowUpRight, Target, Activity, HelpCircle, ShieldAlert
} from 'lucide-react';
import AIInsight from './AIInsight';

interface DashboardProps {
  tasks: Task[];
  habits: Habit[];
  stats: UserStats;
  setActiveView: (view: ViewType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ tasks, habits, stats, setActiveView }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeHelp, setActiveHelp] = useState<{title: string, desc: string} | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const SKY_STAGES = useMemo(() => [
    { id: 0, name: 'سطح زمین', min: 0, color: 'from-slate-200 to-slate-400' },
    { id: 1, name: 'آسمان اول', min: 11, color: 'from-blue-100 to-indigo-300' },
    { id: 2, name: 'آسمان دوم', min: 77, color: 'from-indigo-200 to-purple-400' },
    { id: 3, name: 'آسمان سوم', min: 222, color: 'from-amber-200 to-orange-400' },
    { id: 4, name: 'آسمان چهارم', min: 777, color: 'from-emerald-200 to-teal-400' },
    { id: 5, name: 'آسمان پنجم', min: 1555, color: 'from-rose-200 to-pink-400' },
    { id: 6, name: 'آسمان ششم', min: 3333, color: 'from-cyan-200 to-blue-400' },
    { id: 7, name: 'آسمان هفتم', min: 7777, color: 'from-purple-300 via-white to-amber-300' },
  ], []);

  const chakraData = useMemo(() => {
    const colors: Record<string, string> = {
      'bg-rose-600': '#FF0040',
      'bg-orange-600': '#FF6D00',
      'bg-amber-500': '#FFD600',
      'bg-emerald-600': '#00E676',
      'bg-sky-600': '#00B0FF',
      'bg-indigo-700': '#3D5AFE',
      'bg-purple-700': '#D500F9'
    };
    
    const processed = habits.map(h => ({
      ...h,
      hex: colors[h.color] || '#6366f1',
      ticks: h.completions.length
    }));

    const maxTicks = Math.max(...processed.map(p => p.ticks), 0);
    const isOverallBalanced = processed.every(p => maxTicks - p.ticks < 3);

    return {
      items: processed.map(p => ({
        ...p,
        isLagging: maxTicks - p.ticks >= 3,
        statusColor: maxTicks - p.ticks >= 3 ? 'red' : (isOverallBalanced ? 'green' : 'none')
      })),
      isOverallBalanced,
      maxTicks
    };
  }, [habits]);

  const currentSky = useMemo(() => {
    return [...SKY_STAGES].reverse().find(s => stats.points >= s.min) || SKY_STAGES[0];
  }, [stats.points, SKY_STAGES]);

  const nextSky = SKY_STAGES[currentSky.id + 1] || null;
  const progressToNext = nextSky ? ((stats.points - currentSky.min) / (nextSky.min - currentSky.min)) * 100 : 100;

  const farsiDate = new Intl.DateTimeFormat('fa-IR', { weekday: 'long', day: 'numeric', month: 'long' }).format(currentTime);

  const centerX = 160;
  const centerY = 160;
  const energyPoints = chakraData.items.map((c, i) => {
    const angle = (i * 360) / chakraData.items.length;
    const radius = 110; 
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian),
      hex: c.hex,
      isLagging: c.isLagging,
      statusColor: c.statusColor,
      ticks: c.ticks
    };
  });

  const polygonPath = energyPoints.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24 px-1 min-h-screen">
      
      {/* 1. Header (Light Theme) */}
      <header className="flex justify-between items-center px-4 pt-6">
        <div className="space-y-1 text-right">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{farsiDate}</h2>
          <div className="text-3xl font-black text-slate-900 tabular-nums">
             {currentTime.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex flex-col items-end bg-brand-main/5 px-4 py-2 rounded-2xl border border-brand-main/10 shadow-sm">
              <span className="text-[9px] font-black text-brand-main uppercase tracking-widest">فرکانس فعلی</span>
              <span className="text-sm font-black text-slate-800 tabular-nums">{stats.points} XP</span>
           </div>
           <button onClick={() => setActiveHelp({ title: "هسته تراز انرژی", desc: "دایره‌های براق نشان‌دهنده چاکراهای تو هستند. عدد داخل هر دایره تیک‌های ثبت شده را نشان می‌دهد. اگر فاصله‌ی تیک‌های یک چاکرا با بقیه زیاد شود (بیشتر از ۳)، چراغ قرمز روشن می‌شود. تعادل کامل (چراغ‌های سبز چشمک‌زن) زمانی رخ می‌دهد که همه‌ی بخش‌ها با هم رشد کنند." })} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all border border-slate-200">
             <HelpCircle className="w-5 h-5 text-slate-400" />
           </button>
        </div>
      </header>

      {/* 2. Central Energy Hub (Against Light Background) */}
      <section className="relative h-[340px] flex items-center justify-center overflow-visible">
        <svg className="absolute w-[320px] h-[320px] pointer-events-none z-0" viewBox="0 0 320 320">
          <polygon 
            points={polygonPath} 
            fill="none" 
            stroke="var(--brand-main)" 
            strokeWidth="1.5" 
            strokeOpacity="0.15"
            strokeDasharray="4 4"
          />
          {energyPoints.map((p, i) => (
            <line 
              key={i}
              x1="160" y1="160" 
              x2={p.x} y2={p.y} 
              stroke={p.hex} 
              strokeOpacity="0.1" 
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* Chakra Orbs */}
        {energyPoints.map((p, i) => (
          <div 
            key={i}
            className="absolute transition-all duration-1000 z-20"
            style={{ left: `${p.x}px`, top: `${p.y}px`, transform: 'translate(-50%, -50%)' }}
          >
            <div className="relative group">
               <div 
                 className="w-13 h-13 rounded-full border-2 border-white/80 shadow-lg animate-gloss transition-all duration-500 relative flex items-center justify-center cursor-help"
                 style={{ backgroundColor: p.hex, boxShadow: `0 8px 25px ${p.hex}66`, width: '48px', height: '48px' }}
               >
                 <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/60 rounded-full"></div>
                 <span className="relative z-10 text-[11px] font-black text-white tabular-nums drop-shadow-md">
                   {p.ticks}
                 </span>

                 {p.statusColor !== 'none' && (
                   <div 
                     className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border-[2px] border-white shadow-xl z-30 transition-all duration-500
                       ${p.statusColor === 'red' ? 'bg-rose-600' : 'bg-emerald-400 animate-green-blink-vivid'}
                     `}
                   >
                     <div className={`status-ring ${p.statusColor === 'red' ? 'bg-rose-600' : 'bg-emerald-400'}`}></div>
                   </div>
                 )}
               </div>
               
               <div className="absolute top-14 left-1/2 -translate-x-1/2 text-[9px] font-black text-slate-400 uppercase tracking-tighter whitespace-nowrap">
                 {chakraData.items[i].category}
               </div>
            </div>
          </div>
        ))}

        {/* Main Spirit Core (Light version) */}
        <div className={`relative w-40 h-40 bg-gradient-to-br ${currentSky.color} rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center text-slate-800 border-[8px] border-white z-10 animate-breath`}>
           <Orbit className="w-8 h-8 mb-2 opacity-30 text-slate-900" />
           <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">در ترازِ</span>
           <h3 className="text-lg font-black text-center px-4 leading-tight">{currentSky.name}</h3>
           <div className="absolute -bottom-5 bg-white px-5 py-2 rounded-full text-[11px] font-black shadow-lg border border-slate-100 text-brand-main tabular-nums">
              {stats.points} XP
           </div>
        </div>
      </section>

      {/* 3. Balance Status Message (Card) */}
      <div className={`mx-4 p-6 rounded-[2.5rem] border transition-all duration-700 flex items-center gap-5 shadow-sm
        ${chakraData.isOverallBalanced 
          ? 'bg-emerald-50 border-emerald-100 text-emerald-900' 
          : 'bg-rose-50 border-rose-100 text-rose-900'}
      `}>
         {chakraData.isOverallBalanced ? (
           <div className="p-3 bg-emerald-500 text-white rounded-2xl shadow-md">
              <CheckCircle2 className="w-7 h-7 flex-shrink-0" />
           </div>
         ) : (
           <div className="p-3 bg-rose-500 text-white rounded-2xl shadow-md">
              <ShieldAlert className="w-7 h-7 flex-shrink-0" />
           </div>
         )}
         <div className="text-right">
            <h4 className="text-[16px] font-black mb-1">
              {chakraData.isOverallBalanced ? 'چاکراها در تعادل کامل' : 'نیاز به متعادل‌سازی'}
            </h4>
            <p className="text-[12px] font-bold opacity-70 leading-relaxed">
              {chakraData.isOverallBalanced 
                ? 'نور در تمام مراکز انرژی تو جاری است. هماهنگی تو عالی است.' 
                : 'اختلاف فرکانس چاکراهای تو زیاد است. روی عادت‌های عقب‌افتاده تمرکز کن.'}
            </p>
         </div>
      </div>

      <div className="px-2">
         <AIInsight habits={habits} tasks={tasks} stats={stats} />
      </div>

      {/* 4. Progress Section */}
      <section className="bg-white mx-4 rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="flex justify-between items-end mb-6">
          <div className="space-y-1 text-right">
            <h4 className="text-[11px] font-black text-brand-main uppercase tracking-widest flex items-center gap-2 justify-end">
               ماموریت صعود <ArrowUpRight className="w-3.5 h-3.5" />
            </h4>
            <p className="text-2xl font-black text-slate-900">به سوی {nextSky?.name || 'اوج نهایی'}</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-slate-800 tabular-nums">{Math.round(progressToNext)}٪</span>
          </div>
        </div>

        <div className="h-5 w-full bg-slate-100 rounded-full p-1.5 shadow-inner border border-slate-200">
           <div 
             className={`h-full rounded-full bg-gradient-to-r ${currentSky.color} transition-all duration-1000 relative`}
             style={{ width: `${progressToNext}%` }}
           >
             <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center border border-brand-main/20">
                <div className="w-2 h-2 bg-brand-main rounded-full"></div>
             </div>
           </div>
        </div>
        
        <div className="mt-5 flex justify-between text-[11px] font-black text-slate-400 tabular-nums">
           <span>{currentSky.min} XP</span>
           <span>{nextSky?.min || 'بیشینه'} XP</span>
        </div>
      </section>

      {activeHelp && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white p-8 rounded-[3rem] max-w-sm w-full shadow-2xl animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-brand-main text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                 <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">{activeHelp.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-bold mb-8 text-right">{activeHelp.desc}</p>
              <button onClick={() => setActiveHelp(null)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm active:scale-95 transition-all">متوجه شدم</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
