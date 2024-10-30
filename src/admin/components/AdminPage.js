import React, { useEffect, useState } from "react";
import { Container, Fab, Box, Typography, Paper, CircularProgress, Button, Snackbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from '@material-ui/icons/Delete';
import { useFirebase } from 'context/firebase-context';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import PostAnnouncement from './postAnnouncement';
import CreateCategory from "./createCategory";
import MuiAlert from '@material-ui/lab/Alert';
import { ExitToApp as ExitIcon } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import { useDialog } from 'context/dialog-context';
import { useTranslation } from 'translations';

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: '100vh',
    maxHeight: '100vh',
    minWidth: '95vw',
    maxWidth: '70vw',
    overflowY: 'auto',
    marginLeft: '40px',
    marginRight: '40px',
    marginTop: '10px',
    flexGrow: 1,
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.default,
    minHeight: '100vh',
    transition: 'background-color 0.3s ease',
    position: 'relative',
    transition: 'background-color 0.3s ease',
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    transition: 'background-color 0.3s ease',
    marginBottom: '100px',
    marginTop: '20px'
  },
  deleteButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
  chartContainer: {
    marginTop: theme.spacing(4),
    marginLeft: '20%',
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(4),
  },
  postButton: {
    zIndex: 1000,
    marginLeft: '82%',
  },
  postButton2: {
    zIndex: 1000,
    marginLeft: '86%',
  },
  postList: {
    marginTop: theme.spacing(4),
    marginBottom: '65px',
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
  centerText: {
    textAlign: 'center',
  },
  button: {
    marginBottom: '100px',
    borderRadius: '4px',
  },
  loader: {
    display: "flex",
    justifyContent: "center",
    marginTop: theme.spacing(4),
  },
  list: {
    marginTop: theme.spacing(4),
    marginBottom: '20px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    boxShadow: theme.shadows[2],
  },
  listItemContent: {
    flex: 1,
    marginRight: theme.spacing(2),
  },
}));

const AdminPage = () => {
  const history = useNavigate();
  const { openDialog } = useDialog();
  const t = useTranslation();
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setcategoriesOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "" });
  const [sortBy] = useState('timestamp');
  const [sortOrder] = useState('asc');
  const { firestore } = useFirebase();

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [firestore, sortBy, sortOrder]);

  const fetchPosts = async () => {
    try {
      const query = firestore.collection('posts').orderBy(sortBy, sortOrder);
      const querySnapshot = await query.get();
      const postsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data(), showFullContent: false }));
      setPosts(postsData);
      setLoadingPosts(false);
    } catch (error) {
      console.error("Error fetching posts: ", error);
      setSnackbar({ open: true, message: "Error fetching posts", severity: "error" });
      setLoadingPosts(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const query = firestore.collection('categories').orderBy('name', 'asc');
      const querySnapshot = await query.get();
      const categoriesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCategories(categoriesData);
      setLoadingCategories(false);
    } catch (error) {
      console.error("Error fetching categories: ", error);
      setSnackbar({ open: true, message: "Error fetching categories", severity: "error" });
      setLoadingCategories(false);
    }
  };

  const handleDeletePost = (id) => {
    openDialog({
      title: t('deletePostQuestion'),
      description: t('deletePostDescription'),
      confirmText: t('deleteConfirm'),
      onConfirm: async () => {
        try {
          await firestore.collection("posts").doc(id).delete();
          setPosts(posts.filter(post => post.id !== id));
          setSnackbar({ open: true, message: t('postDeletedSuccess'), severity: "success" });
        } catch (error) {
          console.error("Error deleting post: ", error);
          setSnackbar({ open: true, message: t('postDeletedError'), severity: "error" });
        }
      },
      color: 'secondary',
    });
  };
  
  const handleDeleteCategory = (id) => {
    openDialog({
      title: t('deleteCategoryQuestion'),
      description: t('deleteCategoryDescription'),
      confirmText: t('deleteConfirm'),
      onConfirm: async () => {
        try {
          await firestore.collection("categories").doc(id).delete();
          setCategories(categories.filter(category => category.id !== id));
          setSnackbar({ open: true, message: t('categoryDeletedSuccess'), severity: "success" });
        } catch (error) {
          console.error("Error deleting category: ", error);
          setSnackbar({ open: true, message: t('categoryDeletedError'), severity: "error" });
        }
      },
      color: 'secondary',
    });
  };  

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleLogoutClick = () => {
    openDialog({
      title: t('signOutQuestion'),
      description: t('signOutDescription'),
      confirmText: t('signOutConfirm'),
      onConfirm: async () => {
        history('/');
      },
      color: 'secondary',
    });
  };

  if (loadingPosts || loadingCategories) {
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    );
  }

  const data = posts.map((post, index) => ({
    name: post.createdAt ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : `Post ${index + 1}`,
    count: index + 1,
  }));

  if (loadingPosts) {
    return (
      <div className={classes.loader}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container className={classes.root}>
      <Typography variant="h4" gutterBottom className={classes.centerText}>
        {t('adminDashboard')}
      </Typography>
      <Typography variant="h5" gutterBottom>
        {t('postManagement')}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        className={classes.postButton}
        onClick={() => setOpen(true)}
      >
        {t('postAnnouncements')}
      </Button>
      <PostAnnouncement open={open} onClose={() => { setOpen(false); fetchPosts(); }} />
      <div className={classes.chartContainer}>
        <Typography variant="body1" gutterBottom>
          {t('numberOfPostsOverTime')}
        </Typography>
        <ResponsiveContainer width="80%" height={400}>
          <LineChart
            data={data}
            margin={{
              top: 15, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className={classes.postList}>
        {posts.map(post => (
          <Paper key={post.id} className={classes.postItem}>
            <div className={classes.postContent}>
              <Typography variant="body1">
                <span className={classes.postTitle}>{post.title}</span> {t('in')} <span className={classes.postCategory}>{post.category}</span>
              </Typography>
              <Typography variant="body2">
                {t('by')} <span className={classes.postAuthor}>{post.author}</span>
              </Typography>
            </div>
            <Button onClick={() => handleDeletePost(post.id)} color="secondary">
              <DeleteIcon />
            </Button>
          </Paper>
        ))}
      </div>
      <div className={classes.postList}>
        <Typography variant="h5" gutterBottom>
          {t('categoryManagement')}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.postButton2}
          onClick={() => setcategoriesOpen(true)}
        >
          {t('createCategory')}
        </Button>
        <CreateCategory open={categoriesOpen} onClose={() => { setcategoriesOpen(false); fetchCategories(); }} />
        <div className={classes.list}>
          {categories.map(category => (
            <Paper key={category.id} className={classes.listItem}>
              <div className={classes.listItemContent}>
                <Typography variant="body1">
                  {category.name}
                </Typography>
              </div>
              <Button onClick={() => handleDeleteCategory(category.id)} color="secondary">
                <DeleteIcon />
              </Button>
            </Paper>
          ))}
        </div>
      </div>
      <div className={classes.postList}>
        <Typography variant="h5" gutterBottom>
          {t('userManagement')}
        </Typography>
      </div>
      <div className={classes.postList}>
        <Typography variant="h5" gutterBottom>
          {t('reportManagement')}
        </Typography>
      </div>
      <div className={classes.postList}>
        <Typography variant="h5" gutterBottom>
          {t('supportDesk')}
        </Typography>
      </div>
      <Fab variant="extended" onClick={handleLogoutClick} className={classes.button} color="secondary">
        <Box clone sx={{ mr: 1, }}>
          <ExitIcon />
        </Box>
        {t('signOut')}
      </Fab>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default AdminPage;