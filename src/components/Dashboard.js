import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectDashboardNames, fetchDashboardNames } from '../store/dashboardSlice';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Paper, Typography, Grid, Avatar } from '@mui/material';
import './Dashboard.css';

export default function DashboardPage() {
    const dispatch = useDispatch();
    const names = useSelector(selectDashboardNames);

    useEffect(() => {
        if (names.length === 0) {
            dispatch(fetchDashboardNames());
        }
    }, [dispatch, names]);

    return (
        <Box className="dashboard-bg">
            <Paper elevation={5} className="dashboard-card">
                <Box className="dashboard-header">
                    <PersonIcon className="dashboard-icon" />
                    <Typography variant="h4" className="dashboard-title">
                        Top 100 Names
                    </Typography>
                </Box>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {names.map((user, idx) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
                            <Paper elevation={2} className="dashboard-name-card">
                                {/* Show number (1-100) in avatar */}
                                <Avatar className="dashboard-avatar-num">{idx + 1}</Avatar>
                                <span className="dashboard-name">{user.name}</span>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        </Box>
    );
}
