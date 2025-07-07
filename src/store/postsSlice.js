import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Page size is set in the component, can be parameterized
const initialState = {
    postsByPage: {}, // { 1: [row...], 2: [row...] }
    status: 'idle',
    error: null,
};

export const fetchPostsPage = createAsyncThunk(
    'posts/fetchPostsPage',
    async ({ page, pageSize }, { getState, rejectWithValue }) => {
        const { postsByPage } = getState().posts;
        if (postsByPage[page]) {
            // Already loaded, skip API call
            return rejectWithValue({ reason: 'already_loaded', page });
        }
        const res = await fetch(
            `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${pageSize}`
        );
        const data = await res.json();
        return { page, data };
    }
);

export const removeOldPages = createAsyncThunk(
    'posts/removeOldPages',
    async (pagesToKeep, { getState }) => {
        // No API call, just triggers reducer to clean up pages
        return pagesToKeep;
    }
);

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchPostsPage.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPostsPage.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.error = null;
                state.postsByPage[action.payload.page] = action.payload.data;
            })
            .addCase(fetchPostsPage.rejected, (state, action) => {
                if (action.payload?.reason === 'already_loaded') {
                    state.status = 'succeeded'; // treat as loaded
                } else {
                    state.status = 'failed';
                    state.error = action.error?.message || 'Error';
                }
            })
            .addCase(removeOldPages.fulfilled, (state, action) => {
                const keepSet = new Set(action.payload);
                Object.keys(state.postsByPage).forEach(page => {
                    if (!keepSet.has(Number(page))) {
                        delete state.postsByPage[page];
                    }
                });
            });
    }
});

// Selector to get posts for a specific page
export const selectPostsByPage = (state, page) =>
    state.posts.postsByPage[page] || [];

export default postsSlice.reducer;
