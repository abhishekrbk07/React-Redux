import React from 'react';
import { useSelector } from 'react-redux';
import { selectAllUsers } from '../store/usersSlice';

export default function Dashboard() {
    const users = useSelector(selectAllUsers);
    const activeUsers = users.filter(u => u.website && u.website.length > 0);
    return (
        <div>
            <h2>Dashboard</h2>
            <div>Active users with a website: <b>{activeUsers.length}</b></div>
        </div>
    );
}
