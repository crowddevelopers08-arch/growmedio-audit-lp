/**
 * Dial codes for the booking form's phone field.
 *
 * Only what the field needs: the ISO code (for the flag), the country name
 * (for search), and the dial code. `tz` is here purely so a visitor's browser
 * timezone can pick a sensible default country.
 */
export interface Country {
  iso: string; // ISO 3166-1 alpha-2
  name: string;
  dial: string; // dial code without the leading "+"
  tz: string; // representative IANA timezone
}

// India first (the clinic market), then Gulf, then the rest.
export const COUNTRIES: Country[] = [
  { iso: "IN", name: "India", dial: "91", tz: "Asia/Kolkata" },
  { iso: "AE", name: "United Arab Emirates", dial: "971", tz: "Asia/Dubai" },
  { iso: "SA", name: "Saudi Arabia", dial: "966", tz: "Asia/Riyadh" },
  { iso: "QA", name: "Qatar", dial: "974", tz: "Asia/Qatar" },
  { iso: "KW", name: "Kuwait", dial: "965", tz: "Asia/Kuwait" },
  { iso: "OM", name: "Oman", dial: "968", tz: "Asia/Muscat" },
  { iso: "BH", name: "Bahrain", dial: "973", tz: "Asia/Bahrain" },
  { iso: "US", name: "United States", dial: "1", tz: "America/New_York" },
  { iso: "CA", name: "Canada", dial: "1", tz: "America/Toronto" },
  { iso: "GB", name: "United Kingdom", dial: "44", tz: "Europe/London" },
  { iso: "AU", name: "Australia", dial: "61", tz: "Australia/Sydney" },
  { iso: "NZ", name: "New Zealand", dial: "64", tz: "Pacific/Auckland" },
  { iso: "SG", name: "Singapore", dial: "65", tz: "Asia/Singapore" },
  { iso: "MY", name: "Malaysia", dial: "60", tz: "Asia/Kuala_Lumpur" },
  { iso: "HK", name: "Hong Kong", dial: "852", tz: "Asia/Hong_Kong" },
  { iso: "DE", name: "Germany", dial: "49", tz: "Europe/Berlin" },
  { iso: "FR", name: "France", dial: "33", tz: "Europe/Paris" },
  { iso: "NL", name: "Netherlands", dial: "31", tz: "Europe/Amsterdam" },
  { iso: "IE", name: "Ireland", dial: "353", tz: "Europe/Dublin" },
  { iso: "IT", name: "Italy", dial: "39", tz: "Europe/Rome" },
  { iso: "ES", name: "Spain", dial: "34", tz: "Europe/Madrid" },
  { iso: "CH", name: "Switzerland", dial: "41", tz: "Europe/Zurich" },
  { iso: "SE", name: "Sweden", dial: "46", tz: "Europe/Stockholm" },
  { iso: "NO", name: "Norway", dial: "47", tz: "Europe/Oslo" },
  { iso: "ZA", name: "South Africa", dial: "27", tz: "Africa/Johannesburg" },
  { iso: "NG", name: "Nigeria", dial: "234", tz: "Africa/Lagos" },
  { iso: "KE", name: "Kenya", dial: "254", tz: "Africa/Nairobi" },
  { iso: "JP", name: "Japan", dial: "81", tz: "Asia/Tokyo" },
  { iso: "CN", name: "China", dial: "86", tz: "Asia/Shanghai" },
  { iso: "BD", name: "Bangladesh", dial: "880", tz: "Asia/Dhaka" },
  { iso: "LK", name: "Sri Lanka", dial: "94", tz: "Asia/Colombo" },
  { iso: "NP", name: "Nepal", dial: "977", tz: "Asia/Kathmandu" },
  { iso: "PK", name: "Pakistan", dial: "92", tz: "Asia/Karachi" },
  { iso: "PH", name: "Philippines", dial: "63", tz: "Asia/Manila" },
  { iso: "ID", name: "Indonesia", dial: "62", tz: "Asia/Jakarta" },
  { iso: "TH", name: "Thailand", dial: "66", tz: "Asia/Bangkok" },
];

export const DEFAULT_COUNTRY = COUNTRIES[0];

/** Best-effort default from the visitor's own timezone; falls back to India. */
export function detectCountry(): Country {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const match = COUNTRIES.find((c) => c.tz === tz);
    if (match) return match;
  } catch {
    /* ignore */
  }
  return DEFAULT_COUNTRY;
}

/**
 * India keeps the strict 10-digit mobile check; everywhere else gets a generic
 * international length check. Shared by the form and the API so they can never
 * disagree about what a valid number is.
 */
export function isValidPhone(raw: string, iso?: string) {
  const digits = raw.replace(/\D/g, "");
  if (!iso || iso.toUpperCase() === "IN") return /^[6-9]\d{9}$/.test(digits);
  return digits.length >= 6 && digits.length <= 14;
}
