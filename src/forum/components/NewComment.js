import React, { useState, useContext } from 'react';
import { firestore } from '../firebase';
import { AuthContext } from '../contexts/AuthContext';
import { TextField, Button } from '@material-ui/core';
import { useTranslation } from 'translations'; 

const NewComment = ({ postId, onCommentAdded }) => {
  const { user } = useContext(AuthContext);
  const t = useTranslation();
  const [commentContent, setCommentContent] = useState('');

  const handleAddComment = async () => {
    if (!commentContent.trim()) return;

    try {
      await firestore.collection('posts').doc(postId).collection('comments').add({
        content: commentContent,
        author: user.displayName,
        timestamp: new Date(),
      });

      setCommentContent('');
      onCommentAdded();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div>
      <TextField
        label={t('newComment')}
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
        fullWidth
        multiline
      />
      <Button onClick={handleAddComment} variant="contained" color="primary">
        {t('submit')}
      </Button>
    </div>
  );
};

export default NewComment;
