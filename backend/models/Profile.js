import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    fullName: { type: String, default: '' },
    dateOfBirth: { type: String, default: '' },
    gender: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    bloodGroup: { type: String, default: '' },
    height: { type: String, default: '' },
    weight: { type: String, default: '' },
    allergies: { type: String, default: '' },
    medications: { type: String, default: '' },
    conditions: { type: String, default: '' },
    emergencyContact: { type: String, default: '' },
    emergencyPhone: { type: String, default: '' }
}, {
    timestamps: true
});

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
