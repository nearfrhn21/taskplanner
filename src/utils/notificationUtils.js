// Notification utilities for WhatsApp, Email, and Browser Push
import { formatFriendlyDate, getDueStatus } from './dateUtils';

/**
 * Play an audible chime using Web Audio API (cross-browser, offline, zero assets)
 */
export function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 chord arpeggio

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.36);
    });
  } catch (e) {
    console.warn('Audio playback failed or not allowed without user interaction', e);
  }
}

/**
 * Request browser notification permission
 */
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    return { supported: false, status: 'unsupported' };
  }
  const permission = await Notification.requestPermission();
  return { supported: true, status: permission };
}

/**
 * Trigger native browser desktop/mobile notification
 */
export function sendBrowserNotification(task) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return false;
  }

  const dueInfo = getDueStatus(task.dueDate);
  const title = `⚠️ Task Reminder: ${task.title}`;
  const options = {
    body: `Course: ${task.course || 'General'} | Status: ${dueInfo.text}\nWorking Date: ${formatFriendlyDate(task.workingDate)}`,
    icon: '/favicon.ico',
    tag: `task-${task.id}`,
    requireInteraction: true
  };

  try {
    const notif = new Notification(title, options);
    notif.onclick = () => {
      window.focus();
      notif.close();
    };
    playNotificationSound();
    return true;
  } catch (err) {
    console.error('Failed to dispatch browser notification', err);
    return false;
  }
}

/**
 * Format task text for WhatsApp message
 */
export function formatWhatsAppMessage(task) {
  const dueInfo = getDueStatus(task.dueDate);
  const subtasksTotal = task.subtasks?.length || 0;
  const subtasksDone = task.subtasks?.filter(s => s.completed)?.length || 0;

  let msg = `📚 *EDUPLAN TASK REMINDER*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📌 *Title:* ${task.title}\n`;
  if (task.course) msg += `📖 *Course:* ${task.course} ${task.courseCode ? `(${task.courseCode})` : ''}\n`;
  msg += `⏰ *Due Date:* ${formatFriendlyDate(task.dueDate)} [${dueInfo.text.toUpperCase()}]\n`;
  if (task.workingDate) msg += `🔨 *Working Date:* ${formatFriendlyDate(task.workingDate)}\n`;
  msg += `⚡ *Priority:* ${task.priority?.toUpperCase() || 'NORMAL'}\n`;
  msg += `📊 *Status:* ${task.status?.replace('_', ' ').toUpperCase() || 'PENDING'}\n`;

  if (subtasksTotal > 0) {
    msg += `\n📋 *Subtasks Progress:* ${subtasksDone}/${subtasksTotal} completed (${Math.round((subtasksDone/subtasksTotal)*100)}%)\n`;
    task.subtasks.slice(0, 5).forEach(s => {
      msg += `  ${s.completed ? '✅' : '▫️'} ${s.title}\n`;
    });
    if (subtasksTotal > 5) {
      msg += `  ...and ${subtasksTotal - 5} more\n`;
    }
  }

  if (task.attachments && task.attachments.length > 0) {
    msg += `📎 *Attachments:* ${task.attachments.length} file(s) attached (PDFs/Images)\n`;
  }

  if (task.description) {
    // Truncate long description for clean WhatsApp message
    const cleanDesc = task.description.replace(/\n+/g, ' ').trim();
    const truncated = cleanDesc.length > 250 ? cleanDesc.slice(0, 247) + '...' : cleanDesc;
    msg += `\n📝 *Notes:*\n"${truncated}"\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `🚀 *Tip:* Open EduPlan to check off completed items!`;

  return msg;
}

/**
 * Trigger WhatsApp Notification (opens WhatsApp with phone or share picker)
 */
export function triggerWhatsAppNotification(task, recipientPhone = '') {
  const message = formatWhatsAppMessage(task);
  const cleanPhone = recipientPhone ? recipientPhone.replace(/[^0-9]/g, '') : '';
  
  let url = '';
  if (cleanPhone) {
    url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  } else {
    // Universal WhatsApp share link
    url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  }

  window.open(url, '_blank', 'noopener,noreferrer');
  return true;
}

/**
 * Format email subject and body for Email Notification
 */
export function formatEmailContent(task) {
  const dueInfo = getDueStatus(task.dueDate);
  const subject = `[Reminder] Student Task: "${task.title}" is ${dueInfo.text}`;

  let body = `Hello,\n\nThis is an automated reminder from your EduPlan Student Task Planner for an upcoming assignment.\n\n`;
  body += `==============================================\n`;
  body += `TASK DETAILS\n`;
  body += `==============================================\n`;
  body += `• Title: ${task.title}\n`;
  body += `• Course: ${task.course || 'General'} ${task.courseCode ? `(${task.courseCode})` : ''}\n`;
  body += `• Due Date: ${formatFriendlyDate(task.dueDate)} (${dueInfo.text})\n`;
  body += `• Working Date: ${formatFriendlyDate(task.workingDate)}\n`;
  body += `• Priority: ${(task.priority || 'Normal').toUpperCase()}\n`;
  body += `• Current Status: ${(task.status || 'To Do').replace('_', ' ').toUpperCase()}\n`;

  if (task.subtasks && task.subtasks.length > 0) {
    const done = task.subtasks.filter(s => s.completed).length;
    body += `\nSubtasks (${done}/${task.subtasks.length} Completed):\n`;
    task.subtasks.forEach((s) => {
      body += `  [${s.completed ? 'X' : ' '}] ${s.title}\n`;
    });
  }

  if (task.attachments && task.attachments.length > 0) {
    body += `\nAttached Files (${task.attachments.length}):\n`;
    task.attachments.forEach((att, idx) => {
      body += `  ${idx + 1}. ${att.name} (${(att.size / 1024).toFixed(1)} KB - ${att.type.includes('pdf') ? 'PDF' : 'Image'})\n`;
    });
  }

  if (task.description) {
    body += `\nDescription / Study Notes:\n`;
    body += `----------------------------------------------\n`;
    body += `${task.description}\n`;
    body += `----------------------------------------------\n`;
  }

  body += `\n\nStay on track and good luck studying!\nEduPlan Student Task Planner`;

  return { subject, body };
}

/**
 * Trigger Email Notification via mailto: protocol
 */
export function triggerEmailNotification(task, recipientEmail = '') {
  const { subject, body } = formatEmailContent(task);
  const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = mailtoUrl;
  return true;
}

/**
 * Format daily digest of all urgent tasks
 */
export function formatDigestMessage(tasks, type = 'whatsapp') {
  if (!tasks || tasks.length === 0) return 'No tasks due soon!';
  
  if (type === 'whatsapp') {
    let msg = `📅 *EDUPLAN DAILY DIGEST*\n`;
    msg += `You have *${tasks.length}* task(s) requiring attention:\n\n`;
    tasks.forEach((t, i) => {
      const dueInfo = getDueStatus(t.dueDate);
      msg += `*${i + 1}. ${t.title}*\n`;
      msg += `   • Course: ${t.course || 'General'}\n`;
      msg += `   • Due: ${formatFriendlyDate(t.dueDate)} (${dueInfo.text})\n`;
      msg += `   • Working Date: ${formatFriendlyDate(t.workingDate)}\n\n`;
    });
    msg += `Stay productive and finish strong! 🚀`;
    return msg;
  }

  let body = `EduPlan Task Digest\n\nYou have ${tasks.length} upcoming task(s):\n\n`;
  tasks.forEach((t, i) => {
    const dueInfo = getDueStatus(t.dueDate);
    body += `${i + 1}. ${t.title} [${t.course || 'General'}]\n`;
    body += `   Due: ${formatFriendlyDate(t.dueDate)} (${dueInfo.text})\n`;
    body += `   Planned Work Date: ${formatFriendlyDate(t.workingDate)}\n\n`;
  });
  return body;
}
