export const toNumber = (value: string | number | null | undefined): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
};

export const formatMoney = (value: string | number, currency = '₽') => {
  const amount = toNumber(value);
  return `${amount.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ${currency}`;
};

export const formatSignedMoney = (value: string | number, currency = '₽') => {
  const amount = toNumber(value);
  const prefix = amount >= 0 ? '+' : '-';
  return `${prefix}${Math.abs(amount).toLocaleString('ru-RU', { maximumFractionDigits: 2 })} ${currency}`;
};

export const formatQuantity = (value: string | number) => {
  const amount = toNumber(value);
  return Number.isInteger(amount)
    ? `${amount.toFixed(0)} шт.`
    : `${amount.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} шт.`;
};


export const formatDisplayDate = (value?: string | null) => {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  return parsed.toLocaleDateString('ru-RU');
};
