import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import axios from 'axios';
import HomePage from "./pages/HomePage/HomePage";
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
import Cookies from 'universal-cookie';
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from './store/authSlice';
import AdminNavBar from './components/AdminNavBar/AdminNavBar';
import StudentNavBar from './components/StudentNavBar/StudentNavBar';
import RegisterJob from './components/RegisterJob/RegisterJob';
import PlacementDetails from './components/PlacementDetails/PlacementDetails';
import StudentDetails from './components/StudentDetails/StudentDetails';
import JobDetails from './components/JobDetails/JobDetails';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import AppliedPage from './pages/AppliedPage/AppliedPage';
import AboutPage from './pages/AboutPage/AboutPage';

const getStatus = async (token) => {
  const data = await axios({
    method: "GET",
    url: `${process.env.REACT_APP_BACKEND}/api/v1/check`,
    headers: {
      'Authorization': `token ${token}`
    }
  });
  return data.data.isAdmin;
}

const App = () => {
  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth);
  const cookies = new Cookies();
  const jwt = cookies.get('jwt');
  if (jwt && !auth.isLogin) {
    try {
      const isAdmin = getStatus(jwt);
      dispatch(authActions.logInUser(isAdmin));
    } catch (error) {
    }
  }
  let styleClass = '';
  if (auth.isLogin) {
    styleClass = 'admin-login';
  }
  return (
    <>
      <NavBar/>
      <main className={styleClass}>
          {auth.isLogin && auth.isAdmin && <AdminNavBar/>}
          {auth.isLogin && !auth.isAdmin && <StudentNavBar/>}
          <Routes>
            <Route path="/" element={<HomePage/>} />
            {auth.isLogin && <Route path="/profile" element={<ProfilePage/>} /> }
            <Route path="/register" element={<RegisterPage/>} />
            <Route path="/student/login" element={<LoginPage/>} />
            <Route path="/student/:enrollmentNo" element={<StudentDetails/>} />
            <Route path="/job/:jobid" element={<JobDetails/>} />
            <Route path="/admin/login" element={<LoginPage/>} />
            <Route path="/about" element={<AboutPage/>} />
            {auth.isAdmin && <Route path="/register-job" element={<RegisterJob/>}/>}
            {auth.isAdmin && <Route path="/placement-details" element={<PlacementDetails/>}/>}
            {!auth.isAdmin && auth.isLogin && <Route path="/applied-jobs" element={<AppliedPage/>}/>}
            {/* <Route path="*" element={<Error error={"No Page Found"} />} /> */}
          </Routes>
      </main>
      <footer>
        <Footer/>
      </footer>
    </>
  );
};

export default App;