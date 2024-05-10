import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchGroupById } from '../redux/slices/groups';
import { createAssignment, fetchAllAssignments } from '../redux/slices/assignments';
import { createAssignmentResult, fetchAllAssignmentResults, updateAssignmentResult } from '../redux/slices/assignmentResults';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText, Divider, CardMedia, Button, Avatar, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import Link from '@mui/material/Link';

const GroupDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const group = useSelector((state) => state.groups.currentGroup);
    const assignments = useSelector((state) => state.assignments.assignments.filter(assignment => assignment.group._id === id));
    const assignmentResults = useSelector((state) => state.assignmentResults.assignmentResults);
    const userData = useSelector((state) => state.auth.data);
    const [showAll, setShowAll] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [openResultDialog, setOpenResultDialog] = useState(false);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState('');
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentDescription, setAssignmentDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [gitHubLink, setGitHubLink] = useState('');
    const [openScoreDialog, setOpenScoreDialog] = useState(false);
    const [currentResultId, setCurrentResultId] = useState(null);
    const [newScore, setNewScore] = useState('');

    const handleOpenScoreDialog = (resultId, currentScore) => {
        setCurrentResultId(resultId);
        setNewScore(currentScore.toString());
        setOpenScoreDialog(true);
    };

    const handleCloseScoreDialog = () => {
        setOpenScoreDialog(false);
    };

    const handleUpdateScore = () => {
        dispatch(updateAssignmentResult({ id: currentResultId, updatedData: { score: parseInt(newScore, 10) } }));
        handleCloseScoreDialog();
    };


    useEffect(() => {
        dispatch(fetchGroupById(id));
        dispatch(fetchAllAssignments());
        dispatch(fetchAllAssignmentResults());
    }, [dispatch, id]);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    };

    const toggleShowAll = () => setShowAll(!showAll);

    const getInitials = (name) => {
        return name.split(' ').map((n) => n[0]).join('');
    };

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleOpenResultDialog = (assignmentId) => {
        setSelectedAssignmentId(assignmentId);
        setOpenResultDialog(true);
    };
    const handleCloseResultDialog = () => setOpenResultDialog(false);

    const handleSubmitAssignment = () => {
        dispatch(createAssignment({
            name: assignmentName,
            description: assignmentDescription,
            dueDate: dueDate,
            group: id,
        }));
        handleCloseDialog();
        setAssignmentName('');
        setAssignmentDescription('');
        setDueDate('');
    };

    const handleSubmitResult = () => {
        dispatch(createAssignmentResult({
            assignment: selectedAssignmentId, // Подтвердите, что ключ называется 'assignment'
            user: userData._id,
            gitHubLink,
            score: 0,
        }));
        handleCloseResultDialog();
        setGitHubLink('');
    };

    return (
        <Box sx={{ m: 2 }}>
            {group && (
                <>
                    <Card>
                        <CardContent>
                            <CardMedia
                                component="img"
                                height="140"
                                image={group.course.imageUrl || 'https://via.placeholder.com/140'}
                                alt={group.course.name}
                            />
                            <Typography gutterBottom variant="h4" component="div">{group.name}</Typography>
                            <Typography gutterBottom variant="h5" component="div">{group.course.name}</Typography>
                            {(userData && (userData.role === 'teacher' || userData.role === 'admin')) && <Button onClick={handleOpenDialog}>Добавить задание</Button>}
                        </CardContent>
                        <CardContent>
                            <Typography variant="h6">Участники группы:</Typography>
                            <List>
                                {group.students.map((student) => (
                                    <ListItem key={student._id} secondaryAction={<Avatar src={student.imageUrl || ''} alt={getInitials(student.userName)}>{!student.imageUrl ? getInitials(student.userName) : null}</Avatar>}>
                                        <ListItemText primary={student.userName} secondary={student.email} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                        <Divider variant="middle" />
                        <CardContent>
                            <Typography variant="h6">Расписание:</Typography>
                            <List>
                                {(showAll ? group.schedule.dateTime : group.schedule.dateTime.slice(0, 5)).map((date, index) => (
                                    <ListItem key={index}><ListItemText primary={formatDate(date)} /></ListItem>
                                ))}
                            </List>
                            {group.schedule.dateTime.length > 5 && (<Button onClick={toggleShowAll}>{showAll ? 'Свернуть' : 'Показать все'}</Button>)}
                        </CardContent>
                    </Card>
                    <Card sx={{ mt: 2 }}>
                        <CardContent>
                            <Typography variant="h6">Домашние задания:</Typography>
                            <List>
                                {assignments.map((assignment) => (
                                    <ListItem key={assignment._id} alignItems="flex-start">
                                        <ListItemText primary={assignment.name} secondary={`Срок сдачи: ${formatDate(assignment.dueDate)}`} />
                                        {userData && userData.role === 'student' && <Button onClick={() => handleOpenResultDialog(assignment._id)}>Сдать работу</Button>}
                                        <Typography variant="subtitle2">Решения:</Typography>
                                        <List>
                                            {assignmentResults.filter(result => result.assignment === assignment._id).map((result) => (
                                                <ListItem key={result._id}>
                                                    <ListItemText
                                                        primary={`Сдано пользователем: ${result.user.userName}`}
                                                        secondary={
                                                            <>
                                                                GitHub Link:
                                                                <Link href={result.gitHubLink} target="_blank" rel="noopener noreferrer">
                                                                    {result.gitHubLink}
                                                                </Link>
                                                                <br />
                                                                Score: {result.score}
                                                                {userData && userData.role === 'teacher' && (
                                                                    <Button onClick={() => handleOpenScoreDialog(result._id, result.score)}>Изменить оценку</Button>
                                                                )}
                                                            </>
                                                        }
                                                    />
                                                </ListItem>
                                            ))}
                                        </List>
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </>
            )}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Новое задание</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Название задания" type="text" fullWidth variant="outlined" value={assignmentName} onChange={(e) => setAssignmentName(e.target.value)} />
                    <TextField margin="dense" label="Описание" type="text" fullWidth multiline rows={4} variant="outlined" value={assignmentDescription} onChange={(e) => setAssignmentDescription(e.target.value)} />
                    <TextField margin="dense" label="Срок сдачи" type="date" fullWidth variant="outlined" value={dueDate} onChange={(e) => setDueDate(e.target.value)} InputLabelProps={{ shrink: true }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button onClick={handleSubmitAssignment}>Создать</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openResultDialog} onClose={handleCloseResultDialog}>
                <DialogTitle>Сдать работу</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Ссылка на GitHub" type="text" fullWidth variant="outlined" value={gitHubLink} onChange={(e) => setGitHubLink(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseResultDialog}>Отмена</Button>
                    <Button onClick={handleSubmitResult}>Сдать</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openScoreDialog} onClose={handleCloseScoreDialog}>
                <DialogTitle>Изменить оценку</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Новая оценка"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={newScore}
                        onChange={(e) => setNewScore(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseScoreDialog}>Отмена</Button>
                    <Button onClick={handleUpdateScore}>Сохранить</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
};

export default GroupDetail;
