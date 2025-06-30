import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchUsers,
    forceFetchUsers,
    addUser,
    updateUser,
    deleteUser,
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

    // For Add/Edit dialog
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ id: '', name: '', email: '', phone: '', website: '' });

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleRefresh = () => dispatch(forceFetchUsers());

    // --- Add/Edit Dialog Logic ---
    const openAddDialog = () => {
        setFormData({ id: '', name: '', email: '', phone: '', website: '' });
        setEditMode(false);
        setOpen(true);
    };
    const openEditDialog = (row) => {
        setFormData(row);
        setEditMode(true);
        setOpen(true);
    };
    const handleClose = () => setOpen(false);
    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = () => {
        if (editMode) {
            dispatch(updateUser(formData));
        } else {
            // Remove id for POST, as the API creates one
            const { id, ...rest } = formData;
            dispatch(addUser(rest));
        }
        setOpen(false);
    };

    const handleDelete = (id) => {
        dispatch(deleteUser(id));
    };

    const handleRowClick = params => navigate(`/user/${params.id}`);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Name', width: 180 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phone', headerName: 'Phone', width: 150 },
        { field: 'website', headerName: 'Website', width: 180 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={e => {
                            e.stopPropagation();
                            openEditDialog(params.row);
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        color="error"
                        variant="outlined"
                        size="small"
                        onClick={e => {
                            e.stopPropagation();
                            handleDelete(params.row.id);
                        }}
                    >
                        Delete
                    </Button>
                </Stack>
            )
        }
    ];

    return (
        <div>
            <h2>Users List (CRUD, Redux optimized)</h2>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button variant="contained" onClick={openAddDialog}>Add User</Button>
                <Button variant="outlined" onClick={handleRefresh}>Refresh</Button>
            </Stack>
            <div style={{ height: 500 }}>
                {status === 'loading' && <p>Loading...</p>}
                {status === 'failed' && <p style={{ color: 'red' }}>Error: {error}</p>}
                {status === 'succeeded' && (
                    <DataGrid
                        rows={users}
                        columns={columns}
                        pageSize={8}
                        rowsPerPageOptions={[8]}
                        onRowClick={handleRowClick}
                        getRowId={row => row.id}
                    />
                )}
            </div>
            {/* Add/Edit User Dialog */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editMode ? "Edit User" : "Add User"}</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ minWidth: 350, pt: 1 }}>
                        <TextField
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Website"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>
                        {editMode ? "Save Changes" : "Add User"}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
