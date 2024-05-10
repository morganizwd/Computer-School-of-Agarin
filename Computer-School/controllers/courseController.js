import CourseModel from '../models/course.js';

export const create = async (req, res) => {
    try {
        const doc = new CourseModel({
            name: req.body.name,
            description: req.body.description,
            teacher: req.body.teacher,
            price: req.body.price,
            duration: req.body.duration,
            imageUrl: req.body.imageUrl,
        });

        const course = await doc.save();

        res.json(course);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Create attempt failed',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const courseId = req.params.id;

        const doc = await CourseModel.findByIdAndDelete(courseId);

        if (!doc) {
            return res.status(404).json({
                message: 'Course doesn\'t exist',
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Remove attempt failed',
        });
    }
};

export const update = async (req, res) => {
    try {
        const courseId = req.params.id;

        await CourseModel.updateOne(
            {
                _id: courseId,
            },
            {
                name: req.body.name,
                description: req.body.description,
                teacher: req.body.teacher,
                price: req.body.price,
                duration: req.body.duration,
                imageUrl: req.body.imageUrl,
            },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Update attempt failed',
        });
    }
};

export const getOne = async (req, res) => {
    try{
        const courseId = req.params.id;

        const doc = await CourseModel.findById(courseId).populate('teacher');

        if (doc) {
            res.json(doc);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Search attempt failed',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const courses = await CourseModel.find();

        res.json(courses);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve courses',
        });
    }
};