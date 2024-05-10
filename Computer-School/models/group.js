import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: true,
        },
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
        schedule: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Schedule',
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Group', GroupSchema);