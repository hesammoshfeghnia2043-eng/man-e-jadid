
import React from 'react';
import { COLOR_THEMES } from '../App';
import { Palette, Check, Sparkles, Wand2, Star } from 'lucide-react';

interface SettingsProps {
  currentThemeId: string;
  setTheme: (id: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ currentThemeId, setTheme }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 px-1">
      <header className="space-y-2">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-brand-main text-on-brand rounded-2xl shadow-2xl transition-all duration-500">
            <Palette className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">رنگِ روح</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] opacity-80">Personal Resonance</p>
          </div>
        </div>
      </header>

      <section className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-[3rem] p-6 border border-white/50 dark:border-slate-800 shadow-2xl overflow-hidden relative">
        <div className="absolute -top-12 -right-12 p-4 opacity-5 pointer-events-none">
           <Wand2 className="w-48 h-48 text-brand-main" />
        </div>
        
        <h3 className="text-[10px] font-black text-brand-main uppercase tracking-[0.3em] mb-10 block px-4 opacity-70">Vibrant Palettes (13 Themes)</h3>
        
        <div className="grid grid-cols-1 gap-5">
          {COLOR_THEMES.map((theme) => {
            const isActive = currentThemeId === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`flex items-center justify-between p-5 rounded-[2.5rem] transition-all border-4 relative overflow-hidden group ${
                  isActive 
                    ? 'border-brand-main bg-white dark:bg-slate-800 shadow-2xl scale-[1.03] z-10' 
                    : 'border-transparent bg-white/40 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800 hover:scale-[1.01]'
                }`}
              >
                <div 
                  className="absolute inset-0 opacity-5 pointer-events-none transition-opacity duration-500"
                  style={{ backgroundColor: theme.hex }}
                ></div>

                <div className="flex items-center gap-6 relative z-10">
                  <div 
                    className="w-16 h-16 rounded-[1.75rem] shadow-2xl flex items-center justify-center relative group-hover:rotate-6 transition-transform duration-500"
                    style={{ backgroundColor: theme.hex, boxShadow: `0 10px 30px -5px ${theme.hex}88` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/20 rounded-[1.75rem]"></div>
                    {isActive && <Check className="w-8 h-8 z-10" style={{ color: theme.onMain }} strokeWidth={4} />}
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-black block leading-none tracking-tight ${isActive ? 'text-brand-main' : 'text-slate-700 dark:text-slate-200'}`}>
                      {theme.name}
                    </span>
                    <div className="flex gap-2 mt-3.5">
                       <div className="w-12 h-2 rounded-full" style={{ backgroundColor: theme.hex }}></div>
                       <div className="w-4 h-2 rounded-full opacity-20" style={{ backgroundColor: theme.hex }}></div>
                    </div>
                  </div>
                </div>
                
                {isActive && (
                  <div className="bg-brand-main text-on-brand p-3 rounded-full shadow-2xl animate-bounce">
                     <Star className="w-4 h-4 fill-current" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <div className="text-center space-y-4 opacity-70 pt-8">
        <div className="w-12 h-1.5 bg-brand-main/20 mx-auto rounded-full"></div>
        <p className="text-[10px] font-bold text-slate-500 italic px-12 leading-relaxed text-center">
          «هر انتخابی، یک ارتعاش است. امروز با کدام فرکانس می‌خواهی دنیا را تغییر دهی؟»
        </p>
      </div>
    </div>
  );
};

export default Settings;
