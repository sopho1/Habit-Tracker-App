import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { useFirebase } from 'context/firebase-context';
import { useTranslation } from 'translations';

const PostAnnouncement = ({ open, onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });
  const { firestore } = useFirebase();
  const t = useTranslation();

  const handlePost = async () => {
    try {
      await firestore.collection("announcements").add({
        title,
        content,
        createdAt: new Date(),
      });
      await firestore.collection('posts').add({
        title,
        content,
        author: 'Admin',
        category: 'Announcements',
        userId: '',
        timestamp: new Date(),
        likesCount: 0,
        likedBy: []
      });
      setSnackbar({ open: true, message: t('successMessageAnnouncement'), severity: "success" });
      onClose();
    } catch (error) {
      console.error("Error posting announcement: ", error);
      setSnackbar({ open: true, message: t('errorMessageAnnouncement'), severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>{t('postAnnouncements')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('title')}
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label={t('content')}
            fullWidth
            multiline
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            {t('cancel')}
          </Button>
          <Button onClick={handlePost} color="primary">
            {t('createPost')}
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

export default PostAnnouncement;
