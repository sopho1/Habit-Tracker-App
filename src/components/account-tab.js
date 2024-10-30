import * as React from 'react';
import { DeleteForever as DeleteForeverIcon, Lock as LockIcon, PersonPinCircleOutlined } from '@material-ui/icons';
import { useDeleteUserData } from 'api/user-data';
import { useAuth } from 'context/auth-context';
import { useDialog } from 'context/dialog-context';
import { useSnackbar } from 'context/snackbar-context';
import { useTranslation } from 'translations';
import {
  Button,
  Hidden,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';

function AccountTab({ disabled }) {
  const { deleteAccount, changePassword, changeDisplayName} = useAuth();
  const { openDialog } = useDialog();
  const { openSnackbar } = useSnackbar();
  const t = useTranslation();

  const deleteUserData = useDeleteUserData();

  const handleDeleteAccountClick = () => {
    openDialog({
      title: t('deleteAccountQuestion'),
      description: t('deleteAccountWarning'),
      confirmText: t('deleteAccount'),
      onConfirm: async () => {
        try {
          await deleteAccount();
          await deleteUserData();
          openSnackbar('success', t('accountDeleted'));
        } catch (error) {
          openSnackbar('error', error.message);
        }
      },
      color: 'secondary',
    });
  };

  const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');

   // State for change display name dialog
   const [displayNameDialogOpen, setDisplayNameDialogOpen] = React.useState(false);
   const [newDisplayName, setNewDisplayName] = React.useState('');
 
   const handleChangeDisplayNameClick = () => {
     setDisplayNameDialogOpen(true);
   };
 
   const handleDisplayNameDialogClose = () => {
     setDisplayNameDialogOpen(false);
   };
 
   const handleDisplayNameChange = async () => {
     try {
       await changeDisplayName({ newDisplayName });
       openSnackbar('success', t('displayNameChanged'));
       setDisplayNameDialogOpen(false);
     } catch (error) {
       openSnackbar('error', error.message);
     }
   };

  const handleChangePasswordClick = () => {
    setPasswordDialogOpen(true);
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
  };

  const handlePasswordChange = async () => {
    try {
      await changePassword({ oldPassword, newPassword });
      openSnackbar('success', t('passwordChanged'));
      setPasswordDialogOpen(false);
    } catch (error) {
      openSnackbar('error', error.message);
    }
  };

  return (
    <List disablePadding>
      
      <ListItem>
        <Hidden smDown>
          <ListItemIcon>
            <LockIcon />
          </ListItemIcon>
        </Hidden>
        <ListItemText
          primary={t('changePassword')}
          secondary={t('changePasswordDescriptionShort')}
        />
        <ListItemSecondaryAction>
          <Button
            color="secondary"
            disabled={disabled}
            variant="contained"
            onClick={handleChangePasswordClick}
          >
            {t('changePasswordConfirmation')}
          </Button>
        </ListItemSecondaryAction>
      </ListItem>

      <ListItem>
        <Hidden smDown>
          <ListItemIcon>
            <PersonPinCircleOutlined/>
          </ListItemIcon>
        </Hidden>
        <ListItemText
          primary={t('changeDisplayName')}
          secondary={t('changeDisplayNameDescription')}
        />
        <ListItemSecondaryAction>
          <Button
            color="secondary"
            disabled={disabled}
            variant="contained"
            onClick={handleChangeDisplayNameClick}
          >
            {t('changeDisplayNameConfirmation')}
          </Button>
        </ListItemSecondaryAction>
      </ListItem>

      <ListItem>
        <Hidden smDown>
          <ListItemIcon>
            <DeleteForeverIcon />
          </ListItemIcon>
        </Hidden>
        <ListItemText
          primary={t('deleteAccount')}
          secondary={t('deleteAccountWarningShort')}
        />
        <ListItemSecondaryAction>
          <Button
            color="secondary"
            disabled={disabled}
            variant="contained"
            onClick={handleDeleteAccountClick}
          >
            {t('deleteAccountConfirmation')}
          </Button>
        </ListItemSecondaryAction>
      </ListItem>

      {/* Change Password Dialog */}
      <Dialog open={passwordDialogOpen} onClose={handlePasswordDialogClose}>
        <DialogTitle>{t('changePassword')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('changePasswordDescription')}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label={t('oldPassword')}
            type="password"
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label={t('newPassword')}
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePasswordDialogClose} color="primary">
            {t('cancel')}
          </Button>
          <Button onClick={handlePasswordChange} color="primary">
            {t('changePasswordConfirmation')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Display Name Dialog */}
      <Dialog open={displayNameDialogOpen} onClose={handleDisplayNameDialogClose}>
        <DialogTitle>{t('changeDisplayName')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('changeDisplayNameDescription')}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label={t('newDisplayName')}
            fullWidth
            value={newDisplayName}
            onChange={(e) => setNewDisplayName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisplayNameDialogClose} color="primary">
            {t('cancel')}
          </Button>
          <Button onClick={handleDisplayNameChange} color="primary">
            {t('changeDisplayNameConfirmation')}
          </Button>
        </DialogActions>
      </Dialog>

    </List>
  );
}

export { AccountTab };
