import React from 'react';
import { Navigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';
import { CssBaseline, Box } from '@mui/material';
import './App.css';

import LoginPage from './components/login';
import RegistrationPage from './components/register';
import Header from './components/header';
import Footer from './components/footer';
import UserProfile from './components/userProfile';
import CoursesList from './components/coursesList';
import CourseProfile from './components/CourseProfile';
import TeachersList from './components/TeacherList';
import LocationsList from './components/LocationsList';
import TeacherAdminka from './components/teacherAdminka';
import CoursesAdminka from './components/CoursesAdminks';
import GroupsManager from './components/gropuManager';
import ScheduleManager from './components/schedulesManager';
import GroupsList from './components/groupList';
import GroupDetail from './components/GroupDetail';
import HomePage from './components/homepage';

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    if (window.localStorage.getItem('token')) {
      dispatch(fetchAuthMe());
    }
  }, [dispatch]);

  return (
    <div className="App" style={{ overflowX: 'hidden' }}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />
        <Box component="main" flexGrow={1} sx={{ width: '100%' }}>
          <Routes>
            {/* Existing routes */}
            <Route path='/' element={<HomePage />} />
            <Route path='/profile' element={<UserProfile />} />
            <Route path='/courses' element={<CoursesList />} />
            <Route path='/courses/:courseId' element={<CourseProfile />} />
            <Route path='/teachers' element={<TeachersList />} />
            <Route path='/locations' element={<LocationsList />} />
            <Route path='/adminka1' element={<TeacherAdminka />} />
            <Route path='/adminka2' element={<CoursesAdminka />} />
            <Route path='/adminka3' element={<GroupsManager />} />
            <Route path='/adminka4' element={<ScheduleManager />} />
            <Route path='/groups' element={<GroupsList />} />
            {/* Add the GroupDetail route here */}
            <Route path='/groups/:id' element={<GroupDetail />} />
            {/* Authentication and default routes */}
            {!isAuth && <Route path='/registration' element={<RegistrationPage />} />}
            {!isAuth && <Route path='/login' element={<LoginPage />} />}
            {isAuth && <Route path="*" element={<Navigate to="/" replace />} />}
            {!isAuth && <Route path="*" element={<Navigate to="/login" replace />} />}
          </Routes>

        </Box>
        <Footer></Footer>
      </Box>
    </div>
  );
}

export default App;
