// controllers/logController.js
const Log = require("../models/Log");

exports.getLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalLogs = await Log.countDocuments();

        const logs = await Log.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            logs,
            count: totalLogs,
            totalPages: Math.ceil(totalLogs / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch logs" });
    }
};
