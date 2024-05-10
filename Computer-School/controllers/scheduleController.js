import ScheduleModel from '../models/schedule.js';

export const createSchedule = async (req, res) => {
    try {
        const doc = new ScheduleModel({
            group: req.body.group,
            dateTime: req.body.dateTime,
            location: req.body.location,
        });

        const shedule = await doc.save();
        res.json(shedule);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create schedule',
        });
    }
};

export const removeSchedule = async (req, res) => {
    try {
        const sheduleId = req.params.id;
        const doc = await ScheduleModel.findByIdAndDelete(sheduleId);

        if (!doc) {
            return res.status(404).json({
                message: 'Schedule doesn\'t exist',
            });
        }

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to remove schedule',
        });
    }
};

export const updateSchedule = async (req, res) => {
    try {
        const sheduleId = req.params.id;

        await ScheduleModel.updateOne(
            { _id: sheduleId },
            {
                group: req.body.group,
                dateTime: req.body.dateTime,
                location: req.body.location,
            },
        );

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update schedule',
        });
    }
};

export const getOneSchedule = async (req, res) => {
    try {
        const sheduleId = req.params.id;
        const doc = await ScheduleModel.findById(sheduleId);

        if (doc) {
            res.json(doc);
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve schedule',
        });
    }
};

export const getAllSchedules = async (req, res) => {
    try {
        const shedules = await ScheduleModel.find();
        res.json(shedules);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve schedules',
        });
    }
};