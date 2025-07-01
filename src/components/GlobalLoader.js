import React from 'react';
import { useSelector } from 'react-redux';
import { selectUsersStatus } from '../store/usersSlice';

export default function GlobalLoader() {
    const status = useSelector(selectUsersStatus);
    if (status === 'loading') {
        return (
            <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, zIndex: 2000,
                background: '#1976d2', color: '#fff', textAlign: 'center', padding: 8
            }}>
                Loading...
            </div>
        );
    }
    return null;
}
