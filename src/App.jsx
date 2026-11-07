import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import FilterBar from './components/FilterBar';
import TaskCard from './components/TaskCard';
import TaskModal from './components/TaskModal';
import CalendarTimelineView from './components/CalendarTimelineView';
import KanbanBoardView from './components/KanbanBoardView';
import AttachmentViewerModal from './components/AttachmentViewerModal';
import NotificationCenterModal from './components/NotificationCenterModal';
import MobileBottomNav from './components/MobileBottomNav';
import { 
  loadTasks, saveTasks, loadCourses, saveCourses, 
  loadSettings, saveSettings, resetAllData 
} from './utils/storage';
import { getDueStatus } from './utils/dateUtils';
import { 
  triggerWhatsAppNotification, 
  triggerEmailNotification 
} from './utils/notificationUtils';
import { Plus, BookOpen, AlertTriangle, Send, Sparkles } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState(() => loadTasks());
  const [courses, setCourses] = useState(() => loadCourses());
  const [settings, setSettings] = useState(() => loadSettings());

  // View & Filter states
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'calendar' | 'kanban'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  // Modals
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingAttachment, setViewingAttachment] = useState(null);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  // Sync tasks to storage
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Sync courses to storage
  useEffect(() => {
    saveCourses(courses);
  }, [courses]);

  // Sync settings to storage
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  // Calculate urgent tasks (due within threshold or overdue)
  const urgentTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (t.status === 'completed') return false;
      const dueInfo = getDueStatus(t.dueDate, false, settings.reminderThresholdDays);
      return dueInfo.urgent;
    });
  }, [tasks, settings.reminderThresholdDays]);

  // Filter & sort tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search text matching
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = task.title?.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q);
          const matchCourse = task.course?.toLowerCase().includes(q) || task.courseCode?.toLowerCase().includes(q);
          const matchAtt = task.attachments?.some((a) => a.name?.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchCourse && !matchAtt) return false;
        }

        // Course filter
        if (selectedCourse !== 'all' && task.course !== selectedCourse) {
          return false;
        }

        // Status filter
        if (selectedStatus !== 'all' && task.status !== selectedStatus) {
          return false;
        }

        // Priority filter
        if (selectedPriority !== 'all' && task.priority !== selectedPriority) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return (a.dueDate || '9999').localeCompare(b.dueDate || '9999');
        }
        if (sortBy === 'workingDate') {
          return (a.workingDate || '9999').localeCompare(b.workingDate || '9999');
        }
        if (sortBy === 'priority') {
          const rank = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (rank[b.priority] || 0) - (rank[a.priority] || 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [tasks, searchQuery, selectedCourse, selectedStatus, selectedPriority, sortBy]);

  // Task Handlers
  const handleOpenCreateTask = (presetDate = '') => {
    setEditingTask(presetDate ? { dueDate: presetDate, workingDate: presetDate } : null);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    setTasks((prev) => {
      const exists = prev.some((t) => t.id === taskData.id);
      if (exists) {
        return prev.map((t) => (t.id === taskData.id ? taskData : t));
      }
      return [taskData, ...prev];
    });
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    }
  };

  const handleToggleStatus = (taskId, nextStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t))
    );
  };

  const handleAddCourse = (newCourse) => {
    setCourses((prev) => [...prev, newCourse]);
  };

  const handleSendWhatsApp = (task) => {
    triggerWhatsAppNotification(task, settings.studentPhone);
  };

  const handleSendEmail = (task) => {
    triggerEmailNotification(task, settings.studentEmail);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all tasks and settings back to original demo samples?')) {
      const data = resetAllData();
      if (data) {
        setTasks(data.tasks);
        setCourses(data.courses);
        setSettings(data.settings);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20 sm:pb-12 text-slate-900">
      {/* Top Navbar */}
      <Navbar
        onOpenNewTask={() => handleOpenCreateTask()}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        urgentCount={urgentTasks.length}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Urgent Alert Banner (if tasks are due soon) */}
        {urgentTasks.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 border border-amber-300/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-sm flex-shrink-0 animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Attention: {urgentTasks.length} task(s) near due date!
                </p>
                <p className="text-xs text-slate-600">
                  Deadlines approaching within {settings.reminderThresholdDays} days. Send a WhatsApp or Email reminder to stay on track.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setIsNotificationCenterOpen(true)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 flex items-center gap-1.5"
              >
                <span>Review & Notify</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Statistics Overview */}
        <StatsOverview
          tasks={tasks}
          thresholdDays={settings.reminderThresholdDays}
          onOpenUrgent={() => setIsNotificationCenterOpen(true)}
        />

        {/* Filter, Search, and View Mode Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCourse={selectedCourse}
          onCourseChange={setSelectedCourse}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          selectedPriority={selectedPriority}
          onPriorityChange={setSelectedPriority}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          courses={courses}
        />

        {/* View Switcher: Grid vs Calendar vs Kanban */}
        {viewMode === 'grid' && (
          filteredTasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">No tasks found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5">
                {searchQuery || selectedCourse !== 'all'
                  ? 'No tasks matched your search or filters. Try clearing them.'
                  : 'You have no tasks scheduled yet. Start by adding your first coursework assignment!'}
              </p>
              <button
                onClick={() => handleOpenCreateTask()}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Task</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleStatus={handleToggleStatus}
                  onOpenAttachment={(att) => setViewingAttachment(att)}
                  onSendWhatsApp={handleSendWhatsApp}
                  onSendEmail={handleSendEmail}
                />
              ))}
            </div>
          )
        )}

        {viewMode === 'calendar' && (
          <CalendarTimelineView
            tasks={tasks}
            onSelectTask={handleEditTask}
            onNewTaskWithDate={handleOpenCreateTask}
          />
        )}

        {viewMode === 'kanban' && (
          <KanbanBoardView
            tasks={filteredTasks}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
            onToggleStatus={handleToggleStatus}
            onOpenAttachment={(att) => setViewingAttachment(att)}
            onSendWhatsApp={handleSendWhatsApp}
            onSendEmail={handleSendEmail}
            onNewTask={() => handleOpenCreateTask()}
          />
        )}
      </main>

      {/* Task Create/Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
        courses={courses}
        onAddCourse={handleAddCourse}
      />

      {/* PDF & Image Lightbox Attachment Viewer Modal */}
      <AttachmentViewerModal
        attachment={viewingAttachment}
        onClose={() => setViewingAttachment(null)}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
        tasks={tasks}
        settings={settings}
        onSaveSettings={setSettings}
      />

      {/* Mobile Friendly Bottom Nav (Constraint 4) */}
      <MobileBottomNav
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenNewTask={() => handleOpenCreateTask()}
        onOpenNotifications={() => setIsNotificationCenterOpen(true)}
        urgentCount={urgentTasks.length}
      />
    </div>
  );
}
