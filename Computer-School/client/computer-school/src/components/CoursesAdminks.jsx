import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCourses, fetchCourseById, createCourse, updateCourse, deleteCourse } from '../redux/slices/courses';
import { fetchAllTeachers } from '../redux/slices/teachers';
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, List, ListItem, ListItemText, IconButton, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function CoursesComponent() {
    const dispatch = useDispatch();
    const { courses, currentCourse, status: coursesStatus, error: coursesError } = useSelector(state => state.courses);
    const { teachers, status: teachersStatus, error: teachersError } = useSelector(state => state.teachers);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [courseForm, setCourseForm] = useState({
        name: '',
        description: '',
        teacher: '',
        price: '',
        duration: '',
        imageUrl: '',
    });

    useEffect(() => {
        dispatch(fetchAllCourses());
        dispatch(fetchAllTeachers());
    }, [dispatch]);

    useEffect(() => {
        if (isEdit && currentCourse) {
            setCourseForm({
                name: currentCourse.name,
                description: currentCourse.description,
                teacher: currentCourse.teacher,
                price: currentCourse.price,
                duration: currentCourse.duration,
                imageUrl: currentCourse.imageUrl,
            });
        }
    }, [currentCourse, isEdit]);

    const handleOpen = (edit = false, courseId = null) => {
        if (edit && courseId) {
            dispatch(fetchCourseById(courseId));
            setIsEdit(true);
        } else {
            setCourseForm({
                name: '',
                description: '',
                teacher: '',
                price: '',
                duration: '',
                imageUrl: '',
            });
            setIsEdit(false);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async () => {
        if (isEdit && currentCourse) {
            dispatch(updateCourse({ id: currentCourse._id, updatedData: courseForm }));
        } else {
            dispatch(createCourse(courseForm));
        }
        setOpen(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCourseForm(prevState => ({
            ...prevState, [name]: value
        }));
    };

    const handleDelete = (id) => {
        dispatch(deleteCourse(id));
    };

    if (coursesStatus === 'loading' || teachersStatus === 'loading') return <CircularProgress />;
    if (coursesError) return <p>Error loading courses: {coursesError}</p>;
    if (teachersError) return <p>Error loading teachers: {teachersError}</p>;

    return (
        <div>
            <Button variant="contained" onClick={() => handleOpen()}>Add New Course</Button>
            <List>
                {courses.map((course) => (
                    <ListItem key={course._id} secondaryAction={
                        <>
                            <IconButton edge="end" aria-label="edit" onClick={() => handleOpen(true, course._id)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(course._id)}>
                                <DeleteIcon />
                            </IconButton>
                        </>
                    }>
                        <ListItemText primary={course.name} secondary={course.description} />
                    </ListItem>
                ))}
            </List>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEdit ? 'Edit Course' : 'Add New Course'}</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" name="name" label="Name" fullWidth variant="outlined" value={courseForm.name} onChange={handleChange} />
                    <TextField margin="dense" name="description" label="Description" fullWidth variant="outlined" value={courseForm.description} onChange={handleChange} />
                    <FormControl fullWidth margin="dense">
                        <InputLabel id="teacher-select-label">Teacher</InputLabel>
                        <Select
                            labelId="teacher-select-label"
                            id="teacher-select"
                            value={courseForm.teacher}
                            label="Teacher"
                            onChange={(e) => handleChange({ target: { name: 'teacher', value: e.target.value } })}
                        >
                            {teachers.map((teacher) => (
                                <MenuItem key={teacher._id} value={teacher._id}>
                                    {teacher.user.userName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField margin="dense" name="price" label="Price" fullWidth variant="outlined" type="number" value={courseForm.price} onChange={handleChange} />
                    <TextField margin="dense" name="duration" label="Duration" fullWidth variant="outlined" value={courseForm.duration} onChange={handleChange} />
                    <TextField margin="dense" name="imageUrl" label="Image URL" fullWidth variant="outlined" value={courseForm.imageUrl} onChange={handleChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>{isEdit ? 'Update' : 'Create'}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CoursesComponent;