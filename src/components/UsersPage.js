import React, { useEffect, useState } from 'react';
import './UsersPage.css';
import { DataGrid } from '@mui/x-data-grid';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    Paper,
    Box,
    Typography
} from '@mui/material';
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
import { showNotification } from '../store/NotificationSlice';

export default function UsersPage() {
    // Redux and routing
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux selectors for user data and status
    const users = useSelector(selectAllUsers);
    const status = useSelector(selectUsersStatus);
    const error = useSelector(selectUsersError);

    // Dialog state for Add/Edit user
    const [open, setOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        id: '', name: '', email: '', phone: '', website: ''
    });

    // Fetch users on mount (only once if already loaded)
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    // Manual refresh handler (always refetch)
    const handleRefresh = () => dispatch(forceFetchUsers());

    // Open Add dialog
    const openAddDialog = () => {
        setFormData({ id: '', name: '', email: '', phone: '', website: '' });
        setEditMode(false);
        setOpen(true);
    };
    // Open Edit dialog with existing row data
    const openEditDialog = (row) => {
        setFormData(row);
        setEditMode(true);
        setOpen(true);
    };
    // Dialog close handler
    const handleClose = () => setOpen(false);
    // Form change handler for dialog fields
    const handleChange = e =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // Save handler for add or edit
    const handleSave = () => {
        if (editMode) {
            dispatch(updateUser(formData))
                .then(() =>
                    dispatch(showNotification({ message: 'User updated!', severity: 'success' }))
                );
        } else {
            const { id, ...rest } = formData;
            dispatch(addUser(rest))
                .then(() =>
                    dispatch(showNotification({ message: 'User added!', severity: 'success' }))
                );
        }
        setOpen(false);
    };

    // Delete handler
    const handleDelete = (id) => {
        dispatch(deleteUser(id))
            .then(() =>
                dispatch(showNotification({ message: 'User deleted!', severity: 'info' }))
            );
    };

    // Table row click handler (navigates to user detail)
    const handleRowClick = params => navigate(`/user/${params.id}`);

    // DataGrid columns configuration with improved button look
    const columns = [
        { field: 'id', headerName: 'ID', width: 70, headerClassName: 'users-table-header', cellClassName: 'users-table-cell' },
        { field: 'name', headerName: 'Name', width: 180, headerClassName: 'users-table-header', cellClassName: 'users-table-cell' },
        { field: 'email', headerName: 'Email', width: 200, headerClassName: 'users-table-header', cellClassName: 'users-table-cell' },
        { field: 'phone', headerName: 'Phone', width: 170, headerClassName: 'users-table-header', cellClassName: 'users-table-cell' },
        { field: 'website', headerName: 'Website', width: 180, headerClassName: 'users-table-header', cellClassName: 'users-table-cell' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 240,
            sortable: false,
            headerClassName: 'users-table-header',
            renderCell: (params) => (
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        size="medium"
                        className="table-edit-btn"
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
                        size="medium"
                        className="table-delete-btn"
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
        <Box
            sx={{
                background: "#f4f7fa",
                minHeight: "calc(100vh - 80px)",
                py: 5,
                px: { xs: 1, md: 0 }
            }}
        >
            <Paper
                elevation={4}
                sx={{
                    maxWidth: 1180,
                    margin: "0 auto",
                    p: { xs: 2, md: 4 },
                    borderRadius: 4,
                    background: "#fff"
                }}
            >
                {/* Title */}
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: "#1a2332" }}>
                    Users Management
                </Typography>
                {/* Action buttons */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
                    <Button variant="contained" onClick={openAddDialog} sx={{ fontWeight: 600, px: 3 }}>
                        Add User
                    </Button>
                    <Button variant="outlined" onClick={handleRefresh} sx={{ fontWeight: 600, px: 3 }}>
                        Refresh
                    </Button>
                </Stack>
                {/* Table */}
                <Box sx={{ width: "100%", minHeight: 400, overflowX: "auto" }}>
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
                            className="users-table-root"
                            getRowClassName={() => "users-table-row"}
                            autoHeight
                            disableSelectionOnClick
                            density="comfortable"
                        />
                    )}
                </Box>
            </Paper>
            {/* Add/Edit User Dialog */}
            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 600 }}>
                    {editMode ? "Edit User" : "Add User"}
                </DialogTitle>
                <DialogContent sx={{ py: 2 }}>
                    <Stack spacing={2}>
                        <TextField
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            fullWidth
                            required
                            autoFocus
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
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} sx={{ fontWeight: 600 }}>
                        {editMode ? "Save Changes" : "Add User"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
