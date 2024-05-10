import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import cors from 'cors';

import {
    userController,
    teacherController,
    scheduleController,
    locationController,
    groupController,
    courseController,
    assignmentController,
    assignmentResultController,
} from './controllers/index.js';

import {
    loginValidation,
    registerValidation,
    createTeacherValidation,
    updateTeacherValidation,
    createScheduleValidation,
    updateScheduleValidation,
    createLocationValidation,
    updateLocationValidation,
    createGroupValidation,
    updateGroupValidation,
    createCourseValidation,
    updateCourseValidation,
    createAssignmentResultValidation,
    updateAssignmentResultValidation,
    createAssignmentValidation,
    updateAssignmentValidation
} from './validations.js';

import {
    adminOnlyAuth,
    adminOrTeacherAuth,
    allRolesAuth,
    handleValidationErrors,
} from './utils/index.js'

mongoose
    .connect('mongodb+srv://admin:Hesus2016@cluster0.vgtv5yo.mongodb.net/ComputerSchool')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB ERROR', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

//media upload pathes
app.post('/upload', upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

//auth
app.post('/auth/login', loginValidation, handleValidationErrors, userController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, userController.register);
app.get('/auth/me', allRolesAuth, userController.getMe);
app.get('/user/:userId', allRolesAuth, userController.getUserById);
app.get('/users', userController.getAllUsers);

//teachers
app.post('/teacher/create', adminOnlyAuth, createTeacherValidation, handleValidationErrors, teacherController.createTeacher);
app.delete('/teacher/delete/:id', adminOnlyAuth, teacherController.removeTeacher);
app.patch('/teacher/update/:id', adminOrTeacherAuth, updateTeacherValidation, handleValidationErrors, teacherController.updateTeacher);
app.get('/teacher/:id', teacherController.getOneTeacher);
app.get('/teachers', teacherController.getAllTeachers);

//shedule 
app.post('/schedule/create', adminOrTeacherAuth, createScheduleValidation, handleValidationErrors, scheduleController.createSchedule);
app.delete('/schedule/delete/:id', adminOnlyAuth, scheduleController.removeSchedule);
app.patch('/schedule/update/:id', adminOrTeacherAuth, updateScheduleValidation, handleValidationErrors, scheduleController.updateSchedule);
app.get('/schedule/:id', allRolesAuth, scheduleController.getOneSchedule);
app.get('/schedules', allRolesAuth, scheduleController.getAllSchedules);

// Locations
app.post('/location/create', adminOnlyAuth, createLocationValidation, handleValidationErrors, locationController.createLocation);
app.delete('/location/delete/:id', adminOnlyAuth, locationController.removeLocation);
app.patch('/location/update/:id', adminOnlyAuth, updateLocationValidation, handleValidationErrors, locationController.updateLocation);
app.get('/location/:id', locationController.getOneLocation);
app.get('/locations', locationController.getAllLocations);

// Groups
app.post('/group/create', adminOnlyAuth, createGroupValidation, handleValidationErrors, groupController.createGroup);
app.delete('/group/delete/:id', adminOnlyAuth, groupController.removeGroup);
app.patch('/group/update/:id', adminOnlyAuth, updateGroupValidation, handleValidationErrors, groupController.updateGroup);
app.get('/group/:id', allRolesAuth, groupController.getOneGroup);
app.get('/groups', allRolesAuth, groupController.getAllGroups);

// Courses
app.post('/course/create', adminOnlyAuth, createCourseValidation, handleValidationErrors, courseController.create);
app.delete('/course/delete/:id', adminOnlyAuth, courseController.remove);
app.patch('/course/update/:id', adminOnlyAuth, updateCourseValidation, handleValidationErrors, courseController.update);
app.get('/course/:id', courseController.getOne);
app.get('/courses', courseController.getAll);

// Assignment Results
app.post('/assignmentResult/create', allRolesAuth, createAssignmentResultValidation, handleValidationErrors, assignmentResultController.createAssignmentResult);
app.delete('/assignmentResult/delete/:id', allRolesAuth, assignmentResultController.removeAssignmentResult);
app.patch('/assignmentResult/update/:id', allRolesAuth, updateAssignmentResultValidation, handleValidationErrors, assignmentResultController.updateAssignmentResult);
app.get('/assignmentResult/:id', allRolesAuth, assignmentResultController.getOneAssignmentResult);
app.get('/assignmentResults', allRolesAuth, assignmentResultController.getAllAssignmentResults);

// Assignments
app.post('/assignment/create', adminOrTeacherAuth, createAssignmentValidation, handleValidationErrors, assignmentController.createAssignment);
app.delete('/assignment/delete/:id', adminOrTeacherAuth, assignmentController.removeAssignment);
app.patch('/assignment/update/:id', adminOrTeacherAuth, updateAssignmentValidation, handleValidationErrors, assignmentController.updateAssignment);
app.get('/assignment/:id', allRolesAuth, assignmentController.getOneAssignment);
app.get('/assignments', allRolesAuth, assignmentController.getAllAssignments);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});