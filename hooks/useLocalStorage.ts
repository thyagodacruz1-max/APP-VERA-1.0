
import React, { useState, useEffect } from 'react';

function getValueFromStorage<T,>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') {
    return initialValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    // If there's no item in storage, return the initial value.
    if (item === null) {
      return initialValue;
    }
    const parsedItem = JSON.parse(item);
    // If the stored value is explicitly null (which can happen if "null" was stored),
    // fall back to the initial value. This is critical for arrays to prevent crashes.
    if (parsedItem === null) {
      return initialValue;
    }
    return parsedItem;
  } catch (error) {
    // If JSON.parse fails (e.g., malformed data), it's safer to reset to the initial value.
    console.error(`Error parsing localStorage key "${key}":`, error);
    return initialValue;
  }
}

// FIX: Added React to import to make React.Dispatch and React.SetStateAction types available.
export function useLocalStorage<T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => getValueFromStorage(key, initialValue));

  useEffect(() => {
    try {
      const valueToStore = typeof storedValue === 'function' ? storedValue(storedValue) : storedValue;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}
