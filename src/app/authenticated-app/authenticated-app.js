import * as React from 'react';
import { useQueryClient } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes } from 'react-router-dom';
import { Divider, List, Toolbar, Typography } from '@material-ui/core';
import {
  Add as AddIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitIcon,
  List as ListIcon,
  Star as BadgeIcon,
  Settings as SettingsIcon,
  Notifications as NotificationIcon,
  Chat as ForumIcon,
  Looks as GoalIcon,
  ContactSupport
} from '@material-ui/icons';

import * as guestData from 'data/guest';

import { AddHabitScreen } from 'screens/add-habit';
import { DashboardScreen } from 'screens/dashboard';
import { EditHabitScreen } from 'screens/edit-habit';
import { ManageHabitsScreen } from 'screens/manage-habits';
import { NotFoundScreen } from 'screens/not-found';
import { UserSettingsScreen } from 'screens/user-settings';
import { BadgeAndRewardPage } from '../../components/performance-panel/badgeAndReward';
import NotificationsPage from 'notification/components/NotificationsPage';

import { FullPageErrorFallback, ErrorFallback } from 'components/lib';
import { LocaleSelect } from 'components/locale-select';

import { useTranslation } from 'translations';
import { useAuth } from 'context/auth-context';
import { useDialog } from 'context/dialog-context';
import {
  useUpdateLocaleCode,
  useUpdateUserData,
  useDeleteUserData,
} from 'api/user-data';

import { Drawer, DrawerButton, DrawerLink } from './drawer';
import { Layout } from './layout';
import { Navbar } from './navbar';
import { MainContent } from './main-content';

import LogoImage from './logo.png';
import { GoalSettingScreen} from 'screens/goals'
import ForumList from 'forum/components/FormList';
import NewPost from 'forum/components/NewPost';
import ForumPost from 'forum/components/FormPost';
import { useCheckmarksQuery } from 'api/checkmarks';
import { useUser } from 'context/user-context';

import { SupportScreen } from 'support/support';


function AuthenticatedApp() {
  const queryClient = useQueryClient();
  const { user, signOut } = useAuth();
  const { openDialog } = useDialog();
  const t = useTranslation();
  const { data: checkmarks, error: checkmarksError } = useCheckmarksQuery();
  const { goal } = useUser();
  const deleteUserData = useDeleteUserData();
  const updateUserData = useUpdateUserData();

 
  React.useEffect(() => {
    
    if (user.isAnonymous) {
      const { habits, dbHabits, checkmarks, dbCheckmarks } = guestData;

      // Set data in the cache
      queryClient.setQueryData('habits', habits);
      queryClient.setQueryData('checkmarks', checkmarks);

      // Set data in the database
      updateUserData({
        habits: dbHabits,
        checkmarks: dbCheckmarks,
      });
    }
   
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  // Logout click handler
  const handleLogoutClick = () => {
    openDialog({
      title: t('signOutQuestion'),
      description: t('signOutDescription'),
      confirmText: t('signOutConfirm'),
      onConfirm: async () => {
        try {
          // When signing out and user is anonymous, delete their data
          if (user.isAnonymous) {
            await deleteUserData();
            await signOut();
          } else {
            await signOut();
          }
        } catch (error) {
          console.log(error, error.message);
        }
      },
      color: 'secondary',
    });
  };
  const updateLocaleCode = useUpdateLocaleCode();

  // When locale is clicked, user's data in the database is updated
  const handleLocaleClick = (clickedLocaleCode) => {
    updateLocaleCode(clickedLocaleCode);
  };

  return (
    <ErrorBoundary FallbackComponent={FullPageErrorFallback}>
      <Layout>
        {/* Navbar */}
        <Navbar>
          <LocaleSelect onLocaleClick={handleLocaleClick} />
        </Navbar>

        {/* Drawer */}
        <Drawer>
          <Toolbar>
          <img
        src={LogoImage}
        alt="Logo"
        style={{ width: '30px', height: '30px', marginRight: '10px' }} // Adjust the width and height as needed
      />            
      <Typography variant="h6" color="inherit" noWrap>
              Habit Tracker
            </Typography>
          </Toolbar>
          <Divider />
          <List>
            <DrawerLink to="/dashboard" icon={<DashboardIcon />}>
              {t('dashboard')}
            </DrawerLink>

            <DrawerLink to="/add-habit" icon={<AddIcon />}>
              {t('addHabit')}
            </DrawerLink>

            <DrawerLink to="/manage-habits" icon={<ListIcon />}>
              {t('manageHabits')}
            </DrawerLink>
            <DrawerLink to="/set-goals" icon={<GoalIcon />}>
              {t('setGoals')}
            </DrawerLink>
            <DrawerLink to="/badges" icon={<BadgeIcon />}>
              {t('badges')}
            </DrawerLink>
          </List>
          <Divider />
          <List>
            <DrawerLink to="/forum" icon={<ForumIcon />}>
              {t('forum')}
            </DrawerLink>
            <DrawerLink to="/notifications" icon={<NotificationIcon />}>
              {t('notifications')}
            </DrawerLink>
            <DrawerLink to="/support" icon={<ContactSupport />}>
              {t('support')}
            </DrawerLink>
          </List>
          <Divider />
          <List>
            <DrawerLink to="/settings" icon={<SettingsIcon />}>
              {t('settings')}
            </DrawerLink>
            <DrawerButton onClick={handleLogoutClick} icon={<ExitIcon />}>
              {t('signOut')}
            </DrawerButton>
          </List>
        </Drawer>

        {/* Content */}
        <MainContent>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Routes>
              <Route path="/dashboard" element={<DashboardScreen />} />
              <Route path="/add-habit" element={<AddHabitScreen />} />
              <Route
                path="/edit-habit/:habitId"
                element={<EditHabitScreen />}
              />
              <Route path="/manage-habits" element={<ManageHabitsScreen />} />
              <Route path="/set-goals" element={<GoalSettingScreen />} />
              <Route path="/forum" element={<ForumList />} />
              <Route path="/badges">
            <BadgeAndRewardPage checkmarks={checkmarks} goal={goal} />
                 </Route>              
          <Route path="/forum/new" element={<NewPost />} />
              <Route path="/forum/:id" element={<ForumPost />} />
              <Route path="/settings" element={<UserSettingsScreen />} />
              <Route path="/notifications" element={<NotificationsPage/>} />
              <Route path="/support" element={<SupportScreen/>} />
              <Route path="*" element={<NotFoundScreen />} />
            </Routes>
          </ErrorBoundary>
        </MainContent>
      </Layout>
    </ErrorBoundary>
  );
}

export { AuthenticatedApp };
