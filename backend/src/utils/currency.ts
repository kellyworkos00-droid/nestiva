/**
 * Currency Utility
 * Handles country-to-currency mapping and currency operations
 */

// Country to currency mapping (ISO 4217)
const COUNTRY_CURRENCY_MAP: Record<string, string> = {
  // Europe
  'AT': 'EUR', 'BE': 'EUR', 'CY': 'EUR', 'DE': 'EUR', 'EE': 'EUR', 'ES': 'EUR',
  'FI': 'EUR', 'FR': 'EUR', 'GR': 'EUR', 'IE': 'EUR', 'IT': 'EUR', 'LT': 'EUR',
  'LU': 'EUR', 'LV': 'EUR', 'MT': 'EUR', 'NL': 'EUR', 'PT': 'EUR', 'SK': 'EUR',
  'SI': 'EUR', 'GB': 'GBP', 'CH': 'CHF', 'SE': 'SEK', 'NO': 'NOK', 'DK': 'DKK',
  'CZ': 'CZK', 'HU': 'HUF', 'PL': 'PLN', 'RO': 'RON', 'HR': 'HRK', 'UA': 'UAH',
  'RU': 'RUB', 'TR': 'TRY', 'GE': 'GEL', 'AM': 'AMD', 'AZ': 'AZN', 'BY': 'BYN',

  // Americas
  'US': 'USD', 'CA': 'CAD', 'MX': 'MXN', 'BR': 'BRL', 'AR': 'ARS', 'CL': 'CLP',
  'CO': 'COP', 'PE': 'PEN', 'VE': 'VES', 'EC': 'USD', 'PA': 'USD', 'CR': 'CRC',
  'JM': 'JMD', 'CU': 'CUP', 'DO': 'DOP', 'TT': 'TTD', 'AG': 'XCD', 'BS': 'BSD',
  'BB': 'BBD', 'BZ': 'BZD', 'GY': 'GYD', 'SR': 'SRD', 'BO': 'BOB', 'PY': 'PYG',
  'UY': 'UYU', 'HN': 'HNL', 'NI': 'NIO', 'SV': 'USD', 'GT': 'GTQ', 'BH': 'BHD',

  // Asia
  'IN': 'INR', 'CN': 'CNY', 'JP': 'JPY', 'KR': 'KRW', 'TH': 'THB', 'MY': 'MYR',
  'SG': 'SGD', 'ID': 'IDR', 'PH': 'PHP', 'VN': 'VND', 'TW': 'TWD', 'HK': 'HKD',
  'BD': 'BDT', 'LK': 'LKR', 'PK': 'PKR', 'NP': 'NPR', 'AF': 'AFN', 'KZ': 'KZT',
  'UZ': 'UZS', 'TJ': 'TJS', 'TM': 'TMT', 'KG': 'KGS', 'IR': 'IRR', 'IQ': 'IQD',
  'SA': 'SAR', 'AE': 'AED', 'QA': 'QAR', 'KW': 'KWD', 'OM': 'OMR', 'YE': 'YER',
  'JO': 'JOD', 'LB': 'LBP', 'SY': 'SYP', 'IL': 'ILS', 'PS': 'ILS', 'MN': 'MNT',
  'LA': 'LAK', 'KH': 'KHR', 'MM': 'MMK', 'BN': 'BND', 'TL': 'USD',

  // Africa
  'EG': 'EGP', 'ZA': 'ZAR', 'NG': 'NGN', 'KE': 'KES', 'ET': 'ETB', 'GH': 'GHS',
  'MA': 'MAD', 'TN': 'TND', 'UG': 'UGX', 'TZ': 'TZS', 'RW': 'RWF', 'SD': 'SDG',
  'DZ': 'DZD', 'LY': 'LYD', 'MZ': 'MZN', 'AO': 'AOA', 'ZM': 'ZMW', 'ZW': 'USD',
  'MW': 'MWK', 'BW': 'BWP', 'NA': 'NAD', 'SZ': 'SZL', 'LS': 'LSL', 'MG': 'MGA',
  'MU': 'MUR', 'SC': 'SCR', 'CI': 'XOF', 'BF': 'XOF', 'ML': 'XOF', 'SN': 'XOF',
  'BJ': 'XOF', 'NE': 'XOF', 'TG': 'XOF', 'CM': 'XAF', 'CF': 'XAF', 'CG': 'XAF',
  'GA': 'XAF', 'GQ': 'XAF', 'CD': 'CDF', 'AG': 'XCD', 'BS': 'BSD', 'BB': 'BBD',

  // Oceania
  'AU': 'AUD', 'NZ': 'NZD', 'FJ': 'FJD', 'PG': 'PGK', 'SB': 'SBD', 'WS': 'WST',
  'TO': 'TOP', 'VU': 'VUV', 'KI': 'AUD', 'NR': 'AUD', 'TV': 'AUD', 'PW': 'USD',
  'MH': 'USD', 'FM': 'USD', 'GU': 'USD', 'MP': 'USD', 'AS': 'USD', 'UM': 'USD',
};

// Currency symbols
const CURRENCY_SYMBOLS: Record<string, string> = {
  'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CNY': '¥', 'INR': '₹',
  'AUD': '$', 'CAD': '$', 'CHF': 'CHF', 'SEK': 'kr', 'NOK': 'kr', 'DKK': 'kr',
  'NZD': '$', 'SGD': '$', 'HKD': '$', 'MXN': '$', 'BRL': 'R$', 'KRW': '₩',
  'THB': '฿', 'MYR': 'RM', 'PHP': '₱', 'VND': '₫', 'IDR': 'Rp', 'PKR': '₨',
  'ILS': '₪', 'ZAR': 'R', 'AED': 'د.إ', 'SAR': '﷼', 'QAR': '﷼', 'KWD': 'د.ك',
};

// Current exchange rates (base: USD, would be fetched from API in production)
const EXCHANGE_RATES: Record<string, number> = {
  'USD': 1.0,
  'EUR': 0.92,
  'GBP': 0.79,
  'JPY': 148.5,
  'CNY': 7.24,
  'INR': 83.12,
  'AUD': 1.52,
  'CAD': 1.36,
  'CHF': 0.88,
  'SEK': 10.45,
  'NOK': 10.68,
  'DKK': 6.86,
  'NZD': 1.67,
  'SGD': 1.34,
  'HKD': 7.81,
  'MXN': 17.05,
  'BRL': 4.97,
  'KRW': 1308.50,
  'THB': 35.42,
  'MYR': 4.72,
  'PHP': 56.15,
  'VND': 24560.0,
  'IDR': 16025.0,
  'PKR': 278.50,
  'ILS': 3.72,
  'ZAR': 18.55,
  'AED': 3.67,
  'SAR': 3.75,
  'QAR': 3.64,
  'KWD': 0.31,
};

/**
 * Get currency code for a country
 */
export function getCurrencyByCountry(countryCode: string): string {
  const code = (countryCode || '').toUpperCase();
  return COUNTRY_CURRENCY_MAP[code] || 'USD'; // Default to USD
}

/**
 * Get currency symbol for a currency code
 */
export function getCurrencySymbol(currencyCode: string): string {
  const code = (currencyCode || '').toUpperCase();
  return CURRENCY_SYMBOLS[code] || currencyCode;
}

/**
 * Format price with currency
 */
export function formatPrice(
  amount: number,
  currency: string,
  locale: string = 'en-US'
): string {
  const symbol = getCurrencySymbol(currency);
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (e) {
    // Fallback if locale not supported
    return `${symbol}${amount.toFixed(2)}`;
  }
}

/**
 * Convert price from one currency to another
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) {
    return amount;
  }

  const from = (fromCurrency || 'USD').toUpperCase();
  const to = (toCurrency || 'USD').toUpperCase();

  const fromRate = EXCHANGE_RATES[from] || 1;
  const toRate = EXCHANGE_RATES[to] || 1;

  const inUSD = amount / fromRate;
  return inUSD * toRate;
}

/**
 * Get exchange rate between two currencies
 */
export function getExchangeRate(
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) {
    return 1;
  }

  const from = (fromCurrency || 'USD').toUpperCase();
  const to = (toCurrency || 'USD').toUpperCase();

  const fromRate = EXCHANGE_RATES[from] || 1;
  const toRate = EXCHANGE_RATES[to] || 1;

  return toRate / fromRate;
}

/**
 * Is this country code valid
 */
export function isValidCountry(countryCode: string): boolean {
  return Object.keys(COUNTRY_CURRENCY_MAP).includes((countryCode || '').toUpperCase());
}

/**
 * List all supported countries and currencies
 */
export function getSupportedCurrencies(): Record<string, string> {
  return { ...COUNTRY_CURRENCY_MAP };
}

/**
 * Get all exchange rates (for client-side conversion)
 */
export function getAllExchangeRates(): Record<string, number> {
  return { ...EXCHANGE_RATES };
}
