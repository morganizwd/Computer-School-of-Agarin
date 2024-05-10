import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthMe, logout, selectIsAuth } from '../redux/slices/auth';
import { Avatar, Button, Typography, Box, Grid, Paper } from '@mui/material';

const UserProfile = () => {
    const dispatch = useDispatch();
    const isAuth = useSelector(selectIsAuth);
    const user = useSelector((state) => state.auth.data);

    useEffect(() => {
        if (!user) {
            dispatch(fetchAuthMe());
        }
    }, [dispatch, user]);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <Box sx={{ flexGrow: 1, p: 2 }}>
            <Grid container spacing={2} justifyContent="center">
                {isAuth && user ? (
                    <Grid item xs={12} md={8} lg={6}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar src={user.imageUrl} sx={{ width: 56, height: 56, mb: 2 }} />
                            <Typography gutterBottom variant="h5" component="div">
                                {user.userName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Дата регистрации: {user.createdAt}
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </Paper>
                    </Grid>
                ) : (
                    <Typography variant="body1" align="center">
                        Please login or register.
                    </Typography>
                )}
            </Grid>
        </Box>
    );
};

export default UserProfile;
