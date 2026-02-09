
import React, { useState, useEffect } from 'react';
import { UserStats } from '../types';
import { Zap, HelpCircle, RefreshCw, Trophy, Brain, Sparkles, Eye, Wind, Fingerprint, Flame } from 'lucide-react';

interface IntuitionGameProps {
  addPoints: (amount: number) => void;
  stats: UserStats;
  setStats: React.Dispatch<React.SetStateAction<UserStats>>;
}

const IntuitionGame: React.FC<IntuitionGameProps> = ({ addPoints, stats, setStats }) => {
  const [gameState, setGameState] = useState<'start' | 'meditate' | 'playing' | 'result'>('start');
  const [hiddenColor, setHiddenColor] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [streak, setStreak] = useState(0);

  const colors = [
    { name: 'آبی', hex: 'bg-blue-600', shadow: 'shadow-blue-600/50' },
    { name: 'قرمز', hex: 'bg-rose-600', shadow: 'shadow-rose-600/50' },
    { name: 'سبز', hex: 'bg-emerald-600', shadow: 'shadow-emerald-600/50' },
    { name: 'زرد', hex: 'bg-amber-500', shadow: 'shadow-amber-500/50' }
  ];

  const startGame = () => {
    setGameState('meditate');
    setTimeout(() => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)].hex;
      setHiddenColor(randomColor);
      setGameState('playing');
    }, 2500);
  };

  const handleGuess = (color: string) => {
    setSelectedColor(color);
    setGameState('result');
    if (color === hiddenColor) {
      addPoints(1); // User requested 1 point for correct guess
      setStreak(s => s + 1);
      if (streak + 1 >= 3) {
        setStats(prev => ({
          ...prev,
          badges: prev.badges.map(b => b.id === '3' ? { ...b, unlocked: true } : b)
        }));
      }
    } else {
      addPoints(-1); // User requested -1 point for incorrect guess
      setStreak(0);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] overflow-hidden animate-in fade-in duration-700 relative">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="text-center space-y-1 relative z-10 px-4 pt-4 flex-shrink-0">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-full border border-indigo-100 dark:border-indigo-800/50 mb-1">
           <Sparkles className="w-3 h-3 text-indigo-500" />
           <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">تمرین اتصال کوانتومی</span>
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">دروازه شهود</h2>
        <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold">به شهودت ایمان داشته باش</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        
        {gameState === 'start' && (
          <div className="text-center space-y-12 animate-in zoom-in duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
              <div className="w-36 h-36 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl relative border border-white/20">
                <Eye className="w-14 h-14 text-indigo-600 animate-breath" />
              </div>
            </div>
            <button 
              onClick={startGame}
              className="group relative px-10 py-5 bg-slate-950 dark:bg-white dark:text-slate-950 text-white rounded-[2rem] font-black text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3 tracking-widest uppercase">
                <Fingerprint className="w-5 h-5" />
                شروع آیین اتصال
              </span>
            </button>
          </div>
        )}

        {gameState === 'meditate' && (
          <div className="text-center space-y-8 animate-in fade-in duration-1000">
            <div className="relative flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-indigo-500/30 rounded-full animate-[ping_3s_linear_infinite]"></div>
              <div className="absolute w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(79,70,229,0.5)] animate-breath">
                <Wind className="w-12 h-12 text-white" />
              </div>
            </div>
            <p className="text-indigo-600 dark:text-indigo-400 font-black text-xl animate-pulse tracking-wide">نفس بکش و متصل شو...</p>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="w-full max-w-xs space-y-10 animate-in slide-in-from-bottom-10 duration-500 flex flex-col items-center">
            <div className="w-full flex flex-col items-center gap-6">
                <div className="w-40 h-56 bg-slate-950 rounded-[2.5rem] shadow-2xl flex flex-col items-center justify-center border-2 border-white/10 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.1),transparent)]"></div>
                  <Eye className="w-16 h-16 text-white/20 animate-pulse" />
                  <div className="mt-4 text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">انتخاب با توست</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full">
                  {colors.map((c) => (
                    <button 
                      key={c.name}
                      onClick={() => handleGuess(c.hex)}
                      className={`h-24 rounded-[2rem] ${c.hex} ${c.shadow} shadow-lg active:scale-90 transition-all border-4 border-white dark:border-slate-800 glassy-shimmer overflow-hidden flex items-center justify-center group`}
                    >
                       <Eye className="w-6 h-6 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
            </div>
          </div>
        )}

        {gameState === 'result' && (
          <div className="text-center space-y-8 animate-in zoom-in duration-500 w-full max-w-sm">
            <div className="relative inline-block">
              <div className={`w-48 h-64 ${hiddenColor} rounded-[3rem] mx-auto shadow-2xl border-4 border-white flex flex-col items-center justify-center relative overflow-hidden`}>
                 <div className="absolute inset-0 glassy-shimmer"></div>
                 {selectedColor === hiddenColor ? (
                   <Trophy className="w-20 h-20 text-white drop-shadow-2xl animate-bounce" />
                 ) : (
                   <Brain className="w-20 h-20 text-white/40 drop-shadow-lg" />
                 )}
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center text-2xl">
                {selectedColor === hiddenColor ? '🔥' : '🕯️'}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className={`text-3xl font-black ${selectedColor === hiddenColor ? 'text-emerald-500' : 'text-slate-400'}`}>
                {selectedColor === hiddenColor ? 'شهودت بیدار است!' : 'فرکانس نزدیک بود...'}
              </h3>
              <div className="flex justify-center gap-2">
                 <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-black text-slate-600 dark:text-slate-300">
                    رشته متوالی: {streak}
                 </div>
              </div>
            </div>

            <button 
              onClick={startGame}
              className="w-full max-w-[200px] py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCw className="w-5 h-5" />
              تلاش دوباره
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar (Always Fixed at Bottom of content) */}
      <div className="px-8 pb-4 flex-shrink-0 relative z-10">
         <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-1000" 
              style={{ width: `${(streak / 3) * 100}%` }}
            ></div>
         </div>
         <p className="text-[8px] font-black text-slate-400 text-center mt-2 uppercase tracking-widest">
           {streak >= 3 ? 'نشان تمرکز بالا آزاد شد!' : '۳ تیک متوالی برای نشان ویژه'}
         </p>
      </div>
    </div>
  );
};

export default IntuitionGame;
