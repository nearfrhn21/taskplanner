import React, { useState } from 'react';
import { 
  X, Bell, Send, Mail, AlertTriangle, CheckCircle2, 
  Settings2, Volume2, ShieldAlert, Sparkles, ExternalLink
} from 'lucide-react';
import { 
  triggerWhatsAppNotification, 
  triggerEmailNotification, 
  formatDigestMessage,
  requestNotificationPermission,
  sendBrowserNotification,
  playNotificationSound 
} from '../utils/notificationUtils';
import { getDueStatus, formatFriendlyDate } from '../utils/dateUtils';

export default function NotificationCenterModal({
  isOpen,
  onClose,
  tasks = [],
  settings,
  onSaveSettings
}) {
  const [activeTab, setActiveTab] = useState('alerts'); // 'alerts' | 'settings'
  const [phone, setPhone] = useState(settings?.studentPhone || '');
  const [email, setEmail] = useState(settings?.studentEmail || '');
  const [thresholdDays, setThresholdDays] = useState(settings?.reminderThresholdDays || 2);
  const [browserNotifStatus, setBrowserNotifStatus] = useState(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [toastMessage, setToastMessage] = useState('');

  if (!isOpen) return null;

  // Filter urgent tasks: overdue, due today, due tomorrow, or due within threshold
  const urgentTasks = tasks.filter((t) => {
    if (t.status === 'completed') return false;
    const dueInfo = getDueStatus(t.dueDate, false, thresholdDays);
    return dueInfo.urgent;
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleRequestBrowserPermission = async () => {
    const res = await requestNotificationPermission();
    setBrowserNotifStatus(res.status);
    if (res.status === 'granted') {
      showToast('Browser notifications enabled!');
      playNotificationSound();
    } else {
      showToast('Permission ' + res.status);
    }
  };

  const handleTestBrowserNotification = () => {
    if (urgentTasks.length > 0) {
      sendBrowserNotification(urgentTasks[0]);
    } else {
      sendBrowserNotification({
        id: 'test',
        title: 'Sample Study Session - Math Exam Prep',
        course: 'Mathematics',
        dueDate: new Date().toISOString(),
        workingDate: new Date().toISOString()
      });
    }
    showToast('Sent test notification!');
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      studentPhone: phone,
      studentEmail: email,
      reminderThresholdDays: Number(thresholdDays)
    });
    showToast('Notification settings saved!');
  };

  const handleSendDigestWhatsApp = () => {
    if (urgentTasks.length === 0) {
      alert('No urgent tasks to send!');
      return;
    }
    const digest = formatDigestMessage(urgentTasks, 'whatsapp');
    const cleanPhone = phone ? phone.replace(/[^0-9]/g, '') : '';
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(digest)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(digest)}`;
    window.open(url, '_blank');
  };

  const handleSendDigestEmail = () => {
    if (urgentTasks.length === 0) {
      alert('No urgent tasks to send!');
      return;
    }
    const digest = formatDigestMessage(urgentTasks, 'email');
    const subject = `[EduPlan Digest] ${urgentTasks.length} Task(s) Due Soon!`;
    const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(digest)}`;
    window.location.href = mailto;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">
                Notification & Alert Center
              </h2>
              <p className="text-xs text-slate-500">
                WhatsApp & Email alerts for tasks near due date
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-100 px-6 pt-2 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('alerts')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'alerts'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>Urgent Due Alerts</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-700 font-extrabold">
              {urgentTasks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Reminder Settings</span>
          </button>
        </div>

        {/* Toast confirmation */}
        {toastMessage && (
          <div className="mx-6 mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'alerts' ? (
            <div className="space-y-4">
              {urgentTasks.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">All caught up!</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                    No tasks are overdue or due within the next {thresholdDays} days. Great job staying ahead!
                  </p>
                </div>
              ) : (
                <>
                  {/* Bulk dispatch banner */}
                  <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        {urgentTasks.length} task(s) near due date!
                      </p>
                      <p className="text-[11px] text-amber-700">
                        Send yourself or your study group a summary reminder
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleSendDigestWhatsApp}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        WhatsApp Digest
                      </button>
                      <button
                        onClick={handleSendDigestEmail}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95"
                      >
                        <Mail className="w-3.5 h-3.5 text-sky-600" />
                        Email Digest
                      </button>
                    </div>
                  </div>

                  {/* List of Urgent Tasks */}
                  <div className="space-y-2.5">
                    {urgentTasks.map((t) => {
                      const due = getDueStatus(t.dueDate);
                      return (
                        <div
                          key={t.id}
                          className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 transition-colors shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700">
                                {due.text}
                              </span>
                              <span className="text-xs font-semibold text-slate-500">
                                {t.course}
                              </span>
                            </div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                              {t.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Due: {formatFriendlyDate(t.dueDate)} • Planned Work: {formatFriendlyDate(t.workingDate)}
                            </p>
                          </div>

                          {/* Action dispatch buttons */}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => triggerWhatsAppNotification(t, phone)}
                              className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1 transition active:scale-95"
                              title="Send WhatsApp Notification"
                            >
                              <Send className="w-3 h-3 text-emerald-600" />
                              <span>WhatsApp</span>
                            </button>
                            <button
                              onClick={() => triggerEmailNotification(t, email)}
                              className="px-2.5 py-1.5 text-xs font-bold rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 flex items-center gap-1 transition active:scale-95"
                              title="Send Email Notification"
                            >
                              <Mail className="w-3 h-3 text-sky-600" />
                              <span>Email</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Settings Tab */
            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target WhatsApp Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +62812345678 or +1234567890"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Include country code. Used to automatically target your WhatsApp chat when dispatching reminders.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Student Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. student@university.edu"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Used for prefilling the recipient in email reminder drafts.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Due Date Alert Threshold
                </label>
                <select
                  value={thresholdDays}
                  onChange={(e) => setThresholdDays(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-indigo-600"
                >
                  <option value={1}>1 Day Before Due Date (24 Hours)</option>
                  <option value={2}>2 Days Before Due Date (48 Hours - Recommended)</option>
                  <option value={3}>3 Days Before Due Date</option>
                  <option value={5}>5 Days Before Due Date</option>
                  <option value={7}>1 Week Before Due Date</option>
                </select>
              </div>

              {/* Browser Push & Audio Chime */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-bold text-slate-800">Browser Push Notifications</p>
                    <p className="text-[11px] text-slate-500">Status: {browserNotifStatus}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {browserNotifStatus !== 'granted' ? (
                      <button
                        type="button"
                        onClick={handleRequestBrowserPermission}
                        className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition"
                      >
                        Enable
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleTestBrowserNotification}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition"
                      >
                        Send Test
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <p className="text-xs font-bold text-slate-800">Reminder Chime Test</p>
                    <p className="text-[11px] text-slate-500">Play web audio synthesized chime</p>
                  </div>
                  <button
                    type="button"
                    onClick={playNotificationSound}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl border border-indigo-200 transition"
                    title="Play Sound"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition"
                >
                  Save Notification Preferences
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
