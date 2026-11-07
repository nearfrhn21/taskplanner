import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, BookOpen, TrendingUp } from 'lucide-react';
import { getDueStatus } from '../utils/dateUtils';

export default function StatsOverview({ tasks = [], thresholdDays = 2, onOpenUrgent }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = total - completed;
  
  const urgentTasks = tasks.filter((t) => {
    if (t.status === 'completed') return false;
    const due = getDueStatus(t.dueDate, false, thresholdDays);
    return due.urgent;
  });

  const totalHoursPlanned = tasks
    .filter((t) => t.status !== 'completed')
    .reduce((acc, curr) => acc + (Number(curr.estimatedHours) || 0), 0);

  const completionPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* Stat 1: Total Tasks */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500">Active Tasks</span>
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <BookOpen className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900">{total - completed}</span>
          <span className="text-xs text-slate-400">/ {total} total</span>
        </div>
        <div className="mt-2 flex items-center text-[11px] text-slate-500">
          <span>{pending} pending</span>
        </div>
      </div>

      {/* Stat 2: Urgent / Due Soon */}
      <div
        onClick={urgentTasks.length > 0 ? onOpenUrgent : undefined}
        className={`p-4 rounded-2xl border shadow-2xs transition cursor-pointer ${
          urgentTasks.length > 0
            ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
            : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500">Due Soon / Urgent</span>
          <div
            className={`p-2 rounded-xl ${
              urgentTasks.length > 0 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-extrabold ${urgentTasks.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {urgentTasks.length}
          </span>
          <span className="text-xs text-slate-400">within {thresholdDays} days</span>
        </div>
        <div className="mt-2 text-[11px] font-semibold text-rose-600">
          {urgentTasks.length > 0 ? 'Click to send reminders 🔔' : 'No overdue items'}
        </div>
      </div>

      {/* Stat 3: Study Hours Planned */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500">Study Hours</span>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-extrabold text-slate-900">{totalHoursPlanned}</span>
          <span className="text-xs font-bold text-slate-500">hrs planned</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-500">
          Across pending tasks
        </div>
      </div>

      {/* Stat 4: Completion Rate */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-500">Completion</span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900">{completionPercent}%</span>
          <span className="text-xs text-slate-400">({completed} done)</span>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2.5 overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
