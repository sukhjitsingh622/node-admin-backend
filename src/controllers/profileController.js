const User = require('../models/User');

const getProfile = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            data: req.user // already attached by middleware
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, avatar } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, avatar },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: 'Profile updated',
            data: user
        });
    } catch (err) {
        res.status(500).json({ message: 'Update failed' });
    }
};

module.exports = { getProfile, updateProfile };