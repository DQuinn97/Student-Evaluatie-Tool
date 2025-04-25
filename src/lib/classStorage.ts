// Utility functions for storing and retrieving class selection from localStorage

const STORAGE_KEY = "selectedClass";

/**
 * Saves the selected class ID to localStorage
 */
export const saveSelectedClass = (classId: string): void => {
  try {
    localStorage.setItem(STORAGE_KEY, classId);
  } catch (error) {
    console.error("Error saving class to localStorage:", error);
  }
};

/**
 * Retrieves the previously selected class ID from localStorage
 * Returns null if no class was saved or if there's an error
 */
export const getSelectedClass = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error retrieving class from localStorage:", error);
    return null;
  }
};

/**
 * Clears the selected class from localStorage
 */
export const clearSelectedClass = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing class from localStorage:", error);
  }
};
