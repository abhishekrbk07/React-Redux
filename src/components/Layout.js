import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './Navbar';

export default function Layout() {
    return (
        <div>
            <NavBar />
            <div style={{ width: '90%', maxWidth: 1100, margin: '40px auto' }}>
                <Outlet />
            </div>
        </div>
    );
}
