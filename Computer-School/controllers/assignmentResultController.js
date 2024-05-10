import AssignmentResultModel from '../models/assignmentResult.js'; 

export const createAssignmentResult = async (req, res) => {
    try {
        const doc = new AssignmentResultModel({
            user: req.body.user,
            gitHubLink: req.body.gitHubLink,
            score: req.body.score,
            assignment: req.body.assignment, // Убедитесь, что это поле совпадает с ключом на фронтенде
        });

        const assignmentResult = await doc.save();
        res.json(assignmentResult);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create assignment result',
        });
    }
};

export const removeAssignmentResult = async (req, res) => {
    try {
        const assignmentResultId = req.params.id;
        const doc = await AssignmentResultModel.findByIdAndDelete(assignmentResultId);

        if (!doc) {
            return res.status(404).json({
                message: 'Assignment result doesn\'t exist',
            });
        }

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to remove assignment result',
        });
    }
};

export const updateAssignmentResult = async (req, res) => {
    try {
        const assignmentResultId = req.params.id;

        await AssignmentResultModel.updateOne(
            { _id: assignmentResultId },
            {
                user: req.body.user,
                gitHubLink: req.body.gitHubLink,
                score: req.body.score,
            },
        );

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update assignment result',
        });
    }
};

export const getOneAssignmentResult = async (req, res) => {
    try {
        const assignmentResultId = req.params.id;
        const doc = await AssignmentResultModel.findById(assignmentResultId).populate('user');

        if (doc) {
            res.json(doc);
        } else {
            res.status(404).json({ message: 'Assignment result not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve assignment result',
        });
    }
};

export const getAllAssignmentResults = async (req, res) => {
    try {
        const assignmentResults = await AssignmentResultModel.find().populate('user');
        res.json(assignmentResults);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve assignment results',
        });
    }
};