// LocalStorage helper with safe JSON serialization
export const STORAGE_KEYS = {
  USER_PROFILE: 'focusmate_user_profile',
  TASKS: 'focusmate_tasks',
  EXAMS: 'focusmate_exams',
  ACTIVE_EXAM: 'focusmate_active_exam',
  ENERGY: 'focusmate_energy',
  ACTIVE_TASK_ID: 'focusmate_active_task_id',
};

export const getStoredItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null || item === undefined) return fallback;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return fallback;
  }
};

export const setStoredItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing localStorage key "${key}":`, err);
  }
};

export const removeStoredItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`Error removing localStorage key "${key}":`, err);
  }
};

export const clearAllStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach((k) => {
      localStorage.removeItem(k);
    });
  } catch (err) {
    console.warn('Error clearing localStorage:', err);
  }
};
