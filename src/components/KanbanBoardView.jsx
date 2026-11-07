import React from 'react';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

const COLUMNS = [
  { id: 'todo', title: 'Unchecked (To Do)', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  { id: 'completed', title: 'Checked (Completed)', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' }
];

export default function KanbanBoardView({
  tasks = [],
  onEdit,
  onDelete,
  onToggleStatus,
  onOpenAttachment,
  onSendWhatsApp,
  onSendEmail,
  onNewTask
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => (t.status || 'todo') === col.id);

        return (
          <div
            key={col.id}
            className="bg-slate-100/70 rounded-2xl p-3 sm:p-3.5 border border-slate-200 flex flex-col max-h-[85vh]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  {col.title}
                </span>
                <span className="px-1.5 py-0.2 text-[10px] font-extrabold rounded-full bg-white border border-slate-200 text-slate-600">
                  {columnTasks.length}
                </span>
              </div>

              {col.id === 'todo' && (
                <button
                  onClick={onNewTask}
                  className="p-1 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-white transition"
                  title="Add Task"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Column Tasks Scroll Area */}
            <div className="space-y-3 overflow-y-auto pr-0.5 flex-1 min-h-[150px]">
              {columnTasks.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="text-xs text-slate-400">No tasks in this stage</p>
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleStatus={onToggleStatus}
                    onOpenAttachment={onOpenAttachment}
                    onSendWhatsApp={onSendWhatsApp}
                    onSendEmail={onSendEmail}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
