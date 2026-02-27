
const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
const englishDigits = '0123456789';

export const toPersianDigits = (n: number | string): string => {
  const numStr = String(n);
  return numStr.replace(/[0-9]/g, (w) => persianDigits[+w]);
};

export const fromPersianDigits = (str: string): string => {
  return str.replace(/[۰-۹]/g, (w) => String(persianDigits.indexOf(w)));
};

export const formatWithCommas = (val: string): string => {
  // Remove all non-numeric characters except for formatting
  const clean = val.replace(/[^\d]/g, '');
  if (!clean) return '';
  return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const stripCommas = (val: string): string => {
  return val.replace(/,/g, '');
};

export const normalizePersian = (str: string): string => {
  return str
    .replace(/ی/g, 'ی')
    .replace(/ي/g, 'ی')
    .replace(/ک/g, 'ک')
    .replace(/ك/g, 'ک')
    .trim()
    .toLowerCase();
};

export const formatCurrency = (amount: number, language: 'en' | 'fa', t: any): string => {
    const safeAmount = isNaN(amount) ? 0 : amount;
    if (language === 'fa') {
        const formattedAmount = safeAmount.toLocaleString('fa-IR');
        return `${toPersianDigits(formattedAmount)} ${t.currencySymbol}`;
    }
    return `${safeAmount.toLocaleString('en-US')}${t.currencySymbol}`;
};

export const safeParseInt = (val: string): number => {
    const clean = stripCommas(fromPersianDigits(val));
    const parsed = parseInt(clean, 10);
    return isNaN(parsed) ? 0 : parsed;
};

export const safeParseFloat = (val: string): number => {
    const clean = stripCommas(fromPersianDigits(val));
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
};
