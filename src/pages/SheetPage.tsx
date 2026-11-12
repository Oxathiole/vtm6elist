import { Suspense, lazy } from 'react';
import { useCharacterStore } from '../store';
import { useTranslation } from 'react-i18next';
import { SheetPage1 } from '../components/SheetPage1';
import { SheetPage2 } from '../components/SheetPage2';
import { SheetPage3 } from '../components/SheetPage3';
import { SheetPageInventory } from '../components/SheetPageInventory';
import { useSheetHotkeys } from '../hooks';
import { useUIStore } from '../uiStore';

const SheetPage4 = lazy(() => import('../components/SheetPage4').then(m => ({ default: m.SheetPage4 })));
const ClassicSheetPage = lazy(() => import('../classic/ClassicSheetPage').then(m => ({ default: m.ClassicSheetPage })));

interface SheetPageProps {
  showTips: boolean;
  handleExportPdf: () => void;
}

export const SheetPage = ({ showTips, handleExportPdf }: SheetPageProps) => {
  useSheetHotkeys(handleExportPdf);
  const character = useCharacterStore((s) => s.getActive());
  const addPowerPage = useCharacterStore((s) => s.addPowerPage);
  const { t } = useTranslation();
  const { edition, setEdition } = useUIStore();

  return (
    <div style={{ width: '100%', maxWidth: '210mm', margin: '0 auto', overflowX: 'auto' }}>
      {/* Переключатель редакций — внутри листа */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
        <button
          onClick={() => setEdition('6e')}
          style={{
            padding: '8px 16px',
            background: edition === '6e' ? 'var(--accent)' : 'var(--panel)',
            color: edition === '6e' ? 'var(--bg)' : 'var(--text)',
            border: `1px solid var(--border)`,
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontFamily: "'Cinzel', serif",
            letterSpacing: '0.05em',
          }}
        >
          VTM 6E ALPHA
        </button>
        <button
          onClick={() => setEdition('20th')}
          style={{
            padding: '8px 16px',
            background: edition === '20th' ? 'var(--accent)' : 'var(--panel)',
            color: edition === '20th' ? 'var(--bg)' : 'var(--text)',
            border: `1px solid var(--border)`,
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontFamily: "'Cinzel', serif",
            letterSpacing: '0.05em',
          }}
        >
          VTM 20th
        </button>
      </div>

      {edition === '6e' ? (
        <>
          <SheetPage1 showTips={showTips} edition={edition} />
          <SheetPage2 />
          <SheetPage3 />
          <SheetPageInventory />

          <Suspense fallback={null}>
            {character.powerPages?.map((page, idx) => (
              <SheetPage4 key={page.id} page={page} pageIndex={idx} />
            ))}
          </Suspense>

          <div className="no-print" style={{ marginTop: '20px', marginBottom: '40px', textAlign: 'center' }}>
            <button
              onClick={addPowerPage}
              disabled={character.powerPages?.length >= 5}
              style={{
                padding: '10px 20px',
                background: character.powerPages?.length >= 5 ? 'var(--border)' : 'var(--accent)',
                color: character.powerPages?.length >= 5 ? 'var(--muted)' : 'var(--bg)',
                border: 'none',
                borderRadius: '4px',
                cursor: character.powerPages?.length >= 5 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: "'Cinzel', serif"
              }}
            >
              {t('ui.add_page')}
            </button>
          </div>
        </>
      ) : (
        <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>{t('pdf.preparing')}</div>}>
          <ClassicSheetPage />
        </Suspense>
      )}
    </div>
  );
};
