import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './usersSlice';
import notificationsReducer from './NotificationSlice';
import postsReducer from './postsSlice';


export const store = configureStore({
    reducer: {
        users: usersReducer,
        posts: postsReducer,
        notifications: notificationsReducer,
    },
});
