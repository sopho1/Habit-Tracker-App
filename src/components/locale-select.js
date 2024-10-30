import * as React from 'react';
import PropTypes from 'prop-types';
import { locales, useLocale } from 'localization';
import {
  Menu,
  MenuItem,
  Typography,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { useTranslation } from 'translations';
import { MobileMenuItem } from 'components/mobile-menu';
import { Language } from '@material-ui/icons';

function LocaleSelect({ variant = 'icon', onLocaleClick = () => {} }) {
  const { code: selectedCode, setLocaleByCode } = useLocale();
  const t = useTranslation();

  // Open/close menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (clickedLocaleCode) => {
    onLocaleClick(clickedLocaleCode);
    setLocaleByCode(clickedLocaleCode);
    closeMenu();
  };

  return (
    <>
      {variant === 'icon' && (
        <Tooltip title={t('selectLanguage')}>
          <IconButton
            color="inherit"
            aria-controls="select-language"
            aria-label={t('selectLanguage')}
            aria-haspopup="true"
            onClick={openMenu}
          >
            <Language />
          </IconButton>
        </Tooltip>
      )}

      {variant === 'item' && (
        <MobileMenuItem onClick={openMenu}>
          <IconButton
            edge="start"
            aria-controls="select-language"
            aria-haspopup="true"
          >
            <Language />
          </IconButton>
          <p>{t('selectLanguage')}</p>
        </MobileMenuItem>
      )}

      <Menu
        id="select-language"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        {locales.map(({ code, label }) => (
          <MenuItem
            key={code}
            selected={selectedCode === code}
            onClick={() => handleMenuItemClick(code)}
          >
            <Typography variant="inherit">{label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

LocaleSelect.propTypes = {
  variant: PropTypes.oneOf(['item']),
  onLocaleClick: PropTypes.func,
};

export { LocaleSelect };
