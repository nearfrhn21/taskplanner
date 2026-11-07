import React from 'react';
import { 
  Calendar, Clock, CheckCircle2, Circle, AlertTriangle, 
  Paperclip, FileText, Image as ImageIcon, Send, Mail, 
  MoreVertical, Edit3, Trash2, CheckCircle
} from 'lucide-react';
import { formatFriendlyDate, getDueStatus } from '../utils/dateUtils';
import confetti from 'canvas-confetti';

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
  onOpenAttachment,
  onSendWhatsApp,
  onSendEmail
}) {
  const isCompleted = task.status === 'completed';
  const dueInfo = getDueStatus(task.dueDate, isCompleted);
  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter((s) => s.completed).length;
  const attachments = task.attachments || [];

  const handleToggle = () => {
    const nextStatus = isCompleted ? 'todo' : 'completed';
    if (nextStatus === 'completed') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // ignore
      }
    }
    onToggleStatus(task.id, nextStatus);
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'high':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'medium':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'low':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg ${
        isCompleted
          ? 'border-slate-200 bg-slate-50/60 opacity-80'
          : dueInfo.status === 'overdue'
          ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/10'
          : dueInfo.status === 'due-today'
          ? 'border-amber-300 ring-1 ring-amber-200 bg-amber-50/10'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="p-4 sm:p-5">
        {/* Top Badges Row */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {/* Course Tag */}
            <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 truncate max-w-[140px]">
              {task.courseCode ? `${task.courseCode} • ` : ''}{task.course || 'General'}
            </span>

            {/* Priority */}
            <span
              className={`px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide rounded-md border ${getPriorityStyle(
                task.priority
              )}`}
            >
              {task.priority || 'medium'}
            </span>
          </div>

          {/* Quick Actions (Edit / Delete) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Edit Task"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Task Title with Checkbox */}
        <div className="flex items-start gap-2.5 mb-2.5">
          <button
            type="button"
            onClick={handleToggle}
            className="mt-0.5 flex-shrink-0 text-slate-400 hover:text-indigo-600 transition-colors"
            title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-50" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          <h3
            onClick={() => onEdit(task)}
            className={`text-sm sm:text-base font-bold text-slate-800 cursor-pointer hover:text-indigo-600 transition-colors leading-snug break-words flex-1 ${
              isCompleted ? 'line-through text-slate-400' : ''
            }`}
          >
            {task.title}
          </h3>
        </div>

        {/* Description snippet */}
        {task.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Dates Row: Working Date and Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 mb-3">
          {/* Working Date */}
          <div className="flex items-center gap-1.5 min-w-0 text-slate-600">
            <Clock className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span className="font-semibold text-slate-500 text-[11px]">Work:</span>
            <span className="truncate font-medium text-slate-700">
              {formatFriendlyDate(task.workingDate)}
            </span>
          </div>

          {/* Due Date with Status indicator */}
          <div className="flex items-center gap-1.5 min-w-0">
            <Calendar className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
            <span className="font-semibold text-slate-500 text-[11px]">Due:</span>
            <span
              className={`font-semibold truncate text-[11px] ${
                dueInfo.urgent && !isCompleted ? 'text-rose-600 font-bold' : 'text-slate-700'
              }`}
            >
              {formatFriendlyDate(task.dueDate)}
            </span>
            {dueInfo.urgent && !isCompleted && (
              <span className="flex-shrink-0 px-1.5 py-0.2 text-[9px] font-extrabold uppercase rounded bg-rose-100 text-rose-700">
                {dueInfo.status === 'overdue' ? 'Overdue' : 'Due Soon'}
              </span>
            )}
          </div>
        </div>

        {/* Subtasks Progress Bar (if any) */}
        {subtasks.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1">
              <span>Subtasks</span>
              <span>
                {completedSubtasks} / {subtasks.length} ({Math.round((completedSubtasks / subtasks.length) * 100)}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${(completedSubtasks / subtasks.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Attachments Chips (PDF / Images) */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {attachments.map((att) => {
              const isPdf = att.type?.includes('pdf') || att.name?.toLowerCase().endsWith('.pdf');
              return (
                <button
                  key={att.id}
                  type="button"
                  onClick={() => onOpenAttachment(att)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-white hover:bg-indigo-50/50 hover:border-indigo-300 text-slate-700 transition-colors shadow-2xs max-w-full"
                >
                  {isPdf ? (
                    <FileText className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" />
                  ) : (
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                  )}
                  <span className="truncate max-w-[120px] text-[11px] font-medium">
                    {att.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Bottom Action Footer: One-Click WhatsApp & Email Notification Reminders */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {/* WhatsApp Reminder Button */}
            <button
              type="button"
              onClick={() => onSendWhatsApp(task)}
              title="Send task reminder via WhatsApp"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors active:scale-95"
            >
              <Send className="w-3 h-3 text-emerald-600" />
              <span>WhatsApp</span>
            </button>

            {/* Email Reminder Button */}
            <button
              type="button"
              onClick={() => onSendEmail(task)}
              title="Send task reminder via Email"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 transition-colors active:scale-95"
            >
              <Mail className="w-3 h-3 text-sky-600" />
              <span>Email</span>
            </button>
          </div>

          {/* Status Chip (Two states: COMPLETED or TODO) */}
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isCompleted ? 'COMPLETED' : 'TODO'}
          </span>
        </div>
      </div>
    </div>
  );
}
