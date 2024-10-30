import * as React from 'react';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import { addDays, format, startOfWeek } from 'date-fns';
import { defaultLocale, locales } from './locales';

function LocaleProvider({ children }) {
  const [locale, setLocale] = React.useState(defaultLocale);
  const [localeCode, setLocaleCode] = React.useState('en-US'); // Default locale code

  const setLocaleByCode = React.useCallback(
    (newLocaleCode) => {
      const newLocale = locales.find((locale) => locale.code === newLocaleCode);

      if (newLocale) {
        setLocale(newLocale.import);
        setLocaleCode(newLocale.code); // Update locale code
      } else {
        throw new Error(`Unhandled locale code provided: ${newLocaleCode}`);
      }
    },
    []
  );

  const weekdays = React.useMemo(() => {
    const firstDayOfWeek = startOfWeek(new Date(), { locale });

    return Array.from(Array(7)).map((_, i) =>
      format(addDays(firstDayOfWeek, i), 'eeee', { locale })
    );
  }, [locale]);

  const localeValue = {
    ...locale,
    weekdays,
    setLocaleByCode,
    code: localeCode, // Pass the locale code to context
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={localeValue}>
      {children}
    </LocalizationProvider>
  );
}

export { LocaleProvider };
