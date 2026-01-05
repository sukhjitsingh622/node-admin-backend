const Log = require('../models/Log');

exports.getLogs = async (req, res) => {
    try {
        const logs = await Log.find()
            .populate('user', 'name email role')
            .sort({ createdAt: -1 });

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};