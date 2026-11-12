import { create } from 'zustand';
import { safeStorage } from './utils/storage';

type Edition = '6e' | '20th';

interface UIStore {
  unlockAttributes: boolean;
  unlockSkills: boolean;
  edition: Edition;
  setUnlockAttributes: (v: boolean) => void;
  setUnlockSkills: (v: boolean) => void;
  setEdition: (v: Edition) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  unlockAttributes: safeStorage.get('vtm6e-unlock-attrs') === 'true',
  unlockSkills: safeStorage.get('vtm6e-unlock-skills') === 'true',
  edition: (safeStorage.get('vtm-sheet-edition') as Edition) || '20th',

  setUnlockAttributes: (v) => {
    safeStorage.set('vtm6e-unlock-attrs', String(v));
    set({ unlockAttributes: v });
  },
  setUnlockSkills: (v) => {
    safeStorage.set('vtm6e-unlock-skills', String(v));
    set({ unlockSkills: v });
  },
  setEdition: (v) => {
    safeStorage.set('vtm-sheet-edition', v);
    set({ edition: v });
  },
}));
