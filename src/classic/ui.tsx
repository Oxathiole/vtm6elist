import React, { FC, ReactNode } from 'react';

interface SectionTitleProps {
  children: ReactNode;
}

/** Заголовок секции как на бумаге: жирный чёрный serif по центру,
 * по бокам горизонтальные линии с ромбами «◆» на концах. */
export const SectionTitle: FC<SectionTitleProps> = ({ children }) => (
  <div className="cl-section-title" style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '8px 0 6px' }}>
    <span className="cl-line" style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
    <span style={{ fontSize: '10px', color: 'var(--text)', fontWeight: 'bold' }}>◆</span>
    <span style={{ fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text)', textAlign: 'center', flex: 1 }}>
      {children}
    </span>
    <span style={{ fontSize: '10px', color: 'var(--text)', fontWeight: 'bold' }}>◆</span>
    <span className="cl-line" style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
  </div>
);

interface RatingProps {
  value: number;
  max: number;
  min?: number;
  onChange: (v: number) => void;
  shape?: 'circle' | 'square';
  size?: number;
  mode?: 'rating' | 'pool';
}

/** Ряд кружков/квадратиков. Логика клика по позиции pos (1-based):
 * rating: если pos === value → max(min, value-1), иначе pos.
 * pool:   если pos === value → 0, иначе pos. */
export const Rating: FC<RatingProps> = ({ value, max, min = 0, onChange, shape = 'circle', size = 12, mode = 'rating' }) => {
  const safeValue = Math.max(min, Math.min(max, value));
  const isSquare = shape === 'square';

  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {Array.from({ length: max }).map((_, i) => {
        const pos = i + 1; // 1-based
        const isFilled = pos <= safeValue;
        let onClick: () => void;
        if (mode === 'rating') {
          onClick = () => {
            const next = pos === safeValue ? Math.max(min, safeValue - 1) : pos;
            onChange(next);
          };
        } else {
          onClick = () => {
            const next = pos === safeValue ? 0 : pos;
            onChange(next);
          };
        }
        return (
          <button
            key={pos}
            type="button"
            aria-label={`Dot ${pos} of ${max}, current value ${safeValue}`}
            onClick={onClick}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: size,
              height: size,
              padding: 0,
              flexShrink: 0,
              cursor: 'pointer',
              border: '1px solid var(--border)',
              borderRadius: isSquare ? '0' : '50%',
              background: isFilled ? 'var(--accent)' : 'var(--panel)',
              transition: 'all 0.1s',
            }}
          />
        );
      })}
    </div>
  );
};

interface LinedTextareaProps {
  value: string;
  onChange: (v: string) => void;
  lines: number;
}

/** Textarea с «линованной бумагой». */
export const LinedTextarea: FC<LinedTextareaProps> = ({ value, onChange, lines }) => (
  <textarea
    value={value ?? ''}
    onChange={e => onChange(e.target.value)}
    style={{
      lineHeight: '22px',
      height: `${lines * 22}px`,
      background: 'repeating-linear-gradient(transparent 0 21px, var(--border) 21px 22px)',
      border: 'none',
      resize: 'none',
      font: 'inherit',
      width: '100%',
      boxSizing: 'border-box',
      color: 'var(--text)',
      fontFamily: "Georgia, 'Times New Roman', serif",
      fontSize: '12px',
      margin: 0,
      padding: '0 2px',
    }}
  />
);

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  width?: string;
}

/** Подпись мелким шрифтом + текстовый input с нижней границей. */
export const Field: FC<FieldProps> = ({ label, value, onChange, width = '100%' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
    <label style={{ fontSize: '9px', color: 'var(--text)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '1px' }}>{label}</label>
    <input
      type="text"
      value={value ?? ''}
      onChange={e => onChange(e.target.value)}
      style={{
        width,
        background: 'var(--input-bg)',
        border: 'none',
        borderBottom: '1px solid var(--border)',
        outline: 'none',
        color: 'var(--text)',
        font: 'inherit',
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontSize: '11px',
        padding: '1px 2px',
        boxSizing: 'border-box',
      }}
      onFocus={e => { e.currentTarget.style.borderBottomColor = '#8a6d1f'; }}
      onBlur={e => { e.currentTarget.style.borderBottomColor = '#6b6350'; }}
    />
  </div>
);

interface HealthTrackProps {
  value: number[];
  onChange: (v: number[]) => void;
}

/** 7 строк здоровья. Клик по ячейке циклически меняет 0→1→2→3→0. */
export const HealthTrack: FC<HealthTrackProps> = ({ value, onChange }) => {
  const symbols = ['', '/', '✕', '✳'];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {Array.from({ length: 7 }).map((_, i) => {
        const cur = Math.max(0, Math.min(3, value[i] ?? 0));
        const next = (cur + 1) % 4;
        return (
          <button
            key={i}
            type="button"
            aria-label={`Health row ${i + 1}, state ${cur}`}
            onClick={() => onChange(value.map((v, j) => (j === i ? next : v)))}
            style={{
              width: '16px',
              height: '16px',
              border: '1px solid var(--border)',
              background: 'var(--panel)',
              color: 'var(--text)',
              fontWeight: 'bold',
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              flexShrink: 0,
            }}
          >
            {symbols[cur]}
          </button>
        );
      })}
    </div>
  );
};
