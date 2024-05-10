import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchCourseById } from '../redux/slices/courses';
import { Card, CardContent, CardMedia, Typography, Button, Box, Modal } from '@mui/material';

const CourseProfile = () => {
    const { courseId } = useParams();
    const dispatch = useDispatch();
    const course = useSelector((state) => state.courses.currentCourse);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        dispatch(fetchCourseById(courseId));
    }, [dispatch, courseId]);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <Box sx={{ m: 2 }}>
            {course ? (
                <Card>
                    <CardMedia
                        component="img"
                        height="250"
                        image={course.imageUrl || 'https://via.placeholder.com/250'}
                        alt={course.name}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h4" component="div">
                            {course.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {course.description}
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                            Price: ${course.price}
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                            Длительность: {course.duration}
                        </Typography>
                        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleOpenModal}>
                            Sign Up for Course
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Typography variant="body1">Loading course details...</Typography>
            )}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Contact Information
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        For more information or to sign up for the course, please contact us at:
                        <br />
                        Email: contact@example.com
                        <br />
                        Phone: (123) 456-7890
                    </Typography>
                </Box>
            </Modal>
        </Box>
    );
};

export default CourseProfile;