export const toNumber = (value: string | number | null | undefined): number => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : 0;
};

function addThousandsSeparator(value: string): string {
  return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function trimFraction(value: string): string {
  return value.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0+$/, '$1');
}

export const formatMoney = (value: string | number, currency = '₽') => {
  const amount = toNumber(value);
  return `${amount.toFixed(2)} ${currency}`;
};

export const formatSignedMoney = (value: string | number, currency = '₽') => {
  const amount = toNumber(value);
  return amount >= 0 ? `+${amount.toFixed(2)} ${currency}` : `${amount.toFixed(2)} ${currency}`;
};

export const formatCompactMoney = (value: string | number, currency = '₽') => {
  const amount = toNumber(value);
  const sign = amount < 0 ? '-' : '';
  const normalized = trimFraction(Math.abs(amount).toFixed(2));
  const [integerPart, fractionPart] = normalized.split('.');
  const formattedInteger = addThousandsSeparator(integerPart);
  const formatted = fractionPart ? `${formattedInteger}.${fractionPart}` : formattedInteger;
  return `${sign}${formatted} ${currency}`;
};

export const formatSignedCompactMoney = (value: string | number, currency = '₽') => {
  const amount = toNumber(value);
  const sign = amount >= 0 ? '+' : '-';
  const normalized = trimFraction(Math.abs(amount).toFixed(2));
  const [integerPart, fractionPart] = normalized.split('.');
  const formattedInteger = addThousandsSeparator(integerPart);
  const formatted = fractionPart ? `${formattedInteger}.${fractionPart}` : formattedInteger;
  return `${sign}${formatted} ${currency}`;
};

export const formatApiMoney = (value: string | number | null | undefined, currency = '₽') => {
  const raw = value == null || value === '' ? '0' : String(value);
  return `${raw} ${currency}`;
};

export const formatQuantity = (value: string | number) => {
  const amount = toNumber(value);
  if (Number.isInteger(amount)) {
    return `${amount.toFixed(0)} шт.`;
  }
  return `${trimFraction(amount.toFixed(2))} шт.`;
};

export const formatDisplayDate = (value?: string | null) => {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '—';
  const day = String(parsed.getDate()).padStart(2, '0');
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const year = parsed.getFullYear();
  return `${day}.${month}.${year}`;
};

export const formatCurrentDate = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}.${month}.${year}`;
};
