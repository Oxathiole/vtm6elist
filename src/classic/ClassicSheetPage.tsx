import React, { FC } from 'react';
import './classic.css';
import { useCharacterStore } from '../store';
import { useClassicData, useClassicStore } from './store';
import { L } from './data';
import { ClassicPage1 } from './ClassicPage1';
import { ClassicPage2 } from './ClassicPage2';

interface ClassicSheetPageProps {
  showTips?: boolean;
}

/** Контейнер классического листа: тулбар + две страницы (A4). */
export const ClassicSheetPage: FC<ClassicSheetPageProps> = ({ showTips }) => {
  const character = useCharacterStore(s => s.getActive());
  const reset = useClassicStore(s => s.reset);
  const data = character?.id ? useClassicData(character.id) : null;

  if (!data) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
        {L('Выберите персонажа', 'Select a character to view the classic sheet')}
      </div>
    );
  }

  const handleReset = () => {
    if (confirm(L('Сбросить классический лист для этого персонажа?', 'Reset the classic sheet for this character?'))) {
      reset(character.id);
    }
  };

  return (
    <div className="cl-page-wrapper">
      {/* Тулбар (скрывается при печати) */}
      <div className="cl-toolbar no-print">
        <span className="cl-toolbar-name">
          {L('Классический лист V20', 'Classic Sheet V20')} — {character?.meta?.name || L('Без имени', 'Nameless')}
        </span>
        <button type="button" onClick={handleReset} title={L('Сбросить к значениям по умолчанию', 'Reset to defaults')}>
          {L('Сбросить', 'Reset')}
        </button>
      </div>

      <ClassicPage1 activeId={character.id} data={data} />
      <ClassicPage2 activeId={character.id} data={data} />
    </div>
  );
};
