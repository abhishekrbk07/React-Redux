// PostsPage.js
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsPage, selectPostsByPage } from '../store/postsSlice';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Paper, Box, Stack, Typography, CircularProgress } from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import './Post.css';

const PAGE_SIZE = 10;

export default function PostsPage() {
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();
    const posts = useSelector(state => selectPostsByPage(state, page));
    const status = useSelector(state => state.posts.status);

    useEffect(() => {
        if (!posts) {
            dispatch(fetchPostsPage({ page, pageSize: PAGE_SIZE }));
        }
    }, [dispatch, page, posts]);

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
                    {(!posts || status === 'loading') && (
                        <Box sx={{ py: 8, textAlign: 'center' }}>
                            <CircularProgress size={36} />
                            <Typography sx={{ mt: 2, color: "#1976d2", fontWeight: 600 }}>
                                Loading posts...
                            </Typography>
                        </Box>
                    )}
                    {posts && (
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
                    )}
                </Box>
            </Paper>
        </Box>
    );
}
