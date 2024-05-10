import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllGroups, createGroup, updateGroup, deleteGroup } from '../redux/slices/groups';
import { fetchAllCourses } from '../redux/slices/courses';
import { fetchGetAllUsers } from '../redux/slices/auth';
import { fetchAllSchedules } from '../redux/slices/schedules'; // Import the action
import { Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, InputLabel, FormControl } from '@mui/material';

const GroupsManager = () => {
    const dispatch = useDispatch();
    const groups = useSelector((state) => state.groups.groups);
    const courses = useSelector((state) => state.courses.courses);
    const users = useSelector((state) => state.auth.users);
    const schedules = useSelector((state) => state.schedules.schedules);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentGroup, setCurrentGroup] = useState(null);

    // Fields for the form
    const [name, setName] = useState('');
    const [course, setCourse] = useState('');
    const [students, setStudents] = useState([]);
    const [schedule, setSchedule] = useState(''); // State for selected schedule

    useEffect(() => {
        dispatch(fetchAllGroups());
        dispatch(fetchAllCourses());
        dispatch(fetchGetAllUsers());
        dispatch(fetchAllSchedules());
    }, [dispatch]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setIsEdit(false);
        setCurrentGroup(null);
        resetForm();
    };

    const resetForm = () => {
        setName('');
        setCourse('');
        setStudents([]);
        setSchedule('');
    };

    const handleSubmit = async () => {
        const groupData = { name, course, students, schedule }; // Include selected schedule
        if (isEdit && currentGroup) {
            dispatch(updateGroup({ id: currentGroup._id, updatedData: groupData }));
        } else {
            dispatch(createGroup(groupData));
        }
        handleClose();
    };

    const handleEdit = (group) => {
        setCurrentGroup(group);
        setName(group.name);
        // Ensure you're setting the ID, not the object, unless your Select handles objects
        setCourse(group.course._id);
        // Assuming `students` is an array of student IDs
        const studentIds = group.students.map(student => student._id);
        setStudents(studentIds);
        // Again, ensure you're setting the ID for consistency with your Select component
        setSchedule(group.schedule._id);
        setIsEdit(true);
        handleClickOpen();
    };


    const handleDelete = (id) => {
        dispatch(deleteGroup(id));
    };

    return (
        <div>
            <Button variant="contained" color="primary" onClick={handleClickOpen}>
                {isEdit ? 'Edit Group' : 'Add Group'}
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{isEdit ? 'Edit Group' : 'Create Group'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Group Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <FormControl fullWidth>
                        <InputLabel id="course-label">Course</InputLabel>
                        <Select
                            labelId="course-label"
                            id="course-select"
                            value={course}
                            onChange={(e) => setCourse(e.target.value)}
                            fullWidth
                        >
                            {courses && courses.map((c) => (
                                <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth>
                        <InputLabel id="students-label">Students</InputLabel>
                        <Select
                            labelId="students-label"
                            id="students-select"
                            multiple
                            value={students}
                            onChange={(e) => {
                                const value = e.target.value;
                                setStudents(typeof value === 'string' ? value.split(',') : value);
                            }}
                            renderValue={(selected) => selected.join(', ')}
                            fullWidth
                        >
                            {users && users.filter(user => user.role === "student").map((user) => (
                                <MenuItem key={user._id} value={user._id}>
                                    {user.userName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <InputLabel id="schedule-label">Schedule</InputLabel>
                    <Select
                        labelId="schedule-label"
                        id="schedule-select"
                        value={schedule} // Use `schedule` state here, not `schedules`
                        onChange={(e) => setSchedule(e.target.value)}
                        fullWidth
                    >
                        {schedules.map((schedule) => (
                            <MenuItem key={schedule._id} value={schedule._id}>{schedule.name}</MenuItem> // Assuming each schedule has a name
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {isEdit ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Course</TableCell>
                        <TableCell>Students</TableCell>
                        <TableCell>Schedule</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {groups.map((group) => (
                        <TableRow key={group._id}>
                            <TableCell>{group.name}</TableCell>
                            <TableCell>
                                {/* Непосредственное использование имени курса из объекта курса */}
                                {group.course.name}
                            </TableCell>
                            <TableCell>
                                {/* Преобразование массива объектов студентов в строку с именами */}
                                {group.students.map(student => student.userName).join(', ')}
                            </TableCell>
                            <TableCell>
                                {/* Предполагаем, что schedule - это просто ID, его можно отобразить напрямую или обработать по-другому */}
                                {group.schedule._id}
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => handleEdit(group)} color="primary">
                                    Edit
                                </Button>
                                <Button onClick={() => handleDelete(group._id)} color="secondary">
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default GroupsManager;