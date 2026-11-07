# 📚 EduPlan - Smart Student Task Planner (ReactJS)

A comprehensive, mobile-first Web Application built for students to plan coursework, manage deadlines, attach lecture notes/rubrics (PDF & images), and dispatch WhatsApp / Email reminder notifications.

---

## 🌟 Key Features & Requirements

### 1. Task Management
- **Title**: Strict character limit with live counter (**Max 180 characters**).
- **Description & Study Notes**: Deep note-taking support with live progress bar and counter (**Max 20,000 characters**).
- **Course & Subject Tagging**: Assign courses (e.g., Computer Science, Organic Chemistry, Linear Algebra) with customizable tags and color indicators.
- **Priority & Status**: Urgent, High, Medium, Low; Two clear status states: **Unchecked (To Do)** and **Checked (Completed)** with celebratory confetti animation on completion.
- **Subtasks Checklist**: Manage granular steps with completion percentages.

### 2. Dual-Mode Calendar & Dates
- **Working Date vs. Due Date**: Assign both the planned study day (*Working Date*) and the hard deadline (*Due Date*).
- **Type Manually OR Select from Calendar** (*Constraint 1*):
  - **Manual Typing**: Supports `YYYY-MM-DD`, `DD/MM/YYYY`, `MM/DD/YYYY`, and more with instant validation and friendly date confirmation.
  - **Visual Calendar Picker**: Interactive month view popover with fast preset chips (*Today*, *Tomorrow*, *In 3 Days*, *Next Week*).
- **Date Range Conflict Detection**: Warns if a student schedules the working date after the due date.

### 3. PDF & Image Attachments
- **Supported Formats**: `.pdf`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.gif`, `.svg`.
- **Drag & Drop Upload Zone**: Drag slides, syllabus rubrics, or handwritten notes directly into the task modal.
- **In-App Lightbox & PDF Viewer**: Inspect full-resolution images and read attached PDF documents directly in a preview modal without leaving the app.

### 4. WhatsApp & Email Due Date Notifications
- **Urgent Task Detection**: Automatically highlights tasks due within a customizable threshold (e.g., 24 hours, 48 hours).
- **Direct WhatsApp Dispatch**: Generates clean, formatted reminders with emojis, course info, subtask progress, and deadline warnings (`wa.me` & universal web share).
- **Direct Email Dispatch**: Generates formatted `mailto:` links with complete subject and body outlines.
- **Daily Digest**: Send a bulk summary of all upcoming due tasks in a single click.
- **Browser Push Notifications**: Integrated Web Notifications API with synthesized audio chimes via Web Audio API.

### 5. Views & Mobile-First Design
- **Card Grid View**: Responsive cards with one-click notification buttons, attachment chips, and progress bars.
- **Calendar & Timeline View**: Visual monthly schedule showing both Working Dates (🔨) and Deadlines (⏰) color-coded on the calendar.
- **Kanban Board View**: Organize tasks across the two stages: *Unchecked (To Do)* and *Checked (Completed)*.
- **Mobile Friendly Bottom App Bar**: Fast thumb navigation on mobile phones with floating "+" quick-add action.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or newer)
- npm or yarn

### Installation
```bash
cd taskplanner
npm install
```

### Running Locally in Development Mode
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production
```bash
npm run build
```
Production assets are bundled to the `dist/` directory.

### Previewing the Production Build
```bash
npm run preview
```
