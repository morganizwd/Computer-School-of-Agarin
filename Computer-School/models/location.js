import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
        },
        roomNumber: {
            type: Number,
            required: true,
        }
    }
);

export default mongoose.model('Location', LocationSchema);