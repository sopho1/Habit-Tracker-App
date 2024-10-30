import * as React from 'react';
import { Box } from '@material-ui/core';
import 'styles/ImageBackground.css';

/**
 * Layout with image background
 */
function Layout({ children }) {
  return (
    <ImageBackground>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {children}
      </Box>
    </ImageBackground>
  );
}

/**
 * Component for displaying image background
 */
function ImageBackground({ children }) {
  return (
    <div className="image-background">
      {children}
    </div> 
  );
}

export { Layout };
