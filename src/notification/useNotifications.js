import { useState, useEffect } from 'react';
import { useFirebase } from 'context/firebase-context';

const useNotifications = () => {
  const { firestore } = useFirebase();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore.collection('notifications')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const newNotifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setNotifications(newNotifications);
      });

    return () => unsubscribe();
  }, [firestore]);

  const removeNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return { notifications, removeNotification };
};

export default useNotifications;
