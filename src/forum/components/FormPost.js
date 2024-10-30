import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFirebase } from 'context/firebase-context';
import { useAuth } from 'context/auth-context';
import { Typography, makeStyles, Button, List, ListItem, ListItemText, TextField, IconButton, Paper, Box, Snackbar } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import firebase from 'firebase/app';
import { FullPageSpinner } from 'components/lib';
import { useTranslation } from 'translations';
import { useDialog } from 'context/dialog-context';
import MuiAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
  forumPost: {
    marginBottom: theme.spacing(2),
    minHeight: '70vh',
    minWidth: '70vw',
    maxWidth: '70vw',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: '24px',
    boxSizing: 'border-box',
  },
  card: {
    margin: '20px',
    padding: '15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  postTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  postCategory: {
    fontStyle: 'italic',
    color: theme.palette.primary.main,
    fontSize: '0.875rem',
  },
  postAuthor: {
    color: theme.palette.primary.main,
    fontSize: '0.875rem',
  },
  postContent: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  actionButtons: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start', 
    marginTop: theme.spacing(2),
  },
  actionButton: {
    marginRight: theme.spacing(2), 
    '&:last-child': {
      marginRight: 0, 
    },
  },
  commentSection: {
    marginTop: theme.spacing(2),
  },
  newCommentField: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  submitButton: {
    marginTop: theme.spacing(0),
  },
}));

const ForumPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { firestore } = useFirebase();
  const t = useTranslation();
  const classes = useStyles();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });
  const { openDialog } = useDialog();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      const postDoc = await firestore.collection('posts').doc(id).get();
      setPost({ id: postDoc.id, ...postDoc.data() });

      const commentsCollection = await firestore.collection('posts').doc(id).collection('comments').orderBy('timestamp', 'desc').get();
      setComments(commentsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchPost();
  }, [id, firestore]);

  const handleNewComment = async () => {
    if (newComment.trim() === '') return;
    await firestore.collection('posts').doc(id).collection('comments').add({
      content: newComment,
      author: user.displayName,
      timestamp: new Date(),
    });
    setNewComment('');
    const commentsCollection = await firestore.collection('posts').doc(id).collection('comments').orderBy('timestamp', 'desc').get();
    setComments(commentsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleDeletePost = () => {
    openDialog({
      title: t('deletePostQuestion'),
      description: t('deletePostDescription'),
      confirmText: t('deleteConfirm'),
      cancelText: t('cancel'),
      onConfirm: async () => {
        try {
          await firestore.collection('posts').doc(id).delete();
          setSnackbar({ open: true, message: t('postDeletedSuccess'), severity: "success" });
          navigate('/forum');
        } catch (error) {
          console.error("Error deleting post: ", error);
          setSnackbar({ open: true, message: t('postDeletedError'), severity: "error" });
        }
      },
      color: 'secondary',
    });
  };

  const handleEditPost = () => {
    openDialog({
      title: t('editPostQuestion'),
      description: t('editPostDescription'),
      confirmText: t('editConfirm'),
      cancelText: t('cancel'),
      onConfirm: async () => {
        try {
          await firestore.collection('posts').doc(id).update({ content: editContent });
          setPost({ ...post, content: editContent });
          setIsEditing(false);
          setSnackbar({ open: true, message: t('postEditedSuccess'), severity: "success" });
        } catch (error) {
          console.error("Error editing post: ", error);
          setSnackbar({ open: true, message: t('postEditedError'), severity: "error" });
        }
      },
      color: 'secondary',
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLikePost = async () => {
    const postRef = firestore.collection('posts').doc(id);
    const postDoc = await postRef.get();
    if (!postDoc.exists) return;

    const postData = postDoc.data();
    const isLiked = postData.likedBy.includes(user.uid);

    if (isLiked) {
      await postRef.update({
        likesCount: postData.likesCount - 1,
        likedBy: firebase.firestore.FieldValue.arrayRemove(user.uid),
      });
    } else {
      await postRef.update({
        likesCount: postData.likesCount + 1,
        likedBy: firebase.firestore.FieldValue.arrayUnion(user.uid),
      });
    }

    setPost((prevPost) => ({
      ...prevPost,
      likesCount: isLiked ? prevPost.likesCount - 1 : prevPost.likesCount + 1,
      likedBy: isLiked
        ? prevPost.likedBy.filter(uid => uid !== user.uid)
        : [...prevPost.likedBy, user.uid],
    }));
  };

  if (!post) return <div className={classes}><FullPageSpinner /></div>;

  return (
    <div className={classes.forumPost}>
      <Paper className={classes.card}>
        <Box>
          <Typography variant="h4" className={classes.postTitle}>{post.title}</Typography>
          <Typography variant="body2">
            {t('postedIn')} <span className={classes.postCategory}>{post.category}</span> {t('by')} <span className={classes.postAuthor}>{post.author}</span>
          </Typography>
        </Box>

        <Box className={classes.postContent}>
          {isEditing ? (
            <>
              <TextField
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                fullWidth
                multiline
                variant="outlined"
                className="edit-field"
              />
              <Box className={classes.actionButtons}>
                <Button className={classes.actionButton} onClick={handleEditPost} variant="contained" color="primary">{t('editConfirm')}</Button>
                <Button className={classes.actionButton} onClick={() => setIsEditing(false)} variant="contained" color="secondary">{t('cancel')}</Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="body1" className={classes.postContent}>{post.content}</Typography>
              {user && user.uid === post.userId && (
                <Box className={classes.actionButtons}>
                  <IconButton onClick={() => { setIsEditing(true); setEditContent(post.content); }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={handleDeletePost}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )}
            </>
          )}
        </Box>

        <Box className={classes.actionButtons}>
          <IconButton onClick={handleLikePost} color={post.likedBy.includes(user.uid) ? "primary" : "default"}>
            <ThumbUpIcon />
          </IconButton>
          <Typography variant="body2">{post.likesCount} {t('likes')}</Typography>
        </Box>

        <Box className={classes.commentSection}>
          <Typography variant="h6" gutterBottom>{t('comments')}</Typography>
          <List className="comment-list">
            {comments.map(comment => (
              <ListItem key={comment.id} className="comment-item">
                <ListItemText primary={comment.content} secondary={`${t('by')} ${comment.author}`} />
              </ListItem>
            ))}
          </List>

          <TextField
            label={t('newComment')}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            fullWidth
            multiline
            variant="outlined"
            className={classes.newCommentField}
          />
          <Button onClick={handleNewComment} variant="contained" color="primary" className={classes.submitButton}>{t('submit')}</Button>
        </Box>
        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </Paper>
    </div>
  );
};

export default ForumPost;

