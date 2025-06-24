import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import UsersPage from './components/UsersPage';
import UserProfilePage from './components/UserProfilePage';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<UsersPage />} />
                    <Route path="user/:id" element={<UserProfilePage />} />
                </Route>
            </Routes>
        </Router>
    );
}
