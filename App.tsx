import React, { useState, useEffect, useMemo } from 'react';
import { 
  CheckCircle2, 
  Calendar, 
  BookOpen, 
  Zap, 
  LayoutDashboard,
  Moon,
  Sun,
  Sparkles,
  Heart,
  Mail,
  Settings as SettingsIcon,
  X
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import HabitTracker from './components/HabitTracker';
import DailyPlanner from './components/DailyPlanner';
import Journal from './components/Journal';
import Gratitude from './components/Gratitude';
import AngelMessages from './components/AngelMessages';
import IntuitionGame from './components/IntuitionGame';
import Settings from './components/Settings';
import { ViewType, Task, Habit, JournalEntry, GratitudeEntry, UserStats } from './types';

const INITIAL_HABITS: Habit[] = [
  { id: 'm1', name: 'ورزش و تحرک روزانه', category: 'ریشه', icon: '🏋️', color: 'bg-rose-600', completions: [], streak: 0, frequency: 7, active: true },
  { id: 'm2', name: 'نوشیدن آب و نشاط', category: 'خاجی', icon: '💧', color: 'bg-orange-600', completions: [], streak: 0, frequency: 7, active: true },
  { id: 'm3', name: 'نظم و مدیریت زمان', category: 'خورشیدی', icon: '✨', color: 'bg-amber-500', completions: [], streak: 0, frequency: 7, active: true },
  { id: 'm4', name: 'شکرگزاری و عشق', category: 'قلب', icon: '💖', color: 'bg-emerald-600', completions: [], streak: 0, frequency: 7, active: true },
  { id: 'm5', name: 'بیان صادقانه و مطالعه', category: 'گلو', icon: '📖', color: 'bg-sky-600', completions: [], streak: 0, frequency: 7, active: true },
  { id: 'm6', name: 'تجسم خلاق و شهود', category: 'چشم‌سوم', icon: '👁️', color: 'bg-indigo-700', completions: [], streak: 0, frequency: 7, active: true },
  { id: 'm7', name: 'مدیتیشن و سکوت ذهنی', category: 'تاج', icon: '🧘', color: 'bg-purple-700', completions: [], streak: 0, frequency: 7, active: true },
];

export const COLOR_THEMES = [
  { id: 'classic-white', name: 'سفید کلاسیک', hex: '#4f46e5', onMain: '#ffffff', bg: '#ffffff', shades: { 50:'#f8fafc', 100:'#f1f5f9', 200:'#e2e8f0', 300:'#cbd5e1', 400:'#94a3b8', 500:'#64748b', 600:'#4f46e5' } },
  { id: 'canary-yellow', name: 'زرد قناری', hex: '#FFD700', onMain: '#000000', bg: '#FFFEF0', shades: { 50:'#FFFEF0', 100:'#FFFBC2', 200:'#FFF894', 300:'#FFF466', 400:'#FFF038', 500:'#FFD700', 600:'#E6C200' } },
  { id: 'fire-red', name: 'قرمز آتشین', hex: '#EF394E', onMain: '#ffffff', bg: '#FFF5F6', shades: { 50:'#FFF5F6', 100:'#FFD1D9', 200:'#FFA8B8', 300:'#FF7D94', 400:'#FF5270', 500:'#EF394E', 600:'#D62A3E' } },
  { id: 'electric-blue', name: 'آبی الکتریک', hex: '#0066FF', onMain: '#ffffff', bg: '#F0F7FF', shades: { 50:'#F0F7FF', 100:'#BADDFF', 200:'#85C1FF', 300:'#479DFF', 400:'#1A85FF', 500:'#0066FF', 600:'#0052CC' } },
  { id: 'neon-green', name: 'سبز فسفری', hex: '#00D68F', onMain: '#000000', bg: '#F0FFF9', shades: { 50:'#F0FFF9', 100:'#D6FFF0', 200:'#75FFCF', 300:'#33FFB8', 400:'#00F0A8', 500:'#00D68F', 600:'#00B377' } },
  { id: 'vivid-orange', name: 'نارنجی تند', hex: '#FF5C00', onMain: '#ffffff', bg: '#FFF8F5', shades: { 50:'#FFF8F5', 100:'#FFDBC7', 200:'#FFC09E', 300:'#FF9E6B', 400:'#FF7D38', 500:'#FF5C00', 600:'#D64D00' } },
  { id: 'royal-purple', name: 'بنفش سلطنتی', hex: '#7000FF', onMain: '#ffffff', bg: '#F8F4FF', shades: { 50:'#F8F4FF', 100:'#DECCFF', 200:'#C7A8FF', 300:'#AB7AFF', 400:'#8E4DFF', 500:'#7000FF', 600:'#5C00D6' } },
  { id: 'toxic-lime', name: 'لیمویی نئون', hex: '#A3FF00', onMain: '#000000', bg: '#FBFFF2', shades: { 50:'#FBFFF2', 100:'#E8FFA8', 200:'#D9FF6B', 300:'#C5FF24', 400:'#B1FF00', 500:'#A3FF00', 600:'#86D100' } },
  { id: 'hot-pink', name: 'صورتی تند', hex: '#FF00A8', onMain: '#ffffff', bg: '#FFF2FA', shades: { 50:'#FFF2FA', 100:'#FFCCE9', 200:'#FF99D1', 300:'#FF5CAD', 400:'#FF2E94', 500:'#FF00A8', 600:'#D6008D' } },
  { id: 'pure-gold', name: 'طلایی لوکس', hex: '#C5A059', onMain: '#ffffff', bg: '#FAF9F6', shades: { 50:'#FAF9F6', 100:'#E8E2D1', 200:'#D9CEA9', 300:'#C9B77F', 400:'#BAA35B', 500:'#C5A059', 600:'#A18042' } },
];

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeEntry[]>([]);
  const [currentThemeId, setCurrentThemeId] = useState('classic-white');

  const [stats, setStats] = useState<UserStats>({
    points: 0, level: 1,
    badges: [
      { id: '1', name: 'شروع‌کننده', icon: '🚀', description: 'اولین قدم برای تغییر', unlocked: true },
      { id: '3', name: 'تمرکز بالا', icon: '🎯', description: 'کسب امتیاز در بازی شهود', unlocked: false },
    ]
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem('mj-tasks');
    const savedHabits = localStorage.getItem('mj-habits');
    const savedJournal = localStorage.getItem('mj-journal');
    const savedGratitude = localStorage.getItem('mj-gratitude');
    const savedStats = localStorage.getItem('mj-stats');
    const savedTheme = localStorage.getItem('mj-theme-id');
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedHabits) {
        const parsedHabits = JSON.parse(savedHabits);
        if (parsedHabits.length < INITIAL_HABITS.length) {
            setHabits(INITIAL_HABITS);
        } else {
            setHabits(parsedHabits);
        }
    } else {
        setHabits(INITIAL_HABITS);
    }
    if (savedJournal) setJournalEntries(JSON.parse(savedJournal));
    if (savedGratitude) setGratitudeEntries(JSON.parse(savedGratitude));
    if (savedStats) setStats(JSON.parse(savedStats));
    if (savedTheme) setCurrentThemeId(savedTheme);
    if (localStorage.getItem('theme') === 'dark') setIsDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('mj-tasks', JSON.stringify(tasks));
    localStorage.setItem('mj-habits', JSON.stringify(habits));
    localStorage.setItem('mj-journal', JSON.stringify(journalEntries));
    localStorage.setItem('mj-gratitude', JSON.stringify(gratitudeEntries));
    localStorage.setItem('mj-stats', JSON.stringify(stats));
    localStorage.setItem('mj-theme-id', currentThemeId);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');

    const theme = COLOR_THEMES.find(t => t.id === currentThemeId) || COLOR_THEMES[0];
    Object.entries(theme.shades).forEach(([shade, hex]) => {
      document.documentElement.style.setProperty(`--brand-${shade}`, hex as string);
    });
    document.documentElement.style.setProperty('--brand-main', theme.hex);
    document.documentElement.style.setProperty('--brand-on-main', theme.onMain);
    
    const bgColor = isDarkMode ? '#020617' : theme.bg;
    document.documentElement.style.setProperty('--brand-bg', bgColor);
    document.documentElement.style.setProperty('--brand-shadow', `${theme.hex}33`);
  }, [tasks, habits, journalEntries, gratitudeEntries, stats, isDarkMode, currentThemeId, activeView]);

  const addPoints = (amount: number) => {
    setStats(prev => ({ ...prev, points: prev.points + amount }));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <Dashboard tasks={tasks} habits={habits} stats={stats} setActiveView={setActiveView} />;
      case 'habits': return <HabitTracker habits={habits} setHabits={setHabits} addPoints={addPoints} resetToDefaults={() => setHabits(INITIAL_HABITS)} />;
      case 'planner': return <DailyPlanner tasks={tasks} setTasks={setTasks} addPoints={addPoints} />;
      case 'gratitude': return <Gratitude entries={gratitudeEntries} setEntries={setGratitudeEntries} addPoints={addPoints} />;
      // Fix: Use the correct state setter 'setJournalEntries' instead of the non-existent 'setEntries'
      case 'journal': return <Journal entries={journalEntries} setEntries={setJournalEntries} addPoints={addPoints} />;
      case 'angels': return <AngelMessages />;
      case 'intuition': return <IntuitionGame addPoints={addPoints} stats={stats} setStats={setStats} />;
      case 'settings': return <Settings currentThemeId={currentThemeId} setTheme={setCurrentThemeId} />;
      default: return <Dashboard tasks={tasks} habits={habits} stats={stats} setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen transition-all duration-700 pb-36 bg-[var(--brand-bg)]">
      <header className="px-6 py-5 flex justify-between items-center sticky top-0 z-50 bg-brand-main text-on-brand shadow-2xl border-b border-black/5 transition-all duration-500">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-white/20 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-on-brand font-black text-base border border-white/40 shadow-xl">mj</div>
          <h1 className="text-2xl font-black tracking-tighter">منِ جدید</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-11 h-11 bg-white/15 hover:bg-white/25 rounded-2xl flex items-center justify-center transition-all active:scale-90">
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-300" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setActiveView('settings')} className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-90 ${activeView === 'settings' ? 'bg-white/30 ring-2 ring-white/50' : 'bg-white/15'}`}>
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">{renderView()}</main>

      <nav className="fixed bottom-0 left-0 right-0 bg-brand-main text-on-brand px-2 pt-4 pb-10 z-50 shadow-[0_-15px_40px_rgba(0,0,0,0.2)] border-t border-white/10 transition-all duration-500">
        <div className="max-w-md mx-auto flex justify-between items-center px-2">
          <NavItem active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} icon={<LayoutDashboard />} label="خانه" />
          <NavItem active={activeView === 'habits'} onClick={() => setActiveView('habits')} icon={<CheckCircle2 />} label="عادت‌ها" />
          <NavItem active={activeView === 'planner'} onClick={() => setActiveView('planner')} icon={<Calendar />} label="چک لیست" />
          <NavItem active={activeView === 'gratitude'} onClick={() => setActiveView('gratitude')} icon={<Heart />} label="سپاس" />
          <NavItem active={activeView === 'angels'} onClick={() => setActiveView('angels')} icon={<Mail />} label="فرشتگان" />
          <NavItem active={activeView === 'journal'} onClick={() => setActiveView('journal')} icon={<BookOpen />} label="ژورنال" />
          <NavItem active={activeView === 'intuition'} onClick={() => setActiveView('intuition')} icon={<Zap />} label="شهود" />
        </div>
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${active ? 'opacity-100 scale-110' : 'opacity-40 hover:opacity-70'}`}>
    <div className={`p-2.5 rounded-2xl transition-all duration-300 ${active ? 'bg-white/30 shadow-inner ring-2 ring-white/10' : ''}`}>
      {React.cloneElement(icon as React.ReactElement, { size: 22, strokeWidth: active ? 3.5 : 2 })}
    </div>
    <span className="text-[10px] font-black tracking-tight">{label}</span>
  </button>
);

export default App;