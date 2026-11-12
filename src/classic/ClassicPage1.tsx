import React, { useState } from 'react';
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

const HEALTH_LEVELS = [
  { label: 'ПОМЯТ', penalty: '' },
  { label: 'ЛЕГКО РАНЕН', penalty: '-1' },
  { label: 'РАНЕН', penalty: '-1' },
  { label: 'СЕРЬЁЗНО РАНЕН', penalty: '-2' },
  { label: 'ТЯЖЕЛО РАНЕН', penalty: '-2' },
  { label: 'ЕДВА ЖИВ', penalty: '-5' },
  { label: 'ПРИ СМЕРТИ', penalty: '' },
];

const CustomAbilityRow = ({ cat, updateAbility, abilities }: { cat: string, updateAbility: any, abilities: any }) => {
  const [name, setName] = useState('');

  const handleAdd = () => {
    if (name.trim() && (!abilities[cat] || abilities[cat][name.trim()] === undefined)) {
      updateAbility(cat, name.trim(), 0);
      setName('');
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginTop: '2px' }}>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        onBlur={handleAdd}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd(); } }}
        placeholder="+ Своя..."
        className="cl-input cl-custom-input"
        style={{ flex: 1 }}
      />
    </div>
  );
};

export const ClassicPage1 = () => {
  const {
    character, updateField, updateAttribute, updateAbility,
    addDiscipline, updateDiscipline, removeDiscipline,
    addBackground, updateBackground, removeBackground,
    addSpecialization, updateSpecialization, removeSpecialization,
    updateVirtue, updateBloodPool, updateHealth, setGeneration,
    addMerit, updateMerit, removeMerit,
    addOtherTrait, updateOtherTrait, removeOtherTrait,
    addRitual, updateRitual, removeRitual,
  } = useClassicStore();

  const gen = character.generation;
  const attrCap = (attr: string) => {
    if (gen <= 6) return 7;
    if (gen === 7) return 6;
    return 5;
  };

  const renderBloodGrid = () => {
    const max = character.bloodPool.max || 10;
    const current = character.bloodPool.current || 0;
    return (
      <div className="cl-blood-grid">
        {Array.from({ length: max }).map((_, i) => {
          const val = i + 1;
          return (
            <button
              key={val}
              className={`cl-blood-box ${val <= current ? 'filled' : ''}`}
              onClick={() => updateBloodPool('current', val === current ? 0 : val)}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="classic-page">
      <div style={{ textAlign: 'center', marginBottom: '6px' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.05em' }}>КЛАССИЧЕСКИЕ ПРАВИЛА</div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', letterSpacing: '0.05em' }}>ВАМПИРЫ</div>
        <div style={{ fontSize: '10px', letterSpacing: '0.1em', color: 'var(--muted)' }}>† МАСКАРАД †</div>
      </div>

      <div className="cl-meta-grid">
        <div>
          {[['ИГРОК', 'player'], ['ИМЯ', 'name'], ['ХРОНИКА', 'chronicle'], ['КОНЦЕПЦИЯ', 'concept']].map(([l, k]) => (
            <div key={k} className="cl-meta-row">
              <span className="cl-meta-label">{l}</span>
              <input className="cl-input" value={String((character as any)[k] || '')} onChange={e => updateField(k as any, e.target.value)} />
            </div>
          ))}
        </div>
        <div>
          {[['НАТУРА', 'nature'], ['МАСКА', 'demeanor'], ['КЛАН', 'clan'], ['СИР', 'sire']].map(([l, k]) => (
            <div key={k} className="cl-meta-row">
              <span className="cl-meta-label">{l}</span>
              <input className="cl-input" value={String((character as any)[k] || '')} onChange={e => updateField(k as any, e.target.value)} />
            </div>
          ))}
          <div className="cl-meta-row">
            <span className="cl-meta-label">ПОКОЛЕНИЕ</span>
            <input type="number" className="cl-input" value={gen} onChange={e => setGeneration(Number(e.target.value))} style={{ width: '40px' }} min={4} max={15} />
          </div>
        </div>
      </div>

      <SectionTitle>ХАРАКТЕРИСТИКИ</SectionTitle>
      <div className="cl-grid-3" style={{ marginBottom: '6px' }}>
        {[
          { t: 'ФИЗИЧЕСКИЕ', c: 'physical', a: [['strength', 'Сила'], ['dexterity', 'Ловкость'], ['stamina', 'Выносливость']] },
          { t: 'СОЦИАЛЬНЫЕ', c: 'social', a: [['charisma', 'Обаяние'], ['manipulation', 'Манипуляция'], ['appearance', 'Привлекательность']] },
          { t: 'МЕНТАЛЬНЫЕ', c: 'mental', a: [['perception', 'Восприятие'], ['intelligence', 'Интеллект'], ['wits', 'Смекалка']] },
        ].map(({ t, c, a }) => (
          <div key={c}>
            <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '10px', marginBottom: '2px' }}>{t}</div>
            {a.map(([k, l]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1px' }}>
                <span style={{ fontSize: '10px' }}>{l}</span>
                <Rating value={(character.attributes as any)[c]?.[k] || 0} max={attrCap(k)} onChange={v => updateAttribute(c as any, k, v)} allowZero={k === 'appearance'} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <SectionTitle>СПОСОБНОСТИ</SectionTitle>
      <div className="cl-grid-3" style={{ marginBottom: '6px' }}>
        {[
          { t: 'ТАЛАНТЫ', c: 'talents', l: TALENTS },
          { t: 'НАВЫКИ', c: 'skills', l: SKILLS },
          { t: 'ЗНАНИЯ', c: 'knowledges', l: KNOWLEDGES },
        ].map(({ t, c, l }) => {
          const abilDict = character.abilities[c as keyof typeof character.abilities] || {};
          const customKeys = Object.keys(abilDict).filter(k => !l.includes(k));

          return (
            <div key={c}>
              <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '10px', marginBottom: '2px' }}>{t}</div>
              {l.map(name => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1px' }}>
                  <span style={{ fontSize: '10px' }}>{name}</span>
                  <Rating value={abilDict[name] || 0} onChange={v => updateAbility(c as any, name, v)} allowZero />
                </div>
              ))}
              {customKeys.map(name => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--accent)' }}>{name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Rating value={abilDict[name] || 0} onChange={v => updateAbility(c as any, name, v)} allowZero />
                    <button className="no-print" onClick={() => updateAbility(c as any, name, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e74c3c' }}><Trash2 size={10} /></button>
                  </div>
                </div>
              ))}
              <CustomAbilityRow cat={c} updateAbility={updateAbility} abilities={character.abilities} />
            </div>
          );
        })}
      </div>

      <SectionTitle>ПРЕИМУЩЕСТВА</SectionTitle>
      <div className="cl-grid-3" style={{ marginBottom: '6px' }}>
        <div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '10px', marginBottom: '2px' }}>ДИСЦИПЛИНЫ</div>
          {(character.disciplines || []).map((d, i) => (
            <div key={i} className="cl-named-row">
              <input className="cl-input" value={d.name} onChange={e => updateDiscipline(i, 'name', e.target.value)} />
              <Rating value={d.value} shape="square" onChange={v => updateDiscipline(i, 'value', v)} allowZero />
              <button className="no-print" onClick={() => removeDiscipline(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e74c3c' }}><Trash2 size={10} /></button>
            </div>
          ))}
          <button className="no-print" onClick={addDiscipline} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '9px', padding: 0 }}>+ Добавить</button>
        </div>

        <div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '10px', marginBottom: '2px' }}>ФАКТЫ БИОГРАФИИ</div>
          {(character.backgrounds || []).map((b, i) => (
            <div key={i} className="cl-named-row">
              <input className="cl-input" value={b.name} onChange={e => updateBackground(i, 'name', e.target.value)} />
              <Rating value={b.value} shape="square" onChange={v => updateBackground(i, 'value', v)} allowZero />
              <button className="no-print" onClick={() => removeBackground(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e74c3c' }}><Trash2 size={10} /></button>
            </div>
          ))}
          <button className="no-print" onClick={addBackground} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '9px', padding: 0 }}>+ Добавить</button>
        </div>

        <div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '10px', marginBottom: '2px' }}>ДОБРОДЕТЕЛИ</div>
          {[['conscience', 'СОВЕСТЬ/РЕШИМОСТЬ'], ['selfControl', 'САМОКОНТРОЛЬ/ИНСТИНКТЫ'], ['courage', 'СМЕЛОСТЬ']].map(([k, l]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '9px', fontWeight: 'bold', flexShrink: 0 }}>{l}</span>
              <Rating value={character.virtues[k as keyof typeof character.virtues]} shape="square" onChange={v => updateVirtue(k as any, v)} allowZero />
            </div>
          ))}
        </div>
      </div>

      <div className="cl-grid-3" style={{ alignItems: 'start', marginTop: '4px' }}>
        <div>
          <SectionTitle>СПЕЦИАЛИЗАЦИИ</SectionTitle>
          <table className="cl-spec-table">
            <thead>
              <tr>
                <th>СПОСОБНОСТЬ</th>
                <th>СПЕЦИАЛИЗАЦИЯ</th>
                <th className="no-print" style={{ width: '15px' }}></th>
              </tr>
            </thead>
            <tbody>
              {(character.specializations || []).map((s, i) => (
                <tr key={i}>
                  <td><input className="cl-input" value={s.ability} onChange={e => updateSpecialization(i, 'ability', e.target.value)} /></td>
                  <td><input className="cl-input" value={s.spec} onChange={e => updateSpecialization(i, 'spec', e.target.value)} /></td>
                  <td className="no-print" style={{ textAlign: 'center', padding: 0 }}>
                    <button onClick={() => removeSpecialization(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e74c3c' }}><Trash2 size={10} /></button>
                  </td>
                </tr>
              ))}
              <tr className="no-print">
                <td colSpan={3} style={{ textAlign: 'center', padding: 0 }}>
                  <button onClick={addSpecialization} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '9px', width: '100%' }}>+ Добавить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <SectionTitle>ЧЕЛОВЕЧНОСТЬ/ПУТЬ</SectionTitle>
          <Rating value={character.humanity} max={10} onChange={v => updateField('humanity', v)} allowZero />
          <div style={{ fontSize: '9px', marginTop: '2px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            СТОЙК: <input className="cl-input" style={{ width: '60px', height: '14px' }} placeholder="( )" />
          </div>

          <SectionTitle>ВОЛЯ</SectionTitle>
          <Rating value={character.willpower} max={10} shape="square" onChange={v => updateField('willpower', v)} allowZero />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 12px)', gap: '2px', justifyContent: 'center', marginTop: '7px', marginBottom: '4px' }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <button key={i} className="cl-blood-box" style={{ width: '12px', height: '12px' }} disabled />
            ))}
          </div>

          <SectionTitle>ЗАПАС КРОВИ</SectionTitle>
          {renderBloodGrid()}
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${character.bloodPool.max || 10}, 12px)`, gap: '2px', justifyContent: 'center', marginTop: '7px' }}>
            {Array.from({ length: character.bloodPool.max || 10 }).map((_, i) => (
              <button key={i} className="cl-blood-box" style={{ width: '12px', height: '12px' }} disabled />
            ))}
          </div>
          <div style={{ fontSize: '8px', marginTop: '2px', textTransform: 'uppercase' }}>
            ПРЕДЕЛ ТРАТЫ В ХОД: <input type="number" className="cl-input" value={character.bloodPool.perTurn} readOnly style={{ width: '20px', textAlign: 'center', height: '14px', padding: 0 }} />
          </div>
        </div>

        <div>
          <SectionTitle>ЗДОРОВЬЕ</SectionTitle>
          <div style={{ padding: '0 5px' }}>
            {HEALTH_LEVELS.map((lvl, i) => (
              <div key={i} className="cl-health-row">
                <span className="cl-health-label">{lvl.label}</span>
                <span className="cl-health-pen">{lvl.penalty}</span>
                <button
                  className={`cl-dot square ${(character.health?.squares?.[i] ?? 0) > 0 ? 'filled' : ''}`}
                  onClick={() => updateHealth(i)}
                  style={{ fontSize: '10px', lineHeight: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '15px', minHeight: '12px', padding: 0 }}
                >
                  {character.health?.squares?.[i] === 1 ? '/' : character.health?.squares?.[i] === 2 ? 'X' : character.health?.squares?.[i] === 3 ? 'Ж' : ''}
                </button>
              </div>
            ))}
          </div>

          <SectionTitle>ИЗЪЯН</SectionTitle>
          <textarea className="cl-textarea" value={character.weakness} onChange={e => updateField('weakness', e.target.value)} style={{ width: '100%', height: '25px', resize: 'none' }} />

          <SectionTitle>ОПЫТ</SectionTitle>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <input type="number" className="cl-input" value={character.experience} onChange={e => updateField('experience', Number(e.target.value))} style={{ width: '60%', textAlign: 'center', border: '1px solid var(--border)' }} />
          </div>
        </div>
      </div>

      <SectionTitle>ДОСТИЖЕНИЯ / ОСОБЫЕ ЧЕРТЫ / ОБРЯДЫ</SectionTitle>
      <div className="cl-grid-3" style={{ marginBottom: '6px' }}>
        <div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '10px', marginBottom: '2px' }}>НЕДОСТАТКИ</div>
          {(character.merits || []).map((m, i) => (
            <div key={i} className="cl-named-row">
              <input className="cl-input" value={m.name} onChange={e => updateMerit(i, 'name', e.target.value)} />
              <Rating value={m.dots || 0} shape="square" onChange={v => updateMerit(i, 'dots', v)} allowZero max={7} />
              <button className="no-print" onClick={() => removeMerit(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e74c3c' }}><Trash2 size={10} /></button>
            </div>
          ))}
          <button className="no-print" onClick={addMerit} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '9px' }}>+ Добавить</button>
        </div>

        <div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '10px', marginBottom: '2px' }}>ДОСТОИНСТВА</div>
          {(character.otherTraits || []).map((t, i) => (
            <div key={i} className="cl-named-row">
              <input className="cl-input" value={t.name} onChange={e => updateOtherTrait(i, 'name', e.target.value)} />
              <Rating value={t.dots} shape="square" onChange={v => updateOtherTrait(i, 'dots', v)} allowZero max={7} />
              <button className="no-print" onClick={() => removeOtherTrait(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e74c3c' }}><Trash2 size={10} /></button>
            </div>
          ))}
          <button className="no-print" onClick={addOtherTrait} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '9px' }}>+ Добавить</button>
        </div>

        <div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '10px', marginBottom: '2px' }}>ОБРЯДЫ</div>
          {(character.rituals || []).map((r, i) => (
            <div key={i} className="cl-named-row">
              <input className="cl-input" value={r.name} onChange={e => updateRitual(i, 'name', e.target.value)} />
              <input className="cl-input" value={r.level} onChange={e => updateRitual(i, 'level', e.target.value)} style={{ width: '20px', textAlign: 'center' }} />
              <button className="no-print" onClick={() => removeRitual(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e74c3c' }}><Trash2 size={10} /></button>
            </div>
          ))}
          <button className="no-print" onClick={addRitual} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '9px' }}>+ Добавить</button>
        </div>
      </div>

      <div style={{ flex: 1 }} />
    </div>
  );
};
