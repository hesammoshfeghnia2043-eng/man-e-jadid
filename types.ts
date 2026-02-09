
export enum Priority {
  Low = 'کم',
  Medium = 'متوسط',
  High = 'بالا'
}

export enum TaskCategory {
  Deep = 'تمرکز عمیق',
  Personal = 'شخصی',
  Social = 'اجتماعی',
  Health = 'سلامتی'
}

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  category: TaskCategory;
  completed: boolean;
  createdAt: number;
  date: string; // format: YYYY-MM-DD
  timeSlot: 'morning' | 'afternoon' | 'evening';
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  completions: string[];
  streak: number;
  frequency: number;
  active: boolean;
}

export interface JournalEntry {
  id: string;
  content: string;
  date: string;
}

export interface GratitudeEntry {
  id: string;
  items: string[];
  date: string;
}

export interface UserStats {
  points: number;
  level: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export type ViewType = 'dashboard' | 'habits' | 'planner' | 'gratitude' | 'journal' | 'angels' | 'intuition';
