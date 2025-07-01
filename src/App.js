import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import UsersPage from './components/UsersPage';
import UserProfilePage from './components/UserProfilePage';
import Dashboard from './components/Dashboard';
import GlobalLoader from './components/GlobalLoader';
import Notifications from './components/Notification';

export default function App() {
    return (
        <Router>
            <GlobalLoader />
            <Notifications />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<UsersPage />} />
                    <Route path="user/:id" element={<UserProfilePage />} />
                    <Route path="dashboard" element={<Dashboard />} />
                </Route>
            </Routes>
        </Router>
    );
}
