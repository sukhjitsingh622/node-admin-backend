const User = require('../models/User');
const Blog = require('../models/Blog');
const Log = require('../models/Log');

exports.dashboardData = async (req, res) => {
    try {
        const [
            totalUsers,
            totalLogs,
            totalBlogs
        ] = await Promise.all([
            User.countDocuments(),
            Log.countDocuments(),
            Blog.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalLogs,
                totalBlogs
            }
        });

    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data"
        });
    }
};
