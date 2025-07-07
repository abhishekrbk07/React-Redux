import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Paper, Box, Stack, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchPostsPage, removeOldPages, selectPostsByPage
} from '../store/postsSlice';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import './Post.css';

const PAGE_SIZE = 20;

export default function PostsPage() {
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const posts = useSelector(state => selectPostsByPage(state, page));
    const status = useSelector(state => state.posts.status);

    useEffect(() => {
        dispatch(fetchPostsPage({ page, pageSize: PAGE_SIZE }));
        // Keep only the last 3 pages in memory for efficiency
        dispatch(removeOldPages([page - 1, page, page + 1].filter(p => p > 0)));
    }, [dispatch, page]);

    const columns = [
        { field: 'id', headerName: 'ID', width: 85, headerClassName: 'posts-table-header', cellClassName: 'posts-table-cell' },
        { field: 'userId', headerName: 'User ID', width: 120, headerClassName: 'posts-table-header', cellClassName: 'posts-table-cell' },
        { field: 'title', headerName: 'Title', width: 330, headerClassName: 'posts-table-header', cellClassName: 'posts-table-cell' },
        { field: 'body', headerName: 'Body', width: 500, headerClassName: 'posts-table-header', cellClassName: 'posts-table-cell' },
    ];

    return (
        <Box className="posts-bg">
            <Paper className="posts-paper" elevation={5}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <ArticleOutlinedIcon className="posts-title-icon" />
                    <Typography variant="h4" className="posts-title">
                        Posts Management <span className="posts-title-page">(Page {page})</span>
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                    <Button
                        variant="outlined"
                        className="posts-btn"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="contained"
                        className="posts-btn"
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </Button>
                </Stack>
                <Box className="posts-table-wrapper">
                    {status === 'loading' && <p>Loading...</p>}
                    {status === 'failed' && <p style={{ color: 'red' }}>Error fetching posts</p>}
                    <DataGrid
                        rows={posts}
                        columns={columns}
                        pageSize={PAGE_SIZE}
                        rowsPerPageOptions={[PAGE_SIZE]}
                        getRowId={row => row.id}
                        className="posts-table-root"
                        getRowClassName={() => "posts-table-row"}
                        autoHeight
                        disableSelectionOnClick
                        density="comfortable"
                    />
                </Box>
            </Paper>
        </Box>
    );
}
