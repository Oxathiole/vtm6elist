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

const HEALTH_LEVELS = [
  { label: 'ПОМЯТ', penalty: '' },
  { label: 'ЛЕГКО РАНЕН', penalty: '-1' },
  { label: 'РАНЕН', penalty: '-1' },
  { label: 'СЕРЬЁЗНО РАНЕН', penalty: '-2' },
  { label: 'ТЯЖЕЛО РАНЕН', penalty: '-2' },
  { label: 'ЕДВА ЖИВ', penalty: '-5' },
  { label: 'ПРИ СМЕРТИ', penalty: '' },
];

const DETAILS_LABELS: [string, string][] = [
  ['birthDate', 'ДАТА РОЖДЕНИЯ'],
  ['apparentAge', 'КАЖЕМОЙ ВОЗРАСТ'],
  ['dateOfDeath', 'ДАТА СМЕРТИ'],
  ['gender', 'ПОЛЬ'],
  ['race', 'РАСА'],
  ['hair', 'ВОЛОСЫ'],
  ['eyes', 'ГЛАЗА'],
  ['heightWeight', 'РОСТ/ВЕС'],
  ['build', 'СОСТРОЙ'],
  ['nationality', 'НАРОДНОСТЬ'],
];

export const ClassicPage2 = () => {
  const {
    character, updateField,
    addSpecialization, updateSpecialization, removeSpecialization,
    updateBloodPool, updateHealth,
    addMerit, updateMerit, removeMerit,
    addOtherTrait, updateOtherTrait, removeOtherTrait,
    addRitual, updateRitual, removeRitual,
    addCombatRow, updateCombat, removeCombatRow,
    updateDetail,
  } = useClassicStore();

  const bloodPool = character.bloodPool || { current: 0, max: 10, perTurn: 1 };
  const health = character.health || { damageTaken: 0 };
  const details = character.details || {};

  const specs = Array.isArray(character.specializations) ? character.specializations : [];
  const merits = Array.isArray(character.merits) ? character.merits : [];
  const otherTraits = Array.isArray(character.otherTraits) ? character.otherTraits : [];
  const rituals = Array.isArray(character.rituals) ? character.rituals : [];
  const combat = Array.isArray(character.combat) ? character.combat : [];

  const renderBloodGrid = () => {
    const boxes: React.ReactNode[] = [];
    const max = Math.max(bloodPool.max || 0, 0);
    const current = Math.max(0, bloodPool.current || 0);
    for (let i = 1; i <= Math.max(20, max); i++) {
      const isAvailable = i <= max;
      const isFilled = i <= current;
      boxes.push(
        <button
          key={i}
          disabled={!isAvailable}
          className={`cl-blood-box ${isFilled ? 'filled' : ''} ${!isAvailable ? 'disabled' : ''}`}
          onClick={() => updateBloodPool('current', i === current ? 0 : i)}
        />
      );
    }
    return <div className="cl-blood-grid">{boxes}</div>;
  };

  return (
    <div className="classic-page">

      <SectionTitle>СПЕЦИАЛИЗАЦИИ</SectionTitle>

      <div className="cl-grid-3" style={{ alignItems: 'start' }}>

        <div>
          <table className="cl-spec-table">
            <thead>
              <tr>
                <th style={{ width: '45%' }}>СПОСОБНОСТЬ</th>
                <th>СПЕЦИАЛИЗАЦИЯ</th>
                <th className="no-print" style={{ width: '25px' }}></th>
              </tr>
            </thead>
            <tbody>
              {specs.map((s, i) => (
                <tr key={i}>
                  <td><input className="cl-input" value={s?.ability || ''} onChange={e => updateSpecialization(i, 'ability', e.target.value)} /></td>
                  <td><input className="cl-input" value={s?.spec || ''} onChange={e => updateSpecialization(i, 'spec', e.target.value)} /></td>
                  <td className="no-print" style={{ textAlign: 'center', padding: 0 }}>
                    <button onClick={() => removeSpecialization(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e74c3c' }}><Trash2 size={10} /></button>
                  </td>
                </tr>
              ))}
              <tr className="no-print">
                <td colSpan={3} style={{ textAlign: 'center', padding: '2px' }}>
                  <button onClick={addSpecialization} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '10px', width: '100%' }}>+ Добавить</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>ЧЕЛОВЕЧНОСТЬ/ПУТЬ</div>
          <Rating value={character.humanity || 0} max={10} onChange={v => updateField('humanity', v)} allowZero />
          <div style={{ fontSize: '10px', marginTop: '4px', marginBottom: '12px' }}>
            СТОЙК: <input className="cl-input" style={{ width: '80px' }} placeholder="( )" />
          </div>

          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>ВОЛЯ</div>
          <Rating value={character.willpower || 0} max={10} shape="square" onChange={v => updateField('willpower', v)} allowZero />
          <div style={{ height: '12px' }} />

          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>ЗАПАС КРОВИ</div>
          {renderBloodGrid()}

          <div style={{ fontSize: '9px', marginTop: '4px', textTransform: 'uppercase' }}>
            ПРЕДЕЛ ТРАТЫ В ХОД: <input type="number" className="cl-input" value={bloodPool.perTurn || 0} readOnly style={{ width: '30px', textAlign: 'center', height: '16px' }} />
          </div>
        </div>

        <div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>ЗДОРОВЬЕ</div>
          <div style={{ padding: '0 10px' }}>
            {HEALTH_LEVELS.map((lvl, i) => (
              <div key={i} className="cl-health-row">
                <span className="cl-health-label">{lvl.label}</span>
                <span className="cl-health-pen">{lvl.penalty}</span>
                <button
                  className={`cl-dot square ${health.damageTaken >= i + 1 ? 'filled' : ''}`}
                  onClick={() => updateHealth('damageTaken', health.damageTaken === i + 1 ? 0 : i + 1)}
                />
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11px', marginTop: '12px', marginBottom: '4px' }}>ИЗЪЯН</div>
          <textarea
            className="cl-textarea"
            value={character.weakness || ''}
            onChange={e => updateField('weakness', e.target.value)}
            style={{ width: '100%', height: '40px', border: '1px solid var(--border)', resize: 'none' }}
          />

          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11px', marginTop: '12px', marginBottom: '4px' }}>ОПЫТ</div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <input
              type="number"
              className="cl-input"
              value={character.experience || 0}
              onChange={e => updateField('experience', Number(e.target.value))}
              style={{ width: '60%', textAlign: 'center', border: '1px solid var(--border)' }}
            />
          </div>
        </div>
      </div>

      <SectionTitle>ПРЕИМУЩЕСТВА</SectionTitle>
      <div className="cl-grid-3">

        <div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>ДОСТИЖЕНИЯ</div>
          {merits.map((m, i) => (
            <div key={i} className="cl-named-row" style={{ height: 'auto' }}>
              <input className="cl-input" value={m?.name || ''} onChange={e => updateMerit(i, 'name', e.target.value)} />
              <input className="cl-input" value={m?.cost || ''} onChange={e => updateMerit(i, 'cost', e.target.value)} style={{ width: '40px' }} />
              <button className="no-print" onClick={() => removeMerit(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e74c3c' }}><Trash2 size={10} /></button>
            </div>
          ))}
          <button className="no-print" onClick={addMerit} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '10px', padding: '2px 0' }}>+ Добавить</button>
        </div>

        <div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>ОСОБЫЕ ЧЕРТЫ</div>
          {otherTraits.map((t, i) => (
            <div key={i} className="cl-named-row" style={{ height: 'auto' }}>
              <input className="cl-input" value={t?.name || ''} onChange={e => updateOtherTrait(i, 'name', e.target.value)} />
              <Rating value={t?.dots || 0} shape="square" onChange={v => updateOtherTrait(i, 'dots', v)} allowZero />
              <button className="no-print" onClick={() => removeOtherTrait(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e74c3c' }}><Trash2 size={10} /></button>
            </div>
          ))}
          <button className="no-print" onClick={addOtherTrait} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '10px', padding: '2px 0' }}>+ Добавить</button>
        </div>

        <div>
          <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>ОБРЯДЫ</div>
          {rituals.map((r, i) => (
            <div key={i} className="cl-named-row" style={{ height: 'auto' }}>
              <input className="cl-input" value={r?.name || ''} onChange={e => updateRitual(i, 'name', e.target.value)} />
              <input className="cl-input" value={r?.level || ''} onChange={e => updateRitual(i, 'level', e.target.value)} style={{ width: '40px' }} />
              <button className="no-print" onClick={() => removeRitual(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e74c3c' }}><Trash2 size={10} /></button>
            </div>
          ))}
          <button className="no-print" onClick={addRitual} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '10px', padding: '2px 0' }}>+ Добавить</button>
        </div>
      </div>

      <SectionTitle>БОЙ</SectionTitle>
      <table className="cl-spec-table" style={{ fontSize: '10px' }}>
        <thead>
          <tr>
            <th>ОРУЖИЕ</th>
            <th>СЛОЖНОСТЬ</th>
            <th>УРОН</th>
            <th>ДАЛЬН.</th>
            <th>ТЕМП</th>
            <th>ПАТРОНЫ</th>
            <th>РАЗМЕР</th>
          </tr>
        </thead>
        <tbody>
          {combat.map((row, i) => (
            <tr key={i}>
              <td><input className="cl-input" value={row?.weapon || ''} onChange={e => updateCombat(i, 'weapon', e.target.value)} /></td>
              <td><input className="cl-input" value={row?.difficulty || ''} onChange={e => updateCombat(i, 'difficulty', e.target.value)} /></td>
              <td><input className="cl-input" value={row?.damage || ''} onChange={e => updateCombat(i, 'damage', e.target.value)} /></td>
              <td><input className="cl-input" value={row?.range || ''} onChange={e => updateCombat(i, 'range', e.target.value)} /></td>
              <td><input className="cl-input" value={row?.rate || ''} onChange={e => updateCombat(i, 'rate', e.target.value)} /></td>
              <td><input className="cl-input" value={row?.clip || ''} onChange={e => updateCombat(i, 'clip', e.target.value)} /></td>
              <td><input className="cl-input" value={row?.size || ''} onChange={e => updateCombat(i, 'size', e.target.value)} /></td>
            </tr>
          ))}
          <tr className="no-print">
            <td colSpan={7} style={{ textAlign: 'center', padding: '2px' }}>
              <button onClick={addCombatRow} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '10px', width: '100%' }}>+ Добавить</button>
            </td>
          </tr>
        </tbody>
      </table>

      <SectionTitle>ДЕТАЛИ</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px', marginBottom: '8px' }}>
        {DETAILS_LABELS.map(([k, l]) => (
          <div key={k} className="cl-meta-row">
            <span className="cl-meta-label" style={{ flex: '0 0 80px' }}>{l}</span>
            <input className="cl-input" value={(details as any)[k] || ''} onChange={e => updateDetail(k, e.target.value)} />
          </div>
        ))}
      </div>

      <SectionTitle>ИСТОРИЯ</SectionTitle>
      <textarea
        className="cl-textarea"
        value={character.history || ''}
        onChange={e => updateField('history', e.target.value)}
        style={{ width: '100%', height: '80px', border: '1px solid var(--border)', resize: 'none' }}
      />

      <SectionTitle>ЦЕЛИ</SectionTitle>
      <textarea
        className="cl-textarea"
        value={character.goals || ''}
        onChange={e => updateField('goals', e.target.value)}
        style={{ width: '100%', height: '50px', border: '1px solid var(--border)', resize: 'none' }}
      />

      <SectionTitle>СОЮЗНИКИ И КОНТАКТЫ</SectionTitle>
      <textarea
        className="cl-textarea"
        value={character.allies || ''}
        onChange={e => updateField('allies', e.target.value)}
        style={{ width: '100%', height: '50px', border: '1px solid var(--border)', resize: 'none' }}
      />

      <SectionTitle>СОБСТВЕННОСТЬ И ЭКИПИРОВКА</SectionTitle>
      <textarea
        className="cl-textarea"
        value={character.property || ''}
        onChange={e => updateField('property', e.target.value)}
        style={{ width: '100%', height: '50px', border: '1px solid var(--border)', resize: 'none' }}
      />

      <div style={{ marginTop: 'auto', paddingTop: '16px', textAlign: 'center', fontSize: '9px', color: 'var(--muted)', letterSpacing: '0.05em' }}>
        ХАРАКТЕРИСТИКИ: 7/5/3 • СПОСОБНОСТИ: 13/9/5 • ДИСЦИПЛИНЫ: 3 • ФАКТЫ БИОГРАФИИ: 5 • ДОБРОДЕТЕЛИ: 7 • СВОБОДНЫЕ ПУНКТЫ: 15 (5/2/7/1/2)
      </div>

    </div>
  );
};
