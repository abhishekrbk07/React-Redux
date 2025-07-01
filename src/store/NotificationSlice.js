import { createSlice } from '@reduxjs/toolkit';

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        message: null,
        severity: 'info', // 'success', 'error', 'warning', 'info'
        open: false,
    },
    reducers: {
        showNotification: (state, action) => {
            state.message = action.payload.message;
            state.severity = action.payload.severity || 'info';
            state.open = true;
        },
        hideNotification: (state) => {
            state.open = false;
        },
    },
});

export const { showNotification, hideNotification } = notificationsSlice.actions;

export default  notificationsSlice.reducer;
