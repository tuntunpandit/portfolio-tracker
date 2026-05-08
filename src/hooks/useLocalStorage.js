import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  // 1. Get initial state from localStorage or use provided initialValue
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.error("Error reading from localStorage", error);
    }
    return initialValue;
  });

  // 2. Update localStorage whenever the value changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  }, [key, value]);

  return [value, setValue];
}
