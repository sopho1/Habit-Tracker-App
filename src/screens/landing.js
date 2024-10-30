import React from 'react';
import {
Box,
Fab,
Typography,
useTheme,
} from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'translations';

function LandingScreen() {
return (
<Box>
<WelcomeSection />
</Box>
);

}

function WelcomeSection() {
const t = useTranslation();

return (
<Box sx={{ textAlign: 'center', color: 'white' }}>
<QuoteBox>
<Quote>
{t('welcomeFirstLine')}
<br />
</Quote>
<WelcomeMessage> {t('landingQuoteSecondLine')} <br/> </WelcomeMessage>
</QuoteBox>
<GetStartedButton>{t('getStarted')}</GetStartedButton>
</Box>
);
}

function QuoteBox({ children }) {
return (
<Box
sx={{
textAlign: 'left',
mb: { xs: 1, sm: 0 },
}}
>
{children}
</Box>
);
}

function Quote({ children }) {
return (
<Box
clone
sx={{
textAlign: 'left',
whiteSpace: { xs: 'initial', sm: 'nowrap' },
maxWidth: { xs: 295, sm: 'none' },
fontSize: { xs: '2.5rem', sm: '2rem', md: '3rem' },
}}
>
<Typography variant="h1" component="p" sx={{ color: 'white' }}>
{children}
</Typography>
</Box>
);
}

function WelcomeMessage({ children }) {
return (
<Box
sx={{
fontWeight: 'light',
fontStyle: 'italic',
mb: { xs: 1, sm: 0 },
}}
clone
>
<Typography variant="h5" component="span" sx={{ color: 'white' }}>
{children}
</Typography>
</Box>
);
}

function GetStartedButton(props) {
const theme = useTheme();

return (
<Box
clone
sx={{
backgroundColor: theme.palette.background.paper,
color: theme.palette.primary.main,
fontWeight: 'bold',
mt: 3,
}}
>
<Fab to="/signup" component={RouterLink} variant="extended" {...props} />
</Box>
);
}

export { LandingScreen };