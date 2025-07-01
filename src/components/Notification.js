import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { hideNotification } from '../store/NotificationSlice';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export default function Notifications() {
    const dispatch = useDispatch();
    const { message, severity, open } = useSelector(state => state.notifications);

    return (
        <Snackbar open={open} autoHideDuration={2500} onClose={() => dispatch(hideNotification())}
                  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={() => dispatch(hideNotification())} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
}
