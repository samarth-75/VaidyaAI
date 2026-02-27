import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '7d' // Token expires in 7 days
    });
};
    // @desc    Change user email
    // @route   PUT /api/auth/change-email
    // @access  Private
    export const changeEmail = async (req, res) => {
        try {
            const { newEmail, password } = req.body;
            if (!newEmail || !password) {
                return res.status(400).json({ success: false, message: 'Please provide new email and password.' });
            }
            // Check if email is already taken
            const existingUser = await User.findOne({ email: newEmail });
            if (existingUser) {
                return res.status(400).json({ success: false, message: 'Email already in use.' });
            }
            // Find user and check password
            const user = await User.findById(req.user.id).select('+password');
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }
            const isPasswordCorrect = await user.comparePassword(password);
            if (!isPasswordCorrect) {
                return res.status(401).json({ success: false, message: 'Incorrect password.' });
            }
            user.email = newEmail;
            await user.save();
            // Generate new token
            const token = generateToken(user._id);
            res.status(200).json({ success: true, message: 'Email updated successfully.', token, user: { id: user._id, name: user.name, email: user.email } });
        } catch (error) {
            console.error('Change email error:', error);
            res.status(500).json({ success: false, message: 'Server error during email change', error: error.message });
        }
    };

    // @desc    Change user password
    // @route   PUT /api/auth/change-password
    // @access  Private
    export const changePassword = async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ success: false, message: 'Please provide current and new password.' });
            }
            if (newPassword.length < 6) {
                return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
            }
            // Find user and check current password
            const user = await User.findById(req.user.id).select('+password');
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found.' });
            }
            const isPasswordCorrect = await user.comparePassword(currentPassword);
            if (!isPasswordCorrect) {
                return res.status(401).json({ success: false, message: 'Incorrect current password.' });
            }
            user.password = newPassword;
            await user.save();
            // Generate new token
            const token = generateToken(user._id);
            res.status(200).json({ success: true, message: 'Password updated successfully.', token, user: { id: user._id, name: user.name, email: user.email } });
        } catch (error) {
            console.error('Change password error:', error);
            res.status(500).json({ success: false, message: 'Server error during password change', error: error.message });
        }
    };
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};
