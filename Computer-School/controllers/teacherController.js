import TeacherModel from '../models/teacher.js';

export const createTeacher = async (req, res) => {
    try {
        const doc = new TeacherModel({
            user: req.body.user,
            specialization: req.body.specialization,
            experience: req.body.experience,
        });

        const teacher = await doc.save();
        res.json(teacher);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create teacher',
        });
    }
};

export const removeTeacher = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const doc = await TeacherModel.findByIdAndDelete(teacherId);

        if (!doc) {
            return res.status(404).json({
                message: 'Teacher doesn\'t exist',
            });
        }

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to remove teacher',
        });
    }
};

export const updateTeacher = async (req, res) => {
    try {
        const teacherId = req.params.id;

        await TeacherModel.updateOne(
            { _id: teacherId },
            {
                user: req.body.user,
                specialization: req.body.specialization,
                experience: req.body.experience,
            },
        );

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update teacher',
        });
    }
};

export const getOneTeacher = async (req, res) => {
    try {
        const teacherId = req.params.id;
        const doc = await TeacherModel.findById(teacherId).populate('user', 'userName');
us
        if (doc) {
            res.json(doc);
        } else {
            res.status(404).json({ message: 'Teacher not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve teacher',
        });
    }
};

export const getAllTeachers = async (req, res) => {
    try {
        const teachers = await TeacherModel.find().populate('user', 'userName');
        res.json(teachers);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve teachers',
        });
    }
};