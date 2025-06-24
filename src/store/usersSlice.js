import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- Types (for intellisense, not required but nice for doc) ---
/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} website
 */
/**
 * @typedef {Object} UsersState
 * @property {User[]} data
 * @property {'idle'|'loading'|'succeeded'|'failed'} status
 * @property {string|null} error
 */

// --- Initial state ---
const initialState = /** @type {UsersState} */ ({
    data: [],
    status: 'idle',
    error: null,
});

// --- Thunks ---
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (_, { getState, rejectWithValue }) => {
        const { users } = getState();
        if (users.data.length > 0) {
            return rejectWithValue('already_loaded');
        }
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        return response.json();
    }
);

export const forceFetchUsers = createAsyncThunk(
    'users/forceFetchUsers',
    async () => {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        return response.json();
    }
);

// --- Reducer functions ---
const handlePending = state => { state.status = 'loading'; };
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
        builder
            .addCase(fetchUsers.pending, handlePending)
            .addCase(fetchUsers.fulfilled, handleFulfilled)
            .addCase(fetchUsers.rejected, handleRejected)
            .addCase(forceFetchUsers.pending, handlePending)
            .addCase(forceFetchUsers.fulfilled, handleFulfilled)
            .addCase(forceFetchUsers.rejected, handleRejected);
    },
});

// --- Selectors ---
export const selectAllUsers = state => state.users.data;
export const selectUsersStatus = state => state.users.status;
export const selectUsersError = state => state.users.error;

// --- Export reducer ---
export default usersSlice.reducer;
