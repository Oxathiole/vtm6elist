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
  STR,
  L,
} from './data';
import { ClassicSheetData } from './types';
import { SectionTitle, Rating, Field, HealthTrack } from './ui';
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

  // --- Render helpers ---

  const renderAttributes = (group: 'physical' | 'social' | 'mental') => {
    const groupData = data.attributes[group];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#141414', marginBottom: '3px' }}>
          {L(STR.group[group].ru, STR.group[group].en)}
        </span>
        {ATTRIBUTES[group].map(attr => (
          <div key={attr.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '1px' }}>
            <span style={{ fontSize: '10px', color: '#141414', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', textAlign: 'left', letterSpacing: '0.02em' }}>
              {L(attr.ru, attr.en)}
            </span>
            <Rating
              value={groupData[attr.id as keyof typeof groupData]}
              max={10}
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
        <span style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#141414', textAlign: 'center', margin: '0 0 2px' }}>
          {L(STR.sub[type].ru, STR.sub[type].en)}
        </span>
        {list.map((item, i) => (
          <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '9px', color: '#141414', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', textAlign: 'left', letterSpacing: '0.02em' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', border: '1px dashed #6b6350', padding: '1px 2px', borderRadius: '2px' }}>
          <input
            type="text"
            value={freeName}
            placeholder={L('—', '-')}
            onChange={e => setFreeAbility(type, e.target.value, freeDots)}
            style={{
              flex: 1,
              fontSize: '9px',
              color: '#141414',
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
    const allOptions = [{ id: '', ru: '—', en: '-' }, ...list];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        <span style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#141414', marginBottom: '2px' }}>
          {L(label.ru, label.en)}
        </span>
        {(data[arr] as any[]).map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <select
              value={item.id}
              onChange={e => setNamedDots(arr, i, 'id', e.target.value)}
              style={{
                flex: 1,
                fontSize: '9px',
                color: '#141414',
                border: 'none',
                background: 'transparent',
                outline: 'none',
                padding: '0 1px',
                fontFamily: "Georgia, 'Times New Roman', serif",
                cursor: 'pointer',
                boxSizing: 'border-box',
              }}
            >
              {allOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.id ? L(opt.ru, opt.en) : L('—', '-')}</option>
              ))}
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
        <div style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#141414', marginBottom: '2px' }}>
          {L(STR.header.classicRules.ru, STR.header.classicRules.en)}
        </div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#141414' }}>
          {L(STR.header.vampires.ru, STR.header.vampires.en)}
        </div>
        <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#8a6d1f', marginTop: '2px' }}>
          {L(STR.header.masquerade.ru, STR.header.masquerade.en)}
        </div>
      </div>

      {/* ===== META ROW ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 8px', marginBottom: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          <Field label={L(STR.leftMeta.player.ru, STR.leftMeta.player.en)} value={data.player} onChange={v => setMeta('player', v)} />
          <Field label={L(STR.leftMeta.name.ru, STR.leftMeta.name.en)} value={data.name} onChange={v => setMeta('name', v)} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <label style={{ fontSize: '9px', color: '#141414', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '1px' }}>
              {L(STR.leftMeta.generation.ru, STR.leftMeta.generation.en)}
            </label>
            <select
              value={data.generation}
              onChange={e => setMeta('generation', e.target.value)}
              style={{
                fontSize: '11px',
                color: '#141414',
                border: 'none',
                borderBottom: '1px solid #6b6350',
                outline: 'none',
                background: '#fbf7e8',
                font: 'inherit',
                fontFamily: "Georgia, 'Times New Roman', serif",
                padding: '1px 2px',
                boxSizing: 'border-box',
              }}
            >
              {GENERATION_OPTIONS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <Field label={L(STR.leftMeta.sire.ru, STR.leftMeta.sire.en)} value={data.sire} onChange={v => setMeta('sire', v)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <label style={{ fontSize: '9px', color: '#141414', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '1px' }}>
              {L(STR.rightMeta.nature.ru, STR.rightMeta.nature.en)}
            </label>
            <select
              value={data.nature}
              onChange={e => setMeta('nature', e.target.value)}
              style={{
                fontSize: '11px',
                color: '#141414',
                border: 'none',
                borderBottom: '1px solid #6b6350',
                outline: 'none',
                background: '#fbf7e8',
                font: 'inherit',
                fontFamily: "Georgia, 'Times New Roman', serif",
                padding: '1px 2px',
                boxSizing: 'border-box',
              }}
            >
              <option value="">—</option>
              {NATURES.map(n => (
                <option key={n.id} value={n.id}>{L(n.ru, n.en)}</option>
              ))}
            </select>
          </div>
          <Field label={L(STR.rightMeta.demeanor.ru, STR.rightMeta.demeanor.en)} value={data.demeanor} onChange={v => setMeta('demeanor', v)} />
          <Field label={L(STR.rightMeta.concept.ru, STR.rightMeta.concept.en)} value={data.concept} onChange={v => setMeta('concept', v)} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <label style={{ fontSize: '9px', color: '#141414', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '1px' }}>
              {L(STR.rightMeta.clan.ru, STR.rightMeta.clan.en)}
            </label>
            <select
              value={data.clan}
              onChange={e => setMeta('clan', e.target.value)}
              style={{
                fontSize: '11px',
                color: '#141414',
                border: 'none',
                borderBottom: '1px solid #6b6350',
                outline: 'none',
                background: '#fbf7e8',
                font: 'inherit',
                fontFamily: "Georgia, 'Times New Roman', serif",
                padding: '1px 2px',
                boxSizing: 'border-box',
              }}
            >
              <option value="">—</option>
              {CLANS.map(c => (
                <option key={c.id} value={c.id}>{L(c.ru, c.en)}</option>
              ))}
            </select>
          </div>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#141414', marginBottom: '2px' }}>
            {L(STR.sub.virtues.ru, STR.sub.virtues.en)}
          </span>
          {(['conscience', 'selfControl', 'courage'] as const).map(v => (
            <div key={v} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '9px', color: '#141414', flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', textAlign: 'left', letterSpacing: '0.02em' }}>
                {L(STR.virtue[v].ru, STR.virtue[v].en)}
              </span>
              <Rating
                value={data.virtues[v]}
                max={5}
                min={1}
                shape="circle"
                size={9}
                onChange={v2 => setVirtue(v, v2)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ===== BOTTOM ROW: Specializations | Humanity/Willpower/Blood | Health ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', gap: '8px', marginBottom: '8px' }}>
        {/* Specializations */}
        <div>
          <SectionTitle>{L(STR.section.specializations.ru, STR.section.specializations.en)}</SectionTitle>
          <table className="cl-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>{L(STR.fields.specializationsHeader.ability.ru, STR.fields.specializationsHeader.ability.en)}</th>
                <th>{L(STR.fields.specializationsHeader.specialization.ru, STR.fields.specializationsHeader.specialization.en)}</th>
              </tr>
            </thead>
            <tbody>
              {data.specializations.map((spec, i) => (
                <tr key={i}>
                  <td>
                    <input
                      type="text"
                      className="cl-input"
                      value={spec.ability}
                      onChange={e => setSpec(i, 'ability', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      className="cl-input"
                      value={spec.specialization}
                      onChange={e => setSpec(i, 'specialization', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Humanity / Willpower / Blood */}
        <div>
          <SectionTitle>{L(STR.section.humanity.ru, STR.section.humanity.en)}</SectionTitle>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', color: '#141414', flex: 1, textAlign: 'left' }}>
              {L(STR.fields.humanityNote.ru, STR.fields.humanityNote.en)}
            </span>
            <input
              type="text"
              className="cl-input"
              style={{ width: '50px', fontSize: '10px' }}
              value={data.humanityNote}
              onChange={e => patch(activeId, { humanityNote: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', color: '#141414', flex: 1, textAlign: 'left' }}>
              {L(STR.section.humanity.ru, STR.section.humanity.en)}
            </span>
            <Rating
              value={data.humanity}
              max={10}
              min={0}
              shape="circle"
              size={10}
              onChange={v => setHumanity(v)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '10px', color: '#141414', flex: 1, textAlign: 'left' }}>
              {L(STR.section.willpower.ru, STR.section.willpower.en)}
            </span>
            <Rating
              value={data.willpower.current}
              max={data.willpower.permanent}
              min={0}
              shape="circle"
              size={10}
              onChange={v => setWillpower('current', v)}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '10px', color: '#141414', flex: 1, textAlign: 'left' }}>
              {L(STR.section.blood.ru, STR.section.blood.en)}
            </span>
            <Rating
              value={data.blood.current}
              max={data.blood.max}
              min={0}
              shape="circle"
              size={10}
              onChange={v => setBlood('current', v)}
            />
          </div>
        </div>

        {/* Health */}
        <div>
          <SectionTitle>{L(STR.section.health.ru, STR.section.health.en)}</SectionTitle>
          <HealthTrack value={data.health} onChange={setHealth} />
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <div style={{
        textAlign: 'center',
        fontSize: '8px',
        letterSpacing: '0.04em',
        color: '#8a6d1f',
        marginTop: '12px',
        borderTop: '1px solid #6b6350',
        paddingTop: '4px',
      }}>
        {L(STR.footer.ru, STR.footer.en)}
      </div>
    </div>
  );
};
