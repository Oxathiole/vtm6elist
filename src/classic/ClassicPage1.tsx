import React from 'react';
import { useClassicStore } from './store';
import { Trash2 } from 'lucide-react';

const Dot = ({ filled, shape = 'circle', onClick }: { filled: boolean; shape?: 'circle' | 'square'; onClick?: () => void }) => (
  <button className={`cl-dot ${shape} ${filled ? 'filled' : ''}`} onClick={onClick} />
);

const Rating = ({ value, max = 5, shape = 'circle', onChange, allowZero = false }: { value: number; max?: number; shape?: 'circle' | 'square'; onChange?: (v: number) => void; allowZero?: boolean }) => (
  <div className="cl-dot-group">
    {Array.from({ length: max }).map((_, i) => (
      <Dot
        key={i}
        shape={shape}
        filled={i < value}
        onClick={() => {
          if (!onChange) return;
          if (i + 1 === value) onChange(allowZero ? 0 : Math.max(1, i));
          else onChange(i + 1);
        }}
      />
    ))}
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="cl-section-title">
    <div className="cl-line" />
    <span>{children}</span>
    <div className="cl-line" />
  </div>
);

const TALENTS = ['Атлетика', 'Бдительность', 'Драка', 'Запугивание', 'Красноречие', 'Лидерство', 'Уличное чутьё', 'Хитрость', 'Шестое чувство', 'Эмпатия'];
const SKILLS = ['Вождение', 'Воровство', 'Выживание', 'Исполнение', 'Обращение с животными', 'Ремесло', 'Скрытность', 'Стрельба', 'Фехтование', 'Этикет'];
const KNOWLEDGES = ['Гуманитарные науки', 'Естественные науки', 'Законы', 'Информатика', 'Медицина', 'Оккультизм', 'Политика', 'Расследование', 'Финансы', 'Электроника'];

export const ClassicPage1 = () => {
  const {
    character, updateField, updateAttribute, updateAbility,
    addDiscipline, updateDiscipline, removeDiscipline,
    addBackground, updateBackground, removeBackground,
    updateVirtue, setGeneration,
  } = useClassicStore();

  const gen = character.generation;
  const attrCap = (attr: string) => {
    if (attr === 'appearance') return 5;
    if (gen <= 6) return 7;
    if (gen === 7) return 6;
    return 5;
  };

  const disciplines = Array.isArray(character.disciplines) ? character.disciplines : [];
  const backgrounds = Array.isArray(character.backgrounds) ? character.backgrounds : [];
  const attributes = character.attributes || {};
  const abilities = character.abilities || {};

  const metaFields: [string, string][] = [
    ['ИГРОК', 'player'], ['ИМЯ', 'name'], ['ХРОНИКА', 'chronicle'], ['КОНЦЕПЦИЯ', 'concept'],
    ['НАТУРА', 'nature'], ['МАСКА', 'demeanor'], ['КЛАН', 'clan'], ['СИР', 'sire'],
  ];

  return (
    <div className="classic-page">

      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.05em' }}>КЛАССИЧЕСКИЕ ПРАВИЛА</div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.05em' }}>ВАМПИРЫ</div>
        <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: 'var(--muted)' }}>† МАСКАРАД †</div>
      </div>

      <div className="cl-meta-grid">
        <div>
          {metaFields.slice(0, 4).map(([l, k]) => (
            <div key={k} className="cl-meta-row">
              <span className="cl-meta-label">{l}</span>
              <input className="cl-input" value={String((character as any)[k] ?? '')} onChange={e => updateField(k as any, e.target.value)} />
            </div>
          ))}
        </div>
        <div>
          {metaFields.slice(4, 8).map(([l, k]) => (
            <div key={k} className="cl-meta-row">
              <span className="cl-meta-label">{l}</span>
              <input className="cl-input" value={String((character as any)[k] ?? '')} onChange={e => updateField(k as any, e.target.value)} />
            </div>
          ))}
          <div className="cl-meta-row">
            <span className="cl-meta-label">ПОКОЛЕНИЕ</span>
            <input type="number" className="cl-input" value={gen} onChange={e => setGeneration(Number(e.target.value))} style={{ width: '50px' }} min={4} max={15} />
          </div>
        </div>
      </div>

      <SectionTitle>ХАРАКТЕРИСТИКИ</SectionTitle>
      <div className="cl-grid-3" style={{ marginBottom: '12px' }}>
        {[
          { t: 'ФИЗИЧЕСКИЕ', c: 'physical', a: [['strength', 'Сила'], ['dexterity', 'Ловкость'], ['stamina', 'Выносливость']] },
          { t: 'СОЦИАЛЬНЫЕ', c: 'social', a: [['charisma', 'Обаяние'], ['manipulation', 'Манипуляция'], ['appearance', 'Привлекательность']] },
          { t: 'МЕНТАЛЬНЫЕ', c: 'mental', a: [['perception', 'Восприятие'], ['intelligence', 'Интеллект'], ['wits', 'Смекалка']] },
        ].map(({ t, c, a }) => (
          <div key={c}>
            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>{t}</div>
            {a.map(([k, l]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span>{l}</span>
                <Rating value={(attributes as any)[c]?.[k] || 0} max={attrCap(k)} onChange={v => updateAttribute(c as any, k, v)} allowZero={k === 'appearance'} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <SectionTitle>СПОСОБНОСТИ</SectionTitle>
      <div className="cl-grid-3" style={{ marginBottom: '12px' }}>
        {[
          { t: 'ТАЛАНТЫ', c: 'talents', l: TALENTS },
          { t: 'НАВЫКИ', c: 'skills', l: SKILLS },
          { t: 'ЗНАНИЯ', c: 'knowledges', l: KNOWLEDGES },
        ].map(({ t, c, l }) => (
          <div key={c}>
            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>{t}</div>
            {l.map(name => (
              <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                <span>{name}</span>
                <Rating value={(abilities as any)[c]?.[name] || 0} onChange={v => updateAbility(c as any, name, v)} allowZero />
              </div>
            ))}
          </div>
        ))}
      </div>

      <SectionTitle>ПРЕИМУЩЕСТВА</SectionTitle>
      <div className="cl-grid-3">
        <div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>ДИСЦИПЛИНЫ</div>
          {disciplines.map((d, i) => (
            <div key={i} className="cl-named-row">
              <input className="cl-input" value={d?.name || ''} onChange={e => updateDiscipline(i, 'name', e.target.value)} />
              <Rating value={d?.value || 0} shape="square" onChange={v => updateDiscipline(i, 'value', v)} allowZero />
              <button className="no-print" onClick={() => removeDiscipline(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e74c3c' }}><Trash2 size={12} /></button>
            </div>
          ))}
          <button className="no-print" onClick={addDiscipline} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '10px', padding: '2px 0' }}>+ Добавить</button>
        </div>

        <div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>ФАКТЫ БИОГРАФИИ</div>
          {backgrounds.map((b, i) => (
            <div key={i} className="cl-named-row">
              <input className="cl-input" value={b?.name || ''} onChange={e => updateBackground(i, 'name', e.target.value)} />
              <Rating value={b?.value || 0} shape="square" onChange={v => updateBackground(i, 'value', v)} allowZero />
              <button className="no-print" onClick={() => removeBackground(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e74c3c' }}><Trash2 size={12} /></button>
            </div>
          ))}
          <button className="no-print" onClick={addBackground} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '10px', padding: '2px 0' }}>+ Добавить</button>
        </div>

        <div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>ДОБРОДЕТЕЛИ</div>
          {[['conscience', 'СОВЕСТЬ/РЕШИМОСТЬ'], ['selfControl', 'САМОКОНТРОЛЬ/ИНСТИНКТЫ'], ['courage', 'СМЕЛОСТЬ']].map(([k, l]) => (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold', marginBottom: '2px' }}>{l}</span>
              <Rating value={(character.virtues as any)?.[k] || 0} shape="square" onChange={v => updateVirtue(k as any, v)} allowZero />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
