
import React, { useState } from 'react';
import { Mail, Sparkles, Star, Zap, Heart } from 'lucide-react';

const MESSAGES = [
  { 
    number: '111', 
    meaning: 'همسویی و تجلی افکار', 
    desc: 'فرشتگان به تو می‌گویند که افکارت با سرعت در حال تبدیل شدن به واقعیت هستند. روی خواسته‌هایت تمرکز کن، نه ترس‌هایت.',
    action: 'همین الان یک جمله تاکیدی مثبت را ۳ بار با صدای بلند تکرار کن.'
  },
  { 
    number: '222', 
    meaning: 'اعتماد و تداوم', 
    desc: 'همه چیز در حال درست شدن است. به مسیرت ایمان داشته باش و صبر پیشه کن. دانه‌هایی که کاشته‌ای در حال جوانه زدن هستند.',
    action: 'به مدت ۱ دقیقه در سکوت مطلق بنشین و فقط به ضربان قلبت گوش کن.'
  },
  { 
    number: '333', 
    meaning: 'حمایت اساتید معنوی', 
    desc: 'تو تنها نیستی. نیروهای الهی و اساتید معنوی در اطراف تو هستند تا راهنمایی‌ات کنند. درخواست کمک کن.',
    action: 'یک لیوان آب آگاهانه بنوش و تصور کن نور الهی وارد بدنت می‌شود.'
  },
  { 
    number: '444', 
    meaning: 'حفاظت و امنیت', 
    desc: 'فرشتگان نگهبان در حال حاضر تو را در آغوش گرفته‌اند. تو کاملاً محافظت شده‌ای و راهت درست است.',
    action: 'محیط اطرافت را مرتب کن؛ یک فضای فیزیکی منظم، انرژی را جاری می‌کند.'
  },
  { 
    number: '555', 
    meaning: 'تغییرات بزرگ در راه است', 
    desc: 'تغییراتی در راه است که زندگی تو را به سطح بالاتری می‌برد. این تغییرات برای خیر و صلاح تو هستند، از آن‌ها نترس.',
    action: 'یک کار کوچک را امروز متفاوت انجام بده (مثلاً از مسیری جدید به خانه برو).'
  },
  { 
    number: '777', 
    meaning: 'معجزه و پاداش', 
    desc: 'تو در مسیر درست هستی و پاداش تلاش‌هایت به زودی می‌رسد. معجزات در حال رخ دادن هستند.',
    action: 'امروز به یک نفر هدیه‌ای کوچک بده (حتی یک لبخند یا پیام پرمهر).'
  }
];

const AngelMessages: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMsg, setCurrentMsg] = useState(MESSAGES[0]);

  const openEnvelope = () => {
    const random = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setCurrentMsg(random);
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] overflow-hidden animate-in fade-in duration-700">
      <div className="text-center pt-2 pb-4 flex-shrink-0">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">پیام فرشتگان</h2>
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">فرکانس خود را تنظیم کن</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative px-4">
        {!isOpen ? (
          <div className="relative animate-float-angel flex flex-col items-center">
            
            {/* Wing Graphics - Animated and Ethereal */}
            <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-[440px] pointer-events-none z-0">
              <div className="wing-left animate-wing-pulse opacity-40 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
                  <path d="M180 60C120 0 0 0 0 60C0 120 120 120 180 60Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5" />
                  <path d="M160 60C120 20 40 20 40 60C40 100 120 100 160 60Z" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="0.5" strokeDasharray="4 2" />
                </svg>
              </div>
              <div className="wing-right animate-wing-pulse opacity-40 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" style={{animationDelay: '0.5s'}}>
                <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
                  <path d="M0 60C60 0 180 0 180 60C180 120 60 120 0 60Z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.5" />
                  <path d="M20 60C60 20 140 20 140 60C140 100 60 100 20 60Z" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="0.5" strokeDasharray="4 2" />
                </svg>
              </div>
            </div>

            {/* Glowing Aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-main/20 rounded-full blur-[100px] animate-pulse"></div>

            {/* Premium Golden Envelope */}
            <button 
              onClick={openEnvelope}
              className="group relative z-10 transition-transform active:scale-95"
            >
              <div className="relative w-72 h-48 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(217,119,6,0.6)] border-[6px] border-white/80 flex flex-col items-center justify-center gap-4 animate-gloss-periodic overflow-hidden">
                <div className="absolute inset-0 bg-white/5 opacity-50"></div>
                
                {/* Heart Wax Seal */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-rose-600 rounded-full shadow-2xl flex items-center justify-center border-[3px] border-white/90 z-20 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6 text-white fill-white animate-pulse" />
                </div>

                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center shadow-inner border border-white/40 mt-10">
                  <Mail className="w-10 h-10 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                </div>
                <span className="text-[11px] font-black text-white uppercase tracking-[0.3em] drop-shadow-lg">لمس برای پیام الهی</span>
              </div>
            </button>
            
            <div className="mt-16 flex flex-col items-center gap-2">
               <div className="flex gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
               </div>
               <div className="text-slate-400 dark:text-slate-500 text-[10px] font-black tracking-widest uppercase">
                 صدای هستی را بشنو
               </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-sm space-y-6 animate-in zoom-in duration-500">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] shadow-2xl border-4 border-amber-200 dark:border-amber-900/50 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-yellow-400 to-amber-600"></div>
               <div className="text-center space-y-6">
                  <div className="inline-block px-8 py-4 bg-amber-50 dark:bg-amber-950/50 rounded-[2rem] text-amber-600 dark:text-amber-400 font-black text-5xl shadow-inner border border-amber-100 dark:border-amber-900/30">
                    {currentMsg.number}
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{currentMsg.meaning}</h3>
                    <p className="text-[15px] text-slate-700 dark:text-slate-200 leading-relaxed font-bold">
                      {currentMsg.desc}
                    </p>
                  </div>
               </div>
            </div>

            <div className="bg-indigo-700 p-6 rounded-[3rem] text-white shadow-2xl relative overflow-hidden border-2 border-indigo-400/30">
               <Zap className="absolute top-2 right-2 opacity-10 w-16 h-16" />
               <h4 className="font-black text-[11px] uppercase tracking-[0.3em] mb-2 flex items-center gap-2 text-indigo-100">
                 <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> راهکار عملی کوانتومی
               </h4>
               <p className="text-sm font-black leading-relaxed text-white">
                 {currentMsg.action}
               </p>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="w-full py-5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-[2rem] font-black text-sm active:scale-95 transition-all shadow-md"
            >
              بستن و تفکر
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AngelMessages;
