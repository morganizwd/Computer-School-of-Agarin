import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllGroups } from '../redux/slices/groups';
import { Card, CardContent, Typography, Grid, Box, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GroupsList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { groups, status } = useSelector((state) => state.groups);
    const userData = useSelector((state) => state.auth.data);

    useEffect(() => {
        dispatch(fetchAllGroups());
    }, [dispatch]);

    const handleGroupClick = (id) => {
        navigate(`/groups/${id}`);
    };

    let filteredGroups = groups;
    if (userData && userData.role === 'student') {
        filteredGroups = groups.filter(group =>
            group.students.some(student => student._id === userData._id));
    }

    return (
        <Box sx={{ flexGrow: 1, p: 2 }}>
            <Grid container spacing={3}>
                {status === 'succeeded' &&
                    filteredGroups.map((group) => (
                        <Grid item xs={12} sm={6} md={4} key={group._id} onClick={() => handleGroupClick(group._id)}>
                            <Card sx={{ cursor: 'pointer' }}>
                                <CardContent>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={group.course.imageUrl || 'https://via.placeholder.com/140'}
                                        alt={group.course.name}
                                    />
                                    <Typography gutterBottom variant="h5" component="div">
                                        {group.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {group.course.name}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Box>
    );
};

export default GroupsList;
