import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllUsers, fetchUsers } from '../store/usersSlice';

export default function UserProfilePage() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const users = useSelector(selectAllUsers);
    const user = users.find(u => u.id === parseInt(id, 10));

    // If users is empty, try to fetch (only happens if user refreshes on detail page)
    useEffect(() => {
        if (!users || users.length === 0) {
            dispatch(fetchUsers());
        }
    }, [dispatch, users]);

    if (!users || users.length === 0) {
        return <div>Loading user info...</div>;
    }

    if (!user) return <div>User not found.</div>;

    return (
        <div>
            <Link to="/">← Back to Users List</Link>
            <h2>User Profile</h2>
            <p><b>Name:</b> {user.name}</p>
            <p><b>Email:</b> {user.email}</p>
            <p><b>Phone:</b> {user.phone}</p>
            <p><b>Website:</b> {user.website}</p>
        </div>
    );
}
