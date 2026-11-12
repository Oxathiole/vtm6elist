import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterStore } from '../store';
import { useTranslation } from 'react-i18next';
import { VAMPIRE_TYPES, CLANS_LIST } from '../types';
import { exportJSON } from '../utils/exportImport';
import { api } from '../utils/api';
import { Plus, FileJson, MoreHorizontal, List, BookOpen, LogOut, Skull } from 'lucide-react';

const MAX_CHARACTERS = 30;

const CharacterAvatar = () => (
  <div
    style={{
      width: '56px',
      height: '56px',
      flexShrink: 0,
      background: 'var(--input-bg)',
      border: '1px solid var(--border)',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--muted)',
    }}
  >
    <Skull size={28} />
  </div>
);

export const AccountRoute = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const characters = useCharacterStore(s => s.characters);
  const switchCharacter = useCharacterStore(s => s.switchCharacter);
  const newCharacter = useCharacterStore(s => s.newCharacter);
  const removeCharacter = useCharacterStore(s => s.removeCharacter);

  const [mode, setMode] = useState<'interactive' | 'classic'>('interactive');

  const sorted = useMemo(() => [...characters], [characters]);

  const clanLabel = (id: string) => {
    const f = CLANS_LIST.find(c => c.id === id);
    return f ? t(f.label) : (id || '—');
  };
  const typeLabel = (id: string) => {
    const f = VAMPIRE_TYPES.find(vt => vt.id === id);
    return f ? t(f.label) : (id || '—');
  };

  const handleOpen = (id: string) => {
    switchCharacter(id);
    navigate('/sheet');
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t('placeholders.delete_character'))) return;
    try {
      await api.deleteCharacter(id);
    } catch (err) {
      console.error('delete on server failed', err);
    }
    await removeCharacter(id);
  };

  const handleNew = () => {
    if (characters.length >= MAX_CHARACTERS) return;
    newCharacter();
    navigate('/sheet');
  };

  const handleExportAll = () => {
    const active = useCharacterStore.getState().getActive();
    exportJSON(active);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      {/* Заголовок */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: "'Cinzel', serif",
            color: 'var(--accent)',
            fontSize: '26px',
          }}
        >
          {t('account.my_characters', { defaultValue: 'Мои персонажи' })} ({characters.length}/{MAX_CHARACTERS})
        </h1>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a
            href="https://vampi.info"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--accent)',
              textDecoration: 'none',
              fontSize: '13px',
            }}
          >
            <BookOpen size={14} /> {t('account.knowledge_base', { defaultValue: 'База знаний' })}
          </a>
          <button
            onClick={() => {
              if (confirm(t('auth.logout_confirm', { defaultValue: 'Выйти из аккаунта?' }))) api.logout();
            }}
            className="icon-btn"
            title={t('auth.logout', { defaultValue: 'Выйти' })}
            style={{ color: 'var(--muted)' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Тулбар */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleExportAll}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              background: 'var(--panel)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            <FileJson size={14} /> json
          </button>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '6px 10px',
              background: 'var(--panel)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            title={t('account.list_view', { defaultValue: 'Список' })}
          >
            <List size={14} />
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', fontSize: '13px' }}>
          <button
            onClick={() => setMode('interactive')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: mode === 'interactive' ? 'var(--accent)' : 'var(--muted)',
              padding: 0,
            }}
          >
            {t('account.interactive_sheet', { defaultValue: 'Интерактивный лист' })}
          </button>
          <span style={{ color: 'var(--muted)' }}>/</span>
          <button
            onClick={() => setMode('classic')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: mode === 'classic' ? 'var(--accent)' : 'var(--muted)',
              padding: 0,
            }}
          >
            {t('account.classic_sheet', { defaultValue: 'Классический лист' })}
          </button>
        </div>
      </div>

      {/* Сетка */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px',
        }}
      >
        {sorted.map(c => (
          <div
            key={c.id}
            onClick={() => handleOpen(c.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
          >
            <CharacterAvatar />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px',
                }}
              >
                <div
                  style={{
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: 'var(--text)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {c.meta.name || t('common.nameless', { defaultValue: 'Безымянный' })}
                </div>
                <button
                  onClick={e => handleDelete(c.id, e)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    padding: '2px',
                  }}
                  title={t('common.delete', { defaultValue: 'Удалить' })}
                >
                  <MoreHorizontal size={14} />
                </button>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--muted)',
                  marginBottom: '4px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {clanLabel(c.meta.clan)} — {typeLabel(c.meta.type)}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: c.vitae.current === 0 ? '#e74c3c' : 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span style={{ color: 'var(--accent)' }}>🩸</span>
                {c.vitae.current}/{c.vitae.max}
              </div>
            </div>
          </div>
        ))}

        {characters.length < MAX_CHARACTERS && (
          <button
            onClick={handleNew}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '80px',
              background: 'transparent',
              border: '2px dashed var(--border)',
              borderRadius: '6px',
              cursor: 'pointer',
              color: 'var(--muted)',
              transition: 'border-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.color = 'var(--accent)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--muted)';
            }}
            title={t('common.new_character', { defaultValue: 'Новый персонаж' })}
          >
            <Plus size={28} />
          </button>
        )}
      </div>

      {characters.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--muted)' }}>
          {t('account.no_characters', { defaultValue: 'Нет персонажей. Создайте первого!' })}
        </div>
      )}
    </div>
  );
};
