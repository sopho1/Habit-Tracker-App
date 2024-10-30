import * as React from 'react';
import { Box } from '@material-ui/core';
import { DrawerProvider } from './drawer-context';

/**
 * Layout
 */
function Layout({ children }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
            <DrawerProvider>{children}</DrawerProvider>
        </Box>
  );
}

export { Layout };
