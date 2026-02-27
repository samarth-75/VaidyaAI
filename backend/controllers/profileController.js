import Profile from '../models/Profile.js';

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ userId: req.user._id });

        if (!profile) {
            // Return empty defaults if no profile exists yet
            return res.status(200).json({
                success: true,
                profile: {
                    fullName: '',
                    dateOfBirth: '',
                    gender: '',
                    phone: '',
                    address: '',
                    bloodGroup: '',
                    height: '',
                    weight: '',
                    allergies: '',
                    medications: '',
                    conditions: '',
                    emergencyContact: '',
                    emergencyPhone: ''
                }
            });
        }

        res.status(200).json({
            success: true,
            profile: {
                fullName: profile.fullName,
                dateOfBirth: profile.dateOfBirth,
                gender: profile.gender,
                phone: profile.phone,
                address: profile.address,
                bloodGroup: profile.bloodGroup,
                height: profile.height,
                weight: profile.weight,
                allergies: profile.allergies,
                medications: profile.medications,
                conditions: profile.conditions,
                emergencyContact: profile.emergencyContact,
                emergencyPhone: profile.emergencyPhone
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching profile',
            error: error.message
        });
    }
};

// @desc    Save/update user profile
// @route   PUT /api/profile
// @access  Private
export const saveProfile = async (req, res) => {
    try {
        const {
            fullName,
            dateOfBirth,
            gender,
            phone,
            address,
            bloodGroup,
            height,
            weight,
            allergies,
            medications,
            conditions,
            emergencyContact,
            emergencyPhone
        } = req.body;

        const profileData = {
            userId: req.user._id,
            fullName: fullName || '',
            dateOfBirth: dateOfBirth || '',
            gender: gender || '',
            phone: phone || '',
            address: address || '',
            bloodGroup: bloodGroup || '',
            height: height || '',
            weight: weight || '',
            allergies: allergies || '',
            medications: medications || '',
            conditions: conditions || '',
            emergencyContact: emergencyContact || '',
            emergencyPhone: emergencyPhone || ''
        };

        // Upsert: create if not exists, update if exists
        const profile = await Profile.findOneAndUpdate(
            { userId: req.user._id },
            profileData,
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile saved successfully',
            profile: {
                fullName: profile.fullName,
                dateOfBirth: profile.dateOfBirth,
                gender: profile.gender,
                phone: profile.phone,
                address: profile.address,
                bloodGroup: profile.bloodGroup,
                height: profile.height,
                weight: profile.weight,
                allergies: profile.allergies,
                medications: profile.medications,
                conditions: profile.conditions,
                emergencyContact: profile.emergencyContact,
                emergencyPhone: profile.emergencyPhone
            }
        });
    } catch (error) {
        console.error('Save profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error saving profile',
            error: error.message
        });
    }
};
