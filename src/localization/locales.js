import { enUS} from 'date-fns/locale';

// Default locale
const defaultLocale = enUS;

// Available locales
const locales = [
  { code: 'en-US', label: 'English', import: enUS,},
  { code: 'am', label: 'Amharic', import: enUS },
  { code: 'om', label: 'Oromiffa', import: enUS,},
];

export { defaultLocale, locales };
