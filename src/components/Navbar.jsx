import React from 'react';
import { 
  GraduationCap, Bell, Plus, Calendar, Settings, 
  Sparkles, CheckCircle2, AlertTriangle, Moon, Sun
} from 'lucide-react';

export default function Navbar({
  onOpenNewTask,
  onOpenNotifications,
  urgentCount = 0,
  onResetData
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-slate-900 text-lg sm:text-xl tracking-tight leading-none">
                  EduPlan
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Student Planner
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Stay on top of deadlines & study schedules
              </p>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Urgent Alerts Bell Button */}
            <button
              onClick={onOpenNotifications}
              className={`relative p-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                urgentCount > 0
                  ? 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title="Notifications & Reminders"
            >
              <Bell className="w-4 h-4" />
              {urgentCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-extrabold text-white shadow-sm animate-bounce">
                  {urgentCount}
                </span>
              )}
              <span className="text-xs font-bold hidden md:inline">
                {urgentCount > 0 ? `${urgentCount} Due Soon` : 'Reminders'}
              </span>
            </button>

            {/* Quick Demo Reset / Info */}
            <button
              onClick={onResetData}
              className="hidden lg:inline-flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition"
              title="Reset to sample student data"
            >
              Reset Samples
            </button>

            {/* "+ New Task" Main Call-To-Action Button */}
            <button
              onClick={onOpenNewTask}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/25 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
