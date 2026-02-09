
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Loader2, Quote, AlertCircle, Heart } from 'lucide-react';
import { Habit, Task, UserStats } from '../types';

interface AIInsightProps {
  habits: Habit[];
  tasks: Task[];
  stats: UserStats;
}

const AIInsight: React.FC<AIInsightProps> = ({ habits, tasks, stats }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateInsight = async () => {
    // Check if we already have an insight for today in session storage
    const today = new Date().toISOString().split('T')[0];
    const saved = sessionStorage.getItem(`man-e-bartar-insight-${today}`);
    
    if (saved) {
      setInsight(saved);
      return;
    }

    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const activeHabitsNames = habits.filter(h => h.active).map(h => h.name).join('، ');
      const totalCompletions = habits.reduce((acc, h) => acc + h.completions.length, 0);
      
      const prompt = `
        Context: Personal transformation app "Man-e-Bartar".
        User Info: Level ${stats.level}, Habits: ${activeHabitsNames}, Successes: ${totalCompletions}.
        
        Task: Give a very warm, friendly, informal (محاوره ای) daily message. 
        Tone: Like a best friend talking to a best friend. NO BOOKISH PERSIAN.
        Goal: Deeply motivate them. Praise their persistence.
        Theme: Today is a new beginning.
        Format: One short, powerful paragraph (max 3 lines).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text || "ایول رفیق، همین که امروز هم اینجایی یعنی کارت درسته. هر تیکی که می‌زنی داری اون منِ برترت رو بیدار می‌کنی. دمت گرم!";
      setInsight(text);
      sessionStorage.setItem(`man-e-bartar-insight-${today}`, text);
    } catch (error) {
      setInsight("رفیق، امروز قراره بترکونی. هر قدمت، حتی اگه کوچیک باشه، یه کوه از تغییر می‌سازه. بهت افتخار می‌کنم!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateInsight();
  }, []);

  return (
    <div className="relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-[2.5rem] p-8 shadow-sm border border-indigo-100/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-lg text-slate-800 dark:text-white flex items-center gap-3">
          <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />
          پیام تحول امروز
        </h3>
      </div>

      <div className="relative min-h-[80px] flex items-center">
        {loading ? (
          <div className="w-full space-y-4">
            <div className="h-4 bg-slate-200/50 dark:bg-slate-700/50 rounded-full w-5/6 animate-pulse"></div>
            <div className="h-4 bg-slate-200/50 dark:bg-slate-700/50 rounded-full w-3/4 animate-pulse"></div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-3 duration-1000 relative z-10">
            <Quote className="absolute -top-6 -right-6 w-16 h-16 text-indigo-500/5 rotate-180" />
            <p className="text-slate-800 dark:text-slate-100 text-base leading-relaxed font-bold italic">
              {insight}
            </p>
          </div>
        )}
      </div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mb-16 -mr-16 blur-3xl"></div>
    </div>
  );
};

export default AIInsight;
