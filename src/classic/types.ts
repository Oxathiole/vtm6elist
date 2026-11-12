export interface ClassicNamedDots { id: string; dots: number }
export interface ClassicMerit { name: string; cost: string }
export interface ClassicOtherTrait { name: string; dots: number }
export interface ClassicRitual { name: string; level: string }
export interface ClassicContact { name: string; role: string; notes: string }
export interface ClassicSpec { ability: string; specialization: string }
export interface ClassicCombatRow { weapon: string; difficulty: string; damage: string; range: string; rate: string; clip: string; size: string }

export interface ClassicSheetData {
  player: string; name: string; generation: string; sire: string;
  nature: string; demeanor: string; concept: string; clan: string;
  attributes: {
    physical: { strength: number; dexterity: number; stamina: number };
    social:   { charisma: number; manipulation: number; appearance: number };
    mental:   { perception: number; intelligence: number; wits: number };
  };
  talents: Record<string, number>;
  skills: Record<string, number>;
  knowledges: Record<string, number>;
  disciplines: ClassicNamedDots[];
  backgrounds: ClassicNamedDots[];
  virtues: { conscience: number; selfControl: number; courage: number };
  humanity: number;
  humanityPath: string;
  humanityNote: string;
  bearing: string;
  willpower: { permanent: number; current: number };
  blood: { current: number; max: number; perTurn: number };
  health: number[];
  weakness: string;
  experience: string;
  specializations: ClassicSpec[];
  merits: ClassicMerit[];
  otherTraits: ClassicOtherTrait[];
  rituals: ClassicRitual[];
  history: string[]; goals: string[]; description: string[];
  details: { birthDate: string; apparentAge: string; dateOfDeath: string; gender: string; race: string;
             hair: string; eyes: string; heightWeight: string; build: string; nationality: string };
  allies: string; enemies: string; contacts: ClassicContact[];
  property: string; equipment: string;
  combat: ClassicCombatRow[];
}
