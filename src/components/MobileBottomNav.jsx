import React from 'react';
import { LayoutGrid, Calendar, Kanban, Bell, Plus } from 'lucide-react';

export default function MobileBottomNav({
  viewMode,
  onViewModeChange,
  onOpenNewTask,
  onOpenNotifications,
  urgentCount = 0
}) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-1.5 px-3 sm:hidden shadow-lg safe-area-pb">
      <div className="flex items-center justify-around">
        {/* Tab 1: Tasks */}
        <button
          onClick={() => onViewModeChange('grid')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            viewMode === 'grid' ? 'text-indigo-600 font-bold' : 'text-slate-400'
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Tasks</span>
        </button>

        {/* Tab 2: Calendar */}
        <button
          onClick={() => onViewModeChange('calendar')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            viewMode === 'calendar' ? 'text-indigo-600 font-bold' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Calendar</span>
        </button>

        {/* Center Floating Plus Button */}
        <button
          onClick={onOpenNewTask}
          className="-mt-5 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 ring-4 ring-white active:scale-95 transition"
          title="Add New Task"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Tab 3: Board */}
        <button
          onClick={() => onViewModeChange('kanban')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition ${
            viewMode === 'kanban' ? 'text-indigo-600 font-bold' : 'text-slate-400'
          }`}
        >
          <Kanban className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Board</span>
        </button>

        {/* Tab 4: Alerts */}
        <button
          onClick={onOpenNotifications}
          className="relative flex flex-col items-center py-1 px-2 rounded-xl text-slate-400 transition"
        >
          <Bell className="w-5 h-5" />
          {urgentCount > 0 && (
            <span className="absolute top-0 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-[9px] font-bold text-white flex items-center justify-center">
              {urgentCount}
            </span>
          )}
          <span className="text-[10px] mt-0.5">Alerts</span>
        </button>
      </div>
    </nav>
  );
}
