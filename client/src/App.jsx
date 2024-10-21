import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Cookies from 'js-cookie';

import LoginPage from './components/layouts/LoginPage.jsx';
import EmpLayout from './components/layouts/EmpLayout.jsx';
import AdminLayout from './components/layouts/AdminLayout.jsx';

import Home from './components/Home.jsx';
import AdminDashboard from './components/Dashboard.jsx';
import AttendanceSheet from './components/AttendanceSheet.jsx';
import Announcements from './components/Announcements.jsx';
import Page404 from './components/Page404.jsx';
import ManageEmployees from './components/ManageEmployees.jsx';
import Profile from './components/Profile.jsx';
import EmployeeDetails from './components/EmployeeDetails.jsx';
import Notification from './components/Notification.jsx';
import { Spinner } from '@material-tailwind/react';



const CheckUser = ({ isLoggedIn, loginData, setLoginData }) => {
    if (!isLoggedIn) {
      return <LoginPage setLoginData={setLoginData}/> // Redirect to login if not logged in
    }
    else if(loginData.isAdmin){
      return <AdminLayout loginData={loginData} setLoginData={setLoginData}/>
    }
     else {
      return <EmpLayout loginData={loginData}setLoginData={setLoginData} />
    }
}


export default function App() {
  
  const [loginData, setLoginData] = useState(null); // Start as null to differentiate between loading and no data
  const [loading, setLoading] = useState(true); // Add loading state

  const MobileTabletRoute = ({ children }) => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android|iphone|ipad|ipod/i.test(userAgent.toLowerCase())) {
      return children; 
    } else {
      return <Navigate to="/page-not-found" />;
    }
  };
  
  const ProtectedRoute = ({children})=>{
    if(loginData.isAdmin){
      return children
    }
    else return <Navigate to="/page-not-found" />;
  }

  useEffect(() => {
    const cred = Cookies.get('cred') && JSON.parse(Cookies.get('cred'));
    if (cred) {
      setLoginData(cred);
    }
    setLoading(false); 
  }, []);

  if (loading) {
    return <Spinner color='indigo'/>; 
  }

  const isLoggedIn = Boolean(loginData);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CheckUser loginData={loginData} isLoggedIn={isLoggedIn} setLoginData={setLoginData}/>}>
          <Route index element={<Home loginData={loginData}/>} />
          <Route path="dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="manage-employees" element={<ProtectedRoute><ManageEmployees loginData={loginData}/></ProtectedRoute>} />
          <Route path="profile" element={<Profile loginData={loginData} setLoginData={setLoginData}/>}/> 
          <Route path="employee-details/:id" element={<ProtectedRoute><EmployeeDetails loginData={loginData}/></ProtectedRoute>}/> 
          <Route path="notifications" element={<Notification loginData={loginData}/>}/> 


          <Route path="attendance" element={<MobileTabletRoute><AttendanceSheet loginData={loginData} /></MobileTabletRoute>} />
          <Route path="announcements" element={<MobileTabletRoute><Announcements LoginData={loginData}/></MobileTabletRoute>} />
          <Route path="page-not-found" element={<Page404 />} />
          <Route path="*" element={<Page404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
