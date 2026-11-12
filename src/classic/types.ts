export interface ClassicMerit { name: string; dots: number }
export interface ClassicOtherTrait { name: string; dots: number }
export interface ClassicRitual { name: string; level: string }
export interface ClassicCombatRow { weapon: string; difficulty: string; damage: string; range: string; rate: string; clip: string; size: string }

export interface ClassicDetails {
  birthDate: string;
  apparentAge: string;
  dateOfDeath: string;
  gender: string;
  race: string;
  hair: string;
  eyes: string;
  heightWeight: string;
  build: string;
  nationality: string;
}

export interface ClassicSheetData {
  player: string;
  name: string;
  chronicle: string;
  concept: string;
  generation: number;
  sire: string;
  nature: string;
  demeanor: string;
  clan: string;
  attributes: {
    physical: { strength: number; dexterity: number; stamina: number };
    social:   { charisma: number; manipulation: number; appearance: number };
    mental:   { perception: number; intelligence: number; wits: number };
  };
  abilities: {
    talents: Record<string, number>;
    skills: Record<string, number>;
    knowledges: Record<string, number>;
  };
  disciplines: { name: string; value: number }[];
  backgrounds: { name: string; value: number }[];
  specializations: { ability: string; spec: string }[];
  virtues: { conscience: number; selfControl: number; courage: number };
  humanity: number;
  willpower: number;
  bloodPool: { current: number; max: number; perTurn: number };
  health: { squares: number[] };
  merits: ClassicMerit[];
  otherTraits: ClassicOtherTrait[];
  rituals: ClassicRitual[];
  combat: ClassicCombatRow[];
  details: ClassicDetails;
  history: string;
  goals: string;
  description: string;
  allies: string;
  contacts: string;
  property: string;
  equipment: string;
  weakness: string;
  biography: string;
  flaws: string;
  experience: number;
}
