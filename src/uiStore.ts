import { create } from 'zustand';
import { safeStorage } from './utils/storage';

interface UIStore {
  unlockAttributes: boolean;
  unlockSkills: boolean;
  setUnlockAttributes: (v: boolean) => void;
  setUnlockSkills: (v: boolean) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  unlockAttributes: safeStorage.get('vtm6e-unlock-attrs') === 'true',
  unlockSkills: safeStorage.get('vtm6e-unlock-skills') === 'true',

  setUnlockAttributes: (v) => {
    safeStorage.set('vtm6e-unlock-attrs', String(v));
    set({ unlockAttributes: v });
  },
  setUnlockSkills: (v) => {
    safeStorage.set('vtm6e-unlock-skills', String(v));
    set({ unlockSkills: v });
  },
}));
