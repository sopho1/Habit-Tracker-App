import React from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { Done as DoneIcon, Star, StarHalf, StarBorder } from '@material-ui/icons';
import { useTranslation } from 'translations';
import { calculateScore, createPieChartData } from './helpers';
import { getWeek, isThisWeek, isToday, parseISO } from 'date-fns';

function BadgeAndRewardPage({ checkmarks, goal }) {
  const t = useTranslation();

  const todayValues = checkmarks
    .filter((c) => isToday(parseISO(c.date)))
    .map((c) => c.value);

  const thisWeekValues = checkmarks
    .filter((c) => isThisWeek(parseISO(c.date)))
    .map((c) => c.value);

  const lastWeekValues = checkmarks
    .filter((c) => getWeek(parseISO(c.date)) === getWeek(new Date()) - 1)
    .map((c) => c.value);

  const allTimeValues = checkmarks.map((d) => d.value);
  const allTimeScore = calculateScore(allTimeValues);

  const badgeData = [
    { label: t('lastWeek'), value: calculateScore(lastWeekValues) },
    { label: t('thisWeek'), value: calculateScore(thisWeekValues) },
    { label: t('today'), value: calculateScore(todayValues) },
  ];

  // Function to determine badge stars based on score
  const getBadgeStars = (score) => {
    if (score >= 90) {
      return (
        <>
          <Star style={{ color: 'gold' }} />
          <Star style={{ color: 'gold' }} />
          <Star style={{ color: 'gold' }} />
          <Star style={{ color: 'gold' }} />
          <Star style={{ color: 'gold' }} />
        </>
      );
    } else if (score >= 75) {
      return (
        <>
          <Star style={{ color: 'silver' }} />
          <Star style={{ color: 'silver' }} />
          <Star style={{ color: 'silver' }} />
        </>
      );
    } else if (score >= 50) {
      return (
        <>
          <Star style={{ color: 'bronze' }} />
          <Star style={{ color: 'bronze' }} />
        </>
      );
    } else {
      return <StarBorder style={{ color: 'gray' }} />;
    }
  };

  const badgeStars = getBadgeStars(allTimeScore);

  return (
    <Box>
      <Typography component="h2" variant="h6" color="primary">
        {t('badges')}
      </Typography>

      <Grid container spacing={3} justifyContent="space-evenly">
        {badgeData.map(({ label, value }) => (
          <Grid item key={label}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                border: '1px solid #ccc',
                borderRadius: '8px',
              }}
            >
              <Typography variant="body1">{label}</Typography>
              <Typography variant="h5">{value}%</Typography>
              {value >= goal && <DoneIcon fontSize="large" color="primary" />}
            </Box>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ marginTop: '24px' }}>
        <Typography component="h3" variant="h6" color="primary">
          {t('overallPerformance')}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            marginTop: '8px',
          }}
        >
          <Box sx={{ marginLeft: '16px', display: 'flex', alignItems: 'center' }}>
            {badgeStars}
          </Box>
          <Typography variant="body1" sx={{ marginLeft: '16px' }}>
            {allTimeScore >= goal ? t('goalAchiever') : t('keepGoing')}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export { BadgeAndRewardPage };
