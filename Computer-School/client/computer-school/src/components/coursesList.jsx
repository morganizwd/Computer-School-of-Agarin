import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses } from '../redux/slices/courses';
import { Card, CardContent, CardMedia, Typography, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CoursesList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Используем хук useNavigate для программной навигации
  const courses = useSelector((state) => state.courses.courses);
  const status = useSelector((state) => state.courses.status);

  useEffect(() => {
    dispatch(fetchAllCourses());
  }, [dispatch]);

  const handleCourseClick = (id) => {
    navigate(`/courses/${id}`); // Навигация на страницу курса по его ID
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={3}>
        {status === 'succeeded' &&
          courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id} onClick={() => handleCourseClick(course._id)}>
              <Card sx={{ cursor: 'pointer' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={course.imageUrl || 'https://via.placeholder.com/140'}
                  alt={course.name}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {course.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default CoursesList;