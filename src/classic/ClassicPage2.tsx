import React, { FC } from 'react';
import { STR, L } from './data';
import { ClassicSheetData } from './types';
import { SectionTitle, LinedTextarea, Field } from './ui';
import { useClassicStore } from './store';

interface ClassicPage2Props {
  activeId: string;
  data: ClassicSheetData;
}

export const ClassicPage2: FC<ClassicPage2Props> = ({ activeId, data }) => {
  const patch = useClassicStore(s => s.patch);

  const setMerit = (index: number, field: 'name' | 'cost', value: string) => {
    const list = [...data.merits];
    list[index] = { ...list[index], [field]: value };
    patch(activeId, { merits: list });
  };

  const setOtherTrait = (index: number, field: 'name' | 'dots', value: string | number) => {
    const list = [...data.otherTraits];
    list[index] = { ...list[index], [field]: value as any };
    patch(activeId, { otherTraits: list });
  };

  const setRitual = (index: number, field: 'name' | 'level', value: string) => {
    const list = [...data.rituals];
    list[index] = { ...list[index], [field]: value };
    patch(activeId, { rituals: list });
  };

  const setDetail = (key: keyof ClassicSheetData['details'], value: string) => {
    patch(activeId, { details: { ...data.details, [key]: value } });
  };

  const setCombat = (index: number, field: 'weapon' | 'difficulty' | 'damage' | 'range' | 'rate' | 'clip' | 'size', value: string) => {
    const list = [...data.combat];
    list[index] = { ...list[index], [field]: value };
    patch(activeId, { combat: list });
  };

  const setLongText = (key: 'history' | 'goals' | 'description' | 'allies' | 'contacts' | 'property' | 'equipment' | 'weakness' | 'experience', value: string) => {
    patch(activeId, { [key]: value } as Partial<ClassicSheetData>);
  };

  return (
    <div className="classic-page" style={{ minHeight: '297mm' }}>
      {/* ===== LEFT COLUMN: Merits / Other Traits / Rituals ===== */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '8px' }}>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          {/* Merits */}
          <SectionTitle>{L(STR.section.merits.ru, STR.section.merits.en)}</SectionTitle>
          <table className="cl-table" style={{ width: '100%' }}>
            <tbody>
              {data.merits.map((m: any, i: number) => (
                <tr key={i}>
                  <td style={{ padding: '2px 3px' }}>
                    <input
                      type="text"
                      className="cl-input"
                      value={m.name}
                      onChange={e => setMerit(i, 'name', e.target.value)}
                    />
                  </td>
                  <td style={{ padding: '2px 3px', width: '40%' }}>
                    <input
                      type="text"
                      className="cl-input"
                      value={m.cost}
                      onChange={e => setMerit(i, 'cost', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Other Traits */}
          <SectionTitle>{L(STR.section.otherTraits.ru, STR.section.otherTraits.en)}</SectionTitle>
          <table className="cl-table" style={{ width: '100%' }}>
            <tbody>
              {data.otherTraits.map((t: any, i: number) => (
                <tr key={i}>
                  <td style={{ padding: '2px 3px' }}>
                    <input
                      type="text"
                      className="cl-input"
                      value={t.name}
                      onChange={e => setOtherTrait(i, 'name', e.target.value)}
                    />
                  </td>
                  <td style={{ padding: '2px 3px', width: '50px' }}>
                    <input
                      type="text"
                      className="cl-input"
                      value={t.dots}
                      onChange={e => setOtherTrait(i, 'dots', parseInt(e.target.value) || 0)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Rituals */}
          <SectionTitle>{L(STR.section.rituals.ru, STR.section.rituals.en)}</SectionTitle>
          <table className="cl-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>{L(STR.fields.ritualsHeader.ritual.ru, STR.fields.ritualsHeader.ritual.en)}</th>
                <th>{L(STR.fields.ritualsHeader.level.ru, STR.fields.ritualsHeader.level.en)}</th>
              </tr>
            </thead>
            <tbody>
              {data.rituals.map((r: any, i: number) => (
                <tr key={i}>
                  <td style={{ padding: '2px 3px' }}>
                    <input
                      type="text"
                      className="cl-input"
                      value={r.name}
                      onChange={e => setRitual(i, 'name', e.target.value)}
                    />
                  </td>
                  <td style={{ padding: '2px 3px', width: '50px' }}>
                    <input
                      type="text"
                      className="cl-input"
                      value={r.level}
                      onChange={e => setRitual(i, 'level', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ===== RIGHT COLUMN: History / Details / Combat ===== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>

          {/* History */}
          <SectionTitle>{L(STR.section.history.ru, STR.section.history.en)}</SectionTitle>
          <LinedTextarea
            value={data.history}
            onChange={v => setLongText('history', v)}
            lines={6}
          />

          {/* Goals */}
          <SectionTitle>{L(STR.section.goals.ru, STR.section.goals.en)}</SectionTitle>
          <LinedTextarea
            value={data.goals}
            onChange={v => setLongText('goals', v)}
            lines={4}
          />

          {/* Description */}
          <SectionTitle>{L(STR.section.description.ru, STR.section.description.en)}</SectionTitle>
          <LinedTextarea
            value={data.description}
            onChange={v => setLongText('description', v)}
            lines={4}
          />

          {/* Details */}
          <SectionTitle>{L(STR.fields.details.birthDate.ru, STR.fields.details.birthDate.en)}</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px', marginBottom: '6px' }}>
            <Field label={L(STR.fields.details.birthDate.ru, STR.fields.details.birthDate.en)} value={data.details.birthDate} onChange={v => setDetail('birthDate', v)} />
            <Field label={L(STR.fields.details.apparentAge.ru, STR.fields.details.apparentAge.en)} value={data.details.apparentAge} onChange={v => setDetail('apparentAge', v)} />
            <Field label={L(STR.fields.details.dateOfDeath.ru, STR.fields.details.dateOfDeath.en)} value={data.details.dateOfDeath} onChange={v => setDetail('dateOfDeath', v)} />
            <Field label={L(STR.fields.details.gender.ru, STR.fields.details.gender.en)} value={data.details.gender} onChange={v => setDetail('gender', v)} />
            <Field label={L(STR.fields.details.race.ru, STR.fields.details.race.en)} value={data.details.race} onChange={v => setDetail('race', v)} />
            <Field label={L(STR.fields.details.hair.ru, STR.fields.details.hair.en)} value={data.details.hair} onChange={v => setDetail('hair', v)} />
            <Field label={L(STR.fields.details.eyes.ru, STR.fields.details.eyes.en)} value={data.details.eyes} onChange={v => setDetail('eyes', v)} />
            <Field label={L(STR.fields.details.heightWeight.ru, STR.fields.details.heightWeight.en)} value={data.details.heightWeight} onChange={v => setDetail('heightWeight', v)} />
            <Field label={L(STR.fields.details.build.ru, STR.fields.details.build.en)} value={data.details.build} onChange={v => setDetail('build', v)} />
            <Field label={L(STR.fields.details.nationality.ru, STR.fields.details.nationality.en)} value={data.details.nationality} onChange={v => setDetail('nationality', v)} />
          </div>

          {/* Weakness / Experience */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '6px' }}>
            <Field label={L(STR.fields.weakness.ru, STR.fields.weakness.en)} value={data.weakness} onChange={v => setLongText('weakness', v)} />
            <Field label={L(STR.fields.experience.ru, STR.fields.experience.en)} value={data.experience} onChange={v => setLongText('experience', v)} />
          </div>

          {/* Allies and Contacts */}
          <SectionTitle>{L(STR.section.allies.ru, STR.section.allies.en)}</SectionTitle>
          <LinedTextarea
            value={data.allies}
            onChange={v => setLongText('allies', v)}
            lines={3}
          />

          {/* Property and Equipment */}
          <SectionTitle>{L(STR.section.property.ru, STR.section.property.en)}</SectionTitle>
          <LinedTextarea
            value={data.property}
            onChange={v => setLongText('property', v)}
            lines={3}
          />

          {/* Combat */}
          <SectionTitle>{L(STR.section.combat.ru, STR.section.combat.en)}</SectionTitle>
          <table className="cl-table" style={{ width: '100%', fontSize: '9px' }}>
            <thead>
              <tr>
                <th>{L(STR.fields.combatHeader.weapon.ru, STR.fields.combatHeader.weapon.en)}</th>
                <th>{L(STR.fields.combatHeader.diff.ru, STR.fields.combatHeader.diff.en)}</th>
                <th>{L(STR.fields.combatHeader.damage.ru, STR.fields.combatHeader.damage.en)}</th>
                <th>{L(STR.fields.combatHeader.range.ru, STR.fields.combatHeader.range.en)}</th>
                <th>{L(STR.fields.combatHeader.rate.ru, STR.fields.combatHeader.rate.en)}</th>
                <th>{L(STR.fields.combatHeader.clip.ru, STR.fields.combatHeader.clip.en)}</th>
                <th>{L(STR.fields.combatHeader.size.ru, STR.fields.combatHeader.size.en)}</th>
              </tr>
            </thead>
            <tbody>
              {data.combat.map((row: any, i: number) => (
                <tr key={i}>
                  <td><input type="text" className="cl-input" value={row.weapon} onChange={e => setCombat(i, 'weapon', e.target.value)} /></td>
                  <td><input type="text" className="cl-input" value={row.difficulty} onChange={e => setCombat(i, 'difficulty', e.target.value)} /></td>
                  <td><input type="text" className="cl-input" value={row.damage} onChange={e => setCombat(i, 'damage', e.target.value)} /></td>
                  <td><input type="text" className="cl-input" value={row.range} onChange={e => setCombat(i, 'range', e.target.value)} /></td>
                  <td><input type="text" className="cl-input" value={row.rate} onChange={e => setCombat(i, 'rate', e.target.value)} /></td>
                  <td><input type="text" className="cl-input" value={row.clip} onChange={e => setCombat(i, 'clip', e.target.value)} /></td>
                  <td><input type="text" className="cl-input" value={row.size} onChange={e => setCombat(i, 'size', e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Contacts (separate small section) */}
          <SectionTitle>{L('Контакты', 'Contacts')}</SectionTitle>
          <LinedTextarea
            value={data.contacts}
            onChange={v => setLongText('contacts', v)}
            lines={2}
          />

        </div>
      </div>
    </div>
  );
};
