import i18n from '../i18n';

export type Lang = 'ru' | 'en';

const getLang = (): Lang => (i18n.language || 'ru').startsWith('ru') ? 'ru' : 'en';

/** Хелпер двуязычной подписи. Читает язык динамически. */
export const L = (ru: string, en: string): string => (getLang() === 'ru' ? ru : en);

export interface Bilingual { id: string; ru: string; en: string; }

export const ATTRIBUTES: Record<'physical'|'social'|'mental', Bilingual[]> = {
  physical: [
    { id: 'strength', ru: 'Сила', en: 'Strength' },
    { id: 'dexterity', ru: 'Ловкость', en: 'Dexterity' },
    { id: 'stamina', ru: 'Выносливость', en: 'Stamina' },
  ],
  social: [
    { id: 'charisma', ru: 'Обаяние', en: 'Charisma' },
    { id: 'manipulation', ru: 'Манипуляция', en: 'Manipulation' },
    { id: 'appearance', ru: 'Привлекательность', en: 'Appearance' },
  ],
  mental: [
    { id: 'perception', ru: 'Восприятие', en: 'Perception' },
    { id: 'intelligence', ru: 'Интеллект', en: 'Intelligence' },
    { id: 'wits', ru: 'Смекалка', en: 'Wits' },
  ],
};

export const TALENTS: Bilingual[] = [
  { id: 'athletics', ru: 'Атлетика', en: 'Athletics' },
  { id: 'alertness', ru: 'Бдительность', en: 'Alertness' },
  { id: 'brawl', ru: 'Драка', en: 'Brawl' },
  { id: 'intimidation', ru: 'Запугивание', en: 'Intimidation' },
  { id: 'expression', ru: 'Красноречие', en: 'Expression' },
  { id: 'leadership', ru: 'Лидерство', en: 'Leadership' },
  { id: 'streetwise', ru: 'Уличное чутьё', en: 'Streetwise' },
  { id: 'subterfuge', ru: 'Хитрость', en: 'Subterfuge' },
  { id: 'awareness', ru: 'Шестое чувство', en: 'Awareness' },
  { id: 'empathy', ru: 'Эмпатия', en: 'Empathy' },
];

export const SKILLS: Bilingual[] = [
  { id: 'drive', ru: 'Вождение', en: 'Drive' },
  { id: 'larceny', ru: 'Воровство', en: 'Larceny' },
  { id: 'survival', ru: 'Выживание', en: 'Survival' },
  { id: 'performance', ru: 'Исполнение', en: 'Performance' },
  { id: 'animal_ken', ru: 'Обращение с животными', en: 'Animal Ken' },
  { id: 'crafts', ru: 'Ремесло', en: 'Crafts' },
  { id: 'stealth', ru: 'Скрытность', en: 'Stealth' },
  { id: 'firearms', ru: 'Стрельба', en: 'Firearms' },
  { id: 'melee', ru: 'Фехтование', en: 'Melee' },
  { id: 'etiquette', ru: 'Этикет', en: 'Etiquette' },
];

export const KNOWLEDGES: Bilingual[] = [
  { id: 'academics', ru: 'Гуманитарные науки', en: 'Academics' },
  { id: 'science', ru: 'Естественные науки', en: 'Science' },
  { id: 'law', ru: 'Законы', en: 'Law' },
  { id: 'computer', ru: 'Информатика', en: 'Computer' },
  { id: 'medicine', ru: 'Медицина', en: 'Medicine' },
  { id: 'occult', ru: 'Оккультизм', en: 'Occult' },
  { id: 'politics', ru: 'Политика', en: 'Politics' },
  { id: 'investigation', ru: 'Расследование', en: 'Investigation' },
  { id: 'finance', ru: 'Финансы', en: 'Finance' },
  { id: 'technology', ru: 'Электроника', en: 'Technology' },
];

export const DISCIPLINES: Bilingual[] = [
  { id: 'animalism', ru: 'Анимализм', en: 'Animalism' },
  { id: 'auspex', ru: 'Ясновидение', en: 'Auspex' },
  { id: 'celerity', ru: 'Стремительность', en: 'Celerity' },
  { id: 'chimerstry', ru: 'Химерика', en: 'Chimerstry' },
  { id: 'dementation', ru: 'Помешательство', en: 'Dementation' },
  { id: 'dominate', ru: 'Доминирование', en: 'Dominate' },
  { id: 'fortitude', ru: 'Стойкость', en: 'Fortitude' },
  { id: 'necromancy', ru: 'Некромантия', en: 'Necromancy' },
  { id: 'obfuscate', ru: 'Сокрытие', en: 'Obfuscate' },
  { id: 'obtenebration', ru: 'Затемнение', en: 'Obtenebration' },
  { id: 'potence', ru: 'Мощь', en: 'Potence' },
  { id: 'presence', ru: 'Величие', en: 'Presence' },
  { id: 'protean', ru: 'Изменчивость', en: 'Protean' },
  { id: 'quietus', ru: 'Квиетус', en: 'Quietus' },
  { id: 'serpentis', ru: 'Серпентис', en: 'Serpentis' },
  { id: 'thaumaturgy', ru: 'Тауматургия', en: 'Thaumaturgy' },
  { id: 'vicissitude', ru: 'Виссиситюд', en: 'Vicissitude' },
];

export const BACKGROUNDS: Bilingual[] = [
  { id: 'allies', ru: 'Союзники', en: 'Allies' },
  { id: 'contacts', ru: 'Контакты', en: 'Contacts' },
  { id: 'fame', ru: 'Слава', en: 'Fame' },
  { id: 'generation', ru: 'Поколение', en: 'Generation' },
  { id: 'herd', ru: 'Стадо', en: 'Herd' },
  { id: 'influence', ru: 'Влияние', en: 'Influence' },
  { id: 'mentor', ru: 'Наставник', en: 'Mentor' },
  { id: 'resources', ru: 'Ресурсы', en: 'Resources' },
  { id: 'retainers', ru: 'Слуги', en: 'Retainers' },
  { id: 'status', ru: 'Статус', en: 'Status' },
  { id: 'domain', ru: 'Домен', en: 'Domain' },
  { id: 'alternate_identity', ru: 'Альтер-эго', en: 'Alternate Identity' },
];

export const NATURES: Bilingual[] = [
  { id: 'autocrat', ru: 'Автократ', en: 'Autocrat' },
  { id: 'bon_vivant', ru: 'Бонвиван', en: 'Bon Vivant' },
  { id: 'bravo', ru: 'Задира', en: 'Bravo' },
  { id: 'caregiver', ru: 'Опекун', en: 'Caregiver' },
  { id: 'child', ru: 'Ребёнок', en: 'Child' },
  { id: 'competitor', ru: 'Соперник', en: 'Competitor' },
  { id: 'conformist', ru: 'Конформист', en: 'Conformist' },
  { id: 'conniver', ru: 'Интриган', en: 'Conniver' },
  { id: 'curmudgeon', ru: 'Брюзга', en: 'Curmudgeon' },
  { id: 'deviant', ru: 'Девиант', en: 'Deviant' },
  { id: 'director', ru: 'Руководитель', en: 'Director' },
  { id: 'enigma', ru: 'Загадка', en: 'Enigma' },
  { id: 'fanatic', ru: 'Фанатик', en: 'Fanatic' },
  { id: 'gallant', ru: 'Галант', en: 'Gallant' },
  { id: 'idealist', ru: 'Идеалист', en: 'Idealist' },
  { id: 'jester', ru: 'Шут', en: 'Jester' },
  { id: 'judge', ru: 'Судья', en: 'Judge' },
  { id: 'loner', ru: 'Одиночка', en: 'Loner' },
  { id: 'martyr', ru: 'Мученик', en: 'Martyr' },
  { id: 'monster', ru: 'Монстр', en: 'Monster' },
  { id: 'pedagogue', ru: 'Педагог', en: 'Pedagogue' },
  { id: 'penitent', ru: 'Кающийся', en: 'Penitent' },
  { id: 'perfectionist', ru: 'Перфекционист', en: 'Perfectionist' },
  { id: 'rebel', ru: 'Бунтарь', en: 'Rebel' },
  { id: 'rogue', ru: 'Проходимец', en: 'Rogue' },
  { id: 'scientist', ru: 'Учёный', en: 'Scientist' },
  { id: 'sociopath', ru: 'Социопат', en: 'Sociopath' },
  { id: 'survivor', ru: 'Выживший', en: 'Survivor' },
  { id: 'traditionalist', ru: 'Традиционалист', en: 'Traditionalist' },
  { id: 'trickster', ru: 'Трикстер', en: 'Trickster' },
  { id: 'visionary', ru: 'Провидец', en: 'Visionary' },
];

export const CLANS: Bilingual[] = [
  { id: 'brujah', ru: 'Бруха', en: 'Brujah' },
  { id: 'gangrel', ru: 'Гангрел', en: 'Gangrel' },
  { id: 'malkavian', ru: 'Малкавиан', en: 'Malkavian' },
  { id: 'nosferatu', ru: 'Носферату', en: 'Nosferatu' },
  { id: 'toreador', ru: 'Тореадор', en: 'Toreador' },
  { id: 'tremere', ru: 'Тремер', en: 'Tremere' },
  { id: 'ventrue', ru: 'Вентру', en: 'Ventrue' },
  { id: 'lasombra', ru: 'Ласомбра', en: 'Lasombra' },
  { id: 'tzimisce', ru: 'Цимисхи', en: 'Tzimisce' },
  { id: 'assamite', ru: 'Ассамиты', en: 'Assamites' },
  { id: 'setites', ru: 'Сетиты', en: 'Followers of Set' },
  { id: 'giovanni', ru: 'Джованни', en: 'Giovanni' },
  { id: 'ravnos', ru: 'Равнос', en: 'Ravnos' },
  { id: 'salubri', ru: 'Салюбри', en: 'Salubri' },
  { id: 'caitiff', ru: 'Каитиф', en: 'Caitiff' },
];

export const GENERATION_BLOOD: Record<string, { max: number; perTurn: number }> = {
  '15': { max: 10, perTurn: 1 }, '14': { max: 10, perTurn: 1 }, '13': { max: 10, perTurn: 1 },
  '12': { max: 11, perTurn: 1 }, '11': { max: 12, perTurn: 1 }, '10': { max: 13, perTurn: 2 },
  '9':  { max: 14, perTurn: 2 }, '8':  { max: 15, perTurn: 3 }, '7':  { max: 20, perTurn: 4 },
  '6':  { max: 30, perTurn: 6 }, '5':  { max: 40, perTurn: 8 }, '4':  { max: 50, perTurn: 10 },
};

export const GENERATION_OPTIONS = ['4','5','6','7','8','9','10','11','12','13','14','15'];

/** Заголовки секций (двуязычные). */
export const STR = {
  header: {
    classicRules: { ru: 'КЛАССИЧЕСКИЕ ПРАВИЛА', en: 'CLASSIC RULES' },
    vampires: { ru: 'ВАМПИРЫ', en: 'VAMPIRES' },
    masquerade: { ru: '† МАСКАРАД †', en: '† MASQUERADE †' },
  },
  leftMeta: { player: { ru: 'ИГРОК', en: 'Player' }, name: { ru: 'ИМЯ', en: 'Name' }, generation: { ru: 'ПОКОЛЕНИЕ', en: 'Generation' }, sire: { ru: 'СИР', en: 'Sire' } },
  rightMeta: { nature: { ru: 'НАТУРА', en: 'Nature' }, demeanor: { ru: 'МАСКА', en: 'Demeanor' }, concept: { ru: 'АМПЛУА', en: 'Concept' }, clan: { ru: 'КЛАН', en: 'Clan' } },
  section: {
    attributes: { ru: 'ХАРАКТЕРИСТИКИ', en: 'Attributes' },
    abilities: { ru: 'СПОСОБНОСТИ', en: 'Abilities' },
    advantages: { ru: 'ПРЕИМУЩЕСТВА', en: 'Advantages' },
    specializations: { ru: 'СПЕЦИАЛИЗАЦИИ', en: 'Specializations' },
    humanity: { ru: 'ЧЕЛОВЕЧНОСТЬ/ПУТЬ', en: 'HUMANITY/PATH' },
    willpower: { ru: 'ВОЛЯ', en: 'Willpower' },
    blood: { ru: 'ЗАПАС КРОВИ', en: 'Blood Pool' },
    health: { ru: 'ЗДОРОВЬЕ', en: 'Health' },
    merits: { ru: 'ДОСТОИНСТВА И НЕДОСТАТКИ', en: 'Merits and Flaws' },
    otherTraits: { ru: 'ДРУГИЕ ПАРАМЕТРЫ', en: 'Other Traits' },
    rituals: { ru: 'РИТУАЛЫ', en: 'Rituals' },
    history: { ru: 'ИСТОРИЯ', en: 'History' },
    goals: { ru: 'ЦЕЛИ', en: 'Goals' },
    description: { ru: 'ОПИСАНИЕ', en: 'Description' },
    allies: { ru: 'СОЮЗНИКИ И КОНТАКТЫ', en: 'Allies and Contacts' },
    property: { ru: 'ИМУЩЕСТВО И СНАРЯЖЕНИЕ', en: 'Property and Equipment' },
    combat: { ru: 'БОЕВЫЕ СТОЛКНОВЕНИЯ', en: 'Combat' },
  },
  group: { physical: { ru: 'ФИЗИЧЕСКИЕ', en: 'Physical' }, social: { ru: 'СОЦИАЛЬНЫЕ', en: 'Social' }, mental: { ru: 'МЕНТАЛЬНЫЕ', en: 'Mental' } },
  sub: { talents: { ru: 'ТАЛАНТЫ', en: 'Talents' }, skills: { ru: 'НАВЫКИ', en: 'Skills' }, knowledges: { ru: 'ЗНАНИЯ', en: 'Knowledges' }, disciplines: { ru: 'ДИСЦИПЛИНЫ', en: 'Disciplines' }, backgrounds: { ru: 'ФАКТЫ БИОГРАФИИ', en: 'Backgrounds' }, virtues: { ru: 'ДОБРОДЕТЕЛИ', en: 'Virtues' } },
  virtue: { conscience: { ru: 'СОВЕСТЬ', en: 'Conscience' }, selfControl: { ru: 'САМОКОНТРОЛЬ', en: 'Self-Control' }, courage: { ru: 'СМЕЛОСТЬ', en: 'Courage' } },
  healthRows: [
    { ru: 'ПОМЯТ', en: 'Bruised', penalty: '—' },
    { ru: 'ЛЕГКО РАНЕН', en: 'Hurt', penalty: '−1' },
    { ru: 'РАНЕН', en: 'Injured', penalty: '−1' },
    { ru: 'СЕРЬЕЗНО РАНЕН', en: 'Wounded', penalty: '−2' },
    { ru: 'ТЯЖЕЛО РАНЕН', en: 'Mauled', penalty: '−2' },
    { ru: 'ЕДВА ЖИВ', en: 'Crippled', penalty: '−5' },
    { ru: 'ПРИ СМЕРТИ', en: 'Incapacitated', penalty: '—' },
  ],
  fields: {
    weakness: { ru: 'ИЗЪЯН', en: 'Weakness' },
    experience: { ru: 'ОПЫТ', en: 'Experience' },
    humanityNote: { ru: 'стоит:', en: 'cost:' },
    perTurn: { ru: 'ПРЕДЕЛ ТРАТЫ В ХОД:', en: 'LIMIT PER TURN:' },
    specializationsHeader: { ability: { ru: 'СПОСОБНОСТЬ', en: 'ABILITY' }, specialization: { ru: 'СПЕЦИАЛИЗАЦИЯ', en: 'SPECIALIZATION' } },
    ritualsHeader: { ritual: { ru: 'РИТУАЛ', en: 'RITUAL' }, level: { ru: 'УРОВЕНЬ', en: 'LEVEL' } },
    combatHeader: { weapon: { ru: 'ОРУЖИЕ/АТАКА', en: 'WEAPON/ATTACK' }, diff: { ru: 'СЛОЖН.', en: 'DIFF.' }, damage: { ru: 'УРОН', en: 'DAMAGE' }, range: { ru: 'ДАЛЬН.', en: 'RANGE' }, rate: { ru: 'СКОР.', en: 'RATE' }, clip: { ru: 'МАГАЗИН', en: 'CLIP' }, size: { ru: 'РАЗМЕР', en: 'SIZE' } },
    details: { birthDate: { ru: 'ДАТА РОЖДЕНИЯ', en: 'Birth Date' }, apparentAge: { ru: 'ВИДИМЫЙ ВОЗРАСТ', en: 'Apparent Age' }, dateOfDeath: { ru: 'ДАТА СМЕРТИ', en: 'Date of Death' }, gender: { ru: 'ПОЛ', en: 'Gender' }, race: { ru: 'РАСА', en: 'Race' }, hair: { ru: 'ВОЛОСЫ', en: 'Hair' }, eyes: { ru: 'ГЛАЗА', en: 'Eyes' }, heightWeight: { ru: 'РОСТ/ВЕС', en: 'Height/Weight' }, build: { ru: 'ТЕЛОСЛОЖЕНИЕ', en: 'Build' }, nationality: { ru: 'НАЦИОНАЛЬНОСТЬ', en: 'Nationality' } },
  },
  footer: { ru: 'ХАРАКТЕРИСТИКИ: 7/5/3 • СПОСОБНОСТИ: 13/9/5 • ДИСЦИПЛИНЫ: 3 • ФАКТЫ БИОГРАФИИ: 5 • ДОБРОДЕТЕЛИ: 7 • СВОБОДНЫЕ ПУНКТЫ: 15 (5/2/7/1/2)', en: 'ATTRIBUTES: 7/5/3 • ABILITIES: 13/9/5 • DISCIPLINES: 3 • BACKGROUNDS: 5 • VIRTUES: 7 • FREEBIE POINTS: 15 (5/2/7/1/2)' },
};

/** Дефолтный классический лист. */
export const createDefaultClassic = () => ({
  player: '', name: '', generation: '13', sire: '',
  nature: '', demeanor: '', concept: '', clan: '',
  attributes: {
    physical: { strength: 1, dexterity: 1, stamina: 1 },
    social:   { charisma: 1, manipulation: 1, appearance: 1 },
    mental:   { perception: 1, intelligence: 1, wits: 1 },
  },
  talents: Object.fromEntries(TALENTS.map(t => [t.id, 0])),
  skills: Object.fromEntries(SKILLS.map(s => [s.id, 0])),
  knowledges: Object.fromEntries(KNOWLEDGES.map(k => [k.id, 0])),
  disciplines: Array.from({ length: 6 }, () => ({ id: '', dots: 0 })),
  backgrounds: Array.from({ length: 6 }, () => ({ id: '', dots: 0 })),
  virtues: { conscience: 1, selfControl: 1, courage: 1 },
  humanity: 7,
  humanityNote: '',
  willpower: { permanent: 5, current: 5 },
  blood: { current: 10, max: 10, perTurn: 1 },
  health: [0, 0, 0, 0, 0, 0, 0],
  weakness: '',
  experience: '',
  specializations: Array.from({ length: 10 }, () => ({ ability: '', specialization: '' })),
  merits: Array.from({ length: 20 }, () => ({ name: '', cost: '' })),
  otherTraits: Array.from({ length: 12 }, () => ({ name: '', dots: 0 })),
  rituals: Array.from({ length: 10 }, () => ({ name: '', level: '' })),
  history: '', goals: '', description: '',
  details: { birthDate: '', apparentAge: '', dateOfDeath: '', gender: '', race: '', hair: '', eyes: '', heightWeight: '', build: '', nationality: '' },
  allies: '', contacts: '',
  property: '', equipment: '',
  combat: Array.from({ length: 4 }, () => ({ weapon: '', difficulty: '', damage: '', range: '', rate: '', clip: '', size: '' })),
});

/** Модульная константа-дефолт для чтения без создания записи в сторе. */
export const DEFAULT_CLASSIC = createDefaultClassic();

/** Дополняет недостающие поля дефолтами и добивает массивы до нужной длины. */
export const ensureShape = (d: any): any => {
  const base = createDefaultClassic();
  const out = { ...base, ...d };
  // attributes — нормализуем вложенные группы
  out.attributes = {
    physical: {
      strength: clamp(d?.attributes?.physical?.strength, 0, 10),
      dexterity: clamp(d?.attributes?.physical?.dexterity, 0, 10),
      stamina: clamp(d?.attributes?.physical?.stamina, 0, 10),
    },
    social: {
      charisma: clamp(d?.attributes?.social?.charisma, 0, 10),
      manipulation: clamp(d?.attributes?.social?.manipulation, 0, 10),
      appearance: clamp(d?.attributes?.social?.appearance, 0, 10),
    },
    mental: {
      perception: clamp(d?.attributes?.mental?.perception, 0, 10),
      intelligence: clamp(d?.attributes?.mental?.intelligence, 0, 10),
      wits: clamp(d?.attributes?.mental?.wits, 0, 10),
    },
  };
  // talents / skills / knowledges — только известные ключи
  out.talents = Object.fromEntries(TALENTS.map(t => [t.id, clamp(d?.talents?.[t.id] ?? 0, 0, 5)]));
  out.skills = Object.fromEntries(SKILLS.map(s => [s.id, clamp(d?.skills?.[s.id] ?? 0, 0, 5)]));
  out.knowledges = Object.fromEntries(KNOWLEDGES.map(k => [k.id, clamp(d?.knowledges?.[k.id] ?? 0, 0, 5)]));
  // virtues
  out.virtues = {
    conscience: clamp(d?.virtues?.conscience ?? base.virtues.conscience, 1, 5),
    selfControl: clamp(d?.virtues?.selfControl ?? base.virtues.selfControl, 1, 5),
    courage: clamp(d?.virtues?.courage ?? base.virtues.courage, 1, 5),
  };
  out.humanity = clamp(d?.humanity ?? base.humanity, 0, 10);
  out.willpower = {
    permanent: clamp(d?.willpower?.permanent ?? base.willpower.permanent, 1, 10),
    current: clamp(d?.willpower?.current ?? base.willpower.current, 0, 10),
  };
  // blood
  out.blood = {
    current: clamp(d?.blood?.current ?? base.blood.current, 0, 10),
    max: clamp(d?.blood?.max ?? base.blood.max, 0, 50),
    perTurn: clamp(d?.blood?.perTurn ?? base.blood.perTurn, 1, 10),
  };
  // health — ровно 7, каждое значение 0..3
  out.health = Array.from({ length: 7 }, (_, i) => clamp(d?.health?.[i] ?? 0, 0, 3));
  // массивы фиксированной длины
  const padNamed = (arr: any[], len: number) => Array.from({ length: len }, (_, i) => {
    const v = arr?.[i];
    return v ? { id: v.id ?? '', dots: clamp(v.dots ?? 0, 0, 5) } : { id: '', dots: 0 };
  });
  out.disciplines = padNamed(d?.disciplines, 6);
  out.backgrounds = padNamed(d?.backgrounds, 6);
  out.specializations = Array.from({ length: 10 }, (_, i) => {
    const v = d?.specializations?.[i];
    return v ? { ability: v.ability ?? '', specialization: v.specialization ?? '' } : { ability: '', specialization: '' };
  });
  out.merits = Array.from({ length: 20 }, (_, i) => {
    const v = d?.merits?.[i];
    return v ? { name: v.name ?? '', cost: v.cost ?? '' } : { name: '', cost: '' };
  });
  out.otherTraits = Array.from({ length: 12 }, (_, i) => {
    const v = d?.otherTraits?.[i];
    return v ? { name: v.name ?? '', dots: clamp(v.dots ?? 0, 0, 5) } : { name: '', dots: 0 };
  });
  out.rituals = Array.from({ length: 10 }, (_, i) => {
    const v = d?.rituals?.[i];
    return v ? { name: v.name ?? '', level: v.level ?? '' } : { name: '', level: '' };
  });
  out.combat = Array.from({ length: 4 }, (_, i) => {
    const v = d?.combat?.[i];
    return v
      ? { weapon: v.weapon ?? '', difficulty: v.difficulty ?? '', damage: v.damage ?? '', range: v.range ?? '', rate: v.rate ?? '', clip: v.clip ?? '', size: v.size ?? '' }
      : { weapon: '', difficulty: '', damage: '', range: '', rate: '', clip: '', size: '' };
  });
  // details
  const dd = d?.details;
  out.details = {
    birthDate: dd?.birthDate ?? '', apparentAge: dd?.apparentAge ?? '', dateOfDeath: dd?.dateOfDeath ?? '',
    gender: dd?.gender ?? '', race: dd?.race ?? '', hair: dd?.hair ?? '', eyes: dd?.eyes ?? '',
    heightWeight: dd?.heightWeight ?? '', build: dd?.build ?? '', nationality: dd?.nationality ?? '',
  };
  out.player = d?.player ?? '';
  out.name = d?.name ?? '';
  out.generation = d?.generation ?? base.generation;
  out.sire = d?.sire ?? '';
  out.nature = d?.nature ?? '';
  out.demeanor = d?.demeanor ?? '';
  out.concept = d?.concept ?? '';
  out.clan = d?.clan ?? '';
  out.humanityNote = d?.humanityNote ?? '';
  out.weakness = d?.weakness ?? '';
  out.experience = d?.experience ?? '';
  out.history = d?.history ?? '';
  out.goals = d?.goals ?? '';
  out.description = d?.description ?? '';
  out.allies = d?.allies ?? '';
  out.contacts = d?.contacts ?? '';
  out.property = d?.property ?? '';
  out.equipment = d?.equipment ?? '';
  return out;
};

const clamp = (v: number | undefined, min: number, max: number): number => {
  const n = typeof v === 'number' && !isNaN(v) ? v : 0;
  return Math.max(min, Math.min(n, max));
};
