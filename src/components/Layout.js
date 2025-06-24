import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
    return (
        <div style={{ width: '80%', margin: '40px auto' }}>
            <nav style={{ marginBottom: 20 }}>
                <Link to="/" style={{ marginRight: 20, fontWeight: 'bold', fontSize: '1.2em' }}>
                    Users List
                </Link>
            </nav>
            <Outlet />
        </div>
    );
}
