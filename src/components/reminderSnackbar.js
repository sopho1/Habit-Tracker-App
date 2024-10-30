import React, { useState } from 'react';
import { Snackbar, SnackbarContent, IconButton } from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';

const ReminderSnackbar = ({ open, handleClose }) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={open}
      autoHideDuration={6000} // Adjust as needed
      onClose={handleClose}
    >
      <SnackbarContent
        message="Don't forget to complete today's habits!"
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Snackbar>
  );
};

export default ReminderSnackbar;
