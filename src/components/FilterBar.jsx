import React from 'react';
import { Search, Filter, SlidersHorizontal, LayoutGrid, Calendar as CalendarIcon, Kanban, X } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  onSearchChange,
  selectedCourse,
  onCourseChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  courses = []
}) {
  const hasActiveFilters = searchQuery || selectedCourse !== 'all' || selectedStatus !== 'all' || selectedPriority !== 'all';

  const clearFilters = () => {
    onSearchChange('');
    onCourseChange('all');
    onStatusChange('all');
    onPriorityChange('all');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 mb-6 shadow-2xs space-y-3">
      {/* Top row: Search input + View switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, course, notes, or attachments..."
            className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center self-end sm:self-auto bg-slate-100 p-1 rounded-xl border border-slate-200/60">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              viewMode === 'grid'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Grid Card View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cards</span>
          </button>

          <button
            onClick={() => onViewModeChange('calendar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              viewMode === 'calendar'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Study Calendar & Deadlines"
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Calendar</span>
          </button>

          <button
            onClick={() => onViewModeChange('kanban')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              viewMode === 'kanban'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Kanban Board View"
          >
            <Kanban className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Board</span>
          </button>
        </div>
      </div>

      {/* Bottom Filter & Sorting Controls */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        {/* Course Filter */}
        <div className="flex items-center gap-1 min-w-[130px]">
          <select
            value={selectedCourse}
            onChange={(e) => onCourseChange(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium focus:outline-none focus:border-indigo-600"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id || c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 min-w-[110px]">
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium focus:outline-none focus:border-indigo-600"
          >
            <option value="all">All Statuses</option>
            <option value="todo">Unchecked (To Do)</option>
            <option value="completed">Checked (Completed)</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1 min-w-[110px]">
          <select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium focus:outline-none focus:border-indigo-600"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">🔥 Urgent</option>
            <option value="high">⚡ High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="flex items-center gap-1 ml-auto min-w-[140px]">
          <span className="text-slate-400 font-medium hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium focus:outline-none focus:border-indigo-600"
          >
            <option value="dueDate">Due Date (Earliest)</option>
            <option value="workingDate">Working Date (Planned)</option>
            <option value="priority">Priority</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>

        {/* Clear filters button if active */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-2 py-1 text-xs text-rose-600 hover:text-rose-800 font-semibold hover:bg-rose-50 rounded-lg transition"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
