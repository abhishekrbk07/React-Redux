import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- Initial State ---
const initialState = {
    data: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
};


// Fetch all users (only if not loaded)
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { getState, rejectWithValue }) => {
        const { users } = getState();
        if (users.data.length > 0) {
            return rejectWithValue('already_loaded');
        }
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        return await response.json();
    }
);

// Always fetch (for Refresh)
export const forceFetchUsers = createAsyncThunk(
    'users/forceFetchUsers',
    async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        return await response.json();
    }
);

// Add a user
export const addUser = createAsyncThunk(
    'users/addUser',
    async (newUser) => {
        const response = await fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        });
        return await response.json();
    }
);

// Update a user
export const updateUser = createAsyncThunk(
    'users/updateUser',
    async (user) => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        return await response.json();
    }
);

// Delete a user
export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (id) => {
        await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
            method: 'DELETE',
        });
        return id;
    }
);

// --- Reducer Functions ---
const handlePending = (state) => { state.status = 'loading'; };
const handleFulfilled = (state, action) => {
    state.status = 'succeeded';
    state.data = action.payload;
    state.error = null;
};
const handleRejected = (state, action) => {
    if (action.payload === 'already_loaded') {
        state.status = 'succeeded';
    } else {
        state.status = 'failed';
        state.error = action.error.message;
    }
};

// --- Slice ---
const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: builder => {
        // Fetch
        builder
            .addCase(fetchUsers.pending, handlePending)
            .addCase(fetchUsers.fulfilled, handleFulfilled)
            .addCase(fetchUsers.rejected, handleRejected)
            .addCase(forceFetchUsers.pending, handlePending)
            .addCase(forceFetchUsers.fulfilled, handleFulfilled)
            .addCase(forceFetchUsers.rejected, handleRejected);

        // Add User
        builder.addCase(addUser.fulfilled, (state, action) => {
            state.data.push(action.payload);
        });

        // Update User
        builder.addCase(updateUser.fulfilled, (state, action) => {
            const idx = state.data.findIndex(u => u.id === action.payload.id);
            if (idx > -1) state.data[idx] = action.payload;
        });

        // Delete User
        builder.addCase(deleteUser.fulfilled, (state, action) => {
            state.data = state.data.filter(u => u.id !== action.payload);
        });
    },
});

// --- Selectors ---
export const selectAllUsers = state => state.users.data;
export const selectUsersStatus = state => state.users.status;
export const selectUsersError = state => state.users.error;

// --- Export reducer ---
export default usersSlice.reducer;


