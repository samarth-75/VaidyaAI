import mongoose from 'mongoose';

const abnormalValueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    status: { type: String, required: true },
    normal: { type: String, required: true }
});

const remedySchema = new mongoose.Schema({
    iconName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, default: 'medium' }
});

const reportHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        default: 'Medical Report'
    },
    iconName: {
        type: String,
        default: 'FileText'
    },
    date: {
        type: Date,
        default: Date.now
    },
    summary: {
        type: String,
        required: true
    },
    abnormalValues: [abnormalValueSchema],
    remedies: [remedySchema]
}, {
    timestamps: true
});

const ReportHistory = mongoose.model('ReportHistory', reportHistorySchema);

export default ReportHistory;
