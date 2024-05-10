import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        specialization: {
            type: String,
            required: true,
        },
        experience: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model('Teacher', TeacherSchema);