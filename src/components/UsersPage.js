import React, { useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchUsers,
    forceFetchUsers,
    selectAllUsers,
    selectUsersStatus,
    selectUsersError,
} from '../store/usersSlice';

export default function UsersPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const users = useSelector(selectAllUsers);
    const status = useSelector(selectUsersStatus);
    const error = useSelector(selectUsersError);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleRefresh = () => dispatch(forceFetchUsers());
    const handleRowClick = params => navigate(`/user/${params.id}`);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 180 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone', headerName: 'Phone', width: 150 },
    ];

    return (
        <div>
            <h2>Users List (Redux: API called only once unless refreshed)</h2>
            <Button variant="outlined" onClick={handleRefresh} sx={{ mb: 2 }}>Refresh</Button>
            <div style={{ height: 430 }}>
                {status === 'loading' && <p>Loading...</p>}
                {status === 'failed' && <p style={{ color: 'red' }}>Error: {error}</p>}
                {status === 'succeeded' && (
                    <DataGrid
                        rows={users}
                        columns={columns}
                        pageSize={6}
                        rowsPerPageOptions={[6]}
                        onRowClick={handleRowClick}
                    />
                )}
            </div>
        </div>
    );
}
