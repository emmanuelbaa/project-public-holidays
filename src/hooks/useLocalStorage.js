import { useCallback, useEffect, useState } from "react";

const isBrowser = typeof window !== "undefined";

const readValue = (key, defaultValue) => {
  if (!isBrowser) {
    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  }

  try {
    const stored = window.localStorage.getItem(key);
    if (stored !== null) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore malformed JSON and fall back to the default
  }

  return typeof defaultValue === "function" ? defaultValue() : defaultValue;
};

export default function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => readValue(key, defaultValue));

  const setStoredValue = useCallback(
    (next) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? next(prev) : next;
        return resolved;
      });
    },
    [setValue],
  );

  useEffect(() => {
    if (!isBrowser) return;
    try {
      if (value === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch {
      // ignore quota/permission errors
    }
  }, [key, value]);

  useEffect(() => {
    setValue(readValue(key, defaultValue));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setStoredValue];
}
