import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllUsers } from '../store/usersSlice';

export default function UserCount() {
    const users = useSelector(selectAllUsers);
    return (
        <div style={{ fontWeight: 'bold', margin: '10px 0', fontSize: 16 }}>
            Total Users: {users.length}
        </div>
    );
}
