import * as React from 'react';
import { useFirebase } from './firebase-context';
import { useAsync } from 'utils/hooks';
import { FullPageSpinner, FullPageErrorFallback } from 'components/lib';
import { useNavigate } from 'react-router';
import { useTheme } from '@material-ui/core';

const AuthContext = React.createContext();
AuthContext.displayName = 'AuthContext';

function AuthProvider(props) {
  const {
    data: user,
    status,
    error,
    isLoading,
    isIdle,
    isError,
    isSuccess,
    setData,
  } = useAsync();

  const { firebase, auth } = useFirebase();
  const { resetTheme } = useTheme();
  const navigate = useNavigate();

  // Auth state change observer
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setData(user);
        navigate('dashboard');
      } else {
        setData(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [auth, setData, navigate]);

  // Sign in (email, password)
  const signIn = React.useCallback(
    ({ email, password }) => {
      return auth.signInWithEmailAndPassword(email, password);
    },
    [auth]
  );

  // Sign in with Auth Provider
  const signInWithAuthProvider = React.useCallback(
    ({ id, scopes }) => {
      const authProvider = new firebase.auth.OAuthProvider(id);

      if (scopes) {
        scopes.forEach((scope) => {
          authProvider.addScope(scope);
        });
      }

      return auth.signInWithPopup(authProvider);
    },
    [firebase, auth]
  );

  // Sign in as guest
  const signInAsGuest = React.useCallback(() => {
    return auth.signInAnonymously();
  }, [auth]);

  // Sign up (email, password)
  const signUp = React.useCallback(
    ({ email, password, displayName }) => {
      return auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Update display name after sign-up
          return userCredential.user.updateProfile({
            displayName: displayName
          });
        });
    },
    [auth]
  );

  // Sign out
  const signOut = React.useCallback(() => {
    return auth.signOut().then(() => {
      resetTheme();
    });
  }, [auth, resetTheme]);

  // Reset password
  const resetPassword = React.useCallback(
    ({ email }) => {
      return auth.sendPasswordResetEmail(email);
    },
    [auth]
  );

  // Change password
  const changePassword = React.useCallback(
    async ({ oldPassword, newPassword }) => {
      const user = auth.currentUser;
      const credential = firebase.auth.EmailAuthProvider.credential(
        user.email,
        oldPassword
      );

      try {
        await user.reauthenticateWithCredential(credential);
        await user.updatePassword(newPassword);
      } catch (error) {
        throw new Error(error.message);
      }
    },
    [auth, firebase]
  );

  // Change display name
  const changeDisplayName = React.useCallback(
    async ({ newDisplayName }) => {
      const user = auth.currentUser;

      try {
        await user.updateProfile({
          displayName: newDisplayName
        });
      } catch (error) {
        throw new Error(error.message);
      }
    },
    [auth]
  );

  const deleteAccount = React.useCallback(() => {
    return auth.currentUser.delete();
  }, [auth]);

  // Context value
  const value = React.useMemo(
    () => ({
      user,
      signIn,
      signInWithAuthProvider,
      signInAsGuest,
      signUp,
      signOut,
      resetPassword,
      changePassword,
      changeDisplayName,
      deleteAccount,
    }),
    [
      user,
      signIn,
      signInWithAuthProvider,
      signInAsGuest,
      signUp,
      signOut,
      resetPassword,
      changePassword,
      changeDisplayName,
      deleteAccount,
    ]
  );

  if (isLoading || isIdle) {
    return <FullPageSpinner />;
  }

  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  if (isSuccess) {
    return <AuthContext.Provider value={value} {...props} />;
  }

  throw new Error(`Unhandled status: ${status}`);
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}

export { AuthProvider, useAuth };
