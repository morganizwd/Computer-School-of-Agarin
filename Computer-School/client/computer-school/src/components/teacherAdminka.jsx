import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTeachers, createTeacher, updateTeacher, deleteTeacher } from '../redux/slices/teachers'; // Предполагаемый путь к вашему slice
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

function TeacherAdminka() {
    const dispatch = useDispatch();
    const teachers = useSelector(state => state.teachers.teachers);
    const [open, setOpen] = useState(false);
    const [currentTeacher, setCurrentTeacher] = useState({ id: null, user: '', specialization: '', experience: '' });

    useEffect(() => {
        dispatch(fetchAllTeachers());
    }, [dispatch]);

    const handleClickOpen = (teacher = { id: null, user: '', specialization: '', experience: '' }) => {
        setCurrentTeacher(teacher);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSave = () => {
        if (currentTeacher.id) {
            dispatch(updateTeacher({ id: currentTeacher.id, updatedData: { user: currentTeacher.user, specialization: currentTeacher.specialization, experience: currentTeacher.experience } }));
        } else {
            dispatch(createTeacher({ user: currentTeacher.user, specialization: currentTeacher.specialization, experience: currentTeacher.experience }));
        }
        handleClose();
    };

    const handleDelete = (id) => {
        dispatch(deleteTeacher(id));
    };

    const handleChange = (e) => {
        setCurrentTeacher({ ...currentTeacher, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <Button variant="outlined" onClick={() => handleClickOpen()}>Add Teacher</Button>
            <List>
                {teachers.map((teacher) => (
                    <ListItem
                        key={teacher._id}
                        secondaryAction={
                            <>
                                <IconButton edge="end" aria-label="edit" onClick={() => handleClickOpen({ id: teacher._id, user: teacher.user, specialization: teacher.specialization, experience: teacher.experience })}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(teacher._id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        }
                    >
                        <ListItemText primary={teacher.user.userName} secondary={`Specialization: ${teacher.specialization}, Experience: ${teacher.experience}`} />
                    </ListItem>
                ))}
            </List>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{currentTeacher.id ? 'Edit Teacher' : 'Add Teacher'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="user"
                        label="User ID"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentTeacher.user}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="specialization"
                        label="Specialization"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentTeacher.specialization}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="experience"
                        label="Experience"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={currentTeacher.experience}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default TeacherAdminka;