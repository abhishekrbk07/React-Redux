import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// How many pages to keep in memory (set as needed)
const PAGE_CACHE_SIZE = 5;

const initialState = {
    postsByPage: {},      // { 1: [...], 2: [...], ... }
    pageOrder: [],        // [3, 2, 1] — for cache eviction
    status: 'idle',       // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

// Fetches a single page (only if not in store)
export const fetchPostsPage = createAsyncThunk(
    'posts/fetchPostsPage',
    async ({ page, pageSize }, { getState, rejectWithValue }) => {
        const { postsByPage } = getState().posts;
        if (postsByPage[page]) {
            // Already loaded
            return rejectWithValue({ reason: 'already_loaded', page });
        }
        const res = await fetch(
            `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${pageSize}`
        );
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        return { page, data };
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
                const { page, data } = action.payload;

                // Add new page to store
                state.postsByPage[page] = data;

                // Update pageOrder (most recent first)
                state.pageOrder = [page, ...state.pageOrder.filter(p => p !== page)];

                // If we exceed cache size, remove the oldest
                if (state.pageOrder.length > PAGE_CACHE_SIZE) {
                    const evict = state.pageOrder.pop();
                    delete state.postsByPage[evict];
                }
            })
            .addCase(fetchPostsPage.rejected, (state, action) => {
                if (action.payload?.reason === 'already_loaded') {
                    state.status = 'succeeded';
                } else {
                    state.status = 'failed';
                    state.error = action.error?.message || 'Error';
                }
            });
    }
});

// Selector to get posts for a given page
export const selectPostsByPage = (state, page) =>
    state.posts.postsByPage[page]; // returns undefined if not in store

export default postsSlice.reducer;
