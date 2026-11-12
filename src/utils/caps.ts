// Лимиты по сводке + миграционные утилиты (чистые функции, без side effects).
import { HistoryItem } from '../types';

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

// Лимит по поколению: 4,5,6 → 7; 7 → 6; 8-13+ → 5
export const getAttributeCapByGeneration = (generation: string | number, unlock: boolean): number => {
  if (unlock) return 10;
  const gen = parseInt(String(generation), 10);
  if (isNaN(gen)) return 5;
  if (gen <= 6) return 7;   // 4,5,6 -> 7
  if (gen === 7) return 6;  // 7 -> 6
  return 5;                 // 8-13+ -> 5
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

// ─── Migration: history from old saves ────────────────────────────
// Принимает всё, что угодно (undefined, string, number, массив строк,
// массив объектов, старые поля change/text), возвращает чистый HistoryItem[].
export const normalizeHistory = (raw: any): HistoryItem[] => {
  if (!Array.isArray(raw)) return [];
  const out: HistoryItem[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;

    const id = typeof item.id === 'string' && item.id
      ? item.id
      : (typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `h-${Math.random().toString(36).slice(2)}`);

    const timestamp = typeof item.timestamp === 'number' && isFinite(item.timestamp)
      ? item.timestamp
      : Date.now();

    // Поддерживаем все известные формы:
    // - changes: string[]  (актуальная)
    // - changes: string    (возможно когда-то был singular)
    // - change:  string    (очень старый)
    // - text:    string    (совсем старый)
    let changes: string[] = [];
    if (Array.isArray(item.changes)) {
      changes = item.changes
        .filter((c: any) => typeof c === 'string' && c.trim().length > 0);
    } else if (typeof item.changes === 'string' && item.changes.trim()) {
      changes = [item.changes];
    } else if (typeof item.change === 'string' && item.change.trim()) {
      changes = [item.change];
    } else if (typeof item.text === 'string' && item.text.trim()) {
      changes = [item.text];
    }

    // Полностью пустые записи выкидываем — от них нет пользы, только шум.
    if (changes.length === 0) continue;

    out.push({ id, timestamp, changes });
  }
  // Лимит 50 — как в pushHistory
  return out.slice(0, 50);
};
