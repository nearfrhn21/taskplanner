import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Clock, AlertCircle, Plus, CheckCircle2 
} from 'lucide-react';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, 
  isToday as checkIsToday 
} from 'date-fns';
import { parseUserDate, formatFriendlyDate, getDueStatus } from '../utils/dateUtils';

export default function CalendarTimelineView({
  tasks = [],
  onSelectTask,
  onNewTaskWithDate
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Map tasks by working date and due date
  const getTasksForDay = (day) => {
    const formatted = format(day, 'yyyy-MM-dd');
    const workingTasks = tasks.filter((t) => t.workingDate === formatted);
    const dueTasks = tasks.filter((t) => t.dueDate === formatted);
    return { workingTasks, dueTasks };
  };

  const selectedDayInfo = getTasksForDay(selectedDay);
  const selectedFormatted = format(selectedDay, 'yyyy-MM-dd');

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Calendar Header */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Study Calendar & Deadlines
            </h2>
            <p className="text-xs text-slate-500">
              Track planned study days (🔨) and hard deadlines (⏰)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-600 mr-2">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              Working Date
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Due Date
            </span>
          </div>

          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCurrentMonth(new Date());
              setSelectedDay(new Date());
            }}
            className="px-3 py-1 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
          >
            Today
          </button>
          <span className="font-bold text-sm text-slate-800 min-w-[120px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid & Day Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        {/* Calendar Grid (2 Cols on lg) */}
        <div className="lg:col-span-2 p-3 sm:p-5">
          {/* Day of week headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d} className="text-[11px] font-bold text-slate-400 py-1">
                {d}
              </span>
            ))}
          </div>

          {/* Month Days */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {days.map((day, idx) => {
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isSelected = isSameDay(day, selectedDay);
              const isTodayDate = checkIsToday(day);
              const { workingTasks, dueTasks } = getTasksForDay(day);
              const hasActivity = workingTasks.length > 0 || dueTasks.length > 0;

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[64px] sm:min-h-[82px] p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/30 bg-indigo-50/20'
                      : isTodayDate
                      ? 'border-indigo-300 bg-indigo-50/40'
                      : isCurrentMonth
                      ? 'border-slate-100 hover:border-slate-300 bg-white'
                      : 'border-transparent bg-slate-50/50 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center ${
                        isTodayDate
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : isSelected
                          ? 'text-indigo-600 font-extrabold'
                          : isCurrentMonth
                          ? 'text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>

                    {/* Small badges */}
                    {hasActivity && (
                      <span className="text-[10px] font-bold px-1 rounded bg-slate-100 text-slate-600">
                        {workingTasks.length + dueTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Indicators for tasks */}
                  <div className="space-y-0.5 mt-1 overflow-hidden">
                    {/* Due tasks in red/amber */}
                    {dueTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className="text-[10px] font-semibold truncate px-1 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-100 flex items-center gap-1"
                        title={`Due: ${t.title}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                        <span className="truncate">{t.courseCode || t.title}</span>
                      </div>
                    ))}

                    {/* Working tasks in indigo */}
                    {workingTasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className="text-[10px] font-semibold truncate px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1"
                        title={`Work on: ${t.title}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                        <span className="truncate">{t.courseCode || t.title}</span>
                      </div>
                    ))}

                    {workingTasks.length + dueTasks.length > 2 && (
                      <p className="text-[9px] text-slate-400 font-medium pl-1">
                        +{workingTasks.length + dueTasks.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Side Panel */}
        <div className="p-4 sm:p-5 bg-slate-50/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-800">
                  {format(selectedDay, 'EEEE, MMM d')}
                </h3>
                <p className="text-xs text-slate-500">Day's Agenda & Schedule</p>
              </div>
              <button
                onClick={() => onNewTaskWithDate(selectedFormatted)}
                className="p-1.5 text-xs font-bold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 flex items-center gap-1 shadow-sm transition"
                title="Add task on this date"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* List of Tasks Due on this day */}
            <div className="space-y-3">
              <div>
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  Deadlines / Due Today ({selectedDayInfo.dueTasks.length})
                </h4>
                {selectedDayInfo.dueTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-white p-2.5 rounded-xl border border-slate-100">
                    No deadlines due on this date.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedDayInfo.dueTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => onSelectTask(t)}
                        className="p-2.5 bg-white rounded-xl border border-rose-200 hover:border-rose-300 transition cursor-pointer shadow-2xs"
                      >
                        <p className="text-xs font-bold text-slate-800 truncate">{t.title}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                          <span>{t.course}</span>
                          <span className="font-bold text-rose-600 uppercase">{t.priority}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* List of Tasks to Work On */}
              <div className="pt-2">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Planned Study Sessions ({selectedDayInfo.workingTasks.length})
                </h4>
                {selectedDayInfo.workingTasks.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-white p-2.5 rounded-xl border border-slate-100">
                    No study sessions scheduled for this date.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {selectedDayInfo.workingTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => onSelectTask(t)}
                        className="p-2.5 bg-white rounded-xl border border-indigo-200 hover:border-indigo-300 transition cursor-pointer shadow-2xs"
                      >
                        <p className="text-xs font-bold text-slate-800 truncate">{t.title}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                          <span>Est. {t.estimatedHours || 1} hrs</span>
                          <span>Due: {formatFriendlyDate(t.dueDate)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-center">
            <span className="text-[11px] text-slate-400">
              Click any date above to inspect scheduled deadlines
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
