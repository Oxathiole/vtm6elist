import { safeStorage } from './storage';

interface DebouncedStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const DEBOUNCE_MS = 400;

export const debouncedStorage: DebouncedStorage = (() => {
  const pending = new Map<string, string>();
  const timers = new Map<string, ReturnType<typeof setTimeout>>();

  const flush = (key: string) => {
    const value = pending.get(key);
    if (value !== undefined) {
      safeStorage.set(key, value);
    }
    pending.delete(key);
    timers.delete(key);
  };

  return {
    getItem(key: string): Promise<string | null> {
      return Promise.resolve(safeStorage.get(key));
    },
    setItem(key: string, value: string): Promise<void> {
      pending.set(key, value);
      if (timers.has(key)) {
        clearTimeout(timers.get(key)!);
      }
      timers.set(key, setTimeout(() => flush(key), DEBOUNCE_MS));
      return Promise.resolve();
    },
    removeItem(key: string): Promise<void> {
      if (timers.has(key)) {
        clearTimeout(timers.get(key)!);
        timers.delete(key);
      }
      pending.delete(key);
      safeStorage.remove(key);
      return Promise.resolve();
    },
  };
})();
