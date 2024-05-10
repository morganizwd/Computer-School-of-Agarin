import { body, param } from 'express-validator';

//auth validation
export const loginValidation = [
    body('email', 'Invalid email format').notEmpty().isEmail(),
    body('password', 'Password shoud be at least 5 symbols').isLength({ min: 8 }),
];

export const registerValidation = [
    body('email', 'Invalid email format').notEmpty().isEmail(),
    body('password', 'Password should be at least 8 symbols').isLength({ min: 8 }),
    body('userName', 'Name is too short').isLength({ min: 2 }),
    body('role', 'Invalid role').custom((value) => {
        const roles = ['student', 'admin', 'teacher'];
        if (!roles.includes(value)) {
            throw new Error('Invalid role');
        }
        return true;
    }),
];

// Teacher validation
export const createTeacherValidation = [
    body('user', 'User ID is required').notEmpty().isMongoId(),
    body('specialization', 'Specialization is required').notEmpty(),
    body('experience', 'Experience is required').notEmpty(),
];

export const updateTeacherValidation = [
    body('user', 'User ID must be a valid MongoDB ID').optional().isMongoId(),
    body('specialization', 'Specialization is required').optional().notEmpty(),
    body('experience', 'Experience is required').optional().notEmpty(),
];

// Shedule 
export const createScheduleValidation = [
    body('group', 'Group ID is required').notEmpty().isMongoId(),
    body('dateTime', 'Date and time are required')
        .isArray({ min: 1 }).withMessage('Date and time must be an array with at least one date')
        .custom((dates) => dates.every(date => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[\+\-]\d{2}:\d{2})$/.test(date)))
        .withMessage('Every date and time in the array must be a valid ISO8601 date'),
    body('location', 'Location ID is required').notEmpty().isMongoId(),
];

export const updateScheduleValidation = [
    body('group', 'Group ID must be a valid MongoDB ID').optional().isMongoId(),
    body('dateTime', 'Date and time must be valid')
        .optional()
        .isArray().withMessage('Date and time must be an array')
        .custom((dates, { req }) => req.body.dateTime ? dates.every(date => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?(Z|[\+\-]\d{2}:\d{2})$/.test(date)) : true)
        .withMessage('Every date and time in the array must be a valid ISO8601 date'),
    body('location', 'Location ID must be a valid MongoDB ID').optional().isMongoId(),
];

// Location Validation
export const createLocationValidation = [
    body('address', 'Address is required').notEmpty(),
    body('roomNumber', 'Room number is required').notEmpty().isNumeric(),
];

export const updateLocationValidation = [
    body('address', 'Address is required').optional().notEmpty(),
    body('roomNumber', 'Room number must be a number').optional().isNumeric(),
];

//Group Validation
export const createGroupValidation = [
    body('name', 'Name is required').notEmpty(),
    body('course', 'Course ID is required').notEmpty().isMongoId(),
    body('students', 'Students must be an array').optional().isArray(),
    body('students.*', 'Each student must be a valid MongoDB ID').optional().isMongoId(),
    body('schedule', 'Schedule ID is required').optional().isMongoId(),
];

export const updateGroupValidation = [
    body('name', 'Name is required').optional().notEmpty(),
    body('course', 'Course ID must be a valid MongoDB ID').optional().isMongoId(),
    body('students', 'Students must be an array').optional().isArray(),
    body('students.*', 'Each student must be a valid MongoDB ID').optional().isMongoId(),
    body('schedule', 'Schedule ID must be a valid MongoDB ID').optional().isMongoId(),
];

//Course Validation
export const createCourseValidation = [
    body('name', 'Name is required').notEmpty(),
    body('description', 'Description is required').notEmpty(),
    body('teacher', 'Teacher ID is required').notEmpty().isMongoId(),
    body('price', 'Price is required').notEmpty().isNumeric(),
    body('duration', 'Duration is required').optional(),
    body('imageUrl', 'Image URL must be valid').optional().isURL(),
];

export const updateCourseValidation = [
    body('name', 'Name is required').optional().notEmpty(),
    body('description', 'Description is required').optional().notEmpty(),
    body('teacher', 'Teacher ID must be a valid MongoDB ID').optional().isMongoId(),
    body('price', 'Price must be a number').optional().isNumeric(),
    body('duration', 'Duration is required').optional(),
    body('imageUrl', 'Image URL must be valid').optional().isURL(),
];

//AssignmentResult Validation
export const createAssignmentResultValidation = [
    body('user', 'User ID is required').notEmpty().isMongoId(),
    body('gitHubLink', 'GitHub link is required').notEmpty().isURL(),
    body('score', 'Score is required').notEmpty().isNumeric(),
];

export const updateAssignmentResultValidation = [
    body('user', 'User ID must be a valid MongoDB ID').optional().isMongoId(),
    body('gitHubLink', 'GitHub link must be valid').optional().isURL(),
    body('score', 'Score must be a number').optional().isNumeric(),
];

//Assignment Validation
export const createAssignmentValidation = [
    body('name', 'Name is required').notEmpty(),
    body('description', 'Description is required').notEmpty(),
    body('dueDate', 'Due date must be a valid date').optional().isISO8601(),
    body('group', 'Group ID is required').notEmpty().isMongoId(),
];

export const updateAssignmentValidation = [
    body('name', 'Name is required').optional().notEmpty(),
    body('description', 'Description is required').optional().notEmpty(),
    body('dueDate', 'Due date must be valid').optional().isISO8601(),
    body('group', 'Group ID must be a valid MongoDB ID').optional().isMongoId(),
];