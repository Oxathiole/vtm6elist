import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ClassicSheetData } from './types';
import { safeStorage } from '../utils/storage';

const createDefault = (): ClassicSheetData => ({
  player: '',
  name: '',
  chronicle: '',
  concept: '',
  generation: 13,
  sire: '',
  nature: '',
  demeanor: '',
  clan: '',
  attributes: {
    physical: { strength: 1, dexterity: 1, stamina: 1 },
    social:   { charisma: 1, manipulation: 1, appearance: 1 },
    mental:   { perception: 1, intelligence: 1, wits: 1 },
  },
  abilities: {
    talents: {},
    skills: {},
    knowledges: {},
  },
  disciplines: [],
  backgrounds: [],
  specializations: [],
  virtues: { conscience: 1, selfControl: 1, courage: 1 },
  humanity: 7,
  willpower: 5,
  bloodPool: { current: 10, max: 10, perTurn: 1 },
  health: { damageTaken: 0 },
  merits: [],
  otherTraits: [],
  rituals: [],
  combat: [],
  details: {
    birthDate: '',
    apparentAge: '',
    dateOfDeath: '',
    gender: '',
    race: '',
    hair: '',
    eyes: '',
    heightWeight: '',
    build: '',
    nationality: '',
  },
  history: '',
  goals: '',
  description: '',
  allies: '',
  contacts: '',
  property: '',
  equipment: '',
  weakness: '',
  biography: '',
  flaws: '',
  experience: 0,
});

const BLOOD_POOL_TABLE: Record<number, { max: number; perTurn: number }> = {
  4: { max: 50, perTurn: 10 }, 5: { max: 40, perTurn: 8 },
  6: { max: 30, perTurn: 6 },  7: { max: 20, perTurn: 4 },
  8: { max: 15, perTurn: 3 },  9: { max: 14, perTurn: 2 },
  10: { max: 13, perTurn: 1 }, 11: { max: 12, perTurn: 1 },
  12: { max: 11, perTurn: 1 }, 13: { max: 10, perTurn: 1 },
};

type ClassicState = {
  character: ClassicSheetData;
  updateField: (field: keyof ClassicSheetData, value: any) => void;
  updateAttribute: (cat: 'physical' | 'social' | 'mental', key: string, value: number) => void;
  updateAbility: (cat: 'talents' | 'skills' | 'knowledges', name: string, value: number) => void;
  addDiscipline: () => void;
  updateDiscipline: (index: number, field: 'name' | 'value', value: string | number) => void;
  removeDiscipline: (index: number) => void;
  addBackground: () => void;
  updateBackground: (index: number, field: 'name' | 'value', value: string | number) => void;
  removeBackground: (index: number) => void;
  addSpecialization: () => void;
  updateSpecialization: (index: number, field: 'ability' | 'spec', value: string) => void;
  removeSpecialization: (index: number) => void;
  updateVirtue: (key: 'conscience' | 'selfControl' | 'courage', value: number) => void;
  updateBloodPool: (field: 'current' | 'max' | 'perTurn', value: number) => void;
  updateHealth: (field: 'damageTaken', value: number) => void;
  setGeneration: (value: number) => void;
  updateMerit: (index: number, field: 'name' | 'cost', value: string) => void;
  addMerit: () => void;
  removeMerit: (index: number) => void;
  updateOtherTrait: (index: number, field: 'name' | 'dots', value: string | number) => void;
  addOtherTrait: () => void;
  removeOtherTrait: (index: number) => void;
  updateRitual: (index: number, field: 'name' | 'level', value: string) => void;
  addRitual: () => void;
  removeRitual: (index: number) => void;
  updateCombat: (index: number, field: string, value: string) => void;
  addCombatRow: () => void;
  removeCombatRow: (index: number) => void;
  updateDetail: (key: string, value: string) => void;
};

export const useClassicStore = create<ClassicState>()(
  persist(
    (set, get) => ({
      character: createDefault(),

      updateField: (field, value) => set({ character: { ...get().character, [field]: value } }),

      updateAttribute: (cat, key, value) => set({
        character: { ...get().character, attributes: { ...get().character.attributes, [cat]: { ...get().character.attributes[cat], [key]: value } } },
      }),

      updateAbility: (cat, name, value) => set({
        character: {
          ...get().character,
          abilities: {
            ...get().character.abilities,
            [cat]: value === -1
              ? Object.fromEntries(Object.entries(get().character.abilities[cat]).filter(([k]) => k !== name))
              : { ...get().character.abilities[cat], [name]: value },
          },
        },
      }),

      addDiscipline: () => set({ character: { ...get().character, disciplines: [...get().character.disciplines, { name: '', value: 0 }] } }),
      updateDiscipline: (index, field, value) => {
        const discs = [...get().character.disciplines];
        discs[index] = { ...discs[index], [field]: value };
        set({ character: { ...get().character, disciplines: discs } });
      },
      removeDiscipline: (index) => set({ character: { ...get().character, disciplines: get().character.disciplines.filter((_, i) => i !== index) } }),

      addBackground: () => set({ character: { ...get().character, backgrounds: [...get().character.backgrounds, { name: '', value: 0 }] } }),
      updateBackground: (index, field, value) => {
        const bgs = [...get().character.backgrounds];
        bgs[index] = { ...bgs[index], [field]: value };
        set({ character: { ...get().character, backgrounds: bgs } });
      },
      removeBackground: (index) => set({ character: { ...get().character, backgrounds: get().character.backgrounds.filter((_, i) => i !== index) } }),

      addSpecialization: () => set({ character: { ...get().character, specializations: [...get().character.specializations, { ability: '', spec: '' }] } }),
      updateSpecialization: (index, field, value) => {
        const specs = [...get().character.specializations];
        specs[index] = { ...specs[index], [field]: value };
        set({ character: { ...get().character, specializations: specs } });
      },
      removeSpecialization: (index) => set({ character: { ...get().character, specializations: get().character.specializations.filter((_, i) => i !== index) } }),

      updateVirtue: (key, value) => set({ character: { ...get().character, virtues: { ...get().character.virtues, [key]: value } } }),
      updateBloodPool: (field, value) => set({ character: { ...get().character, bloodPool: { ...get().character.bloodPool, [field]: value } } }),
      updateHealth: (field, value) => set({ character: { ...get().character, health: { ...get().character.health, [field]: value } } }),

      setGeneration: (value) => {
        const bp = BLOOD_POOL_TABLE[value] || { max: 10, perTurn: 1 };
        set({
          character: { ...get().character, generation: value, bloodPool: { current: bp.max, max: bp.max, perTurn: bp.perTurn } },
        });
      },

      // Merits
      addMerit: () => set({ character: { ...get().character, merits: [...get().character.merits, { name: '', cost: '' }] } }),
      updateMerit: (index, field, value) => {
        const m = [...get().character.merits];
        m[index] = { ...m[index], [field]: value };
        set({ character: { ...get().character, merits: m } });
      },
      removeMerit: (index) => set({ character: { ...get().character, merits: get().character.merits.filter((_, i) => i !== index) } }),

      // Other Traits
      addOtherTrait: () => set({ character: { ...get().character, otherTraits: [...get().character.otherTraits, { name: '', dots: 0 }] } }),
      updateOtherTrait: (index, field, value) => {
        const ot = [...get().character.otherTraits];
        ot[index] = { ...ot[index], [field]: value };
        set({ character: { ...get().character, otherTraits: ot } });
      },
      removeOtherTrait: (index) => set({ character: { ...get().character, otherTraits: get().character.otherTraits.filter((_, i) => i !== index) } }),

      // Rituals
      addRitual: () => set({ character: { ...get().character, rituals: [...get().character.rituals, { name: '', level: '' }] } }),
      updateRitual: (index, field, value) => {
        const r = [...get().character.rituals];
        r[index] = { ...r[index], [field]: value };
        set({ character: { ...get().character, rituals: r } });
      },
      removeRitual: (index) => set({ character: { ...get().character, rituals: get().character.rituals.filter((_, i) => i !== index) } }),

      // Combat
      addCombatRow: () => set({
        character: {
          ...get().character,
          combat: [...get().character.combat, { weapon: '', difficulty: '', damage: '', range: '', rate: '', clip: '', size: '' }],
        },
      }),
      updateCombat: (index, field, value) => {
        const c = [...get().character.combat];
        c[index] = { ...c[index], [field]: value };
        set({ character: { ...get().character, combat: c } });
      },
      removeCombatRow: (index) => set({ character: { ...get().character, combat: get().character.combat.filter((_, i) => i !== index) } }),

      // Details
      updateDetail: (key, value) => set({
        character: { ...get().character, details: { ...get().character.details, [key]: value } },
      }),
    }),
    {
      name: 'classic-sheet',
      storage: createJSONStorage(() => ({
        getItem: (name) => safeStorage.get(name),
        setItem: (name, value) => safeStorage.set(name, value),
        removeItem: (name) => safeStorage.remove(name),
      })),
      migrate: (persisted: any) => {
        if (!persisted || typeof persisted !== 'object') return { character: createDefault() };
        const c = persisted.character;
        const d = createDefault();
        return {
          character: {
            ...d,
            ...c,
            attributes: {
              physical: { ...d.attributes.physical, ...(c.attributes?.physical ?? {}) },
              social:   { ...d.attributes.social,   ...(c.attributes?.social ?? {}) },
              mental:   { ...d.attributes.mental,  ...(c.attributes?.mental ?? {}) },
            },
            abilities: {
              talents:    { ...d.abilities.talents,    ...(c.abilities?.talents ?? {}) },
              skills:     { ...d.abilities.skills,     ...(c.abilities?.skills ?? {}) },
              knowledges: { ...d.abilities.knowledges, ...(c.abilities?.knowledges ?? {}) },
            },
            disciplines: Array.isArray(c.disciplines) ? c.disciplines : [],
            backgrounds: Array.isArray(c.backgrounds) ? c.backgrounds : [],
            specializations: Array.isArray(c.specializations) ? c.specializations : [],
            virtues: {
              conscience:  c.virtues?.conscience  ?? d.virtues.conscience,
              selfControl: c.virtues?.selfControl ?? d.virtues.selfControl,
              courage:     c.virtues?.courage     ?? d.virtues.courage,
            },
            bloodPool: {
              current: c.bloodPool?.current ?? d.bloodPool.current,
              max:     c.bloodPool?.max     ?? d.bloodPool.max,
              perTurn: c.bloodPool?.perTurn ?? d.bloodPool.perTurn,
            },
            health: {
              damageTaken: c.health?.damageTaken ?? d.health.damageTaken,
            },
            merits: Array.isArray(c.merits) ? c.merits : [],
            otherTraits: Array.isArray(c.otherTraits) ? c.otherTraits : [],
            rituals: Array.isArray(c.rituals) ? c.rituals : [],
            combat: Array.isArray(c.combat) ? c.combat : [],
            details: { ...d.details, ...(c.details ?? {}) },
          } as ClassicSheetData,
        };
      },
    }
  )
);
