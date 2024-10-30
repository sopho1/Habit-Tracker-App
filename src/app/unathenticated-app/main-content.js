import { Box } from '@material-ui/core';

/**
 * Main content wrapper
 */
function MainContent({ children }) {
  return (
    <Box
      component="main"
      sx={{
        flex: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </Box>
  );
}

export { MainContent };
