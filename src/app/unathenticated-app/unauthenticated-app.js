import * as React from 'react';
import { Link as RouterLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Hidden,
  IconButton,
  Toolbar,
  Tooltip,
  useTheme,
  Box,
} from '@material-ui/core';
import {
  AccountCircle as AccountCircleIcon,
  Brightness4 as MoonIcon,
  Brightness7 as SunIcon,
  PersonAdd as PersonAddIcon,
} from '@material-ui/icons';
import {
  MobileMenu,
  MobileMenuItem,
  MobileMenuProvider,
  MobileMenuToggler,
} from 'components/mobile-menu';

import { Footer } from 'components/footer';
import { LocaleSelect } from 'components/locale-select';
import { LandingScreen } from 'screens/landing';
import { ResetPasswordScreen } from 'screens/reset-password';
import { SignInScreen } from 'screens/sign-in';
import { SignUpScreen } from 'screens/sign-up';
import { useTranslation } from 'translations';
import { AppTitle } from './app-title';
import { FooterPro } from './footerPro';
import { Layout } from './layout';
import { MainContent } from './main-content';
import { Navbar, NavbarStartItem } from './navbar';
import AdminLogin from 'admin/components/AdminLogin';
import AdminPage from 'admin/components/AdminPage';
import ProtectedRoute from 'admin/ProtectedRoute';
import { AuthProvider } from 'admin/Authcontext';

const iconButtonProps = {
  edge: 'start',
  color: 'inherit',
};

/**
 * Version of the app when user is not authenticated.
 */
function UnathenticatedApp() {
  const t = useTranslation();
  const { palette, toggleDarkMode } = useTheme();
  const location = useLocation();

  // Dark mode
  const darkModeLabel = t('darkModeSwitch');
  const darkModeIcon = palette.mode === 'light' ? <MoonIcon /> : <SunIcon />;

  const showAuthButtons = location.pathname !== '/admin-dashboard';

  return (
    <Layout>
      {/* Navbar */}
      <MobileMenuProvider>
        <Navbar>
          <NavbarStartItem>
            <AppTitle />
          </NavbarStartItem>

          {/* Screens larger than `xs` */}
          <Hidden smDown>
            {/* Locale select */}
            <LocaleSelect />

            {/* Dark mode switch */}
            <Tooltip title={darkModeLabel}>
              <IconButton
                aria-label={darkModeLabel}
                onClick={toggleDarkMode}
                {...iconButtonProps}
              >
                {darkModeIcon}
              </IconButton>
            </Tooltip>

            {showAuthButtons && (
              <ButtonGroup variant="outlined" color="inherit">
                <Button component={RouterLink} to="/signin">
                  {t('signIn')}
                </Button>
                <Button component={RouterLink} to="/signup">
                  {t('signUp')}
                </Button>
              </ButtonGroup>
            )}
          </Hidden>

          <Hidden smUp>
            {/* Toggle mobile menu */}
            <MobileMenuToggler />
          </Hidden>
        </Navbar>

        <MobileMenu>
          {showAuthButtons && (
            <>
              {/* Sign in */}
              <MobileMenuItem component={RouterLink} to="signin">
                <IconButton edge="start">
                  <AccountCircleIcon />
                </IconButton>
                <p>{t('signIn')}</p>
              </MobileMenuItem>

              {/* Sign up */}
              <MobileMenuItem component={RouterLink} to="signup">
                <IconButton edge="start">
                  <PersonAddIcon />
                </IconButton>
                <p>{t('signUp')}</p>
              </MobileMenuItem>
            </>
          )}

          {/* Locale select */}
          <LocaleSelect variant="item" />

          {/* Dark mode switch */}
          <MobileMenuItem onClick={toggleDarkMode}>
            <IconButton edge="start">{darkModeIcon}</IconButton>
            <p>{t('darkModeSwitch')}</p>
          </MobileMenuItem>
        </MobileMenu>
      </MobileMenuProvider>

      {/* Main content */}
      <MainContent>
        {/* Offset for navbar */}
        <Toolbar />
        <AuthProvider>

          <Routes>
            <Route path="/" element={<LandingScreen />} />
            <Route path="/signin" element={<SignInScreen />} />
            <Route path="/signup" element={<SignUpScreen />} />
            <Route path="/reset-password" element={<ResetPasswordScreen />} />
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <ProtectedRoute path="/admin-dashboard" element={<AdminPage />} />
          </Routes>

        </AuthProvider>

      </MainContent>

      {/* Footer */}
      <FooterPro>
        <Footer />
      </FooterPro>

    </Layout>
  );
}

export { UnathenticatedApp };
