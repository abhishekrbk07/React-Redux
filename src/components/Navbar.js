import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Stack, Badge } from '@mui/material';
import { useLocation, Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

import './Navbar.css';

export default function Navbar() {
    const location = useLocation();
    const isUsers = location.pathname.startsWith('/user') || location.pathname === '/';
    const isPosts = location.pathname.startsWith('/posts');

    return (
        <AppBar position="static" className="navbar-appbar" elevation={0}>
            <Toolbar className="navbar-toolbar">
                {/* Logo/Icon */}
                <IconButton size="large" edge="start" className="navbar-icon" disableRipple>
                    <DashboardIcon fontSize="large" />
                </IconButton>
                {/* Title */}
                <Typography variant="h5" className="navbar-title">
                    REDUX USER MANAGEMENT
                </Typography>
                {/* Nav buttons */}
                <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                        component={Link}
                        to="/posts"
                        className={`navbar-btn${isPosts ? ' active' : ''}`}
                        disableElevation
                    >
                        <ArticleOutlinedIcon style={{ marginRight: 8 }} />
                        POSTS
                    </Button>
                    <Badge badgeContent={10} color="error" overlap="rectangular">
                        <Button
                            component={Link}
                            to="/"
                            className={`navbar-btn${isUsers ? ' active' : ''}`}
                            disableElevation
                        >
                            <GroupIcon style={{ marginRight: 8 }} />
                            USERS
                        </Button>
                    </Badge>
                    <Button
                        component={Link}
                        to="/dashboard"
                        className={`navbar-btn${location.pathname === '/dashboard' ? ' active' : ''}`}
                        disableElevation
                    >
                        <DashboardIcon style={{ marginRight: 8 }} />
                        DASHBOARD
                    </Button>

                    <IconButton className="navbar-icon" size="large">
                        <NotificationsIcon />
                    </IconButton>
                </Stack>
            </Toolbar>
        </AppBar>
    );
}
