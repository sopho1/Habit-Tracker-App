import * as React from 'react';
import { Typography, Grid, Box, IconButton, Toolbar, Divider, useTheme } from '@material-ui/core';
import { Facebook, Twitter, Instagram, LinkedIn, Email, LocationOn } from '@material-ui/icons';
import LogoImage from '../app/authenticated-app/logo.png';
import { useTranslation } from 'translations';

function Footer(props) {
  const t = useTranslation();
  const theme = useTheme();

  return (
    <Box
      component="footer"
      py={4}
      px={2}
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.primary.main,
        fontWeight: 'bold',
      }}
      {...props}
    >
      <Divider />
      <Grid container spacing={4} justifyContent="space-between" alignItems="center">
        <Grid item xs={12} sm={4} md={3}>
          <Toolbar>
            <img
              src={LogoImage}
              alt="Logo"
              style={{ width: '30px', height: '30px', marginRight: theme.spacing(2) }}
            />
            <Typography variant="h6" component="div">
              {t('habitTracker')}
            </Typography>
          </Toolbar>
          <Typography variant="body2" color="inherit" style={{ marginLeft: '5px' }}>
            {t('trackYourHabits')}
          </Typography>

        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          <Typography variant="h6" component="div">
            {t('contactUs')}
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <Typography>
              <Email style={{ paddingTop: '7px', marginRight: '2px' }} />
              <a href="mailto:info@habittracker.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                {t('emailUs')}
              </a>
            </Typography>
          </Box>
          <Box display="flex" alignItems="center">
            <Typography>
              <LocationOn style={{ paddingTop: '7px' }} />
              {t('addisAbaba')}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} sm={4} md={3}>
          <Typography variant="h6" component="div">
            {t('followUs')}
          </Typography>
          <Box>
            <IconButton href="https://www.facebook.com" color="inherit">
              <Facebook />
            </IconButton>
            <IconButton href="https://www.twitter.com" color="inherit">
              <Twitter />
            </IconButton>
            <IconButton href="https://www.instagram.com" color="inherit">
              <Instagram />
            </IconButton>
            <IconButton href="https://www.linkedin.com" color="inherit">
              <LinkedIn />
            </IconButton>
          </Box>
        </Grid>
      </Grid>
      <Box mt={4} textAlign="center" style={{ marginTop: '10px' }}>
        <Typography variant="subtitle2" component="div">
          &copy; {new Date().getFullYear()} {t('allRightsReserved')}
        </Typography>
      </Box>
    </Box>
  );
}

export { Footer };
