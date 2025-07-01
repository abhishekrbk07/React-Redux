import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import notificationsReducer from './NotificationSlice'; // <-- ADD THIS

export const store = configureStore({
    reducer: {
        users: usersReducer,
        notifications: notificationsReducer,
    },
});
