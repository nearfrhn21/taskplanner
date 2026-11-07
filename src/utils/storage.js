// Storage manager for LocalStorage & indexed caching
import { INITIAL_TASKS, INITIAL_COURSES, DEFAULT_SETTINGS } from './sampleData';

const TASKS_KEY = 'eduplan_student_tasks_v1';
const COURSES_KEY = 'eduplan_courses_v1';
const SETTINGS_KEY = 'eduplan_settings_v1';

export function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) {
      saveTasks(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_TASKS;
  } catch (e) {
    console.error('Error loading tasks from localStorage', e);
    return INITIAL_TASKS;
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Error saving tasks to localStorage', e);
  }
}

export function loadCourses() {
  try {
    const raw = localStorage.getItem(COURSES_KEY);
    if (!raw) {
      saveCourses(INITIAL_COURSES);
      return INITIAL_COURSES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_COURSES;
  } catch (e) {
    console.error('Error loading courses', e);
    return INITIAL_COURSES;
  }
}

export function saveCourses(courses) {
  try {
    localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
  } catch (e) {
    console.error('Error saving courses', e);
  }
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (e) {
    console.error('Error loading settings', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
  }
}

export function resetAllData() {
  try {
    localStorage.removeItem(TASKS_KEY);
    localStorage.removeItem(COURSES_KEY);
    localStorage.removeItem(SETTINGS_KEY);
    return {
      tasks: INITIAL_TASKS,
      courses: INITIAL_COURSES,
      settings: DEFAULT_SETTINGS
    };
  } catch (e) {
    console.error('Error resetting data', e);
  }
}
