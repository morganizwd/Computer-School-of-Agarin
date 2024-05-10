import LocationModel from '../models/location.js';

export const createLocation = async (req, res) => {
    try {
        const doc = new LocationModel({
            address: req.body.address, 
            roomNumber: req.body.roomNumber,
        });

        const location = await doc.save();
        res.json(location);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to create location',
        });
    }
};

export const removeLocation = async (req, res) => {
    try {
        const locationId = req.params.id;
        const doc = await LocationModel.findByIdAndDelete(locationId);

        if (!doc) {
            return res.status(404).json({
                message: 'Location doesn\'t exist',
            });
        }

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to remove location',
        });
    }
};

export const updateLocation = async (req, res) => {
    try {
        const locationId = req.params.id;

        await LocationModel.updateOne(
            { _id: locationId },
            {
                address: req.body.address, 
                roomNumber: req.body.roomNumber,
            },
        );

        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to update location',
        });
    }
};

export const getOneLocation = async (req, res) => {
    try {
        const locationId = req.params.id;
        const doc = await LocationModel.findById(locationId);

        if (doc) {
            res.json(doc);
        } else {
            res.status(404).json({ message: 'Location not found' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve location',
        });
    }
};

export const getAllLocations = async (req, res) => {
    try {
        const locations = await LocationModel.find();
        res.json(locations);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Failed to retrieve locations',
        });
    }
};
