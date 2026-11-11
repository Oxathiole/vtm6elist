import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useCharacterStore } from '../store';
import {
  ClassicSheetData,
  createDefaultClassic,
  ensureShape,
  DEFAULT_CLASSIC,
} from './data';

interface ClassicStore {
  byCharacterId: Record<string, ClassicSheetData>;
  patch: (characterId: string, partial: Partial<ClassicSheetData>) => void;
  reset: (characterId: string) => void;
}

export const useClassicStore = create<ClassicStore>()(
  persist(
    (set, get) => ({
      byCharacterId: {},

      patch: (characterId, partial) => {
        set(state => {
          const old = state.byCharacterId[characterId];
          const base = old ? old : createDefaultClassic();
          return {
            byCharacterId: {
              ...state.byCharacterId,
              [characterId]: { ...base, ...partial },
            },
          };
        });
      },

      reset: (characterId) => {
        set(state => ({
          byCharacterId: {
            ...state.byCharacterId,
            [characterId]: createDefaultClassic(),
          },
        }));
      },
    }),
    {
      name: 'vtm-classic-store',
      version: 1,
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const raw = localStorage.getItem(name);
          return raw ? JSON.parse(raw) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
      })),
      onRehydrateStorage: () => (state) => {
        if (state?.byCharacterId) {
          const normalized: Record<string, ClassicSheetData> = {};
          for (const [key, val] of Object.entries(state.byCharacterId)) {
            normalized[key] = ensureShape(val);
          }
          state.byCharacterId = normalized;
        }
        return state;
      },
    }
  )
);

/** Хук: получает данные классического листа для активного персонажа.
 *  Запись НЕ создаётся во время рендера — только при первом изменении через patch. */
export const useClassicData = (activeId: string): ClassicSheetData => {
  const data = useClassicStore(s => s.byCharacterId[activeId]);
  return data ?? DEFAULT_CLASSIC;
};
