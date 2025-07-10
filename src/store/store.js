import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import notificationsReducer from './NotificationSlice';
import postsReducer from './postsSlice';
import dashboardReducer from './dashboardSlice';


export const store = configureStore({
    reducer: {
        users: usersReducer,
        posts: postsReducer,
        notifications: notificationsReducer,
        dashboard: dashboardReducer,
    },
});
