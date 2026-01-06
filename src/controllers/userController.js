const User = require('../models/User');

/**
 * @desc Get all users
 * @route GET /api/users
 * @access Admin only
 */
exports.getUsers = async (req, res) => {
    try {
        // Fetch all users except passwords
        const users = await User.find().select('-password');

        res.status(200).json({
            count: users.length,
            users: users
        });

    } catch (error) {
        console.error('GET USERS ERROR 👉', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Get single user
 * @route   GET /api/users/:id
 * @access  Admin
 */
exports.getUserById = async (req, res) => {
    try {
        const user = await user.findById(req.param.id).select('-password');

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "server error"
        });
    }
}

/**
 * @desc    Update user
 * @route   PUT /api/users/:id
 * @access  Admin
 */
exports.updateUser = async (req, res) => {
    try {
        const { name, email, role, isActive } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, role, isActive },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User updated', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Admin
 */
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// CHANGE ROLE
exports.changeRole = async (req, res) => {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
    );
    res.json(user);
};