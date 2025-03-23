export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
}

// List of common currencies with their symbols and names
export const currencies: CurrencyOption[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "TWD", name: "New Taiwan Dollar", symbol: "NT$" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
];

// Get currency info by code
export function getCurrencyByCode(code: string): CurrencyOption | undefined {
  return currencies.find((currency) => currency.code === code);
}

// Format amount with currency symbol
export function formatAmount(amount: number, currencyCode: string): string {
  const currency = getCurrencyByCode(currencyCode);
  if (!currency) return amount.toLocaleString();

  // Special handling for currencies that typically don't use decimal places
  const noDecimalCurrencies = ["JPY", "KRW", "VND", "IDR"];
  const minimumFractionDigits = noDecimalCurrencies.includes(currencyCode)
    ? 0
    : 2;

  return `${currency.symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  })}`;
}

// Get user's local currency based on their locale
export function getLocalCurrency(): string {
  try {
    const locale = navigator.language;
    const currency = new Intl.NumberFormat(locale)
      .formatToParts(0)
      .find((part) => part.type === "currency");
    return currency?.value || "USD";
  } catch {
    return "USD";
  }
}
