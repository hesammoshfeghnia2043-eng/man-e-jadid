
import React, { useState, useMemo } from 'react';
import { Task, Priority, TaskCategory } from '../types';
import { Plus, Check, Trash2, ChevronRight, ChevronLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface DailyPlannerProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addPoints: (amount: number) => void;
}

const DailyPlanner: React.FC<DailyPlannerProps> = ({ tasks, setTasks, addPoints }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const dateKey = currentDate.toISOString().split('T')[0];
  
  const persianDate = useMemo(() => {
    return new Intl.DateTimeFormat('fa-IR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    }).format(currentDate);
  }, [currentDate]);

  const dailyTasks = useMemo(() => {
    return tasks.filter(t => t.date === dateKey);
  }, [tasks, dateKey]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTitle,
      priority: Priority.Medium,
      category: TaskCategory.Personal,
      completed: false,
      createdAt: Date.now(),
      date: dateKey,
      timeSlot: 'morning'
    };

    setTasks([task, ...tasks]);
    setNewTitle('');
    setIsAdding(false);
    addPoints(10);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        if (!t.completed) addPoints(15);
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const changeDay = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + offset);
    setCurrentDate(newDate);
    setIsAdding(false);
  };

  const goToToday = () => setCurrentDate(new Date());

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* ورق روزانه */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-500 opacity-20"></div>
        
        <div className="flex justify-between items-center mb-8">
          {/* فلش سمت راست -> روز قبل */}
          <button onClick={() => changeDay(-1)} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors">
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="text-center">
            <h2 className="text-xl font-black text-slate-800 dark:text-white">{persianDate}</h2>
            <button 
              onClick={goToToday}
              className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-1 hover:underline"
            >
              امروز
            </button>
          </div>

          {/* فلش سمت چپ -> روز بعد */}
          <button onClick={() => changeDay(1)} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>

        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
           <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-slate-500">چک لیست کارهای روزانه</span>
           </div>
           <button 
             onClick={() => setIsAdding(true)}
             className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all"
           >
             <Plus className="w-5 h-5" />
           </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={addTask} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] shadow-2xl border-2 border-indigo-100 dark:border-indigo-900/30 space-y-4 animate-in slide-in-from-top-4">
          <input 
            type="text" 
            placeholder="چه کاری باید انجام شه؟" 
            className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none outline-none font-bold text-sm focus:ring-2 focus:ring-indigo-500"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm">افزودن</button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl font-black text-sm">لغو</button>
          </div>
        </form>
      )}

      {/* لیست تسک‌ها */}
      <div className="space-y-3">
        {dailyTasks.length === 0 ? (
          <div className="text-center py-20 opacity-30">
            <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="text-xs font-bold">ورق امروز هنوز سفیده!</p>
          </div>
        ) : (
          dailyTasks.map(task => (
            <div key={task.id} className={`group bg-white dark:bg-slate-900 p-5 rounded-[2rem] flex items-center justify-between border border-slate-100 dark:border-slate-800 transition-all ${task.completed ? 'opacity-50' : 'shadow-sm'}`}>
              <div className="flex items-center gap-4 flex-1">
                <button 
                  onClick={() => toggleTask(task.id)} 
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 text-white' : 'bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700'}`}
                >
                  {task.completed && <Check className="w-5 h-5 stroke-[3]" />}
                </button>
                <p className={`text-sm font-bold ${task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                  {task.title}
                </p>
              </div>
              <button 
                onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} 
                className="p-2 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DailyPlanner;
