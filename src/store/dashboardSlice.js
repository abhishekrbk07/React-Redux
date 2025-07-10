import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchDashboardNames = createAsyncThunk(
    'dashboard/fetchNames',
    async (_, { getState, rejectWithValue }) => {
        const { data } = getState().dashboard;
        if (data.length > 0) return rejectWithValue('already_loaded');
        const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=100');
        const posts = await res.json();
        // Map to fake "name" objects
        return posts.map(post => ({ id: post.id, name: post.title }));
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: { data: [], status: 'idle', error: null },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchDashboardNames.pending, state => { state.status = 'loading'; })
            .addCase(fetchDashboardNames.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchDashboardNames.rejected, (state, action) => {
                if (action.payload === 'already_loaded') {
                    state.status = 'succeeded';
                } else {
                    state.status = 'failed';
                    state.error = action.error?.message;
                }
            });
    },
});

export const selectDashboardNames = state => state.dashboard.data;
export default dashboardSlice.reducer;
