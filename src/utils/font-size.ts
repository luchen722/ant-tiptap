export const DEFAULT_FONT_SIZES = [
  '8px',
  '10px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '30px',
  '36px',
  '48px',
  '60px',
  '72px',
];

export const DEFAULT_FONT_SIZE = 'default';

const SIZE_PATTERN = /(\d+\.?\d*)([^\d]*)$/i;

export function convertToPX(styleValue: string): string {
  const matches = styleValue.match(SIZE_PATTERN);

  if (!matches) return '';
  const value = matches[1];
  if (!value) return '';
  return value;
}
