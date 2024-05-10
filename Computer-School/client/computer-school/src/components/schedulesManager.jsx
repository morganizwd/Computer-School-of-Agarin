import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllSchedules, createSchedule, updateSchedule, deleteSchedule } from '../redux/slices/schedules';
import { fetchAllGroups } from '../redux/slices/groups';
import { fetchAllLocations } from '../redux/slices/locations';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from 'uuid';

function ScheduleManager() {
    const dispatch = useDispatch();
    const schedules = useSelector(state => state.schedules.schedules);
    const groups = useSelector(state => state.groups.groups);
    const locations = useSelector(state => state.locations.locations);
    const [open, setOpen] = useState(false);
    const [currentSchedule, setCurrentSchedule] = useState({ group: '', dateTime: [new Date()], location: '' });

    useEffect(() => {
        dispatch(fetchAllSchedules());
        dispatch(fetchAllGroups());
        dispatch(fetchAllLocations());
    }, [dispatch]);

    const handleClickOpen = (schedule = null) => {
        if (schedule) {
            setCurrentSchedule({ ...schedule, dateTime: schedule.dateTime.map(date => new Date(date)) });
        } else {
            setCurrentSchedule({ group: '', dateTime: [new Date()], location: '' });
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentSchedule({ group: '', dateTime: [new Date()], location: '' });
    };

    const handleSave = () => {
        if (currentSchedule?._id) {
            dispatch(updateSchedule({ id: currentSchedule._id, updatedData: currentSchedule }));
        } else {
            dispatch(createSchedule(currentSchedule));
        }
        handleClose();
    };

    const handleDelete = (id) => {
        dispatch(deleteSchedule(id));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentSchedule(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date, index) => {
        const newDates = [...currentSchedule.dateTime];
        newDates[index] = date;
        setCurrentSchedule(prev => ({ ...prev, dateTime: newDates }));
    };

    const addDateField = () => {
        setCurrentSchedule(prev => ({
            ...prev,
            dateTime: [...prev.dateTime, new Date()]
        }));
    };

    const removeDateField = (index) => {
        setCurrentSchedule(prev => ({
            ...prev,
            dateTime: prev.dateTime.filter((_, i) => i !== index)
        }));
    };

    return (
        <div>
            <Button variant="outlined" onClick={() => handleClickOpen()}>Add Schedule</Button>
            <List>
                {schedules.map((schedule) => (
                    <ListItem key={schedule._id}>
                        <ListItemText
                            primary={`Schedule for ${groups.find(group => group._id === schedule.group)?.name} at ${locations.find(location => location._id === schedule.location)?.address
                                } on ${schedule.dateTime.join(', ')}`} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="edit" onClick={() => handleClickOpen(schedule)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(schedule._id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth="xl">
                <DialogTitle>{currentSchedule?._id ? 'Edit Schedule' : 'New Schedule'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="group-label">Group</InputLabel>
                                <Select labelId="group-label" id="group" name="group" value={currentSchedule.group} onChange={handleChange} autoWidth>
                                    {groups.map((group) => (
                                        <MenuItem key={group._id} value={group._id}>{group.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {currentSchedule.dateTime.map((date, index) => (
                            <Grid item xs={12} md={6} key={uuidv4()} style={{ position: 'relative' }}>
                                <DatePicker selected={date} onChange={(date) => handleDateChange(date, index)} showTimeSelect dateFormat="Pp" className="form-control" />
                                {currentSchedule.dateTime.length > 1 && (
                                    <IconButton aria-label="delete date" onClick={() => removeDateField(index)} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
                                        <DeleteIcon />
                                    </IconButton>
                                )}
                            </Grid>
                        ))}
                        <Grid item xs={12}>
                            <Button variant="contained" onClick={addDateField}>Add Another Date</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel id="location-label">Location</InputLabel>
                                <Select labelId="location-label" id="location" name="location" value={currentSchedule.location} onChange={handleChange} autoWidth>
                                    {locations.map((location) => (
                                        <MenuItem key={location._id} value={location._id}>{location.address}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default ScheduleManager;
