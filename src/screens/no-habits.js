import { Add as AddIcon } from '@material-ui/icons';
import { ReactComponent as EmptyBox } from 'images/empty-box.svg';
import { Link as RouterLink } from 'react-router-dom';
import { Fab, Box, Typography } from '@material-ui/core';
import { useTranslation } from 'translations';


function NoHabitsScreen() {
  const t = useTranslation();

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        clone
        sx={{
          width: '40%',
          height: '40%',
          margin: 2,
        }}
      >
        <EmptyBox />
      </Box>

      <Box
        sx={{
          margin: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" gutterBottom>
          {t('noHabitsTitle')}
        </Typography>
        <Typography variant="body1">
          {t('noHabitsDescription')}
        </Typography>
      </Box>
      <Fab
        variant="extended"
        color="primary"
        component={RouterLink}
        to="/add-habit"
      >
        <Box
          clone
          sx={{
            mr: 1,
          }}
        >
          <AddIcon />
        </Box>
        {t('addHabit')}
      </Fab>
    </Box>
  );
}

export { NoHabitsScreen };
