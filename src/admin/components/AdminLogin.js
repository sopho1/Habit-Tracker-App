import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from 'context/firebase-context';
import { TextField, Button, Container, Typography, Box, makeStyles } from '@material-ui/core';
import { useAuth } from '../Authcontext';
import { useTranslation } from 'translations'; 

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[1],
    marginBottom: '360px',
  },
}));

const AdminLogin = () => {
  const classes = useStyles();
  const t = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate();
  const { firestore } = useFirebase();
  const { login } = useAuth(); // Get login function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const adminRef = await firestore.collection('admin').where('email', '==', email).get();
      if (!adminRef.empty) {
        const adminData = adminRef.docs[0].data();
        if (adminData.password === password) {
          login(); // Set isAuthenticated to true upon successful login
          history('/admin-dashboard');
        } else {
          alert(t('invalidCredentials'));
        }
      } else {
        alert(t('invalidCredentials'));
      }
    } catch (error) {
      console.error(t('errorLoggingIn'), error);
    }
  };

  return (
    <Container maxWidth="xs" className={classes.root}>
      <Box className={classes.formContainer}>
        <Typography component="h1" variant="h5" align="center">
          {t('adminLogin')}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label={t('emailAddress')}
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label={t('password')}
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '1rem' }}
          >
            {t('login')}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AdminLogin;
