export const numberOrNull = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export const formatCurrency = (n: number, currency = "ILS", locale = "he-IL") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(n);

export const toFixedSafe = (v: unknown, digits = 1) => {
  const n = numberOrNull(v);
  return n === null ? null : n.toFixed(digits);
};
