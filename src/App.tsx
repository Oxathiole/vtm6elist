import React, { useState, useRef, useEffect, useCallback, Suspense, lazy } from 'react';
import { useCharacterStore } from './store';
import { CharacterSelector } from './components/CharacterSelector';
import i18n, { t, loadAndChangeLanguage } from './i18n';
import { VAMPIRE_TYPES, CREATION_RULES } from './types';
import { useUIStore } from './uiStore';
import { safeStorage } from './utils/storage';
import { THEMES, DEFAULT_THEME_ID } from './themes';
import { Download, Upload, FileJson, RotateCcw, Menu, X, Send, BookOpen, Globe, History as HistoryIcon, HelpCircle, Moon, Skull } from 'lucide-react';
import { NavLink, Navigate, Routes, Route, useNavigate } from 'react-router-dom';
import { api } from './utils/api';
import { AuthScreen } from './components/AuthScreen';
const SheetPage = lazy(() => import('./pages/SheetPage').then(m => ({ default: m.SheetPage })));
const MasterRoute = lazy(() => import('./pages/MasterRoute').then(m => ({ default: m.MasterRoute })));
const AccountRoute = lazy(() => import('./pages/AccountRoute').then(m => ({ default: m.AccountRoute })));

const NavTab = ({ to, label, end }: { to: string; label: string; end?: boolean }) => (
  <NavLink
    to={to}
    end={end}
    className="icon-btn"
    style={({ isActive }) => ({
      padding: '4px 10px',
      borderRadius: '4px',
      border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
      background: isActive ? 'var(--accent)' : 'var(--panel)',
      color: isActive ? 'var(--bg)' : 'var(--text)',
      fontSize: '12px',
      fontWeight: 'bold',
      letterSpacing: '0.05em',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    })}
  >
    {label}
  </NavLink>
);

function App() {
  const navigate = useNavigate();
  const [isAuthed, setIsAuthed] = useState(!!api.getToken());
  const [showAuth, setShowAuth] = useState(false);
  const hasMasterCode = !!safeStorage.get('vtm6e-master-code');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeId, setThemeId] = useState<string>(() => safeStorage.get('vtm6e-theme') || DEFAULT_THEME_ID);
  const [lang, setLang] = useState<string>(() => safeStorage.get('vtm6e-lang') || 'ru');
  const [showTips, setShowTips] = useState<boolean>(() => {
    const saved = safeStorage.get('vtm6e-tips');
    return saved !== null && saved !== 'false';
  });
  useEffect(() => {
    safeStorage.set('vtm6e-tips', showTips.toString());
  }, [showTips]);

  const { edition } = useUIStore();

  const [showSummary, setShowSummary] = useState<boolean>(() => safeStorage.get('vtm6e-summary') !== 'false');
  useEffect(() => { safeStorage.set('vtm6e-summary', showSummary.toString()); }, [showSummary]);
  const [showHistory, setShowHistory] = useState(false);
  
  // Состояния для экспорта PDF
  const [isExporting, setIsExporting] = useState(false);
  const [pdfProgress, setPdfProgress] = useState({ current: 0, total: 0 });
  const isExportingRef = useRef(false);
  
  // Классический режим экспорта PDF (светлая тема)
  const [pdfClassicMode, setPdfClassicMode] = useState<boolean>(() => safeStorage.get('vtm6e-pdf-classic') !== 'false');
  const pdfClassicModeRef = useRef(pdfClassicMode);
  
  useEffect(() => {
    safeStorage.set('vtm6e-pdf-classic', pdfClassicMode.toString());
    pdfClassicModeRef.current = pdfClassicMode;
  }, [pdfClassicMode]);

  // Убирать фон (для экономии чернил)
  // Включено по умолчанию, пока пользователь явно не отключит
  const [pdfRemoveBg, setPdfRemoveBg] = useState<boolean>(() => safeStorage.get('vtm6e-pdf-remove-bg') !== 'false');
  const pdfRemoveBgRef = useRef(pdfRemoveBg);

  // Состояние для открытия меню настроек PDF
  const [showPdfMenu, setShowPdfMenu] = useState(false);
  const pdfMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    safeStorage.set('vtm6e-pdf-remove-bg', pdfRemoveBg.toString());
    pdfRemoveBgRef.current = pdfRemoveBg;
  }, [pdfRemoveBg]);

  // Закрытие меню по клику вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pdfMenuRef.current && !pdfMenuRef.current.contains(event.target as Node)) {
        setShowPdfMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const character = useCharacterStore(s => s.characters.find(c => c.id === s.activeId) || s.characters[0]);
  const history = useCharacterStore(s => s.history);
  const pushHistory = useCharacterStore(s => s.pushHistory);
  const clearHistory = useCharacterStore(s => s.clearHistory);
  const advanceNight = useCharacterStore(s => s.advanceNight);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevCharRef = useRef(character);

  // --- Auth state ---
  const [hasLoadedFromServer, setHasLoadedFromServer] = useState(false);
  const firstSyncDoneRef = useRef(false);

  // При логине: грузим персонажей с сервера
  useEffect(() => {
    if (!isAuthed) {
      setHasLoadedFromServer(false);
      firstSyncDoneRef.current = false;
      return;
    }
    let cancelled = false;
    api.fetchCharacters()
      .then(chars => {
        if (cancelled) return;
        if (chars && chars.length > 0) {
          useCharacterStore.getState().loadCharacters(chars);
        }
        setHasLoadedFromServer(true);
      })
      .catch(err => {
        if (cancelled) return;
        console.error('[sync] pull failed', err);
        setHasLoadedFromServer(true); // не блокируем save, чтобы можно было запушить локальные
      });
    return () => { cancelled = true; };
  }, [isAuthed]);

  // Автосохранение активного персонажа с debounce
  useEffect(() => {
    if (!isAuthed || !hasLoadedFromServer) return;
    const timer = setTimeout(() => {
      const active = useCharacterStore.getState().getActive();
      api.saveCharacters([active]).catch(err => console.error('[sync] push failed', err));
      firstSyncDoneRef.current = true;
    }, 2000);
    return () => clearTimeout(timer);
  }, [isAuthed, character, hasLoadedFromServer]);

  // Сброс истории при смене персонажа
  useEffect(() => {
    prevCharRef.current = character;
  }, [character.id]);

  // Функция для генерации наглядного списка изменений
  const getDiffList = (oldC: any, newC: any): string[] => {
    if (!oldC) return [];
    const changes: string[] = [];

    if (oldC.vitae.current !== newC.vitae.current) changes.push(`${t('history.vitae')} ${oldC.vitae.current} > ${newC.vitae.current}`);
    if (oldC.willpower.current !== newC.willpower.current) changes.push(`${t('history.willpower')} ${oldC.willpower.current} > ${newC.willpower.current}`);
    if (oldC.humanity.path !== newC.humanity.path) changes.push(`${t('history.humanity')} ${oldC.humanity.path} > ${newC.humanity.path}`);
    if (oldC.bloodSurge !== newC.bloodSurge) changes.push(`${t('history.blood_surge')} ${oldC.bloodSurge} > ${newC.bloodSurge}`);

    const attrs = ['strength', 'dexterity', 'stamina', 'charisma', 'manipulation', 'composure', 'intelligence', 'wits', 'resolve'];
    
    ['physical', 'social', 'mental'].forEach(group => {
      attrs.forEach(a => {
        if (newC.attributes[group]?.[a] !== undefined) {
          const oldVal = oldC.attributes[group]?.[a] || 0;
          const newVal = newC.attributes[group]?.[a] || 0;
          if (oldVal !== newVal) changes.push(`${t('attributes.' + a)} ${oldVal} > ${newVal}`);
        }
      });
    });

    Object.keys(newC.skills).forEach(s => {
      const oldVal = oldC.skills?.[s]?.dots || 0;
      const newVal = newC.skills?.[s]?.dots || 0;
      if (oldVal !== newVal) {
         const skillName = t('skills.' + s) !== 'skills.' + s ? t('skills.' + s) : s;
         changes.push(`${skillName} ${oldVal} > ${newVal}`);
      }
    });

    return changes;
  };

  // Автосохранение в реальном времени (с дебаунсом 2 секунды)
  useEffect(() => {
    if (JSON.stringify(prevCharRef.current) === JSON.stringify(character)) return;

    const timer = setTimeout(() => {
      const current = useCharacterStore.getState().getActive();
      if (JSON.stringify(prevCharRef.current) !== JSON.stringify(current)) {
        const diff = getDiffList(prevCharRef.current, current);
        if (diff.length > 0) {
          pushHistory(diff);
        }
        prevCharRef.current = current;
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [character, pushHistory]);
  const rules = CREATION_RULES[character.meta.type] || CREATION_RULES['vampire_neonate'];

  useEffect(() => {
    isExportingRef.current = isExporting;
  }, [isExporting]);

  useEffect(() => {
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
    const root = document.documentElement;
    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--panel', theme.panel);
    root.style.setProperty('--text', theme.text);
    root.style.setProperty('--muted', theme.muted);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--header-bg', theme.headerBg);
    root.style.setProperty('--header-text', theme.headerText);
    root.style.setProperty('--dot-color', theme.dotColor);
    root.style.setProperty('--card-border', theme.cardBorder);
    root.style.setProperty('--glow', theme.glow);
    root.style.setProperty('--input-bg', theme.inputBg);
    safeStorage.set('vtm6e-theme', themeId);
  }, [themeId]);

  const handleExportPdf = useCallback(async () => {
    if (isExportingRef.current) return;
    setIsExporting(true);
    setPdfProgress({ current: 0, total: 0 });
    
    try {
      const { exportAllPDFs } = await import('./utils/exportImport');
      const active = useCharacterStore.getState().getActive();
      await exportAllPDFs(active.meta.name, (current, total) => {
        setPdfProgress({ current, total });
      }, pdfClassicModeRef.current, pdfRemoveBgRef.current);
    } catch (err) {
      alert(t('pdf.error_prefix') + ' ' + (err as Error).message);
    } finally {
      setIsExporting(false);
      setPdfProgress({ current: 0, total: 0 });
    }
  }, []);

  useEffect(() => {
    const onLangChange = (lng: string) => {
      setLang(lng);
      safeStorage.set('vtm6e-lang', lng);
    };
    i18n.on('languageChanged', onLangChange);
    return () => i18n.off('languageChanged', onLangChange);
  }, []);

  const typeLabel = (() => {
    const found = VAMPIRE_TYPES.find(vt => vt.id === character.meta.type);
    return found ? t(found.label) : character.meta.type;
  })();

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { importJSONFile } = await import('./utils/exportImport');
    importJSONFile(
      file,
      (data) => {
        const st = useCharacterStore.getState();
        if (Array.isArray(data)) st.loadCharacters(data);
        else st.loadCharacter(data);
      },
      (err) => alert(err)
    );
    if (fileInputRef.current) fileInputRef.current.value = '';
  };



  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      {/* МОДАЛЬНОЕ ОКНО АВТОРИЗАЦИИ */}
      {showAuth && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
          }}
        >
          <AuthScreen onAuth={() => { setIsAuthed(true); setShowAuth(false); }} />
        </div>
      )}

      {/* ОВЕРЛЕЙ ЗАГРУЗКИ PDF */}
      {isExporting && (
        <div className="no-print" style={{
          position: 'fixed', inset: 0, zIndex: 9999,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontFamily: "'Cinzel', serif"
        }}>
          <div style={{ fontSize: '24px', marginBottom: '20px', letterSpacing: '0.1em' }}>{t('pdf.exporting')}</div>
          <div style={{ width: '300px', height: '12px', background: '#333', borderRadius: '6px', overflow: 'hidden', border: '1px solid #555' }}>
            <div style={{
              height: '100%',
              background: 'var(--accent, #b31217)',
              width: pdfProgress.total > 0 ? `${(pdfProgress.current / pdfProgress.total) * 100}%` : '0%',
              transition: 'width 0.2s ease'
            }} />
          </div>
          <div style={{ marginTop: '12px', fontSize: '14px', color: '#aaa' }}>
            {pdfProgress.total > 0 ? t('pdf.page_of', { current: pdfProgress.current, total: pdfProgress.total }) : t('pdf.preparing')}
          </div>
        </div>
      )}

      {/* ПАНЕЛЬ СВОДКИ ПРАВИЛ */}
      {showSummary && edition !== '20th' && (
        <div
          className="no-print fixed top-[70px] right-[14px] md:right-[30px] z-[80] rounded-lg p-4 transition-all"
          style={{
            width: 'min(320px, calc(100vw - 28px))',
            background: 'var(--panel)',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
            color: 'var(--text)',
            fontSize: '12px',
            fontFamily: "'Inter', sans-serif"
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
            <h3 style={{ margin: 0, fontWeight: 'bold', color: 'var(--accent)', fontSize: '14px' }}>{t('summary_panel.title', { type: typeLabel })}</h3>
            <button onClick={() => setShowSummary(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)' }}><X size={16} /></button>
          </div>

          {/* Трекеры: нужно : факт */}
          <div style={{ marginTop: '12px', borderTop: '1px solid var(--border)', paddingTop: '8px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '6px' }}>
              {t('summary_panel.trackers')}
            </div>

            {/* Жизненные пути */}
            {(() => {
              const filled = (character.lifePaths || []).filter(p => p && p.trim()).length;
              const need = rules.paths;
              return (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>{t('summary_panel.lifepaths')}:</span>
                  <b style={{ color: filled === need ? 'var(--accent)' : filled > need ? '#e74c3c' : 'var(--text)' }}>{need} : {filled}</b>
                </div>
              );
            })()}

            {/* Характеристики (7/5/3) */}
            {(() => {
              const calcExtras = (cat: any) => Object.values(cat).reduce((a: number, b: any) => a + b, 0) - 3;
              const p = Math.max(0, calcExtras(character.attributes.physical));
              const s = Math.max(0, calcExtras(character.attributes.social));
              const m = Math.max(0, calcExtras(character.attributes.mental));
              
              const totalSpent = p + s + m;
              const need = 15;
              
              // Проверяем, влезают ли точки в лимиты 7/5/3
              const sorted = [p, s, m].sort((a, b) => b - a);
              const isOverLimit = sorted[0] > 7 || sorted[1] > 5 || sorted[2] > 3;
              const isValid = totalSpent === need && !isOverLimit;

              return (
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '2px' }}>
                    <span>{t('summary_panel.attributes')}:</span>
                    <b style={{ color: isValid ? 'var(--accent)' : (totalSpent > need || isOverLimit) ? '#e74c3c' : 'var(--text)' }}>
                      {need} : {totalSpent}
                    </b>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '10px', color: 'var(--muted)', paddingLeft: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{t('attributes_groups.physical')}:</span>
                      <span style={{ color: p > 7 ? '#e74c3c' : 'var(--text)' }}>{p}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{t('attributes_groups.social')}:</span>
                      <span style={{ color: s > 7 ? '#e74c3c' : 'var(--text)' }}>{s}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{t('attributes_groups.mental')}:</span>
                      <span style={{ color: m > 7 ? '#e74c3c' : 'var(--text)' }}>{m}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Навыки */}
            {(() => {
              const spent = Object.values(character.skills).reduce((s, sk) => s + (sk?.dots || 0), 0);
              const need = 18;
              return (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>{t('summary_panel.skills')}:</span>
                  <b style={{ color: spent === need ? 'var(--accent)' : spent > need ? '#e74c3c' : 'var(--text)' }}>{need} : {spent}</b>
                </div>
              );
            })()}

            {/* Ресурсы */}
            {(() => {
              const spent = character.resources.reduce((s, r) => s + (r?.dots || 0), 0);
              const need = 9;
              return (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>{t('summary_panel.resources')}:</span>
                  <b style={{ color: spent === need ? 'var(--accent)' : spent > need ? '#e74c3c' : 'var(--text)' }}>{need} : {spent}</b>
                </div>
              );
            })()}

            {/* Дисциплины */}
            {(() => {
              const spent = character.disciplines.reduce((s, d) => s + (d?.dots || 0), 0);
              const need = 4;
              return (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>{t('summary_panel.disciplines')}:</span>
                  <b style={{ color: spent === need ? 'var(--accent)' : spent > need ? '#e74c3c' : 'var(--text)' }}>{need} : {spent}</b>
                </div>
              );
            })()}

            {/* Силы Дисциплин */}
            {(() => {
              const spent = character.disciplines.reduce((s, d) => s + (d.powersList?.filter(Boolean).length || 0), 0);
              const need = 4;
              return (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span>{t('summary_panel.powers')}:</span>
                  <b style={{ color: spent === need ? 'var(--accent)' : spent > need ? '#e74c3c' : 'var(--text)' }}>{need} : {spent}</b>
                </div>
              );
            })()}

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '2px' }}>
              <span>{t('summary_panel.merits')}:</span>
              <b>1 : —</b>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span>{t('summary_panel.traits')}:</span>
              <b>2 : —</b>
            </div>
          </div>
        </div>
      )}

      {/* HEADER — minimalist toolbar */}
      <header className="sticky top-0 z-50 no-print" style={{ background: 'var(--panel)', borderBottom: '1px solid var(--border)', position: 'relative' }}>
        
        <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
          <a href="https://t.me/Oxathioleph" target="_blank" rel="noreferrer" title="Telegram Oxathiole" className="icon-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fill="#229ED9"/>
              <path d="M5.4927 11.8621L18.0652 6.93005C18.6487 6.71824 19.1587 7.07501 18.9697 7.95712L18.9706 7.95593L16.83 18.1383C16.6714 18.8638 16.2422 19.0418 15.6433 18.7015L12.4405 16.3147L10.8934 17.8086C10.7224 17.9796 10.5794 18.1227 10.2491 18.1227L10.4789 14.8651L16.3583 9.52782C16.6158 9.29959 16.3028 9.16997 15.9626 9.39662L8.70475 13.9674L5.54873 12.9896C4.86258 12.7804 4.84673 12.3084 5.4927 11.8621Z" fill="white"/>
            </svg>
          </a>
          <span style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: "'Cinzel', serif", letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>Powered by oxathiole</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '8px 16px', flexWrap: 'wrap', minHeight: '40px' }}>

          <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--accent)', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>VTM 6E</span>

          <div style={{ height: '20px', width: '1px', background: 'var(--border)' }} />

          <CharacterSelector />
        
          <div style={{ display: 'flex', gap: '6px' }}>
              <NavTab to="/sheet" end label={t('nav.sheet')} />
              <NavTab to="/master" label={t('nav.master')} />
              <NavTab to="/account" label={t('nav.account')} />
            </div>

            {isAuthed ? (
              <button
                className="icon-btn"
                onClick={() => { if (confirm(t('auth.logout_confirm'))) api.logout(); }}
                title={t('auth.logout')}
                style={{ position: 'relative', color: 'var(--muted)' }}
              >
                <span style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', fontSize: '7px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', pointerEvents: 'none' }}>out</span>
                <X size={16} />
              </button>
            ) : (
              <button
                className="icon-btn"
                onClick={() => setShowAuth(true)}
                title={t('auth.login')}
                style={{ position: 'relative', color: 'var(--accent)', fontWeight: 'bold', fontSize: '12px' }}
              >
                {t('auth.login')}
              </button>
            )}

          <div style={{ height: '20px', width: '1px', background: 'var(--border)' }} />

          {/* Group 3: Tools */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="icon-btn" onClick={() => setShowTips(!showTips)} title={t('common.tips_toggle')} style={{ position: 'relative', color: showTips ? 'var(--accent)' : 'var(--muted)' }}>
              <span style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', fontSize: '7px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', pointerEvents: 'none' }}>tips</span>
              <HelpCircle size={16} />
            </button>
            <button className="icon-btn" onClick={() => setShowSummary(!showSummary)} title={t('common.summary_rules')} style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', fontSize: '7px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', pointerEvents: 'none' }}>rule</span>
              <BookOpen size={16} />
            </button>
            <button className="icon-btn" onClick={async () => { const { exportJSON } = await import('./utils/exportImport'); exportJSON(character); }} title={t('common.export_json')} style={{ position: 'relative' }} disabled={isExporting}>
              <span style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', fontSize: '7px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', pointerEvents: 'none' }}>json</span>
              <FileJson size={16} />
            </button>
            <button className="icon-btn" onClick={() => fileInputRef.current?.click()} title={t('common.import_json')} style={{ position: 'relative' }} disabled={isExporting}>
              <span style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', fontSize: '7px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', pointerEvents: 'none' }}>imp</span>
              <Upload size={16} />
            </button>
            <button className="icon-btn" onClick={() => { if (confirm(t('placeholders.clear_sheet'))) useCharacterStore.getState().resetActiveCharacter(); }} title={t('common.reset')} style={{ position: 'relative' }} disabled={isExporting}>
              <span style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', fontSize: '7px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', pointerEvents: 'none' }}>clear</span>
              <RotateCcw size={16} />
            </button>
            <button
              className="icon-btn"
              onClick={() => { if (confirm(t('common.new_night_confirm'))) advanceNight(); }}
              title={t('common.new_night')}
              style={{ position: 'relative' }}
            >
              <span style={{
                position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)',
                fontSize: '7px', color: 'var(--muted)',
                textTransform: 'uppercase', letterSpacing: '0.1em', pointerEvents: 'none',
              }}>night</span>
              <Moon size={16} />
            </button>
          </div>

          {/* Group 4: PDF Export Dropdown */}
          <div ref={pdfMenuRef} style={{ position: 'relative', display: 'flex', alignItems: 'center', padding: '0 8px' }}>
            <button
              className="icon-btn"
              style={{ position: 'relative', opacity: isExporting ? 0.5 : 1, cursor: isExporting ? 'not-allowed' : 'pointer', padding: '4px' }}
              onClick={() => setShowPdfMenu(!showPdfMenu)}
              disabled={isExporting}
              title={t('common.pdf_export')}
            >
              <span style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', fontSize: '7px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', pointerEvents: 'none' }}>pdf</span>
              <Download size={16} />
            </button>

            {/* Выпадающее меню настроек PDF */}
            {showPdfMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '12px',
                width: '220px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', color: 'var(--text)' }} title={t('common.pdf_classic_hint')}>
                  <input
                    type="checkbox"
                    checked={pdfClassicMode}
                    onChange={e => setPdfClassicMode(e.target.checked)}
                    style={{ accentColor: 'var(--accent)', cursor: 'pointer', margin: 0 }}
                  />
                  {t('common.pdf_classic_mode')}
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', color: 'var(--text)' }} title={t('common.pdf_remove_bg_hint')}>
                  <input
                    type="checkbox"
                    checked={pdfRemoveBg}
                    onChange={e => setPdfRemoveBg(e.target.checked)}
                    style={{ accentColor: 'var(--accent)', cursor: 'pointer', margin: 0 }}
                  />
                  {t('common.pdf_remove_bg')}
                </label>

                <button
                  onClick={() => { setShowPdfMenu(false); handleExportPdf(); }}
                  style={{
                    marginTop: '4px', background: 'var(--accent)', color: 'var(--bg)',
                    border: 'none', padding: '8px', borderRadius: '4px',
                    cursor: 'pointer', fontWeight: 'bold', fontSize: '12px'
                  }}
                >
                  {t('common.pdf_do_export')}
                </button>
              </div>
            )}
          </div>

          {/* Group 5: Theme + Mobile menu */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="icon-btn"
              onClick={() => setShowHistory(!showHistory)}
              title={t('common.history_changes')}
              style={{ position: 'relative', opacity: isExporting ? 0.5 : 1 }}
              disabled={isExporting}
            >
              <span style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', fontSize: '7px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', pointerEvents: 'none' }}>hist</span>
              <HistoryIcon size={16} />
            </button>

            <button
              className="icon-btn"
              onClick={() => {
                if (isExporting) return;
                const currentLang = lang || i18n.language || 'ru';
                const next = ['ru','en','zh'][(['ru','en','zh'].indexOf(currentLang) + 1) % 3];
                loadAndChangeLanguage(next).catch(console.error);
              }}
              title={t('ui.language')}
              style={{ position: 'relative', opacity: isExporting ? 0.5 : 1, cursor: isExporting ? 'not-allowed' : 'pointer' }}
              disabled={isExporting}
            >
              <span style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%)', fontSize: '7px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', pointerEvents: 'none' }}>{lang || 'ru'}</span>
              <Globe size={16} />
            </button>
            
            <select value={themeId} onChange={(e) => setThemeId(e.target.value)} style={{ background: 'var(--panel)', border: `1px solid var(--border)`, color: 'var(--text)', padding: '3px 5px', fontSize: '12px', borderRadius: '4px', opacity: isExporting ? 0.5 : 1 }} disabled={isExporting}>
              {THEMES.map(th => <option key={th.id} value={th.id}>{th.name}</option>)}
            </select>

            <button className="icon-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} title={t('ui.menu')}>
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div style={{ background: 'var(--panel)', borderTop: '1px solid var(--border)', padding: '8px 12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <NavLink to="/sheet" end className="flex items-center gap-2 p-2 rounded" style={({ isActive }) => ({ background: isActive ? 'var(--accent)' : 'transparent', color: isActive ? 'var(--bg)' : 'var(--text)', border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}` })}>{t('nav.sheet')}</NavLink>
              <button onClick={() => { setMobileMenuOpen(false); navigate('/master'); }}>{t('nav.master')}</button>
              <button onClick={() => { setMobileMenuOpen(false); navigate('/account'); }}>{t('nav.account')}</button>
              <button onClick={() => { setShowSummary(true); setMobileMenuOpen(false); }} className="flex items-center gap-2 p-2 rounded" style={{ background: 'transparent', color: 'var(--text)', border: `1px solid var(--border)` }}><BookOpen size={14} /> {t('common.summary_rules')}</button>
              <button onClick={async () => { const { exportJSON } = await import('./utils/exportImport'); exportJSON(character); setMobileMenuOpen(false); }} className="flex items-center gap-2 p-2 rounded" style={{ background: 'transparent', color: 'var(--text)', border: `1px solid var(--border)` }}><FileJson size={14} /> {t('common.export_json')}</button>
              <button onClick={() => { fileInputRef.current?.click(); setMobileMenuOpen(false); }} className="flex items-center gap-2 p-2 rounded" style={{ background: 'transparent', color: 'var(--text)', border: `1px solid var(--border)` }}><Upload size={14} /> {t('common.import_json')}</button>
              <button onClick={() => { handleExportPdf(); setMobileMenuOpen(false); }} className="flex items-center gap-2 p-2 rounded" style={{ background: 'var(--accent)', color: 'var(--bg)' }}><Download size={14} /> {t('common.pdf_export')}</button>
              <button onClick={() => { if (confirm(t('placeholders.clear_sheet'))) useCharacterStore.getState().resetActiveCharacter(); setMobileMenuOpen(false); }} className="flex items-center gap-2 p-2 rounded" style={{ background: 'transparent', color: 'var(--muted)', border: `1px solid var(--border)` }}><RotateCcw size={14} /> {t('common.reset')}</button>
              <a href="https://t.me/Oxathioleph" target="_blank" rel="noreferrer" className="flex items-center gap-2 p-2 rounded" style={{ background: 'transparent', color: 'var(--text)', border: `1px solid var(--border)` }}><Send size={14} /> Telegram</a>
              {isAuthed ? (
                <button onClick={() => { if (confirm(t('auth.logout_confirm'))) { api.logout(); setMobileMenuOpen(false); } }} className="flex items-center gap-2 p-2 rounded" style={{ background: 'transparent', color: 'var(--muted)', border: `1px solid var(--border)` }}><X size={14} /> {t('auth.logout')}</button>
              ) : (
                <button onClick={() => { setMobileMenuOpen(false); setShowAuth(true); }} className="flex items-center gap-2 p-2 rounded" style={{ background: 'var(--accent)', color: 'var(--bg)' }}><Send size={14} /> {t('auth.login')}</button>
              )}
            </div>
          </div>
        )}

        <input type="file" accept=".json" ref={fileInputRef} onChange={handleImport} style={{ display: 'none' }} />
      </header>

      {/* ПАНЕЛЬ ИСТОРИИ */}
      {showHistory && (
        <div className="no-print fixed inset-y-0 right-0 w-80 z-[100] flex flex-col shadow-2xl" style={{ background: 'var(--panel)', borderLeft: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ margin: 0, fontWeight: 'bold', color: 'var(--accent)', fontSize: '16px', fontFamily: "'Cinzel', serif" }}>{t('history.title')}</h3>
            <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}><X size={18} /></button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {history.length === 0 && <span style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center', marginTop: '20px' }}>{t('history.empty')}</span>}
            
            {history
              .filter(item => item && Array.isArray(item.changes) && item.changes.length > 0)
              .map((item) => (
                <div key={item.id} style={{ fontSize: '12px', lineHeight: 1.4, color: 'var(--text)' }}>
                  <span style={{ color: 'var(--muted)', marginRight: '6px' }}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},
                  </span>
                  <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>
                    {item.changes.join(', ')}
                  </span>
                </div>
              ))}
          </div>
          
          {history.length > 0 && (
            <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
               <button onClick={() => { if(confirm(t('history.clear_confirm'))) clearHistory(); }} style={{ width: '100%', background: 'transparent', color: 'var(--muted)', border: `1px solid var(--border)`, padding: '8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}>
                  {t('history.clear_button')}
               </button>
            </div>
          )}
        </div>
      )}

      {/* MAIN CONTENT */}
      <main id="main-content" className="flex-1 p-2 md:p-6 pb-20 md:pb-6">
        <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>{t('pdf.preparing')}</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/sheet" replace />} />
            <Route path="/sheet" element={<SheetPage showTips={showTips} handleExportPdf={handleExportPdf} />} />
            <Route path="/master" element={<MasterRoute />} />
            <Route
              path="/account"
              element={
                isAuthed ? (
                  <AccountRoute />
                ) : (
                  <div
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      justifyContent: 'center', minHeight: '60vh', gap: '16px',
                      color: 'var(--text)', fontFamily: "'Cinzel', serif",
                    }}
                  >
                    <Skull size={48} style={{ color: 'var(--accent)' }} />
                    <p style={{ margin: 0, fontSize: '15px', color: 'var(--muted)', textAlign: 'center', maxWidth: '420px' }}>
                      {t('auth.account_need_login')}
                    </p>
                    <button
                      onClick={() => setShowAuth(true)}
                      style={{
                        padding: '10px 28px',
                        background: 'var(--accent)', color: '#000', fontWeight: 'bold',
                        border: 'none', borderRadius: '6px', cursor: 'pointer',
                        fontSize: '14px', fontFamily: "'Georgia', serif",
                      }}
                    >
                      {t('auth.login')}
                    </button>
                  </div>
                )
              }
            />
            <Route path="*" element={<Navigate to="/sheet" replace />} />
          </Routes>
        </Suspense>
      </main>
      
      <div style={{ textAlign: 'center', padding: '8px 0 4px', fontSize: '11px', color: 'var(--muted)', fontFamily: "'Cinzel', serif", letterSpacing: '0.15em' }}>
        Powered by <span style={{ color: 'var(--accent)' }}>oxathiole</span>
      </div>

    </div>
  );
};

export default App;
