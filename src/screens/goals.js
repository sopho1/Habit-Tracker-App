import * as React from 'react';
import { Box, Paper} from '@material-ui/core';
import { PerformanceTab } from 'components/performance-tab';

export default function GoalSettingScreen() {
  
  return (
    <Box
      sx={{
        width: '50vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
      }}
    >
      <Box
        component={Paper}
        sx={{ width: '100%', height: { xs: '100%', sm: 'auto' } }}
      >
        
        <Box sx={{ m: { xs: 0, sm: 2 } }}>
            <PerformanceTab />
        </Box>
      </Box>
    </Box>
  );
}

export { GoalSettingScreen };
