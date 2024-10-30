import React, { useEffect, useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, IconButton, Paper } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { useFirebase } from 'context/firebase-context';
import useNotifications from '../useNotifications';
import { useTranslation } from 'translations'; 

const NotificationsPage = () => {
  const { notifications, removeNotification } = useNotifications();
  const { firestore } = useFirebase();
  const t = useTranslation();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const querySnapshot = await firestore.collection("announcements").orderBy("createdAt", "desc").get();
        const announcementsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error("Error fetching announcements: ", error);
      }
    };

    fetchAnnouncements();
  }, [firestore]);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        {t('notifications')}
      </Typography>
      <Paper elevation={2} style={{ padding: '16px', marginBottom: '16px' }}>
        <Typography variant="h6">{t('recentAnnouncements')}</Typography>
        <List>
          {announcements.map((announcement) => (
            <ListItem key={announcement.id}>
              <ListItemText
                primary={announcement.title}
                secondary={`${t('postedOn')} ${announcement.createdAt.toDate().toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
     
      <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
      <Typography variant="h6">{t('checkoutRecentForumPosts')}</Typography>

        <List>
          {notifications.map((notification) => (
            <ListItem key={notification.id}>
              <ListItemText
                primary={notification.title}
                secondary={`${t('postedOn')} ${notification.timestamp.toDate().toLocaleString()}`}
              />
              <IconButton edge="end" aria-label="delete" onClick={() => removeNotification(notification.id)}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default NotificationsPage;

