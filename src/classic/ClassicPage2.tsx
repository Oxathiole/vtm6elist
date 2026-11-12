import React from 'react';
import { useClassicStore } from './store';
import { Trash2 } from 'lucide-react';

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="cl-section-title">
    <div className="cl-line" />
    <span>{children}</span>
    <div className="cl-line" />
  </div>
);

export const ClassicPage2 = () => {
  const {
    character, updateField,
    addCombatRow, updateCombat, removeCombatRow,
    updateDetail,
  } = useClassicStore();

  return (
    <div className="classic-page">

      <SectionTitle>БОЙ</SectionTitle>
      <table className="cl-spec-table" style={{ marginBottom: '6px' }}>
        <thead>
          <tr>
            <th>ОРУЖИЕ</th>
            <th>СЛОЖНОСТЬ</th>
            <th>УРОН</th>
            <th>ДАЛЬН.</th>
            <th>ТЕМП</th>
            <th>ПАТРОНЫ</th>
            <th>РАЗМЕР</th>
            <th className="no-print" style={{ width: '15px' }}></th>
          </tr>
        </thead>
        <tbody>
          {(character.combat || []).map((row, i) => (
            <tr key={i}>
              <td><input className="cl-input" value={row.weapon} onChange={e => updateCombat(i, 'weapon', e.target.value)} /></td>
              <td><input className="cl-input" value={row.difficulty} onChange={e => updateCombat(i, 'difficulty', e.target.value)} /></td>
              <td><input className="cl-input" value={row.damage} onChange={e => updateCombat(i, 'damage', e.target.value)} /></td>
              <td><input className="cl-input" value={row.range} onChange={e => updateCombat(i, 'range', e.target.value)} /></td>
              <td><input className="cl-input" value={row.rate} onChange={e => updateCombat(i, 'rate', e.target.value)} /></td>
              <td><input className="cl-input" value={row.clip} onChange={e => updateCombat(i, 'clip', e.target.value)} /></td>
              <td><input className="cl-input" value={row.size} onChange={e => updateCombat(i, 'size', e.target.value)} /></td>
              <td className="no-print" style={{ textAlign: 'center', padding: 0 }}>
                <button onClick={() => removeCombatRow(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#e74c3c' }}><Trash2 size={10} /></button>
              </td>
            </tr>
          ))}
          <tr className="no-print">
            <td colSpan={8} style={{ textAlign: 'center', padding: 0 }}>
              <button onClick={addCombatRow} style={{ background: 'transparent', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '9px', width: '100%' }}>+ Добавить</button>
            </td>
          </tr>
        </tbody>
      </table>

      <SectionTitle>ДЕТАЛИ</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px', marginBottom: '6px' }}>
        {[['birthDate', 'ДАТА РОЖДЕНИЯ'], ['apparentAge', 'КАЖЕМЫЙ ВОЗРАСТ'], ['dateOfDeath', 'ДАТА СМЕРТИ'], ['gender', 'ПОЛ'], ['race', 'РАСА'], ['hair', 'ВОЛОСЫ'], ['eyes', 'ГЛАЗА'], ['heightWeight', 'РОСТ/ВЕС'], ['build', 'СОСТРОЙ'], ['nationality', 'НАРОДНОСТЬ']].map(([k, l]) => (
          <div key={k} className="cl-meta-row" style={{ height: '18px' }}>
            <span className="cl-meta-label" style={{ flex: '0 0 80px', fontSize: '9px' }}>{l}</span>
            <input className="cl-input" value={(character.details as any)?.[k] || ''} onChange={e => updateDetail(k, e.target.value)} style={{ height: '18px' }} />
          </div>
        ))}
      </div>

      <SectionTitle>ИСТОРИЯ</SectionTitle>
      <textarea className="cl-textarea" value={character.history} onChange={e => updateField('history', e.target.value)} style={{ flex: 1, minHeight: '40px', resize: 'none', marginBottom: '6px' }} />

      <SectionTitle>ЦЕЛИ</SectionTitle>
      <textarea className="cl-textarea" value={character.goals} onChange={e => updateField('goals', e.target.value)} style={{ flex: 1, minHeight: '30px', resize: 'none', marginBottom: '6px' }} />

      <SectionTitle>СОЮЗНИКИ И КОНТАКТЫ</SectionTitle>
      <textarea className="cl-textarea" value={character.allies} onChange={e => updateField('allies', e.target.value)} style={{ flex: 1, minHeight: '30px', resize: 'none', marginBottom: '6px' }} />

      <SectionTitle>СОБСТВЕННОСТЬ И ЭКИПИРОВКА</SectionTitle>
      <textarea className="cl-textarea" value={character.property} onChange={e => updateField('property', e.target.value)} style={{ flex: 1, minHeight: '30px', resize: 'none' }} />

      <div style={{ marginTop: '6px', textAlign: 'center', fontSize: '8px', color: 'var(--muted)' }}>
        ХАРАКТЕРИСТИКИ: 7/5/3 • СПОСОБНОСТИ: 13/9/5 • ДИСЦИПЛИНЫ: 3 • ФАКТЫ БИОГРАФИИ: 5 • ДОБРОДЕТЕЛИ: 7 • СВОБОДНЫЕ ПУНКТЫ: 15
      </div>

    </div>
  );
};
