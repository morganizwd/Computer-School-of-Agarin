import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTeachers } from '../redux/slices/teachers'; // Убедитесь, что путь импорта соответствует вашей структуре
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

const TeachersList = () => {
    const dispatch = useDispatch();
    const { teachers, status, error } = useSelector((state) => state.teachers);

    useEffect(() => {
        dispatch(fetchAllTeachers());
    }, [dispatch]);

    if (status === 'loading') {
        return <Typography>Loading...</Typography>;
    }

    if (status === 'failed') {
        return <Typography>Error: {error}</Typography>;
    }

    return (
        <Box sx={{ flexGrow: 1, p: 2 }}>
            <Grid container spacing={3}>
                {teachers.map((teacher) => (
                    <Grid item xs={12} sm={6} md={4} key={teacher._id}>
                        <Card>
                            <CardContent>
                                {/* Предполагается, что поле userName теперь доступно в объекте user */}
                                <Typography gutterBottom variant="h5" component="div">
                                    Name: {teacher.user.userName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Specialization: {teacher.specialization}
                                </Typography>
                                <Typography variant="body1">
                                    Experience: {teacher.experience}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default TeachersList;