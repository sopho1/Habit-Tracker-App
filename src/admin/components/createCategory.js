import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { useFirebase } from 'context/firebase-context';
import { useTranslation } from 'translations'; 

const CreateCategory = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });
  const { firestore } = useFirebase();
  const t = useTranslation();

  const handlePost = async () => {
    try {
      await firestore.collection("categories").add({
        name,
      });
      setSnackbar({ open: true, message: t('successMessageCategory'), severity: "success" });
      onClose();
    } catch (error) {
      console.error("Error creating category: ", error);
      setSnackbar({ open: true, message: t('errorMessageCategory'), severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{t('createCategory')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('name')}
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {t('cancel')}
          </Button>
          <Button onClick={handlePost} color="primary">
            {t('createCategory')}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default CreateCategory;
