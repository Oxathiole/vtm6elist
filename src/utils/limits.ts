// Лимиты по сводке:
// - Потолок Характеристик: неонат 5, анцилла 6, старейшина 8
// - Макс. Навык при создании = 3 для ВСЕХ типов вампиров
// - unlock=true полностью снимает лимиты (Unlock в шапке)

export const getAttributeCap = (type: string, unlock: boolean): number => {
  if (unlock) return 10;
  switch (type) {
    case 'elder':   return 8;
    case 'ancilla': return 6;
    default:        return 5; // vampire_neonate, duskborn
  }
};

export const getSkillCap = (_type: string, unlock: boolean): number => {
  if (unlock) return 5;
  return 3; // По шагу 4: при создании ни один Навык не может превышать 3 пункта
};

export const getDisciplineCap = (type: string, unlock: boolean): number => {
  if (unlock) return 10;
  switch (type) {
    case 'elder':   return 8;
    case 'ancilla': return 6;
    default:       return 5;
  }
};
