import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useFirebase } from 'context/firebase-context';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Typography, Button, Paper, makeStyles, MenuItem, Menu, Divider} from '@material-ui/core';
import { useTranslation } from 'translations';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(2),
    height: '70vh',
    width: '70vw',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: '24px',
    boxSizing: 'border-box',
  },
  postItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    boxShadow: theme.shadows[2],
  },
  postContent: {
    flex: 1,
    marginRight: theme.spacing(2),
  },
  sortByContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  sortByLabel: {
    marginRight: theme.spacing(1),
  },
  holder: {
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  sortButton: {
    color: theme.palette.secondary.main,
  },
  postTitle: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  postCategory: {
    fontStyle: 'italic',
    color: theme.palette.primary.main,
  },
  postAuthor: {
    color: theme.palette.primary.main,
  },
  postLikes: {
    color: theme.palette.text.primary,
  },
  separator: {
    width: '100%',
    textAlign: 'center',
    margin: theme.spacing(2, 0),
  },
  divider: {
    borderBottomWidth: 4,
    borderColor: theme.palette.primary.main
  }
}));

const ForumList = () => {
  const t = useTranslation();
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState('asc');
  const { firestore } = useFirebase();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const query = firestore.collection('posts');
      const snapshot = await query.orderBy(sortBy, sortOrder).get();
      const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(postsData);
    };

    fetchPosts();
  }, [firestore, sortBy, sortOrder]);

  const handleSortBy = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    handleClose();
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const announcements = posts.filter(post => post.category === 'Announcements');
  const otherPosts = posts.filter(post => post.category !== 'Announcements');

  return (
    <div className={classes.root}>
      <div className={classes.holder}>
        <div className={classes.sortByContainer}>
          <Typography variant="body1" className={classes.sortByLabel}>
            {t('sortByLabel')}
          </Typography>
          <Button
            aria-controls="sort-menu"
            aria-haspopup="true"
            onClick={handleOpenMenu}
            endIcon={<ArrowDropDownIcon />}
            className={classes.sortButton}
          >
            {sortBy === 'timestamp' ? (sortOrder === 'asc' ? t('oldestOnTop') : t('recentOnTop')) : (sortOrder === 'asc' ? t('leastLikedOnTop') : t('mostLikedOnTop'))}
          </Button>
          <Menu
            id="sort-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleSortBy('timestamp', 'desc')}>{t('recentOnTop')}</MenuItem>
            <MenuItem onClick={() => handleSortBy('timestamp', 'asc')}>{t('oldestOnTop')}</MenuItem>
            <MenuItem onClick={() => handleSortBy('likesCount', 'desc')}>{t('mostLikedOnTop')}</MenuItem>
            <MenuItem onClick={() => handleSortBy('likesCount', 'asc')}>{t('leastLikedOnTop')}</MenuItem>
          </Menu>
        </div>

        <Button component={Link} to="/forum/new" variant="contained" color="secondary">
          {t('createNewPost')}
        </Button>
      </div>

      <div className="postList">
        {announcements.map(post => (
          <Paper key={post.id} className={classes.postItem}>
            <div className={classes.postContent}>
              <Typography variant="body1">
                <span className={classes.postTitle}>{post.title}</span> {t('in')} <span className={classes.postCategory}>{post.category}</span>
              </Typography>
              <Typography variant="body2">
                {t('by')} <span className={classes.postAuthor}>{post.author}</span> - <span className={classes.postLikes}>{post.likesCount} {t('likes')}</span>
              </Typography>
            </div>
            <Button component={Link} to={`/forum/${post.id}`} color="secondary">
              {t('readMore')}
            </Button>
          </Paper>
        ))}
        {announcements.length > 0 && <div className={classes.separator}><Divider className={classes.divider}/></div>}
        {otherPosts.map(post => (
          <Paper key={post.id} className={classes.postItem}>
            <div className={classes.postContent}>
              <Typography variant="body1">
                <span className={classes.postTitle}>{post.title}</span> {t('in')} <span className={classes.postCategory}>{post.category}</span>
              </Typography>
              <Typography variant="body2">
                {t('by')} <span className={classes.postAuthor}>{post.author}</span> - <span className={classes.postLikes}>{post.likesCount} {t('likes')}</span>
              </Typography>
            </div>
            <Button component={Link} to={`/forum/${post.id}`} color="secondary">
              {t('readMore')}
            </Button>
          </Paper>
        ))}
      </div>
    </div>
  );
};

export default ForumList;
