import GroupModel from '../models/group.js';

export const createGroup = async (req, res) => {
    try {
        const doc = new GroupModel({
            name: req.body.name,
            course: req.body.course,
            students: req.body.students,
            schedule: req.body.schedule,
        });

        const group = await doc.save();
        res.json(group);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create group',
        });
    }
};

export const removeGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const doc = await GroupModel.findByIdAndDelete(groupId);

        if (!doc) {
            return res.status(404).json({
                message: 'Group doesn\'t exist',
            });
        }

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to remove group',
        });
    }
};

export const updateGroup = async (req, res) => {
    try {
        const groupId = req.params.id;

        await GroupModel.updateOne(
            { _id: groupId },
            {
                name: req.body.name,
                course: req.body.course,
                students: req.body.students,
                schedule: req.body.schedule,
            },
        );

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update group',
        });
    }
};

export const getOneGroup = async (req, res) => {
    try {
        const groupId = req.params.id;
        const doc = await GroupModel.findById(groupId).populate('course students schedule');

        if (doc) {
            res.json(doc);
        } else {
            res.status(404).json({ message: 'Group not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve group',
        });
    }
};

export const getAllGroups = async (req, res) => {
    try {
        const groups = await GroupModel.find().populate('course students schedule');
        res.json(groups);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve groups',
        });
    }
};