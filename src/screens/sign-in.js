import React, { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField, makeStyles } from '@material-ui/core'; // Import makeStyles
import { AuthProviderList } from 'components/auth-providers-list';
import {
  Form,
  FormBody,
  FormButton,
  FormDivider,
  FormErrorText,
  FormHeader,
  FormLink,
  FormListContainer,
  FormPrimaryText,
  FormSecondaryText,
} from 'components/form';
import { useAuth } from 'context/auth-context';
import { signInSchema } from 'data/constraints';
import { useTranslation, translations } from 'translations';
import { useForm } from 'react-hook-form';
import { useAsync } from 'utils/hooks';
import ReminderSnackbar from 'components/reminderSnackbar';
import { SignInAsGuestButton } from 'components/sign-in-as-guest-button';

// Define styles using makeStyles
const useStyles = makeStyles((theme) => ({
  root: {
    overflowY: 'auto',
    minHeight: '100vh',
    margin: '12px'
  },
}));

function SignInScreen() {
  const classes = useStyles(); // Use defined styles

  const t = useTranslation(translations);

  const { signIn, signInWithAuthProvider, signInAsGuest } = useAuth();
  const { isLoading, isError: isAuthError, error: authError, run } = useAsync();

  const { register, handleSubmit, errors, reset } = useForm({
    resolver: yupResolver(signInSchema),
    reValidateMode: 'onSubmit',
  });

  const [showReminderSnackbar, setShowReminderSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Map Firebase error codes to user-friendly messages
  const getErrorMessage = (error) => {
    switch (error.code) {
      default:
        return t('signInError');
    }
  };

  // Form submit
  const onSubmit = ({ email, password }) => {
    run(signIn({ email, password }))
      .then(() => {
        // Show the Snackbar when login is successful
        setShowReminderSnackbar(true);
      })
      .catch((error) => {
        // Set a user-friendly error message
        const userFriendlyErrorMessage = getErrorMessage(error);
        // Display the error message in the form
        setErrorMessage(userFriendlyErrorMessage);
        reset(); // Reset the form on error
      });
  };

  // Auth provider click
  const handleAuthProviderClick = (event, provider) => {
    // Prevents the form from submitting and triggering the form errors
    event.preventDefault();

    run(signInWithAuthProvider(provider));
  };

  // Sign in as Guest click
  const handleSignInAsGuestClick = () => {
    run(signInAsGuest());
  };

  const errorMessages = Object.values(errors);
  const isError = isAuthError || errorMessages.length !== 0;
  const formErrorMessage = authError?.message || errorMessages[0]?.message;

  const closeSnackbar = () => {
    setShowReminderSnackbar(false);
  };

  return (
    <div className={classes.root}> {/* Apply root class */}
      <div className={classes.formContainer}> {/* Apply formContainer class */}
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormHeader>
            <FormPrimaryText>{t('signIn')}</FormPrimaryText>
            <FormSecondaryText>
              {t('noAccountQuestion')}{' '}
              <FormLink to="/signup">{t('signUp')}</FormLink>
            </FormSecondaryText>
            <FormErrorText>{isError ? (errorMessage || formErrorMessage) : ' '}</FormErrorText>
          </FormHeader>

          <FormBody>
            <FormListContainer>
              <AuthProviderList
                text={t('signInWith')}
                onAuthProviderClick={handleAuthProviderClick}
                disabled={isLoading}
              />

              <SignInAsGuestButton
                label={t('signInAsGuest')}
                disabled={isLoading}
                onClick={handleSignInAsGuestClick}
              />
            </FormListContainer>

            <FormDivider />

            <TextField
              inputRef={register}
              name="email"
              autoComplete="email"
              label={t('email')}
              placeholder={t('emailPlaceholder')}
              error={!!errors?.email}
              disabled={isLoading}
              variant="outlined"
              fullWidth
            />

            <TextField
              inputRef={register}
              name="password"
              type="password"
              autoComplete="current-password"
              label={t('password')}
              placeholder="••••••••••••••"
              error={!!errors?.password}
              disabled={isLoading}
              variant="outlined"
              fullWidth
            />

            <FormButton type="submit" pending={isLoading}>
              {t('signIn')}
            </FormButton>

            <FormSecondaryText>
              <FormLink to="/reset-password">{t('forgotPassword')}</FormLink>
            </FormSecondaryText>

            <FormSecondaryText>
              <FormLink to="/admin-login">{t('areYouAdmin')}</FormLink>
            </FormSecondaryText>
          </FormBody>
        </Form>
        <ReminderSnackbar
          open={showReminderSnackbar}
          handleClose={closeSnackbar}
        />
      </div>
    </div>
  );
}

export { SignInScreen };
