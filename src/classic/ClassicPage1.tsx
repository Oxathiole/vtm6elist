import React, { FC } from 'react';
import {
  ATTRIBUTES,
  TALENTS,
  SKILLS,
  KNOWLEDGES,
  DISCIPLINES,
  BACKGROUNDS,
  NATURES,
  CLANS,
  GENERATION_OPTIONS,
  GENERATION_BLOOD,
  STR,
  L,
} from './data';
import { ClassicSheetData } from './types';
import { SectionTitle, Rating, Field } from './ui';
import { useClassicStore } from './store';

interface ClassicPage1Props {
  activeId: string;
  data: ClassicSheetData;
}

/** Normalize a free-ability name to a record key. */
const getAbilityKey = (name: string): string => {
  const trimmed = name.trim();
  return trimmed ? trimmed.toLowerCase().replace(/\s+/g, '_') : '__other';
};

/** Get the display name from a key ('__other' means empty). */
const getKeyDisplayName = (key: string): string => {
  return key === '__other' ? '' : key;
};

const HEALTH_ROWS = [
  { ru: 'Помят', en: 'Bruised', pen: '—' },
  { ru: 'Легко ранен', en: 'Hurt', pen: '−1' },
  { ru: 'Ранен', en: 'Injured', pen: '−1' },
  { ru: 'Серьёзно ранен', en: 'Wounded', pen: '−2' },
  { ru: 'Тяжело ранен', en: 'Mauled', pen: '−2' },
  { ru: 'Едва жив', en: 'Crippled', pen: '−5' },
  { ru: 'При смерти', en: 'Incapacitated', pen: '—' },
];
const HEALTH_MARKS = ['', '/', '✕', ''];

const MetaRow: FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="cl-meta-row">
    <span className="cl-meta-label" title={label}>{label}</span>
    {children}
  </div>
);

const PoolSquares: FC<{ value: number; max: number; disabledFrom?: number; size?: number; onChange: (v: number) => void }> =
  ({ value, max, disabledFrom, size = 12, onChange }) => (
    <div className="cl-pool-row">
      {Array.from({ length: max }).map((_, i) => {
        const pos = i + 1;
        const disabled = disabledFrom !== undefined && pos > disabledFrom;
        return (
          <button key={pos} type="button" disabled={disabled}
            className={`cl-pool-box${pos <= value ? ' on' : ''}`}
            style={{ width: size, height: size }}
            onClick={() => onChange(pos === value ? 0 : pos)} />
        );
      })}
    </div>
  );

const BloodGrid: FC<{ current: number; max: number; onChange: (v: number) => void }> = ({ current, max, onChange }) => {
  const rows = Math.max(2, Math.ceil(max / 10));
  return (
    <div className="cl-blood-grid">
      {Array.from({ length: rows * 10 }).map((_, i) => {
        const pos = i + 1;
        const disabled = pos > max;
        return (
          <button key={pos} type="button" disabled={disabled}
            className={`cl-pool-box${pos <= current ? ' on' : ''}`}
            style={{ width: 12, height: 12 }}
            onClick={() => onChange(pos === current ? 0 : pos)} />
        );
      })}
    </div>
  );
};

const HealthColumn: FC<{
  health: number[]; weakness: string; experience: string;
  onHealth: (v: number[]) => void; onWeakness: (v: string) => void; onExperience: (v: string) => void;
}> = ({ health, weakness, experience, onHealth, onWeakness, onExperience }) => (
  <div className="cl-bottom-col">
    <SectionTitle>{L(STR.section.health.ru, STR.section.health.en)}</SectionTitle>
    <div>
      {HEALTH_ROWS.map((r, i) => (
        <div className="cl-health-row" key={r.en}>
          <span className="cl-health-label">{L(r.ru, r.en)}</span>
          <span className="cl-health-pen">{r.pen}</span>
          <button type="button" className="cl-health-box"
            onClick={() => onHealth(health.map((v, idx) => (idx === i ? (v + 1) % 4 : v)))}>
            {HEALTH_MARKS[health[i] ?? 0]}
          </button>
        </div>
      ))}
    </div>
    <SectionTitle>{L('Изъян', 'Weakness')}</SectionTitle>
    <input className="cl-input cl-weakness-input" value={weakness} onChange={e => onWeakness(e.target.value)} />
    <SectionTitle>{L('Опыт', 'Experience')}</SectionTitle>
    <div className="cl-exp-wrap">
      <input className="cl-input cl-exp-input" value={experience} onChange={e => onExperience(e.target.value)} />
    </div>
  </div>
);

export const ClassicPage1: FC<ClassicPage1Props> = ({ activeId, data }) => {
  const patch = useClassicStore(s => s.patch);

  const setMeta = (field: keyof ClassicSheetData, value: string) =>
    patch(activeId, { [field]: value } as Partial<ClassicSheetData>);

  const setAttr = (group: 'physical' | 'social' | 'mental', key: string, value: number) =>
    patch(activeId, {
      attributes: {
        ...data.attributes,
        [group]: { ...data.attributes[group], [key]: value },
      },
    });

  const setAbility = (type: 'talents' | 'skills' | 'knowledges', key: string, value: number) =>
    patch(activeId, { [type]: { ...data[type], [key]: value } });

  const setFreeAbility = (type: 'talents' | 'skills' | 'knowledges', name: string, dots: number) => {
    const knownIds = new Set(
      type === 'talents' ? TALENTS.map(t => t.id) :
      type === 'skills' ? SKILLS.map(s => s.id) :
      KNOWLEDGES.map(k => k.id)
    );
    const record: Record<string, number> = { ...data[type] };
    Object.keys(record).forEach(key => {
      if (!knownIds.has(key)) delete record[key];
    });
    const key = getAbilityKey(name);
    record[key] = dots;
    patch(activeId, { [type]: record });
  };

  const setNamedDots = (arr: 'disciplines' | 'backgrounds', index: number, field: 'id' | 'dots', value: string | number) => {
    const list = [...(data[arr] as any[])];
    list[index] = { ...list[index], [field]: value };
    patch(activeId, { [arr]: list } as Partial<ClassicSheetData>);
  };

  const setVirtue = (key: 'conscience' | 'selfControl' | 'courage', value: number) =>
    patch(activeId, { virtues: { ...data.virtues, [key]: value } });

  const setHumanity = (value: number) => patch(activeId, { humanity: value });

  const setWillpower = (key: 'permanent' | 'current', value: number) =>
    patch(activeId, { willpower: { ...data.willpower, [key]: value } });

  const setBlood = (key: 'current' | 'max' | 'perTurn', value: number) =>
    patch(activeId, { blood: { ...data.blood, [key]: value } });

  const setHealth = (value: number[]) => patch(activeId, { health: value });

  const setSpec = (index: number, field: 'ability' | 'specialization', value: string) => {
    const list = [...data.specializations];
    list[index] = { ...list[index], [field]: value };
    patch(activeId, { specializations: list });
  };

  const setGeneration = (g: string) => {
    const gb = GENERATION_BLOOD[g] ?? { max: 10, perTurn: 1 };
    patch(activeId, {
      generation: g,
      blood: { ...data.blood, max: gb.max, perTurn: gb.perTurn, current: Math.min(data.blood.current, gb.max) },
    });
  };
  const setWillpowerPermanent = (v: number) =>
    patch(activeId, { willpower: { permanent: v, current: Math.min(data.willpower.current, v) } });

  // --- Render helpers ---

  const renderAttributes = (group: 'physical' | 'social' | 'mental') => {
    const groupData = data.attributes[group];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: '3px' }}>
          {L(STR.group[group].ru, STR.group[group].en)}
        </span>
        {ATTRIBUTES[group].map(attr => (
          <div key={attr.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1px' }}>
            <span style={{ fontSize: '10px', color: 'var(--text)', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', textAlign: 'left', letterSpacing: '0.02em' }}>
              {L(attr.ru, attr.en)}
            </span>
            <Rating
              value={groupData[attr.id as keyof typeof groupData]}
              max={5}
              min={1}
              shape="circle"
              size={10}
              onChange={v => setAttr(group, attr.id, v)}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderAbilityColumn = (type: 'talents' | 'skills' | 'knowledges', list: { id: string; ru: string; en: string }[]) => {
    const knownIds = new Set(list.map(x => x.id));
    const freeEntry = Object.entries(data[type]).find(([k]) => !knownIds.has(k));
    const freeKey = freeEntry ? freeEntry[0] : '__other';
    const freeName = getKeyDisplayName(freeKey);
    const freeDots = freeEntry ? freeEntry[1] : 0;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <span style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)', textAlign: 'center', margin: '0 0 2px' }}>
          {L(STR.sub[type].ru, STR.sub[type].en)}
        </span>
        {list.map((item, i) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '9px', color: 'var(--text)', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', textAlign: 'left', letterSpacing: '0.02em' }}>
              {L(item.ru, item.en)}
            </span>
            <Rating
              value={data[type][item.id] ?? 0}
              max={5}
              min={0}
              shape="circle"
              size={9}
              onChange={v => setAbility(type, item.id, v)}
            />
          </div>
        ))}
        {/* Free row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', border: '1px dashed var(--border)', padding: '1px 2px', borderRadius: '2px' }}>
          <input
            type="text"
            value={freeName}
            placeholder={L('—', '-')}
            onChange={e => setFreeAbility(type, e.target.value, freeDots)}
            style={{
              flex: 1,
              fontSize: '9px',
              color: 'var(--text)',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              padding: '0 1px',
              fontFamily: "Georgia, 'Times New Roman', serif",
              boxSizing: 'border-box',
            }}
          />
          <Rating
            value={freeDots}
            max={5}
            min={0}
            shape="circle"
            size={9}
            onChange={v => setFreeAbility(type, freeName, v)}
          />
        </div>
      </div>
    );
  };

  const renderNamedRows = (arr: 'disciplines' | 'backgrounds', list: { id: string; ru: string; en: string }[], label: { ru: string; en: string }) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <span style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: '2px' }}>
          {L(label.ru, label.en)}
        </span>
        {(data[arr] as any[]).map((item, i) => (
          <div className="cl-named-row" key={i}>
            <select className="cl-select" value={item.id} onChange={e => setNamedDots(arr, i, 'id', e.target.value)}>
              <option value="">—</option>
              {list.map(o => <option key={o.id} value={o.id}>{L(o.ru, o.en)}</option>)}
            </select>
            <Rating
              value={item.dots}
              max={5}
              min={0}
              shape="circle"
              size={9}
              onChange={v => setNamedDots(arr, i, 'dots', v)}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="classic-page" style={{ minHeight: '297mm' }}>
      {/* ===== HEADER ===== */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text)', marginBottom: '2px' }}>
          {L(STR.header.classicRules.ru, STR.header.classicRules.en)}
        </div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text)' }}>
          {L(STR.header.vampires.ru, STR.header.vampires.en)}
        </div>
        <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)', marginTop: '2px' }}>
          {L(STR.header.masquerade.ru, STR.header.masquerade.en)}
        </div>
      </div>

      {/* ===== META ROW ===== */}
      <div className="cl-meta-grid">
        <div>
          <MetaRow label={L(STR.leftMeta.player.ru, STR.leftMeta.player.en)}>
            <input className="cl-input" value={data.player} onChange={e => setMeta('player', e.target.value)} />
          </MetaRow>
          <MetaRow label={L(STR.leftMeta.name.ru, STR.leftMeta.name.en)}>
            <input className="cl-input" value={data.name} onChange={e => setMeta('name', e.target.value)} />
          </MetaRow>
          <MetaRow label={L(STR.leftMeta.generation.ru, STR.leftMeta.generation.en)}>
            <select className="cl-select" value={data.generation} onChange={e => setGeneration(e.target.value)}>
              {GENERATION_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </MetaRow>
          <MetaRow label={L(STR.leftMeta.sire.ru, STR.leftMeta.sire.en)}>
            <input className="cl-input" value={data.sire} onChange={e => setMeta('sire', e.target.value)} />
          </MetaRow>
        </div>
        <div>
          <MetaRow label={L(STR.rightMeta.nature.ru, STR.rightMeta.nature.en)}>
            <select className="cl-select" value={data.nature} onChange={e => setMeta('nature', e.target.value)}>
              <option value="">—</option>
              {NATURES.map(o => <option key={o.id} value={o.id}>{L(o.ru, o.en)}</option>)}
            </select>
          </MetaRow>
          <MetaRow label={L(STR.rightMeta.demeanor.ru, STR.rightMeta.demeanor.en)}>
            <select className="cl-select" value={data.demeanor} onChange={e => setMeta('demeanor', e.target.value)}>
              <option value="">—</option>
              {NATURES.map(o => <option key={o.id} value={o.id}>{L(o.ru, o.en)}</option>)}
            </select>
          </MetaRow>
          <MetaRow label={L(STR.rightMeta.concept.ru, STR.rightMeta.concept.en)}>
            <input className="cl-input" value={data.concept} onChange={e => setMeta('concept', e.target.value)} />
          </MetaRow>
          <MetaRow label={L(STR.rightMeta.clan.ru, STR.rightMeta.clan.en)}>
            <select className="cl-select" value={data.clan} onChange={e => setMeta('clan', e.target.value)}>
              <option value="">—</option>
              {CLANS.map(o => <option key={o.id} value={o.id}>{L(o.ru, o.en)}</option>)}
            </select>
          </MetaRow>
        </div>
      </div>

      {/* ===== ATTRIBUTES ===== */}
      <SectionTitle>{L(STR.section.attributes.ru, STR.section.attributes.en)}</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
        {renderAttributes('physical')}
        {renderAttributes('social')}
        {renderAttributes('mental')}
      </div>

      {/* ===== ABILITIES ===== */}
      <SectionTitle>{L(STR.section.abilities.ru, STR.section.abilities.en)}</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
        {renderAbilityColumn('talents', TALENTS)}
        {renderAbilityColumn('skills', SKILLS)}
        {renderAbilityColumn('knowledges', KNOWLEDGES)}
      </div>

      {/* ===== ADVANTAGES ===== */}
      <SectionTitle>{L(STR.section.advantages.ru, STR.section.advantages.en)}</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '8px' }}>
        {renderNamedRows('disciplines', DISCIPLINES, STR.sub.disciplines)}
        {renderNamedRows('backgrounds', BACKGROUNDS, STR.sub.backgrounds)}
        <div>
          <span className="cl-virtue-label" style={{ display: 'block', marginBottom: 6 }}>
            {L(STR.sub.virtues.ru, STR.sub.virtues.en)}
          </span>
          {(['conscience', 'selfControl', 'courage'] as const).map(v => (
            <div className="cl-virtue-stack" key={v}>
              <span className="cl-virtue-label">{L(STR.virtue[v].ru, STR.virtue[v].en)}</span>
              <Rating value={data.virtues[v]} max={5} min={1} shape="circle" size={10}
                onChange={val => setVirtue(v, val)} />
            </div>
          ))}
        </div>
      </div>

      {/* ===== BOTTOM ROW: Specializations | Humanity/Willpower/Blood | Health ===== */}
      <div className="cl-bottom-grid">
        {/* Left column: Specializations */}
        <div className="cl-bottom-col">
          <SectionTitle>{L(STR.section.specializations.ru, STR.section.specializations.en)}</SectionTitle>
          <table className="cl-table cl-spec-table">
            <thead>
              <tr>
                <th>{L(STR.fields.specializationsHeader.ability.ru, STR.fields.specializationsHeader.ability.en)}</th>
                <th>{L(STR.fields.specializationsHeader.specialization.ru, STR.fields.specializationsHeader.specialization.en)}</th>
              </tr>
            </thead>
            <tbody>
              {data.specializations.map((spec, i) => (
                <tr key={i}>
                  <td><input className="cl-input" value={spec.ability} onChange={e => setSpec(i, 'ability', e.target.value)} /></td>
                  <td><input className="cl-input" value={spec.specialization} onChange={e => setSpec(i, 'specialization', e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Middle column: three centered blocks */}
        <div className="cl-bottom-col cl-mid-stack">
          <div className="cl-center-block">
            <SectionTitle>{L(STR.section.humanity.ru, STR.section.humanity.en)}</SectionTitle>
            <input className="cl-input cl-path-input" value={data.humanityPath ?? ''}
              onChange={e => patch(activeId, { humanityPath: e.target.value })} />
            <Rating value={data.humanity} max={10} min={0} shape="square" size={13} onChange={setHumanity} />
            <div className="cl-bearing-row">
              <span>{L(STR.fields.humanityNote.ru, STR.fields.humanityNote.en)}</span>
              <input className="cl-input" value={data.humanityNote} onChange={e => patch(activeId, { humanityNote: e.target.value })} />
              <span>(</span>
              <input className="cl-input cl-bearing-num" value={data.bearing ?? ''} onChange={e => patch(activeId, { bearing: e.target.value })} />
              <span>)</span>
            </div>
          </div>

          <div className="cl-center-block">
            <SectionTitle>{L(STR.section.willpower.ru, STR.section.willpower.en)}</SectionTitle>
            <Rating value={data.willpower.permanent} max={10} min={1} shape="circle" size={12} onChange={setWillpowerPermanent} />
            <PoolSquares value={data.willpower.current} max={10} disabledFrom={data.willpower.permanent}
              onChange={v => setWillpower('current', v)} />
          </div>

          <div className="cl-center-block">
            <SectionTitle>{L(STR.section.blood.ru, STR.section.blood.en)}</SectionTitle>
            <BloodGrid current={data.blood.current} max={data.blood.max} onChange={v => setBlood('current', v)} />
            <div className="cl-perturn">
              <span>{L(STR.fields.perTurn.ru, STR.fields.perTurn.en)}</span>
              <input type="number" min={1} max={10} className="cl-input" value={data.blood.perTurn}
                onChange={e => setBlood('perTurn', Math.max(1, Math.min(10, Number(e.target.value) || 1)))} />
            </div>
          </div>
        </div>

        {/* Right column: Health + Weakness + Experience */}
        <HealthColumn
          health={data.health}
          weakness={data.weakness ?? ''}
          experience={data.experience ?? ''}
          onHealth={setHealth}
          onWeakness={v => patch(activeId, { weakness: v })}
          onExperience={v => patch(activeId, { experience: v })}
        />
      </div>

      {/* ===== FOOTER ===== */}
      <div style={{
        textAlign: 'center',
        fontSize: '8px',
        letterSpacing: '0.04em',
        color: 'var(--accent)',
        marginTop: '12px',
        borderTop: '1px solid var(--border)',
        paddingTop: '4px',
      }}>
        {L(STR.footer.ru, STR.footer.en)}
      </div>
    </div>
  );
};
